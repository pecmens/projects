/**
 * SSPS 主服务器脚本
 * 用于启动整个静态状态发布系统
 */
const express = require('express');
const { exec, spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 静态文件服务
app.use(express.static('project/front/out'));

// API 代理到后端
app.all('/api/*', (req, res) => {
  // 这里可以代理到 Python 后端
  console.log(`API 请求: ${req.method} ${req.url}`);
  
  // 简单的响应，实际实现中会代理到后端服务
  res.json({ 
    message: 'API 代理服务', 
    method: req.method, 
    path: req.url 
  });
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\nSSPS 服务器运行在 http://localhost:${PORT}`);
  console.log('生产模式：提供静态文件服务');
  console.log('开发模式：使用 npm run dev 命令\n');
});

module.exports = app;