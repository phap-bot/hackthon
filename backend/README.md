# 🚀 AI Travel Planner Backend

智能旅游规划系统后端API，使用FastAPI构建，支持MongoDB数据库和实时WebSocket通信。

## 📋 项目概述

这是一个完整的后端系统，为AI旅游规划前端应用提供强大的API支持。系统包含用户认证、旅游规划、实时地图功能、反馈系统和管理面板等完整功能。

## ✨ 主要功能

### 🔐 用户认证系统
- 用户注册/登录
- JWT令牌认证
- 密码加密存储
- 用户信息管理

### 🗺️ 旅游规划系统
- AI驱动的行程生成
- 多天行程规划
- 预算和偏好设置
- 活动详情管理
- **🇻🇳 越南语支持**: 完整的越南语AI响应和本地化

### 🗺️ 实时地图功能
- Google Maps API集成
- 地点搜索和详情
- 路线规划
- 实时位置追踪

### 💬 实时通信
- WebSocket连接
- 实时位置更新
- 行程聊天
- 紧急警报

### 📊 反馈系统
- 行程评价
- 多维度评分
- 建议收集
- 统计分析
- **🤖 智能分析**: 自动情感分析和趋势分析
- **🔄 自动改进**: 基于反馈自动生成改进建议
- **📈 管理面板**: 完整的反馈管理和分析仪表板

### 👨‍💼 管理面板
- 用户管理
- 行程统计
- 收入分析
- 系统监控

## 🛠️ 技术栈

- **后端框架**: FastAPI 0.104.1
- **数据库**: MongoDB 7.0
- **缓存**: Redis 7.2
- **认证**: JWT + Passlib
- **地图服务**: Google Maps API
- **AI服务**: OpenAI API
- **实时通信**: WebSocket
- **容器化**: Docker + Docker Compose
- **测试**: Pytest + TestClient

## 📁 项目结构

```
backend/
├── app/
│   ├── __init__.py
│   ├── database.py              # 数据库连接和配置
│   ├── models.py                # Pydantic数据模型
│   ├── middleware.py            # 中间件（日志、限流）
│   ├── routers/                 # API路由
│   │   ├── auth.py             # 认证路由
│   │   ├── travel_planner.py   # 旅游规划路由
│   │   ├── itinerary.py        # 行程详情路由
│   │   ├── feedback.py         # 反馈路由
│   │   ├── feedback_management.py # 反馈管理路由
│   │   ├── feedback_dashboard.py  # 反馈仪表板路由
│   │   ├── admin.py            # 管理路由
│   │   ├── maps.py             # 地图路由
│   │   ├── websocket.py        # WebSocket路由
│   │   └── language.py         # 语言路由
│   ├── services/               # 业务逻辑服务
│   │   ├── ai_service.py       # AI服务
│   │   ├── maps_service.py     # 地图服务
│   │   ├── language_service.py # 语言服务
│   │   ├── feedback_analytics_service.py # 反馈分析服务
│   │   └── auto_improvement_service.py   # 自动改进服务
│   └── utils/                  # 工具函数
│       ├── auth.py             # 认证工具
│       └── logger.py           # 日志工具
├── tests/                      # 测试文件
│   └── test_api.py            # API测试
├── logs/                       # 日志文件
├── main.py                     # 应用入口
├── requirements.txt            # Python依赖
├── Dockerfile                  # Docker配置
├── docker-compose.yml          # Docker Compose配置
├── mongo-init.js              # MongoDB初始化脚本
├── start.sh                   # Linux启动脚本
├── start.bat                  # Windows启动脚本
└── env.example                # 环境变量示例
```

## 🚀 快速开始

### 方法1: 使用MongoDB Compass Local (推荐) - 适合本地开发

#### 1. 克隆项目
```bash
git clone <repository-url>
cd backend
```

#### 2. 确保MongoDB Compass运行
- 启动MongoDB Compass
- 连接到 `mongodb://localhost:27017`
- 确保连接状态为 "Connected"

#### 3. 配置环境变量
```bash
# 复制环境变量文件
cp env.example .env

# 编辑.env文件，添加你的API密钥
# Windows: notepad .env
# Linux/Mac: nano .env
```

**⚠️ 重要**: 在 `.env` 文件中必须配置以下API密钥:

#### 如何获取API密钥:

**1. OpenAI API Key (必需)**
- 访问: https://platform.openai.com/api-keys
- 登录或注册OpenAI账户
- 点击 "Create new secret key"
- 复制生成的密钥 (格式: sk-...)
- 添加到 `.env`: `OPENAI_API_KEY=sk-your-key-here`

**2. Google Maps API Key (必需)**
- 访问: https://console.cloud.google.com/
- 创建新项目或选择现有项目
- 启用以下APIs:
  - Maps JavaScript API
  - Places API
  - Directions API
  - Geocoding API
- 创建API密钥
- 添加到 `.env`: `GOOGLE_MAPS_API_KEY=your-key-here`

**3. SerpAPI Key (推荐)**
- 访问: https://serpapi.com/
- 注册免费账户 (100 searches/month)
- 获取API key
- 添加到 `.env`: `SERPAPI_API_KEY=your-key-here`

**4. Weather API Key (可选)**
- 访问: https://openweathermap.org/api
- 注册免费账户
- 获取API key
- 添加到 `.env`: `WEATHER_API_KEY=your-key-here`

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
SERPAPI_API_KEY=your-serpapi-api-key-here
WEATHER_API_KEY=your-weather-api-key-here
```

#### 4. 测试MongoDB连接
```bash
# 测试MongoDB连接和基本功能
python test_mongodb.py
```

#### 5. 启动后端服务
```bash
# Windows:
start_local.bat

# Linux/Mac:
chmod +x start_local.sh
./start_local.sh
```

#### 6. 验证安装
- **API文档**: http://localhost:8000/docs
- **健康检查**: http://localhost:8000/health
- **数据库管理**: MongoDB Compass (localhost:27017)

### 方法2: 本地开发 - 适合开发者

#### 1. 系统要求
- **Python**: 3.11+ (推荐 3.11.5)
- **MongoDB**: 7.0+
- **Redis**: 7.2+ (可选)
- **Git**: 最新版本

#### 2. 安装Python依赖

```bash
# 创建虚拟环境
python3 -m venv venv

# 激活虚拟环境
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 升级pip
python -m pip install --upgrade pip

# 安装依赖
pip install -r requirements.txt
```

#### 3. 安装和配置MongoDB

**选项A: 使用Docker (推荐)**
```bash
# 启动MongoDB容器
docker run -d -p 27017:27017 --name mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  mongo:7.0

# 验证MongoDB运行
docker ps | grep mongodb
```

**选项B: 本地安装**
- **Windows**: 下载并安装 [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- **macOS**: `brew install mongodb-community`
- **Ubuntu**: 参考 [MongoDB官方文档](https://docs.mongodb.com/manual/installation/)

#### 4. 安装和配置Redis (可选)

**选项A: 使用Docker**
```bash
docker run -d -p 6379:6379 --name redis redis:7.2-alpine
```

**选项B: 本地安装**
- **Windows**: 下载 [Redis for Windows](https://github.com/microsoftarchive/redis/releases)
- **macOS**: `brew install redis`
- **Ubuntu**: `sudo apt install redis-server`

#### 5. 配置环境变量

```bash
# 复制环境变量文件
cp env.example .env

# 编辑.env文件
# Windows: notepad .env
# Linux/Mac: nano .env
```

**必需配置**:
```env
# 数据库配置
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=hackthon

# 安全配置 (生产环境必须更改)
SECRET_KEY=your-super-secret-key-change-in-production

# API密钥 (必须配置)
OPENAI_API_KEY=sk-your-openai-api-key-here
GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here

# Redis配置 (可选)
REDIS_URL=redis://localhost:6379

# CORS配置
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

#### 6. 启动应用

```bash
# 方法1: 使用启动脚本
# Windows:
start.bat
# Linux/Mac:
chmod +x start.sh
./start.sh

# 方法2: 直接使用uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 方法3: 开发模式 (自动重载)
uvicorn main:app --reload --host 127.0.0.1 --port 8000 --log-level debug
```

#### 7. 验证安装成功

```bash
# 测试API健康状态
curl http://localhost:8000/health
# 预期输出: {"status": "healthy", "timestamp": "..."}

# 测试API文档
# 打开浏览器访问: http://localhost:8000/docs
```

#### 8. 完整功能测试

**测试用户注册和登录:**
```bash
# 1. 注册新用户
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpassword123",
    "full_name": "Test User"
  }'

# 2. 用户登录
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpassword123"
  }'
# 保存返回的access_token用于后续测试
```

**测试旅游规划功能:**
```bash
# 使用上面获取的token替换YOUR_TOKEN
export TOKEN="YOUR_TOKEN_HERE"

# 创建旅游计划
curl -X POST "http://localhost:8000/api/travel-planner" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "destination": "Hà Nội, Việt Nam",
    "start_date": "2024-02-01",
    "end_date": "2024-02-05",
    "people": 2,
    "budget": "medium",
    "travel_style": "cultural",
    "interests": ["历史", "美食", "文化"]
  }'
```

**测试地图功能:**
```bash
# 搜索地点
curl "http://localhost:8000/api/maps/search?query=Hồ Gươm, Hà Nội"

# 获取地点详情
curl "http://localhost:8000/api/maps/place/ChIJ..."
```

**测试反馈系统:**
```bash
# 提交反馈
curl -X POST "http://localhost:8000/api/feedback" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "trip_id": "trip_id_here",
    "rating": 5,
    "comment": "Chuyến đi rất tuyệt vời!",
    "categories": ["service", "experience"]
  }'
```

**测试SerpAPI功能:**
```bash
# 搜索咖啡店 (Hà Nội)
curl "http://localhost:8000/api/maps/coffee?lat=21.0285&lng=105.8542&min_rating=4.0&limit=5"

# 搜索餐厅
curl "http://localhost:8000/api/maps/restaurants?lat=21.0285&lng=105.8542&min_rating=4.0&limit=5"

# 搜索酒店
curl "http://localhost:8000/api/maps/hotels?lat=21.0285&lng=105.8542&min_rating=4.0&limit=5"

# 搜索景点
curl "http://localhost:8000/api/maps/attractions?lat=21.0285&lng=105.8542&min_rating=4.0&limit=5"

# 获取地点评价
curl "http://localhost:8000/api/maps/place/place_id_here/reviews"
```

**运行SerpAPI测试脚本:**
```bash
# 运行demo script
python test_serpapi.py
```

**验证所有服务运行正常:**
```bash
# 检查Docker容器状态
docker-compose ps

# 检查MongoDB连接
docker exec travel_planner_mongodb mongosh --eval "db.adminCommand('ping')"

# 检查Redis连接
docker exec travel_planner_redis redis-cli ping

# 查看应用日志
docker-compose logs backend --tail=50
```

## 🔧 环境配置

### 必需的环境变量

```env
# 数据库配置
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=travel_planner

# 安全配置
SECRET_KEY=your-secret-key-change-in-production

# API密钥
OPENAI_API_KEY=your-openai-api-key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Redis配置
REDIS_URL=redis://localhost:6379

# 语言配置
DEFAULT_LANGUAGE=vi
SUPPORTED_LANGUAGES=vi,en

# CORS配置
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### 可选的环境变量

```env
# JWT配置
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALGORITHM=HS256

# 限流配置
REQUESTS_PER_MINUTE=60

# 日志配置
LOG_LEVEL=INFO
LOG_FILE=logs/app.log
```

## 📖 API文档

启动服务后，访问以下地址查看API文档：

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **健康检查**: http://localhost:8000/health

### 主要API端点

#### 认证 API
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息
- `PUT /api/auth/me` - 更新用户信息

#### 旅游规划 API
- `POST /api/travel-planner` - 创建旅游计划
- `GET /api/trips` - 获取用户行程
- `GET /api/trips/{trip_id}` - 获取行程详情
- `PUT /api/trips/{trip_id}` - 更新行程
- `DELETE /api/trips/{trip_id}` - 删除行程

#### 地图 API
- `GET /api/maps/search` - 搜索地点
- `GET /api/maps/place/{place_id}` - 获取地点详情
- `POST /api/maps/directions` - 获取路线
- `GET /api/maps/geocode` - 地址转坐标

#### SerpAPI 地图搜索 API (新增)
- `GET /api/maps/coffee` - 搜索咖啡店 (支持评分过滤)
- `GET /api/maps/restaurants` - 搜索餐厅 (支持评分过滤)
- `GET /api/maps/hotels` - 搜索酒店 (支持评分过滤)
- `GET /api/maps/attractions` - 搜索景点 (支持评分过滤)
- `GET /api/maps/place/{place_id}/reviews` - 获取地点评价

#### WebSocket API
- `WS /ws/connect/{user_id}` - 实时连接
- 支持消息类型: `location_update`, `join_trip`, `trip_message`, `emergency_alert`

#### 反馈 API
- `POST /api/feedback` - 提交反馈
- `GET /api/feedback` - 获取反馈列表
- `GET /api/feedback/{feedback_id}` - 获取反馈详情
- `PUT /api/feedback/{feedback_id}` - 更新反馈
- `POST /api/feedback/{feedback_id}/vote` - 投票反馈
- `POST /api/feedback/{feedback_id}/reply` - 回复反馈

#### 反馈分析 API
- `GET /api/feedback/analytics` - 获取反馈分析
- `GET /api/feedback/insights` - 获取反馈洞察
- `GET /api/feedback/improvement-roadmap` - 获取改进路线图

#### 反馈仪表板 API
- `GET /api/dashboard/stats` - 获取仪表板统计
- `GET /api/dashboard/trends` - 获取反馈趋势
- `GET /api/dashboard/feedback-summary` - 获取反馈摘要
- `POST /api/dashboard/feedback/{feedback_id}/assign` - 分配反馈
- `POST /api/dashboard/feedback/{feedback_id}/resolve` - 解决反馈

#### 管理 API
- `GET /api/admin/stats` - 获取统计数据
- `GET /api/admin/trips` - 获取所有行程
- `GET /api/admin/users` - 获取所有用户

#### 语言 API
- `GET /api/languages` - 获取支持的语言列表
- `GET /api/languages/{language}/messages` - 获取特定语言的系统消息
- `POST /api/languages/translate` - 翻译数据到目标语言
- `GET /api/languages/{language}/activity-types` - 获取活动类型翻译
- `GET /api/languages/{language}/budget-types` - 获取预算类型翻译
- `GET /api/languages/{language}/travel-styles` - 获取旅行风格翻译

#### 偏好调查 API (新增)
- `POST /api/survey/submit` - 提交旅游偏好调查
- `GET /api/survey/my-preferences` - 获取当前用户的旅游偏好
- `PUT /api/survey/update` - 更新旅游偏好
- `GET /api/survey/recommendations` - 获取个性化推荐
- `GET /api/survey/options` - 获取所有可用的调查选项

## 🧪 测试

```bash
# 运行所有测试
pytest

# 运行特定测试
pytest tests/test_api.py

# 运行测试并生成覆盖率报告
pytest --cov=app tests/

# 运行测试并显示详细输出
pytest -v
```

## 📊 数据库设计

### 主要集合

#### users
```json
{
  "_id": "ObjectId",
  "username": "string",
  "email": "string",
  "full_name": "string",
  "hashed_password": "string",
  "avatar_url": "string",
  "is_active": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

#### trips
```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId",
  "destination": "string",
  "start_date": "date",
  "end_date": "date",
  "total_days": "number",
  "total_cost": "number",
  "people": "number",
  "budget": "string",
  "travel_style": "string",
  "interests": ["string"],
  "status": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

#### activities
```json
{
  "_id": "ObjectId",
  "trip_id": "ObjectId",
  "day": "number",
  "name": "string",
  "type": "string",
  "time": "string",
  "duration": "string",
  "cost": "number",
  "description": "string",
  "location": "string",
  "rating": "number",
  "coordinates": {
    "lat": "number",
    "lng": "number"
  },
  "created_at": "datetime"
}
```

## 🔒 安全特性

- **JWT认证**: 安全的令牌认证
- **密码加密**: 使用bcrypt加密密码
- **CORS保护**: 配置跨域访问
- **速率限制**: 防止API滥用
- **输入验证**: Pydantic模型验证
- **SQL注入防护**: MongoDB NoSQL数据库
- **日志记录**: 完整的操作日志

## 📈 性能优化

- **数据库索引**: 优化查询性能
- **连接池**: MongoDB连接池管理
- **缓存机制**: Redis缓存支持
- **异步处理**: FastAPI异步支持
- **分页查询**: 大数据集分页
- **压缩响应**: Gzip压缩

## 🚀 部署

### Docker部署

```bash
# 构建镜像
docker build -t travel-planner-backend .

# 运行容器
docker run -d -p 8000:8000 \
  -e MONGODB_URL=mongodb://mongodb:27017 \
  -e SECRET_KEY=your-secret-key \
  travel-planner-backend
```

### 生产环境配置

```bash
# 使用生产环境配置
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4

# 使用Gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## 🔧 开发工具

### 代码格式化
```bash
# 使用black格式化代码
black app/

# 使用isort排序导入
isort app/

# 使用flake8检查代码
flake8 app/
```

### 数据库管理
```bash
# 连接MongoDB
mongosh mongodb://localhost:27017/travel_planner

# 查看集合
show collections

# 查看文档
db.users.find().pretty()
```

## 📝 更新日志

### v2.0.0 (2024-01-01)
- ✨ 完整的后端系统重构
- 🔐 JWT认证系统
- 🗺️ 实时地图功能
- 💬 WebSocket实时通信
- 📊 管理面板API
- 🧪 完整的测试套件
- 🐳 Docker容器化支持
- **🇻🇳 越南语支持**: 完整的越南语AI响应和本地化系统
- **📊 智能反馈系统**: 完整的反馈管理、分析和自动改进系统

## 🤝 贡献指南

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开Pull Request

## 📄 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🔧 故障排除和常见问题

### 常见问题

#### 1. MongoDB连接失败
```bash
# 错误: pymongo.errors.ServerSelectionTimeoutError
# 解决方案:
docker ps | grep mongodb  # 检查MongoDB是否运行
docker logs travel_planner_mongodb  # 查看MongoDB日志
```

#### 2. API密钥错误
```bash
# 错误: OpenAI API key not found
# 解决方案:
# 1. 检查.env文件是否存在
ls -la .env

# 2. 检查API密钥格式
grep OPENAI_API_KEY .env
# 应该显示: OPENAI_API_KEY=sk-...

# 3. 验证API密钥有效性
curl -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models
```

#### 3. 端口冲突
```bash
# 错误: Address already in use
# 解决方案:
# 检查端口占用
netstat -tulpn | grep :8000  # Linux
lsof -i :8000  # macOS
netstat -ano | findstr :8000  # Windows

# 杀死占用进程
kill -9 <PID>  # Linux/macOS
taskkill /PID <PID> /F  # Windows
```

#### 4. Docker容器启动失败
```bash
# 查看容器状态
docker-compose ps

# 查看详细日志
docker-compose logs backend
docker-compose logs mongodb

# 重新构建并启动
docker-compose down
docker-compose up --build -d
```

#### 5. Python依赖安装失败
```bash
# 错误: pip install failed
# 解决方案:
# 1. 升级pip
python -m pip install --upgrade pip

# 2. 使用国内镜像源
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple/

# 3. 清理缓存
pip cache purge
```

### 调试技巧

#### 1. 启用详细日志
```bash
# 设置环境变量
export LOG_LEVEL=DEBUG

# 启动应用
uvicorn main:app --reload --log-level debug
```

#### 2. 测试数据库连接
```python
# 在Python shell中测试
python -c "
from app.database import get_database
db = get_database()
print('Database connected:', db.name)
"
```

#### 3. 测试API端点
```bash
# 健康检查
curl http://localhost:8000/health

# 测试认证
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"test123"}'
```

### 性能优化

#### 1. 数据库索引优化
```javascript
// 在MongoDB中创建索引
db.users.createIndex({ "email": 1 }, { unique: true })
db.trips.createIndex({ "user_id": 1, "created_at": -1 })
db.activities.createIndex({ "trip_id": 1, "day": 1 })
```

#### 2. Redis缓存配置
```bash
# 检查Redis连接
redis-cli ping

# 查看Redis内存使用
redis-cli info memory
```

#### 3. 应用性能监控
```bash
# 使用htop监控资源使用
htop

# 监控网络连接
netstat -tulpn | grep :8000
```

### 开发工具

#### 1. 代码格式化
```bash
# 格式化Python代码
black app/
isort app/

# 检查代码质量
flake8 app/
```

#### 2. 数据库管理
```bash
# 连接MongoDB
mongosh mongodb://localhost:27017/travel_planner

# 查看集合
show collections

# 查看文档数量
db.users.countDocuments()
db.trips.countDocuments()
```

#### 3. API测试
```bash
# 使用curl测试API
curl -X GET "http://localhost:8000/api/trips" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 使用httpie (更友好的工具)
pip install httpie
http GET localhost:8000/api/trips Authorization:"Bearer YOUR_JWT_TOKEN"
```

### 生产环境部署检查清单

- [ ] 更改默认SECRET_KEY
- [ ] 配置生产环境MongoDB
- [ ] 设置正确的CORS origins
- [ ] 配置HTTPS
- [ ] 设置日志轮转
- [ ] 配置监控和告警
- [ ] 备份数据库
- [ ] 测试所有API端点
- [ ] 配置负载均衡
- [ ] 设置防火墙规则

## 📞 支持

如有问题或建议，请：

1. 查看 [Issues](https://github.com/your-repo/issues)
2. 创建新的Issue
3. 联系开发团队
4. 查看本文档的故障排除部分

### 获取帮助

- **文档**: 查看本文档的各个章节
- **API文档**: http://localhost:8000/docs
- **日志**: 检查 `logs/app.log` 文件
- **社区**: 加入我们的开发者社区

---

**Developed with ❤️ for Travel Lovers**
