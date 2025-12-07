package handlers

import (
	"net/http"
	"strconv"
	"strings"
	"ssps-go/config"
	"ssps-go/models"
	"ssps-go/serializers"
	"ssps-go/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ContentHandler struct {
	DB *gorm.DB
}

func NewContentHandler(db *gorm.DB) *ContentHandler {
	return &ContentHandler{DB: db}
}

// GetArticles 获取文章列表
func (h *ContentHandler) GetArticles(c *gin.Context) {
	utils.LogRequest(c)
	
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", strconv.Itoa(config.AppConfig.PageSize)))
	category := c.Query("category")
	tag := c.Query("tag")
	search := c.Query("search")

	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = config.AppConfig.PageSize
	}
	if pageSize > config.AppConfig.MaxPageSize {
		pageSize = config.AppConfig.MaxPageSize
	}

	offset := (page - 1) * pageSize

	var articles []models.Article
	query := h.DB.Preload("Author").Preload("Category").Preload("Tags")

	// 只读文章查询
	if !c.GetBool("isAuthenticated") {
		query = query.Where("published = ?", true)
	}

	// 分类过滤
	if category != "" {
		query = query.Joins("JOIN categories ON articles.category_id = categories.id").Where("categories.name = ?", category)
	}

	// 标签过滤
	if tag != "" {
		query = query.Joins("JOIN article_tags ON articles.id = article_tags.article_id").
			Joins("JOIN tags ON article_tags.tag_id = tags.id").
			Where("tags.name = ?", tag)
	}

	// 搜索
	if search != "" {
		searchClause := "%" + strings.ToLower(search) + "%"
		query = query.Where("LOWER(title) LIKE ? OR LOWER(content) LIKE ? OR LOWER(excerpt) LIKE ?", searchClause, searchClause, searchClause)
	}

	var total int64
	h.DB.Model(&models.Article{}).Count(&total)

	if err := query.Offset(offset).Limit(pageSize).Order("created_at DESC").Find(&articles).Error; err != nil {
		utils.LogError("获取文章列表失败", err)
		utils.HandleError(c, http.StatusInternalServerError, "获取文章列表失败")
		return
	}

	var responses []serializers.ArticleListResponse
	for _, article := range articles {
		responses = append(responses, serializers.ArticleListResponseFromModel(article))
	}

	// 计算分页信息
	hasNext := int64(offset+pageSize) < total
	hasPrev := page > 1

	var nextPage, prevPage interface{}
	if hasNext {
		nextPage = gin.H{
			"page":      page + 1,
			"page_size": pageSize,
		}
	} else {
		nextPage = nil
	}

	if hasPrev {
		prevPage = gin.H{
			"page":      page - 1,
			"page_size": pageSize,
		}
	} else {
		prevPage = nil
	}

	response := gin.H{
		"count":  total,
		"next":   nextPage,
		"prev":   prevPage,
		"result": responses,
	}
	
	utils.HandleSuccessWithData(c, http.StatusOK, response)
}

// GetArticle 获取文章详情
func (h *ContentHandler) GetArticle(c *gin.Context) {
	utils.LogRequest(c)
	
	slug := c.Param("slug")

	var article models.Article
	query := h.DB.Preload("Author").Preload("Category").Preload("Tags")

	if !c.GetBool("isAuthenticated") {
		query = query.Where("published = ?", true)
	}

	if err := query.Where("slug = ?", slug).First(&article).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.HandleError(c, http.StatusNotFound, "文章不存在")
			return
		}
		utils.LogError("获取文章失败", err)
		utils.HandleError(c, http.StatusInternalServerError, "获取文章失败")
		return
	}

	response := serializers.ArticleResponseFromModel(article)
	utils.HandleSuccess(c, http.StatusOK, "", response)
}

// CreateArticle 创建文章
func (h *ContentHandler) CreateArticle(c *gin.Context) {
	utils.LogRequest(c)
	
	userID, exists := utils.GetUserIDFromContext(c)
	if !exists {
		utils.HandleError(c, http.StatusUnauthorized, "未认证")
		return
	}

	var req serializers.ArticleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.HandleError(c, http.StatusBadRequest, "无效的请求数据: "+err.Error())
		return
	}

	// 创建文章
	article := models.Article{
		Title:   req.Title,
		Slug:    req.Slug,
		Content: req.Content,
		AuthorID: &userID,
	}

	if req.Excerpt != nil {
		article.Excerpt = req.Excerpt
	}

	if req.Published != nil {
		article.Published = *req.Published
	}

	// 处理分类
	if req.Category != nil {
		var category models.Category
		if err := h.DB.Where("name = ? OR slug = ?", *req.Category, *req.Category).First(&category).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				category = models.Category{
					Name: *req.Category,
					Slug: *req.Category,
				}
				if err := h.DB.Create(&category).Error; err != nil {
					utils.LogError("创建分类失败", err)
					utils.HandleError(c, http.StatusInternalServerError, "创建分类失败")
					return
				}
			} else {
				utils.LogError("获取分类失败", err)
				utils.HandleError(c, http.StatusInternalServerError, "获取分类失败")
				return
			}
		}
		article.CategoryID = &category.ID
	}

	// 处理标签
	if req.Tags != nil && len(req.Tags) > 0 {
		var tags []models.Tag
		for _, tagName := range req.Tags {
			var tag models.Tag
			if err := h.DB.Where("name = ? OR slug = ?", tagName, tagName).First(&tag).Error; err != nil {
				if err == gorm.ErrRecordNotFound {
					tag = models.Tag{
						Name: tagName,
						Slug: tagName,
					}
					if err := h.DB.Create(&tag).Error; err != nil {
						utils.LogError("创建标签失败", err)
						utils.HandleError(c, http.StatusInternalServerError, "创建标签失败")
						return
					}
				} else {
					utils.LogError("获取标签失败", err)
					utils.HandleError(c, http.StatusInternalServerError, "获取标签失败")
					return
				}
			}
			tags = append(tags, tag)
		}
		article.Tags = tags
	}

	if err := h.DB.Create(&article).Error; err != nil {
		utils.LogError("创建文章失败", err)
		utils.HandleError(c, http.StatusInternalServerError, "创建文章失败")
		return
	}

	response := serializers.ArticleResponseFromModel(article)
	utils.HandleSuccess(c, http.StatusCreated, "文章创建成功", response)
}

// UpdateArticle 更新文章
func (h *ContentHandler) UpdateArticle(c *gin.Context) {
	utils.LogRequest(c)
	
	slug := c.Param("slug")
	userID, exists := utils.GetUserIDFromContext(c)
	if !exists {
		utils.HandleError(c, http.StatusUnauthorized, "未认证")
		return
	}

	var req serializers.ArticleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.HandleError(c, http.StatusBadRequest, "无效的请求数据: "+err.Error())
		return
	}

	var article models.Article
	if err := h.DB.Where("slug = ?", slug).First(&article).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.HandleError(c, http.StatusNotFound, "文章不存在")
			return
		}
		utils.LogError("获取文章失败", err)
		utils.HandleError(c, http.StatusInternalServerError, "获取文章失败")
		return
	}

	// 检查权限
	if article.AuthorID != nil && *article.AuthorID != userID {
		utils.HandleError(c, http.StatusForbidden, "无权限修改此文章")
		return
	}

	// 更新文章
	article.Title = req.Title
	article.Slug = req.Slug
	article.Content = req.Content

	if req.Excerpt != nil {
		article.Excerpt = req.Excerpt
	}

	if req.Published != nil {
		article.Published = *req.Published
	}

	// 处理分类
	if req.Category != nil {
		var category models.Category
		if err := h.DB.Where("name = ? OR slug = ?", *req.Category, *req.Category).First(&category).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				category = models.Category{
					Name: *req.Category,
					Slug: *req.Category,
				}
				if err := h.DB.Create(&category).Error; err != nil {
					utils.LogError("创建分类失败", err)
					utils.HandleError(c, http.StatusInternalServerError, "创建分类失败")
					return
				}
			} else {
				utils.LogError("获取分类失败", err)
				utils.HandleError(c, http.StatusInternalServerError, "获取分类失败")
				return
			}
		}
		article.CategoryID = &category.ID
	}

	// 更新标签
	if req.Tags != nil {
		var tags []models.Tag
		for _, tagName := range req.Tags {
			var tag models.Tag
			if err := h.DB.Where("name = ? OR slug = ?", tagName, tagName).First(&tag).Error; err != nil {
				if err == gorm.ErrRecordNotFound {
					tag = models.Tag{
						Name: tagName,
						Slug: tagName,
					}
					if err := h.DB.Create(&tag).Error; err != nil {
						utils.LogError("创建标签失败", err)
						utils.HandleError(c, http.StatusInternalServerError, "创建标签失败")
						return
					}
				} else {
					utils.LogError("获取标签失败", err)
					utils.HandleError(c, http.StatusInternalServerError, "获取标签失败")
					return
				}
			}
			tags = append(tags, tag)
		}
		article.Tags = tags
	}

	if err := h.DB.Save(&article).Error; err != nil {
		utils.LogError("更新文章失败", err)
		utils.HandleError(c, http.StatusInternalServerError, "更新文章失败")
		return
	}

	response := serializers.ArticleResponseFromModel(article)
	utils.HandleSuccess(c, http.StatusOK, "文章更新成功", response)
}

// DeleteArticle 删除文章
func (h *ContentHandler) DeleteArticle(c *gin.Context) {
	utils.LogRequest(c)
	
	slug := c.Param("slug")
	userID, exists := utils.GetUserIDFromContext(c)
	if !exists {
		utils.HandleError(c, http.StatusUnauthorized, "未认证")
		return
	}

	var article models.Article
	if err := h.DB.Where("slug = ?", slug).First(&article).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.HandleError(c, http.StatusNotFound, "文章不存在")
			return
		}
		utils.LogError("获取文章失败", err)
		utils.HandleError(c, http.StatusInternalServerError, "获取文章失败")
		return
	}

	// 检查权限
	if article.AuthorID != nil && *article.AuthorID != userID {
		utils.HandleError(c, http.StatusForbidden, "无权限删除此文章")
		return
	}

	if err := h.DB.Delete(&article).Error; err != nil {
		utils.LogError("删除文章失败", err)
		utils.HandleError(c, http.StatusInternalServerError, "删除文章失败")
		return
	}

	utils.HandleSuccessWithMessage(c, http.StatusOK, "文章删除成功")
}

// GetCategories 获取分类列表
func (h *ContentHandler) GetCategories(c *gin.Context) {
	utils.LogRequest(c)
	
	var categories []models.Category
	if err := h.DB.Find(&categories).Error; err != nil {
		utils.LogError("获取分类列表失败", err)
		utils.HandleError(c, http.StatusInternalServerError, "获取分类列表失败")
		return
	}

	var responses []serializers.CategoryResponse
	for _, category := range categories {
		responses = append(responses, serializers.CategoryResponseFromModel(category))
	}

	utils.HandleSuccess(c, http.StatusOK, "", responses)
}

// GetCategory 获取分类详情
func (h *ContentHandler) GetCategory(c *gin.Context) {
	utils.LogRequest(c)
	
	slug := c.Param("slug")

	var category models.Category
	if err := h.DB.Where("slug = ?", slug).First(&category).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.HandleError(c, http.StatusNotFound, "分类不存在")
			return
		}
		utils.LogError("获取分类失败", err)
		utils.HandleError(c, http.StatusInternalServerError, "获取分类失败")
		return
	}

	response := serializers.CategoryResponseFromModel(category)
	utils.HandleSuccess(c, http.StatusOK, "", response)
}

// CreateCategory 创建分类
func (h *ContentHandler) CreateCategory(c *gin.Context) {
	utils.LogRequest(c)
	
	var req serializers.CategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.HandleError(c, http.StatusBadRequest, "无效的请求数据: "+err.Error())
		return
	}

	category := models.Category{
		Name:        req.Name,
		Slug:        req.Slug,
		Description: req.Description,
	}

	if err := h.DB.Create(&category).Error; err != nil {
		utils.LogError("创建分类失败", err)
		utils.HandleError(c, http.StatusInternalServerError, "创建分类失败")
		return
	}

	response := serializers.CategoryResponseFromModel(category)
	utils.HandleSuccess(c, http.StatusCreated, "分类创建成功", response)
}

// GetTags 获取标签列表
func (h *ContentHandler) GetTags(c *gin.Context) {
	utils.LogRequest(c)
	
	var tags []models.Tag
	if err := h.DB.Find(&tags).Error; err != nil {
		utils.LogError("获取标签列表失败", err)
		utils.HandleError(c, http.StatusInternalServerError, "获取标签列表失败")
		return
	}

	var responses []serializers.TagResponse
	for _, tag := range tags {
		responses = append(responses, serializers.TagResponseFromModel(tag))
	}

	utils.HandleSuccess(c, http.StatusOK, "", responses)
}

// GetTag 获取标签详情
func (h *ContentHandler) GetTag(c *gin.Context) {
	utils.LogRequest(c)
	
	slug := c.Param("slug")

	var tag models.Tag
	if err := h.DB.Where("slug = ?", slug).First(&tag).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.HandleError(c, http.StatusNotFound, "标签不存在")
			return
		}
		utils.LogError("获取标签失败", err)
		utils.HandleError(c, http.StatusInternalServerError, "获取标签失败")
		return
	}

	response := serializers.TagResponseFromModel(tag)
	utils.HandleSuccess(c, http.StatusOK, "", response)
}

// CreateTag 创建标签
func (h *ContentHandler) CreateTag(c *gin.Context) {
	utils.LogRequest(c)
	
	var req serializers.TagRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.HandleError(c, http.StatusBadRequest, "无效的请求数据: "+err.Error())
		return
	}

	tag := models.Tag{
		Name: req.Name,
		Slug: req.Slug,
	}

	if err := h.DB.Create(&tag).Error; err != nil {
		utils.LogError("创建标签失败", err)
		utils.HandleError(c, http.StatusInternalServerError, "创建标签失败")
		return
	}

	response := serializers.TagResponseFromModel(tag)
	utils.HandleSuccess(c, http.StatusCreated, "标签创建成功", response)
}

// UpdateCategory 更新分类
func (h *ContentHandler) UpdateCategory(c *gin.Context) {
	utils.LogRequest(c)
	
	slug := c.Param("slug")
	userID, exists := utils.GetUserIDFromContext(c)
	if !exists {
		utils.HandleError(c, http.StatusUnauthorized, "未认证")
		return
	}

	var req serializers.CategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.HandleError(c, http.StatusBadRequest, "无效的请求数据: "+err.Error())
		return
	}

	var category models.Category
	if err := h.DB.Where("slug = ?", slug).First(&category).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.HandleError(c, http.StatusNotFound, "分类不存在")
			return
		}
		utils.LogError("获取分类失败", err)
		utils.HandleError(c, http.StatusInternalServerError, "获取分类失败")
		return
	}

	// 更新分类信息
	category.Name = req.Name
	category.Slug = req.Slug
	category.Description = req.Description

	if err := h.DB.Save(&category).Error; err != nil {
		utils.LogError("更新分类失败", err)
		utils.HandleError(c, http.StatusInternalServerError, "更新分类失败")
		return
	}

	response := serializers.CategoryResponseFromModel(category)
	utils.HandleSuccess(c, http.StatusOK, "分类更新成功", response)
}

// DeleteCategory 删除分类
func (h *ContentHandler) DeleteCategory(c *gin.Context) {
	utils.LogRequest(c)
	
	slug := c.Param("slug")
	userID, exists := utils.GetUserIDFromContext(c)
	if !exists {
		utils.HandleError(c, http.StatusUnauthorized, "未认证")
		return
	}

	var category models.Category
	if err := h.DB.Where("slug = ?", slug).First(&category).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.HandleError(c, http.StatusNotFound, "分类不存在")
			return
		}
		utils.LogError("获取分类失败", err)
		utils.HandleError(c, http.StatusInternalServerError, "获取分类失败")
		return
	}

	if err := h.DB.Delete(&category).Error; err != nil {
		utils.LogError("删除分类失败", err)
		utils.HandleError(c, http.StatusInternalServerError, "删除分类失败")
		return
	}

	utils.HandleSuccessWithMessage(c, http.StatusOK, "分类删除成功")
}

// UpdateTag 更新标签
func (h *ContentHandler) UpdateTag(c *gin.Context) {
	utils.LogRequest(c)
	
	slug := c.Param("slug")
	userID, exists := utils.GetUserIDFromContext(c)
	if !exists {
		utils.HandleError(c, http.StatusUnauthorized, "未认证")
		return
	}

	var req serializers.TagRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.HandleError(c, http.StatusBadRequest, "无效的请求数据: "+err.Error())
		return
	}

	var tag models.Tag
	if err := h.DB.Where("slug = ?", slug).First(&tag).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.HandleError(c, http.StatusNotFound, "标签不存在")
			return
		}
		utils.LogError("获取标签失败", err)
		utils.HandleError(c, http.StatusInternalServerError, "获取标签失败")
		return
	}

	// 更新标签信息
	tag.Name = req.Name
	tag.Slug = req.Slug

	if err := h.DB.Save(&tag).Error; err != nil {
		utils.LogError("更新标签失败", err)
		utils.HandleError(c, http.StatusInternalServerError, "更新标签失败")
		return
	}

	response := serializers.TagResponseFromModel(tag)
	utils.HandleSuccess(c, http.StatusOK, "标签更新成功", response)
}

// DeleteTag 删除标签
func (h *ContentHandler) DeleteTag(c *gin.Context) {
	utils.LogRequest(c)
	
	slug := c.Param("slug")
	userID, exists := utils.GetUserIDFromContext(c)
	if !exists {
		utils.HandleError(c, http.StatusUnauthorized, "未认证")
		return
	}

	var tag models.Tag
	if err := h.DB.Where("slug = ?", slug).First(&tag).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.HandleError(c, http.StatusNotFound, "标签不存在")
			return
		}
		utils.LogError("获取标签失败", err)
		utils.HandleError(c, http.StatusInternalServerError, "获取标签失败")
		return
	}

	if err := h.DB.Delete(&tag).Error; err != nil {
		utils.LogError("删除标签失败", err)
		utils.HandleError(c, http.StatusInternalServerError, "删除标签失败")
		return
	}

	utils.HandleSuccessWithMessage(c, http.StatusOK, "标签删除成功")
}