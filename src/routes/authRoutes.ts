import express from 'express';
import { login, signup, refreshaccessToken } from '../controllers/authController';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/refresh', refreshaccessToken)

export default router;