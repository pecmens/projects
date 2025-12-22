# SSPS Django 后端 API 文档

## 一、后端API接口实现原理

### 1.1 架构设计
SSPS Django后端采用经典的MVT（Model-View-Template）架构，结合Django REST Framework实现API功能：

- **Model层**: 负责数据模型定义和数据库操作
- **View层**: 处理HTTP请求，执行业务逻辑，返回响应
- **Serializer层**: 负责数据序列化和反序列化
- **Authentication层**: 负责用户认证和权限控制

### 1.2 API实现技术栈
- **Django**: Web框架，提供ORM、URL路由、中间件等功能
- **Django REST Framework (DRF)**: 提供API开发工具，如序列化器、视图集、认证等
- **Django REST Framework SimpleJWT**: 提供JWT认证支持
- **数据库**: SQLite（开发）/ PostgreSQL（生产）

### 1.3 序列化器实现原理
序列化器（Serializer）是连接Django模型和JSON数据的桥梁：

```python
class ArticleSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Article
        fields = ['id', 'title', 'slug', 'content', 'excerpt', ...]
        lookup_field = 'slug'
```

序列化器的主要功能：
- 将模型实例转换为JSON格式（序列化）
- 将JSON数据转换为模型实例（反序列化）
- 数据验证和清理
- 字段级别的控制（只读、验证规则等）

### 1.4 视图实现原理
使用DRF的GenericAPIView和Mixins实现CRUD操作：

```python
class ArticleListView(generics.ListCreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleListSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
```

视图类的职责：
- 定义数据查询集（queryset）
- 指定序列化器（serializer_class）
- 控制分页、过滤、权限
- 处理HTTP请求方法（GET、POST、PUT、DELETE）

### 1.5 认证与权限实现
使用JWT Token进行无状态认证：

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
}
```

认证流程：
1. 用户登录时，服务器验证凭据
2. 生成JWT Token并返回给客户端
3. 客户端在后续请求中携带Token
4. 服务器验证Token并识别用户身份

## 二、后端接口配置与前端连接

### 2.1 前后端分离架构
SSPS采用前后端分离架构，前端和后端独立部署：

```
前端 (Next.js) ←→ HTTP API ←→ 后端 (Django)
```

### 2.2 接口配置
#### CORS配置
```python
# settings.py
INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    ...
    'corsheaders.middleware.CorsMiddleware',
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Next.js开发服务器
    "https://yourdomain.com",  # 生产环境域名
]
```

#### JWT配置
```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
}
```

### 2.3 前端连接方式

#### 2.3.1 API客户端封装
前端可以创建统一的API客户端：

```javascript
// apiClient.js
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 自动添加Token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### 2.3.2 认证流程
1. **用户注册**
```javascript
const register = async (userData) => {
  const response = await apiClient.post('/auth/register/', userData);
  const { token, user } = response.data;
  localStorage.setItem('token', token);
  return { token, user };
};
```

2. **用户登录**
```javascript
const login = async (credentials) => {
  const response = await apiClient.post('/auth/login/', credentials);
  const { access, user } = response.data;
  localStorage.setItem('token', access);
  return { access, user };
};
```

3. **获取文章列表**
```javascript
const getArticles = async (params) => {
  const response = await apiClient.get('/articles/', params);
  return response.data;
};
```

#### 2.3.3 错误处理
```javascript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token过期，清除本地存储并重定向到登录页
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 2.4 数据同步机制
#### 2.4.1 实时数据更新
- 前端通过API获取最新数据
- 使用React Query或SWR进行缓存管理
- 支持数据预加载和后台更新

#### 2.4.2 静态生成集成
- 前端可以在构建时调用后端API获取数据
- 使用获取的数据生成静态页面
- 支持增量静态再生（ISR）

## 三、后端各项功能详解

### 3.1 用户认证功能

#### 3.1.1 用户注册
- **端点**: `POST /api/auth/register/`
- **功能**: 创建新用户账户
- **请求体**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```
- **响应**:
```json
{
  "user": {
    "id": number,
    "username": "string",
    "email": "string"
  },
  "token": "string"
}
```

#### 3.1.2 用户登录
- **端点**: `POST /api/auth/login/`
- **功能**: 用户身份验证
- **请求体**:
```json
{
  "username": "string",
  "password": "string"
}
```
- **响应**:
```json
{
  "access": "string",
  "refresh": "string",
  "user": {
    "id": number,
    "username": "string",
    "email": "string"
  }
}
```

#### 3.1.3 用户信息获取
- **端点**: `GET /api/auth/user/`
- **功能**: 获取当前登录用户信息
- **认证**: JWT Token
- **响应**:
```json
{
  "id": number,
  "username": "string",
  "email": "string"
}
```

### 3.2 文章管理功能

#### 3.2.1 文章列表
- **端点**: `GET /api/articles/`
- **功能**: 获取文章列表，支持分页、搜索、过滤
- **查询参数**:
  - `page`: 页码
  - `page_size`: 每页数量
  - `category`: 按分类过滤
  - `tag`: 按标签过滤
  - `search`: 搜索关键词
- **响应**:
```json
{
  "count": 100,
  "next": "http://.../api/articles/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "文章标题",
      "slug": "article-slug",
      "excerpt": "文章摘要",
      "published": true,
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z",
      "category": "分类名",
      "tags": ["标签1", "标签2"]
    }
  ]
}
```

#### 3.2.2 文章创建
- **端点**: `POST /api/articles/`
- **功能**: 创建新文章
- **权限**: 认证用户
- **请求体**:
```json
{
  "title": "文章标题",
  "slug": "article-slug",
  "content": "文章内容（支持Markdown）",
  "excerpt": "文章摘要",
  "published": true,
  "category": "分类ID或名称",
  "tags": ["标签1", "标签2"]
}
```

#### 3.2.3 文章详情
- **端点**: `GET /api/articles/<slug>/`
- **功能**: 获取文章详情
- **响应**: 包含完整文章内容的JSON对象

### 3.3 分类管理功能

#### 3.3.1 分类列表
- **端点**: `GET /api/categories/`
- **功能**: 获取所有分类
- **响应**:
```json
[
  {
    "id": 1,
    "name": "技术",
    "slug": "tech",
    "description": "技术相关的文章"
  }
]
```

#### 3.3.2 分类创建/更新/删除
- **创建**: `POST /api/categories/`
- **详情/更新/删除**: `GET/PUT/DELETE /api/categories/<slug>/`
- **权限**: 认证用户

### 3.4 标签管理功能

#### 3.4.1 标签列表
- **端点**: `GET /api/tags/`
- **功能**: 获取所有标签
- **响应**:
```json
[
  {
    "id": 1,
    "name": "Python",
    "slug": "python"
  }
]
```

#### 3.4.2 标签CRUD操作
- **创建**: `POST /api/tags/`
- **详情/更新/删除**: `GET/PUT/DELETE /api/tags/<slug>/`

### 3.5 管理后台功能

#### 3.5.1 Django Admin
- **访问地址**: `/admin/`
- **功能**:
  - 用户管理
  - 文章管理（富文本编辑器）
  - 分类管理
  - 标签管理
  - 内容搜索和过滤
  - 批量操作

#### 3.5.2 内容管理特性
- **富文本编辑**: 支持Markdown格式
- **文件上传**: 图片和文档上传功能
- **版本控制**: 内容修改历史
- **权限管理**: 不同用户角色的权限控制

### 3.6 性能优化功能

#### 3.6.1 数据库优化
- **索引优化**: 在常用查询字段上创建数据库索引
- **查询优化**: 使用select_related和prefetch_related减少数据库查询
- **缓存机制**: 支持Redis缓存热点数据

#### 3.6.2 API性能
- **分页**: 自动分页，避免大数据量查询
- **过滤**: 支持多种过滤方式
- **序列化优化**: 使用不同序列化器处理列表和详情视图

### 3.7 安全特性

#### 3.7.1 认证安全
- JWT Token防篡改
- Token过期机制
- 密码加密存储

#### 3.7.2 数据安全
- 输入验证和清理
- SQL注入防护
- XSS防护
- CSRF防护（对于表单提交）

#### 3.7.3 权限控制
- 细粒度权限控制
- 只读/写权限分离
- 用户角色管理