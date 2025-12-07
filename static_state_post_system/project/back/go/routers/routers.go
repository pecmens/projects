package routers

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"ssps-go/handlers"
	"ssps-go/middleware"
)

// SetupRoutes 设置路由
func SetupRoutes(r *gin.Engine, db *gorm.DB) {
	// 创建处理器实例
	authHandler := handlers.NewAuthHandler(db)
	contentHandler := handlers.NewContentHandler(db)

	// 公共路由
	public := r.Group("/api")
	{
		// 认证相关路由
		public.POST("/auth/register", authHandler.Register)
		public.POST("/auth/login", authHandler.Login)
		public.GET("/auth/user", middleware.AuthMiddleware(), authHandler.GetCurrentUser)

		// 内容相关路由
		public.GET("/articles", contentHandler.GetArticles)
		public.GET("/articles/:slug", contentHandler.GetArticle)
		public.GET("/categories", contentHandler.GetCategories)
		public.GET("/categories/:slug", contentHandler.GetCategory)
		public.GET("/tags", contentHandler.GetTags)
		public.GET("/tags/:slug", contentHandler.GetTag)
	}

	// 需要认证的路由
	protected := r.Group("/api")
	protected.Use(middleware.AuthMiddleware())
	{
		// 文章管理
		protected.POST("/articles", contentHandler.CreateArticle)
		protected.PUT("/articles/:slug", contentHandler.UpdateArticle)
		protected.DELETE("/articles/:slug", contentHandler.DeleteArticle)

		// 分类管理
		protected.POST("/categories", contentHandler.CreateCategory)
		protected.PUT("/categories/:slug", contentHandler.UpdateCategory)
		protected.DELETE("/categories/:slug", contentHandler.DeleteCategory)

		// 标签管理
		protected.POST("/tags", contentHandler.CreateTag)
		protected.PUT("/tags/:slug", contentHandler.UpdateTag)
		protected.DELETE("/tags/:slug", contentHandler.DeleteTag)
	}
}