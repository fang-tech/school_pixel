import { Router, Request, Response } from 'express';
import { getAllSubmissions, updateSubmissionStatus, deleteSubmission } from '../db';
import { ReviewAction } from '../types';

const router = Router();

// 获取所有提交记录（管理后台用）
router.get('/submissions', (_req: Request, res: Response) => {
  try {
    const submissions = getAllSubmissions();
    res.json({ success: true, data: submissions });
  } catch (err) {
    console.error('查询失败:', err);
    res.status(500).json({ error: '查询失败' });
  }
});

// 审核操作：批准或拒绝
router.post('/review/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  const { action } = req.body as { action: ReviewAction };

  if (isNaN(id)) {
    res.status(400).json({ error: '无效的 ID' });
    return;
  }

  if (action !== 'approved' && action !== 'rejected') {
    res.status(400).json({ error: 'action 必须为 approved 或 rejected' });
    return;
  }

  try {
    const updated = updateSubmissionStatus(id, action);
    if (!updated) {
      res.status(404).json({ error: '未找到该提交记录' });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    console.error('审核操作失败:', err);
    res.status(500).json({ error: '审核操作失败' });
  }
});

// 删除提交记录
router.delete('/submissions/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: '无效的 ID' });
    return;
  }

  try {
    const deleted = deleteSubmission(id);
    if (!deleted) {
      res.status(404).json({ error: '未找到该提交记录' });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    console.error('删除失败:', err);
    res.status(500).json({ error: '删除失败' });
  }
});

export default router;
