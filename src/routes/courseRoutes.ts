import express from 'express';
import { getCourses, joinCourse, getCourseInfo, createCourse, updateCourseInfo, deleteCourse } from '../controllers/courseController';
import threadRoutes from './threadRoutes';
const router = express.Router();

router.use('/threads',threadRoutes);
router.get('/:user_id', getCourses);
router.post('/join', joinCourse);
router.get('/:courseId', getCourseInfo);
router.post('/', createCourse);
router.put('/:courseId', updateCourseInfo);
router.delete('/', deleteCourse);

export default router;