package handlers

import (
	"net/http"
	"ssps-go/models"
	"ssps-go/serializers"
	"ssps-go/utils"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthHandler struct {
	DB *gorm.DB
}

func NewAuthHandler(db *gorm.DB) *AuthHandler {
	return &AuthHandler{DB: db}
}

// Register 注册用户
func (h *AuthHandler) Register(c *gin.Context) {
	utils.LogRequest(c)
	
	var req serializers.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.HandleError(c, http.StatusBadRequest, "无效的请求数据: "+err.Error())
		return
	}

	// 检查用户是否已存在
	var existingUser models.User
	if err := h.DB.Where("username = ? OR email = ?", req.Username, req.Email).First(&existingUser).Error; err == nil {
		utils.HandleError(c, http.StatusConflict, "用户名或邮箱已存在")
		return
	}

	// 哈希密码
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), 14)
	if err != nil {
		utils.LogError("密码哈希失败", err)
		utils.HandleError(c, http.StatusInternalServerError, "密码哈希失败")
		return
	}

	// 创建用户
	user := models.User{
		Username: req.Username,
		Email:    req.Email,
		Password: string(hashedPassword),
	}
	
	if err := h.DB.Create(&user).Error; err != nil {
		utils.LogError("创建用户失败", err)
		utils.HandleError(c, http.StatusInternalServerError, "创建用户失败")
		return
	}

	// 生成令牌
	token, err := utils.GenerateToken(user.ID, user.Username)
	if err != nil {
		utils.LogError("生成令牌失败", err)
		utils.HandleError(c, http.StatusInternalServerError, "生成令牌失败")
		return
	}

	response := serializers.LoginResponse{
		User:  serializers.UserResponseFromModel(user),
		Token: token,
	}
	
	utils.HandleSuccess(c, http.StatusCreated, "用户注册成功", response)
}

// Login 登录用户
func (h *AuthHandler) Login(c *gin.Context) {
	utils.LogRequest(c)
	
	var req serializers.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.HandleError(c, http.StatusBadRequest, "无效的请求数据: "+err.Error())
		return
	}

	// 查找用户
	var user models.User
	if err := h.DB.Where("username = ? OR email = ?", req.Username, req.Username).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.HandleError(c, http.StatusUnauthorized, "用户名或密码错误")
			return
		}
		utils.LogError("数据库查询错误", err)
		utils.HandleError(c, http.StatusInternalServerError, "数据库错误")
		return
	}

	// 验证密码
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		utils.HandleError(c, http.StatusUnauthorized, "用户名或密码错误")
		return
	}

	// 生成令牌
	token, err := utils.GenerateToken(user.ID, user.Username)
	if err != nil {
		utils.LogError("生成令牌失败", err)
		utils.HandleError(c, http.StatusInternalServerError, "生成令牌失败")
		return
	}

	response := serializers.LoginResponse{
		User:  serializers.UserResponseFromModel(user),
		Token: token,
	}
	
	utils.HandleSuccess(c, http.StatusOK, "登录成功", response)
}

// GetCurrentUser 获取当前用户信息
func (h *AuthHandler) GetCurrentUser(c *gin.Context) {
	utils.LogRequest(c)
	
	userID, exists := utils.GetUserIDFromContext(c)
	if !exists {
		utils.HandleError(c, http.StatusUnauthorized, "未认证")
		return
	}

	var user models.User
	if err := h.DB.First(&user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.HandleError(c, http.StatusNotFound, "用户不存在")
			return
		}
		utils.LogError("获取用户信息失败", err)
		utils.HandleError(c, http.StatusInternalServerError, "获取用户信息失败")
		return
	}

	response := serializers.UserResponseFromModel(user)
	utils.HandleSuccess(c, http.StatusOK, "", response)
}