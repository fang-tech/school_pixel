import { Router, Request, Response } from 'express';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../config';

const router = Router();

router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body as { username: string; password: string };

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    res.json({ success: true });
  } else {
    res.status(401).json({ error: '用户名或密码错误' });
  }
});

router.post('/logout', (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

router.get('/check', (req: Request, res: Response) => {
  res.json({ loggedIn: !!(req.session && req.session.isAdmin) });
});

export default router;
