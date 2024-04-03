import express, {NextFunction, Request, Response} from 'express';
import { getCourses, joinCourse, getCourseInfo, createCourse, updateCourseInfo, deleteCourse } from '../controllers/courseController';
import threadRoutes from './threadRoutes';
const router = express.Router();


router.use('/:course_id/threads', threadRoutes,);

router.get('/', getCourses);
router.post('/join', joinCourse);
router.get('/:course_id', getCourseInfo);
router.post('/', createCourse);
router.put('/:course_id', updateCourseInfo);
router.delete('/', deleteCourse);


export default router;