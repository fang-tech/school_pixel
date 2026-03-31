# SWJTU 像素形象工坊 - API 文档

## 公开接口

---

### 获取所有提交记录

```
GET /admin/api/submissions
```

**鉴权**：无

**响应**：

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "张三",
      "message": "这是我的像素形象！",
      "config": "{\"select\":[...],\"paletteSetting\":[...]}",
      "image": "data:image/png;base64,iVBORw0KGgo...",
      "status": "pending",
      "created_at": "2026-03-18 12:00:00"
    }
  ]
}
```

**字段说明**：

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `number` | 提交记录唯一 ID |
| `username` | `string` | 用户名 |
| `message` | `string` | 用户寄语 |
| `config` | `string` | 捏人配置 JSON 字符串，包含 `select`（部件选择）和 `paletteSetting`（调色板设置） |
| `image` | `string` | 角色截图，base64 编码的 data URL（`data:image/png;base64,...`），可能为空字符串 |
| `status` | `string` | 审核状态：`"pending"` / `"approved"` / `"rejected"` |
| `created_at` | `string` | 提交时间，格式 `YYYY-MM-DD HH:mm:ss` |

**错误响应**（500）：

```json
{
  "error": "查询失败"
}
```

---

### 获取已审核通过的提交

```
GET /api/approved
```

**鉴权**：无

**响应**：与 `/admin/api/submissions` 相同结构，但仅返回 `status === "approved"` 的记录。

---

### 提交作品

```
POST /api/submit
```

**鉴权**：无

**Content-Type**：`application/json`

**请求体**：

```json
{
  "username": "张三",
  "message": "这是我的像素形象！",
  "config": { "select": [...], "paletteSetting": [...] },
  "image": "data:image/png;base64,iVBORw0KGgo..."
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `username` | `string` | ✅ | 用户名，最长 50 字符 |
| `message` | `string` | ✅ | 寄语，最长 200 字符 |
| `config` | `object` | ✅ | 捏人配置对象 |
| `image` | `string` | ❌ | 角色截图 base64 data URL |

**成功响应**（200）：

```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "张三",
    "message": "这是我的像素形象！",
    "config": "{...}",
    "image": "data:image/png;base64,...",
    "status": "pending",
    "created_at": "2026-03-18 12:00:00"
  }
}
```

**错误响应**（400）：

```json
{ "error": "缺少必填字段：username, message, config" }
```

```json
{ "error": "username 和 message 必须为字符串" }
```

---

## 认证接口

---

### 管理员登录

```
POST /auth/login
```

**请求体**：

```json
{
  "username": "admin",
  "password": "your_password"
}
```

**成功**：`{ "success": true }`
**失败**（401）：`{ "error": "用户名或密码错误" }`

---

### 退出登录

```
POST /auth/logout
```

**响应**：`{ "success": true }`

---

### 检查登录状态

```
GET /auth/check
```

**响应**：`{ "loggedIn": true }` 或 `{ "loggedIn": false }`

---

## 管理接口（需登录）

以下接口需要先通过 `/auth/login` 登录，请求时携带 session cookie。

---

### 审核提交

```
POST /admin/api/review/:id
```

**请求体**：

```json
{ "action": "approved" }
```

| 字段 | 类型 | 可选值 |
|------|------|--------|
| `action` | `string` | `"approved"` / `"rejected"` |

**成功**：`{ "success": true }`
**失败**（404）：`{ "error": "未找到该提交记录" }`

---

### 删除提交

```
DELETE /admin/api/submissions/:id
```

**成功**：`{ "success": true }`
**失败**（404）：`{ "error": "未找到该提交记录" }`
**未登录**（401）：`{ "error": "未登录" }`
