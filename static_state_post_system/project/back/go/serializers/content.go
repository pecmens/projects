package serializers

import "ssps-go/models"

// ArticleRequest 文章请求
type ArticleRequest struct {
	Title     string  `json:"title" binding:"required"`
	Slug      string  `json:"slug" binding:"required"`
	Content   string  `json:"content" binding:"required"`
	Excerpt   *string `json:"excerpt,omitempty"`
	Published *bool   `json:"published,omitempty"`
	Category  *string `json:"category,omitempty"`
	Tags      []string `json:"tags,omitempty"`
}

// ArticleResponse 文章响应
type ArticleResponse struct {
	ID        uint          `json:"id"`
	Title     string        `json:"title"`
	Slug      string        `json:"slug"`
	Content   string        `json:"content"`
	Excerpt   *string       `json:"excerpt,omitempty"`
	CreatedAt string        `json:"created_at"`
	UpdatedAt string        `json:"updated_at"`
	Published bool          `json:"published"`
	Author    *UserResponse `json:"author,omitempty"`
	Category  *string       `json:"category,omitempty"`
	Tags      []string      `json:"tags,omitempty"`
}

// ArticleListResponse 文章列表响应
type ArticleListResponse struct {
	ID        uint      `json:"id"`
	Title     string    `json:"title"`
	Slug      string    `json:"slug"`
	Excerpt   *string   `json:"excerpt,omitempty"`
	Published bool      `json:"published"`
	CreatedAt string    `json:"created_at"`
	UpdatedAt string    `json:"updated_at"`
	Category  *string   `json:"category,omitempty"`
}

// CategoryRequest 分类请求
type CategoryRequest struct {
	Name        string `json:"name" binding:"required"`
	Slug        string `json:"slug" binding:"required"`
	Description string `json:"description"`
}

// CategoryResponse 分类响应
type CategoryResponse struct {
	ID          uint   `json:"id"`
	Name        string `json:"name"`
	Slug        string `json:"slug"`
	Description string `json:"description"`
	CreatedAt   string `json:"created_at"`
}

// TagRequest 标签请求
type TagRequest struct {
	Name string `json:"name" binding:"required"`
	Slug string `json:"slug" binding:"required"`
}

// TagResponse 标签响应
type TagResponse struct {
	ID        uint   `json:"id"`
	Name      string `json:"name"`
	Slug      string `json:"slug"`
	CreatedAt string `json:"created_at"`
}

// ArticleResponseFromModel 将Article模型转换为响应格式
func ArticleResponseFromModel(article models.Article) ArticleResponse {
	var author *UserResponse
	if article.Author != nil {
		userResp := UserResponseFromModel(*article.Author)
		author = &userResp
	}

	var category *string
	if article.Category != nil {
		category = &article.Category.Name
	}

	var tags []string
	for _, tag := range article.Tags {
		tags = append(tags, tag.Name)
	}

	return ArticleResponse{
		ID:        article.ID,
		Title:     article.Title,
		Slug:      article.Slug,
		Content:   article.Content,
		Excerpt:   article.Excerpt,
		CreatedAt: article.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt: article.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
		Published: article.Published,
		Author:    author,
		Category:  category,
		Tags:      tags,
	}
}

// ArticleListResponseFromModel 将Article模型转换为列表响应格式
func ArticleListResponseFromModel(article models.Article) ArticleListResponse {
	var category *string
	if article.Category != nil {
		category = &article.Category.Name
	}

	return ArticleListResponse{
		ID:        article.ID,
		Title:     article.Title,
		Slug:      article.Slug,
		Excerpt:   article.Excerpt,
		Published: article.Published,
		CreatedAt: article.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt: article.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
		Category:  category,
	}
}

// CategoryResponseFromModel 将Category模型转换为响应格式
func CategoryResponseFromModel(category models.Category) CategoryResponse {
	return CategoryResponse{
		ID:          category.ID,
		Name:        category.Name,
		Slug:        category.Slug,
		Description: category.Description,
		CreatedAt:   category.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
}

// TagResponseFromModel 将Tag模型转换为响应格式
func TagResponseFromModel(tag models.Tag) TagResponse {
	return TagResponse{
		ID:        tag.ID,
		Name:      tag.Name,
		Slug:      tag.Slug,
		CreatedAt: tag.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
}