package models

import (
	"gorm.io/gorm"
	"time"
)

// User 用户模型
type User struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Username  string    `json:"username" gorm:"uniqueIndex;not null"`
	Email     string    `json:"email" gorm:"uniqueIndex;not null"`
	Password  string    `json:"-" gorm:"not null"` // 不在JSON中暴露
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Articles  []Article `json:"-" gorm:"foreignKey:AuthorID"`
}

// Category 分类模型
type Category struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Name        string    `json:"name" gorm:"uniqueIndex;not null"`
	Slug        string    `json:"slug" gorm:"uniqueIndex;not null"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	Articles    []Article `json:"-" gorm:"foreignKey:CategoryID"`
}

// Tag 标签模型
type Tag struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name" gorm:"uniqueIndex;not null"`
	Slug      string    `json:"slug" gorm:"uniqueIndex;not null"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Articles  []Article `json:"-" gorm:"many2many:article_tags;"`
}

// ArticleTags 关联表
type ArticleTags struct {
	ArticleID uint `gorm:"primaryKey"`
	TagID     uint `gorm:"primaryKey"`
}

// Article 文章模型
type Article struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Title     string    `json:"title" gorm:"not null"`
	Slug      string    `json:"slug" gorm:"uniqueIndex;not null"`
	Content   string    `json:"content" gorm:"not null"`
	Excerpt   string    `json:"excerpt"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Published bool      `json:"published" gorm:"default:false"`
	
	// 关联字段
	AuthorID   *uint      `json:"-" gorm:"index"`
	Author     *User      `json:"author,omitempty" gorm:"foreignKey:AuthorID"`
	CategoryID *uint      `json:"-" gorm:"index"`
	Category   *Category  `json:"category,omitempty" gorm:"foreignKey:CategoryID"`
	Tags       []Tag      `json:"tags,omitempty" gorm:"many2many:article_tags;"`
	
	// 软删除
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}