import express, { Request, Response, NextFunction } from 'express';
import { getThreads, createThread, getThread, updateThread } from '../controllers/threadController';
import messageRoutes from "../routes/messageRoutes";
const router = express.Router({mergeParams: true});


router.use('/:thread_id/messages', messageRoutes);
router.get('/', getThreads);
router.get('/:thread_id', getThread);
router.post('/', createThread);
router.put('/:thread_id', updateThread);

export default router;