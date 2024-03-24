import express from 'express';
import { getThreads, createThread } from '../controllers/threadController';

const router = express.Router();

router.get('/', getThreads);
router.post('/', createThread);

export default router;