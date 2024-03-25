import express from 'express';
import { getCourses, joinCourse } from '../controllers/courseController';
import threadRoutes from './threadRoutes';
const router = express.Router();

router.use('/threads',threadRoutes);
router.get('/', getCourses);
router.post('/join', joinCourse);

export default router;