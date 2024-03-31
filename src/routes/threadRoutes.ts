import express from 'express';
import { getThreads, createThread } from '../controllers/threadController';
import messageRoutes from '../routes/messageRoutes';

const router = express.Router();

router.use('/:thread_id/messages', messageRoutes);
router.get('/', getThreads);
router.post('/', createThread);

export default router;