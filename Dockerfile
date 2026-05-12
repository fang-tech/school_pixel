# ---- 构建阶段 ----
FROM node:20-alpine AS builder

RUN sed -i 's|dl-cdn.alpinelinux.org|mirrors.ustc.edu.cn|g' /etc/apk/repositories
RUN apk add --no-cache python3 make g++

WORKDIR /app/server

COPY server/package.json server/package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --registry=https://registry.npmmirror.com \
        --disturl=https://npmmirror.com/mirrors/node

COPY server/tsconfig.json ./
COPY server/src ./src
RUN npm run build

# ---- 运行阶段 ----
FROM node:20-alpine

RUN sed -i 's|dl-cdn.alpinelinux.org|mirrors.ustc.edu.cn|g' /etc/apk/repositories
RUN apk add --no-cache python3 make g++

WORKDIR /app

# 仅安装生产依赖
COPY server/package.json server/package-lock.json* ./server/
RUN --mount=type=cache,target=/root/.npm \
    cd server && npm ci --omit=dev --registry=https://registry.npmmirror.com \
        --disturl=https://npmmirror.com/mirrors/node

# 清理编译工具（减小镜像体积）
RUN apk del python3 make g++

# 复制编译产物
COPY --from=builder /app/server/dist ./server/dist

# 复制后端视图模板
COPY server/views ./server/views

# 复制前端静态资源
COPY front ./front

# 复制 Unity WebGL 游戏包体
COPY web-demo ./web-demo

# 创建数据目录
RUN mkdir -p /data

ENV NODE_ENV=production
ENV DB_PATH=/data/data.db
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server/dist/index.js"]
