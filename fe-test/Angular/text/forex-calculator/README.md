# 外汇实时计算器

一个基于 Angular 18 构建的现代化外汇汇率查询与货币转换工具，提供实时汇率数据、多货币转换和优雅的用户界面。

## 🌟 功能特性

### 实时汇率监控
- **实时更新**: 每30秒自动获取最新汇率数据
- **多币种支持**: 支持美元、人民币、欧元、英镑、日元、澳元等10+主要货币
- **涨跌显示**: 直观显示汇率变化趋势（绿色上涨、红色下跌、灰色持平）
- **变化百分比**: 显示汇率变化的绝对值和百分比

### 货币转换器
- **实时转换**: 基于最新汇率进行货币转换计算
- **双向转换**: 支持任意两种支持货币之间的转换
- **快速交换**: 一键交换源货币和目标货币
- **精确计算**: 支持小数点后多位的精确计算

### 用户界面
- **响应式设计**: 完美适配桌面、平板和手机设备
- **现代美观**: 采用毛玻璃效果和渐变背景的现代化设计
- **交互友好**: 流畅的动画效果和直观的操作体验
- **加载状态**: 优雅的加载动画和错误处理

## 🚀 快速开始

### 环境要求
- Node.js 18+ 
- Angular CLI 18+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm start
```
访问 http://localhost:4200 查看应用

### 构建生产版本
```bash
npm run build
```

### 运行测试
```bash
npm test
```

## 📁 项目结构

```
forex-calculator/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── home/                 # 主页组件
│   │   │       ├── home.component.ts
│   │   │       ├── home.component.html
│   │   │       └── home.component.scss
│   │   ├── services/
│   │   │   └── forex.service.ts      # 外汇数据服务
│   │   ├── app.component.ts          # 根组件
│   │   ├── app.config.ts             # 应用配置
│   │   └── app.routes.ts             # 路由配置
│   ├── styles.scss                   # 全局样式
│   ├── index.html                    # HTML模板
│   └── main.ts                       # 应用入口
├── angular.json                      # Angular配置
├── package.json                      # 依赖配置
├── tsconfig.json                     # TypeScript配置
└── README.md                         # 项目说明
```

## 💻 技术栈

- **框架**: Angular 18
- **语言**: TypeScript 5.4
- **样式**: SCSS
- **HTTP客户端**: Angular HTTP Client
- **响应式编程**: RxJS
- **构建工具**: Angular CLI

## 🔧 API 数据源

项目使用多个外汇API作为数据源：

### 主要API
- **ExchangeRate-API**: https://api.exchangerate-api.com/v4/latest/USD
- **ER-API**: https://open.er-api.com/v6/latest/USD

### 备用数据
当外部API不可用时，系统会使用预设的备用汇率数据，确保应用正常运行。

## 📊 支持的货币

| 货币代码 | 货币名称 | 英文名称 |
|---------|---------|----------|
| USD | 美元 | US Dollar |
| CNY | 人民币 | Chinese Yuan |
| EUR | 欧元 | Euro |
| GBP | 英镑 | British Pound |
| JPY | 日元 | Japanese Yen |
| AUD | 澳元 | Australian Dollar |
| CAD | 加元 | Canadian Dollar |
| CHF | 瑞士法郎 | Swiss Franc |
| HKD | 港币 | Hong Kong Dollar |
| SGD | 新加坡元 | Singapore Dollar |
| KRW | 韩元 | Korean Won |

## 🎨 设计特色

### 视觉效果
- **毛玻璃效果**: 使用 `backdrop-filter` 实现现代化的毛玻璃效果
- **渐变背景**: 紫色渐变背景营造专业金融应用氛围
- **卡片设计**: 圆角卡片配合阴影效果提升层次感
- **动态交互**: hover效果和过渡动画增强用户体验

### 响应式布局
- **桌面端**: 网格布局展示汇率卡片，最大宽度1200px
- **平板端**: 自适应网格列数，保持良好的可读性
- **移动端**: 单列布局，优化的触控体验

## 🔄 数据更新机制

### 自动更新
- **更新频率**: 每30秒自动获取最新汇率
- **后台更新**: 使用RxJS定时器实现后台数据更新
- **状态管理**: BehaviorSubject管理汇率数据和更新时间

### 错误处理
- **API故障**: 自动切换到备用API
- **网络错误**: 降级使用预设汇率数据
- **用户提示**: 友好的错误提示和加载状态

## 📱 使用说明

### 查看实时汇率
1. 打开应用即可看到当前主要货币对美元的汇率
2. 绿色表示上涨，红色表示下跌
3. 点击"刷新"按钮可手动更新数据

### 货币转换
1. 在转换器中输入要转换的金额
2. 选择源货币和目标货币
3. 系统会自动显示转换结果
4. 点击交换按钮可快速互换货币

### 响应式使用
- 在移动设备上，汇率卡片会自动调整为单列显示
- 转换器在移动端会垂直排列，便于操作

## ⚙️ 配置说明

### 预算配置
在 `angular.json` 中配置了组件样式大小预算：
```json
"budgets": [
  {
    "type": "anyComponentStyle",
    "maximumWarning": "6kb",
    "maximumError": "10kb"
  }
]
```

### API配置
在 `forex.service.ts` 中可以配置：
- API端点URL
- 更新频率
- 支持的货币列表
- 备用汇率数据

## 🚀 部署

### 构建生产版本
```bash
npm run build
```

### 部署到静态服务器
将 `dist/forex-calculator` 目录部署到任何静态文件服务器即可。

### Docker部署
```dockerfile
FROM nginx:alpine
COPY dist/forex-calculator /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## ⚠️ 免责声明

- 本应用提供的汇率数据仅供参考
- 实际交易请以银行或金融机构的官方汇率为准
- 开发者不对基于本应用数据的任何交易决策负责

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发送邮件
- 创建 Pull Request

---

**外汇实时计算器** - 让汇率查询和货币转换变得简单高效！