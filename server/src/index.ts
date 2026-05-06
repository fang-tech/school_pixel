import express from 'express';
import session from 'express-session';
import path from 'path';
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

app.use('/game', (req, res, next) => {
  const url = req.path;
  for (const [suffix, contentType] of Object.entries(BR_CONTENT_TYPES)) {
    if (url.endsWith(suffix)) {
      res.set('Content-Encoding', 'br');
      res.set('Content-Type', contentType);
      break;
    }
  }

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
