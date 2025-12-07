/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 生成静态文件
  trailingSlash: true,
  images: {
    unoptimized: true // 由于是静态导出，需要设置为未优化
  }
}

module.exports = nextConfig
