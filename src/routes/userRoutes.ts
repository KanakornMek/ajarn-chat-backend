import express from 'express';
import { login, signup, refreshaccessToken, validate } from '../controllers/authController';
import { getUserInfo } from '../controllers/userController';

const router = express.Router();

router.get('/', getUserInfo);

export default router;