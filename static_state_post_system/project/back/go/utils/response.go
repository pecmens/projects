package utils

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// APIResponse 通用API响应格式
type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   interface{} `json:"error,omitempty"`
}

// HandleError 处理错误并返回标准错误响应
func HandleError(c *gin.Context, statusCode int, message string) {
	log.Printf("[%s] ERROR - Path: %s, Error: %s, Status: %d", 
		time.Now().Format("2006-01-02 15:04:05"), 
		c.Request.URL.Path, 
		message, 
		statusCode)
	
	response := APIResponse{
		Success: false,
		Error:   message,
		Message: message,
	}
	
	c.JSON(statusCode, response)
}

// HandleSuccess 处理成功响应
func HandleSuccess(c *gin.Context, statusCode int, message string, data interface{}) {
	response := APIResponse{
		Success: true,
		Message: message,
		Data:    data,
	}
	
	if message == "" && data != nil {
		// 如果没有提供消息，但有数据，则只返回数据
		c.JSON(statusCode, data)
		return
	}
	
	c.JSON(statusCode, response)
}

// HandleSuccessWithMessage 仅返回消息的成功响应
func HandleSuccessWithMessage(c *gin.Context, statusCode int, message string) {
	response := APIResponse{
		Success: true,
		Message: message,
	}
	
	c.JSON(statusCode, response)
}

// HandleSuccessWithData 仅返回数据的成功响应
func HandleSuccessWithData(c *gin.Context, statusCode int, data interface{}) {
	c.JSON(statusCode, data)
}

// LogInfo 记录信息日志
func LogInfo(message string) {
	log.Printf("[%s] INFO - %s", 
		time.Now().Format("2006-01-02 15:04:05"), 
		message)
}

// LogError 记录错误日志
func LogError(message string, err error) {
	log.Printf("[%s] ERROR - %s, Details: %v", 
		time.Now().Format("2006-01-02 15:04:05"), 
		message, 
		err)
}

// LogRequest 记录请求日志
func LogRequest(c *gin.Context) {
	log.Printf("[%s] REQUEST - Method: %s, Path: %s, IP: %s", 
		time.Now().Format("2006-01-02 15:04:05"), 
		c.Request.Method, 
		c.Request.URL.Path, 
		c.ClientIP())
}