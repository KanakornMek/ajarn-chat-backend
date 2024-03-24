import express from 'express';
import { getCourses, joinCourse } from '../controllers/courseController';

const router = express.Router();

router.get('/', getCourses);
router.post('/join', joinCourse);

export default router;