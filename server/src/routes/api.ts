import { Router, Request, Response } from 'express';
import { insertSubmission, getApprovedSubmissions } from '../db';
import { SubmitPayload } from '../types';

const router = Router();

// 用户提交三元组（username + 寄语 + 捏人配置）
router.post('/submit', (req: Request, res: Response) => {
  const { username, message, config, image } = req.body as SubmitPayload;

  if (!username || !message || !config) {
    res.status(400).json({ error: '缺少必填字段：username, message, config' });
    return;
  }

  if (typeof username !== 'string' || typeof message !== 'string') {
    res.status(400).json({ error: 'username 和 message 必须为字符串' });
    return;
  }

  try {
    const configStr = typeof config === 'string' ? config : JSON.stringify(config);
    const imageStr = typeof image === 'string' ? image : '';
    const submission = insertSubmission(username.trim(), message.trim(), configStr, imageStr);
    res.json({ success: true, data: submission });
  } catch (err) {
    console.error('提交失败:', err);
    res.status(500).json({ error: '提交失败' });
  }
});

// 获取所有已审核通过的三元组
router.get('/approved', (_req: Request, res: Response) => {
  try {
    const approved = getApprovedSubmissions();
    res.json({ success: true, data: approved });
  } catch (err) {
    console.error('查询失败:', err);
    res.status(500).json({ error: '查询失败' });
  }
});

export default router;
