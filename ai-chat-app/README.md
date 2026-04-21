# AI Chat 应用

一个基于 Vue3 + TypeScript + UniApp (Web 版) 和 Express + MongoDB 的 AI 聊天应用，支持 AI 聊天、好友管理和多种 AI 工具。

## 项目结构

```
ai-chat-app/
├── frontend/          # 前端项目 (Vue3 + TypeScript + Vite)
│   ├── src/
│   │   ├── api/       # API 请求封装
│   │   ├── assets/    # 静态资源
│   │   ├── components/# 公共组件
│   │   ├── router/    # 路由配置
│   │   ├── stores/    # Pinia 状态管理
│   │   ├── views/     # 页面组件
│   │   ├── App.vue    # 根组件
│   │   └── main.ts    # 入口文件
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── backend/           # 后端项目 (Express + TypeScript + MongoDB)
    ├── src/
    │   ├── config/    # 配置文件
    │   ├── controllers/# 控制器
    │   ├── middleware/# 中间件
    │   ├── models/    # 数据模型
    │   ├── routes/    # 路由
    │   └── index.ts   # 入口文件
    ├── package.json
    └── tsconfig.json
```

## 功能特性

### 1. AI 聊天
- 🤖 与 AI 助手进行智能对话
- 💬 实时消息发送和接收
- 📝 会话历史记录
- 🔄 自动滚动到最新消息

### 2. 好友管理
- 👥 添加好友
- 📨 好友请求处理（接受/拒绝）
- 📋 好友列表管理
- 💌 与好友私聊

### 3. AI 工具集
- ✍️ AI 写作助手
- 🌐 AI 翻译
- 💻 AI 代码助手
- 🎨 AI 图像生成
- 🎤 语音转文字
- 📊 数据分析

## 技术栈

### 前端
- **框架**: Vue 3.5+
- **语言**: TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router 5
- **HTTP 客户端**: Axios
- **实时通信**: Socket.IO Client

### 后端
- **框架**: Express
- **语言**: TypeScript
- **数据库**: MongoDB
- **认证**: JWT
- **实时通信**: Socket.IO
- **密码加密**: bcrypt

## 快速开始

### 环境要求
- Node.js >= 18
- MongoDB >= 4.4

### 后端启动

```bash
cd ai-chat-app/backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，设置 MongoDB 连接字符串和 JWT 密钥

# 开发模式运行
npm run dev

# 生产模式运行
npm run build
npm start
```

### 前端启动

```bash
cd ai-chat-app/frontend

# 安装依赖
npm install

# 开发模式运行
npm run dev

# 生产模式构建
npm run build
```

## API 接口

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息

### 聊天相关
- `GET /api/chat/sessions` - 获取会话列表
- `POST /api/chat/ai` - 创建 AI 会话
- `GET /api/chat/:sessionId/messages` - 获取消息历史
- `POST /api/chat/:sessionId/messages` - 发送消息
- `POST /api/chat/:sessionId/ai-reply` - 获取 AI 回复

### 好友相关
- `GET /api/friends` - 获取好友列表
- `POST /api/friends/request` - 发送好友请求
- `GET /api/friends/requests` - 获取待处理请求
- `POST /api/friends/accept/:friendId` - 接受好友请求
- `POST /api/friends/reject/:friendId` - 拒绝好友请求

### AI 工具
- `POST /api/ai-tools/process` - 处理 AI 工具请求

## 页面说明

### 1. 登录/注册页 (`/login`)
- 支持邮箱密码登录
- 支持新用户注册
- JWT Token 自动保存

### 2. AI 聊天页 (`/chat`)
- 左侧会话列表
- 右侧聊天窗口
- 支持新建 AI 对话
- 实时消息展示

### 3. 好友管理页 (`/friends`)
- 添加好友功能
- 好友请求处理
- 好友列表展示
- 在线状态显示

### 4. AI 工具页 (`/ai-tools`)
- 6 种 AI 工具卡片
- 工具使用工作区
- 结果展示区域

## 开发说明

### 添加新的 AI 工具
1. 在 `frontend/src/views/AITools.vue` 中添加新的工具卡片
2. 在 `toolNames` 和 `toolPlaceholders` 中添加配置
3. 在后端 `backend/src/controllers/aiToolsController.ts` 中实现处理逻辑

### 添加新的聊天功能
1. 在 `frontend/src/stores/chat.ts` 中添加状态和方法
2. 在后端添加相应的路由和控制器
3. 更新消息模型 `backend/src/models/Message.ts`

## 注意事项

1. **MongoDB 连接**: 确保 MongoDB 服务已启动并正确配置连接字符串
2. **JWT 密钥**: 生产环境请使用强随机字符串作为 JWT 密钥
3. **CORS 配置**: 前后端分离时需要正确配置 CORS
4. **Socket.IO**: 实时通信需要确保 WebSocket 端口开放

## 后续优化建议

1. 🔐 添加邮箱验证功能
2. 📱 适配移动端 (UniApp)
3. 🎨 添加主题切换功能
4. 📦 添加消息推送通知
5. 🗄️ 添加消息搜索功能
6. 📊 添加用户数据统计
7. 🌐 接入真实的 AI 模型 API (如 OpenAI、文心一言等)
8. 🖼️ 添加头像上传功能
9. 🔔 添加在线状态实时更新
10. 📝 添加消息撤回和编辑功能

## License

MIT
