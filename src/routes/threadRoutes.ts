import express, { Request, Response, NextFunction } from 'express';
import { getThreads, createThread, getThread, updateThread } from '../controllers/threadController';

const router = express.Router({mergeParams: true});


router.get('/', getThreads);
router.get('/:thread_id', getThread);
router.post('/', createThread);
router.put('/:thread_id', updateThread);

export default router;