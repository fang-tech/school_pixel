import { Request, Response, NextFunction } from 'express';

declare module 'express-session' {
  interface SessionData {
    isAdmin: boolean;
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.session && req.session.isAdmin) {
    next();
  } else {
    res.status(401).json({ error: '未登录' });
  }
}
