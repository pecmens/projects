package config

import (
	"fmt"
	"log"
	"os"
	"time"
)

type Config struct {
	JWTSecret     string
	DatabaseURL   string
	Port          string
	JWTExpireTime time.Duration
	PageSize      int
	MaxPageSize   int
}

var AppConfig *Config

func InitConfig() {
	AppConfig = &Config{
		JWTSecret:     getEnv("JWT_SECRET", "your-very-secure-secret-key-change-in-production"),
		DatabaseURL:   getEnv("DATABASE_URL", "ssps.db"),
		Port:          getEnv("PORT", "8080"),
		JWTExpireTime: parseDuration(getEnv("JWT_EXPIRE_HOURS", "24")),
		PageSize:      parseInt(getEnv("PAGE_SIZE", "10"), 10),
		MaxPageSize:   parseInt(getEnv("MAX_PAGE_SIZE", "100"), 100),
	}

	// 验证必要配置
	if AppConfig.JWTSecret == "your-very-secure-secret-key-change-in-production" {
		log.Println("警告: 使用默认JWT密钥，在生产环境中应更改此密钥")
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func parseDuration(durationStr string) time.Duration {
	duration, err := time.ParseDuration(durationStr + "h")
	if err != nil {
		log.Printf("无法解析持续时间，使用默认值24小时: %v", err)
		return 24 * time.Hour
	}
	return duration
}

func parseInt(intStr string, defaultVal int) int {
	var result int
	_, err := fmt.Sscanf(intStr, "%d", &result)
	if err != nil {
		log.Printf("无法解析整数 %s，使用默认值 %d: %v", intStr, defaultVal, err)
		return defaultVal
	}
	return result
}