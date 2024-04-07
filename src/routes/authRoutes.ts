import express from 'express';
import { login, signup, refreshaccessToken, validate } from '../controllers/authController';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/refresh', refreshaccessToken);
router.post('/validate', validate)

export default router;