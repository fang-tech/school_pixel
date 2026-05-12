import express from 'express';
import session from 'express-session';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { initDB } from './db';
import { SESSION_SECRET } from './config';
import { requireAdmin } from './middleware/auth';
import apiRouter from './routes/api';
import adminRouter from './routes/admin';
import authRouter from './routes/authRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// 初始化数据库
initDB();

// API 路由（公开）
app.use('/api', apiRouter);

// 认证路由
app.use('/auth', authRouter);

// 公开接口：获取所有提交记录（无需登录）
app.get('/admin/api/submissions', (_req, res) => {
  const { getAllSubmissions } = require('./db');
  try {
    const submissions = getAllSubmissions();
    res.json({ success: true, data: submissions });
  } catch (err) {
    console.error('查询失败:', err);
    res.status(500).json({ error: '查询失败' });
  }
});

// 管理后台 API（需要登录）
app.use('/admin/api', requireAdmin, adminRouter);

// 静态资源：捏人页面
const frontDir = path.resolve(__dirname, '../../front');
app.use('/maker', express.static(frontDir));

// 静态资源：Unity WebGL 游戏
const gameDir = path.resolve(__dirname, '../../web-demo');
const BR_CONTENT_TYPES: Record<string, string> = {
  '.data.br': 'application/octet-stream',
  '.wasm.br': 'application/wasm',
  '.js.br': 'application/javascript',
};

const GAME_REVALIDATE_CACHE_CONTROL = 'public, max-age=0, must-revalidate';
const IMMUTABLE_CACHE_CONTROL = 'public, max-age=31536000, immutable';

// 计算 Build 目录的版本 hash（取 wasm.br 文件内容 md5 前 8 位）
function computeBuildVersion(): string {
  const wasmPath = path.join(gameDir, 'Build', 'web-demo.wasm.br');
  try {
    const buf = fs.readFileSync(wasmPath);
    return crypto.createHash('md5').update(buf).digest('hex').slice(0, 8);
  } catch {
    return 'dev';
  }
}

const BUILD_VERSION = computeBuildVersion();
console.log(`游戏 Build 版本: ${BUILD_VERSION}`);

// 设置 .br 文件的 Content-Type / Content-Encoding 中间件
function brMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const url = req.path;
  for (const [suffix, contentType] of Object.entries(BR_CONTENT_TYPES)) {
    if (url.endsWith(suffix)) {
      res.set('Content-Encoding', 'br');
      res.set('Content-Type', contentType);
      break;
    }
  }
  next();
}

// Addressables bundle 文件（文件名含 hash，immutable 长缓存）
app.use('/game/StreamingAssets/aa', (req, res, next) => {
  if (req.path.endsWith('.bundle')) {
    res.set('Content-Type', 'application/octet-stream');
    res.set('Cache-Control', IMMUTABLE_CACHE_CONTROL);
  } else {
    res.set('Cache-Control', GAME_REVALIDATE_CACHE_CONTROL);
  }
  next();
}, express.static(path.join(gameDir, 'StreamingAssets/aa'), { etag: true, lastModified: true }));

// FMOD .bank 文件
app.use('/game/StreamingAssets', (req, res, next) => {
  if (req.path.endsWith('.bank')) {
    res.set('Content-Type', 'application/octet-stream');
    res.set('Cache-Control', GAME_REVALIDATE_CACHE_CONTROL);
  }
  next();
}, express.static(path.join(gameDir, 'StreamingAssets'), { etag: true, lastModified: true }));

// 版本化 Build 路径：/game/v{hash}/Build/* → immutable 永久缓存
app.use(`/game/v${BUILD_VERSION}/Build`, brMiddleware, (req, res, next) => {
  res.set('Cache-Control', IMMUTABLE_CACHE_CONTROL);
  next();
}, express.static(path.join(gameDir, 'Build'), { etag: false, lastModified: false }));

// 兼容旧路径 /game/Build/*（短缓存，用于平滑过渡）
app.use('/game/Build', brMiddleware, (req, res, next) => {
  res.set('Cache-Control', GAME_REVALIDATE_CACHE_CONTROL);
  next();
}, express.static(path.join(gameDir, 'Build'), { etag: true, lastModified: true }));

// /game/index.html：动态注入版本号，本身不缓存
app.get('/game/index.html', (_req, res) => {
  const templatePath = path.join(gameDir, 'index.html');
  let html = fs.readFileSync(templatePath, 'utf8');
  // 替换 buildUrl 变量，将 "Build" 改为版本化路径
  html = html.replace(
    /var buildUrl\s*=\s*["']Build["']/,
    `var buildUrl = "/game/v${BUILD_VERSION}/Build"`
  );
  res.set('Cache-Control', GAME_REVALIDATE_CACHE_CONTROL);
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

// /game 其余静态资源（非 Build 文件）
app.use('/game', (req, res, next) => {
  res.set('Cache-Control', GAME_REVALIDATE_CACHE_CONTROL);
  next();
}, express.static(gameDir, { etag: true, lastModified: true }));

// 管理后台页面
const viewsDir = path.resolve(__dirname, '../views');
app.get('/admin/login', (_req, res) => {
  res.sendFile(path.join(viewsDir, 'login.html'));
});
app.get('/admin', (_req, res) => {
  if (_req.session && _req.session.isAdmin) {
    res.sendFile(path.join(viewsDir, 'admin.html'));
  } else {
    res.redirect('/admin/login');
  }
});

// 根路径跳转到捏人页面
app.get('/', (_req, res) => {
  res.redirect('/maker/data/index.html');
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器已启动: http://localhost:${PORT}`);
  console.log(`捏人页面: http://localhost:${PORT}/maker/data/index.html`);
  console.log(`管理后台: http://localhost:${PORT}/admin`);
});
