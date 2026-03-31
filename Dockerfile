# ---- 构建阶段 ----
FROM node:20-alpine AS builder

WORKDIR /app/server

COPY server/package.json server/package-lock.json* ./
RUN npm ci

COPY server/tsconfig.json ./
COPY server/src ./src
RUN npm run build

# ---- 运行阶段 ----
FROM node:20-alpine

WORKDIR /app

# 仅安装生产依赖
COPY server/package.json server/package-lock.json* ./server/
RUN cd server && npm ci --omit=dev

# 复制编译产物
COPY --from=builder /app/server/dist ./server/dist

# 复制后端视图模板
COPY server/views ./server/views

# 复制前端静态资源
COPY front ./front

# 创建数据目录
RUN mkdir -p /data

ENV NODE_ENV=production
ENV DB_PATH=/data/data.db
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server/dist/index.js"]
