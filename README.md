# SWJTU 像素形象工坊

基于像素点阵的角色捏人系统，支持用户自定义角色形象并提交作品，管理员可审核管理。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | 原生 HTML/CSS/JS + PSD 解析引擎（dotKisekae） |
| 后端 | Express 4 + TypeScript |
| 数据库 | SQLite（better-sqlite3）|
| 运行时 | Node.js |

## 项目结构

```
school/
├── front/                  # 前端静态资源
│   └── data/
│       ├── index.html      # 捏人主页面
│       ├── kisekae.css     # 样式（SWJTU 主题）
│       ├── dotKisekae.js   # 捏人引擎核心
│       └── psd.js          # PSD 解析库
├── server/                 # 后端服务
│   ├── src/
│   │   ├── index.ts        # 入口，Express 配置
│   │   ├── db.ts           # SQLite 数据库操作
│   │   ├── config.ts       # 环境配置（管理员账号等）
│   │   ├── types.ts        # TypeScript 类型定义
│   │   ├── middleware/
│   │   │   └── auth.ts     # 管理员鉴权中间件
│   │   └── routes/
│   │       ├── api.ts      # 公开 API（提交作品、获取已审核作品）
│   │       ├── admin.ts    # 管理后台 API（审核、删除）
│   │       └── authRoutes.ts # 登录/登出
│   ├── views/
│   │   ├── admin.html      # 管理后台页面
│   │   └── login.html      # 管理员登录页
│   └── package.json
├── data.db                 # SQLite 数据库文件（运行时生成）
└── README.md
```

## 快速开始

### 1. 安装依赖

```bash
cd server
npm install
```

### 2. 配置环境变量（可选）

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `PORT` | `3000` | 服务端口 |
| `ADMIN_USER` | `admin` | 管理员用户名 |
| `ADMIN_PASS` | `tianyufang` | 管理员密码 |
| `SESSION_SECRET` | 内置默认值 | Session 加密密钥 |

### 3. 启动服务

**开发模式（热重载）：**

```bash
cd server
npm run dev
```

**生产模式：**

```bash
cd server
npm run build
npm start
```

### 4. 访问页面

| 页面 | 地址 |
|------|------|
| 捏人页面 | `http://localhost:3000/` |
| 管理后台 | `http://localhost:3000/admin` |

## 功能特性

### 捏人页面

- **像素角色定制**：按部位分组的 Tab 导航（身体/头部/头发/上装/下装），每个 Tab 内纵向滚动选择部件和调色
- **配置持久化**：自动保存到 localStorage，刷新页面不丢失
- **保存/加载设置**：导出 JSON 配置文件，支持上传复用
- **重置形象**：一键恢复默认状态
- **提交作品**：填写用户名和寄语后提交，含 5 秒防抖限制，Toast 通知反馈

### 管理后台

- **作品审核**：查看所有提交，支持批准/拒绝状态切换
- **图片预览**：直接在卡片中展示角色截图
- **删除功能**：确认后永久删除提交记录
- **Session 鉴权**：登录后 24 小时有效

### API 接口

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| `POST` | `/api/submit` | 提交作品 | 无 |
| `GET` | `/api/approved` | 获取已审核作品 | 无 |
| `POST` | `/auth/login` | 管理员登录 | 无 |
| `POST` | `/auth/logout` | 退出登录 | 无 |
| `GET` | `/auth/check` | 检查登录状态 | 无 |
| `GET` | `/admin/api/submissions` | 获取所有提交 | 无 |
| `POST` | `/admin/api/review/:id` | 审核操作 | 需登录 |
| `DELETE` | `/admin/api/submissions/:id` | 删除提交 | 需登录 |

## Docker 部署

### 快速启动

```bash
docker compose up -d
```

服务将在 `http://localhost:3000` 启动，数据库文件自动保存在 `./appdata/data.db`。

### 自定义配置

创建 `.env` 文件覆盖默认值：

```env
ADMIN_USER=admin
ADMIN_PASS=your_password
SESSION_SECRET=your_secret_key
```

### 升级应用

```bash
# 拉取新代码后重新构建
docker compose down
docker compose build
docker compose up -d
```

数据保存在 `./appdata/` 目录，升级不会丢失。如需备份，直接复制该目录即可。

### 数据迁移

```bash
# 备份
cp ./appdata/data.db ./backup_$(date +%Y%m%d).db

# 恢复
cp ./backup_20250101.db ./appdata/data.db
docker compose restart
```

## 视觉风格

采用 SWJTU（西南交通大学）品牌配色：

- **主色**：深蓝 `#00447C`
- **强调色**：金色 `#C5A664`
- **背景**：淡蓝 `#E8EFF6`
