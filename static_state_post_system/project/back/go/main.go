package main

import (
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	
	"ssps-go/config"
	"ssps-go/models"
	"ssps-go/routers"
	"ssps-go/utils"
)

func main() {
	// 设置Gin模式
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	// 初始化数据库
	db, err := initDB()
	if err != nil {
		panic("failed to connect database: " + err.Error())
	}

	// 自动迁移数据库表
	err = db.AutoMigrate(&models.User{}, &models.Article{}, &models.Category{}, &models.Tag{})
	if err != nil {
		panic("failed to migrate database: " + err.Error())
	}

	// 初始化配置
	config.InitConfig()

	// 创建Gin引擎
	r := gin.Default()

	// 日志中间件
	r.Use(gin.Logger())
	
	// 恢复中间件
	r.Use(gin.Recovery())

	// CORS中间件
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// 静态文件服务
	r.Use(static.Serve("/static", static.LocalFile("./static", true)))

	// 设置路由
	routers.SetupRoutes(r, db)

	// 启动服务器
	utils.LogInfo("服务器启动，监听端口: " + config.AppConfig.Port)
	r.Run(":" + config.AppConfig.Port)
}

func initDB() (*gorm.DB, error) {
	// 使用SQLite作为默认数据库（开发环境）
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "ssps.db"
	}
	
	return gorm.Open(sqlite.Open(dsn), &gorm.Config{})
}