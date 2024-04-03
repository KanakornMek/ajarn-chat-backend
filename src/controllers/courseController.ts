import { Request, Response } from 'express';
import { prisma } from '../db/prismaClient';
async function getCourses(req: Request, res: Response) {
    try{
        const userId = req.user?.id
        if (!userId) {
            return res.status(400).json({ error: 'User ID not provided' });
        }
        const courses = await prisma.userCourse.findMany({
            where: {
                userId,

            },
            include: {
                course: true
            }
        })
        res.status(200).json(courses);
    } catch(err) {
        res.status(500).send(err);
    }
}

async function joinCourse(req: Request, res: Response) {
    try{
        const { courseId } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({ error: 'User ID not provided' });
        }

        const userCourse = await prisma.userCourse.create({
            data: {
                courseId,
                userId
            }
        })
        res.status(200).json(userCourse);
    } catch(err) {
        res.status(500).send(err);
    }
}

async function getCourseInfo(req: Request, res: Response) {
    try {
        const { course_id } = req.params;
        const course = await prisma.course.findUnique({
            where: {
                id: course_id
            },
        })
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json(course);
    }

    catch(err) {
        res.status(500).send(err);
    }
}

async function createCourse(req: Request, res: Response) {
    try {
        const {name, semester, year, uniCourseId} = req.body;
        if (!name || !semester || !year || !uniCourseId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        if (typeof name !== 'string' ||
            typeof semester !== 'string' ||
            typeof year !== 'number' ||
            typeof uniCourseId !== 'string') {
            return res.status(400).json({ error: 'Invalid data types' });
        }

        if (year <= 0 || !Number.isInteger(year)) {
            return res.status(422).json({ error: 'Year must be a positive integer' });
        }

        const course = await prisma.course.create({
            data: {
                name,
                semester,
                year,
                uniCourseId
            }
        })
        res.status(201).json(course);
    }

    catch(err) {
        res.status(500).send(err);
    }
}

async function updateCourseInfo(req: Request, res: Response) {
    try {
        const {course_id} = req.params;
        const {name, semester, year, uniCourseId} = req.body;
        if (!course_id ||!name ||!semester ||!year ||!uniCourseId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        if (typeof name !== 'string' ||
            typeof semester !== 'string' ||
            typeof year !== 'number' ||
            typeof uniCourseId !== 'string') {
            return res.status(400).json({ error: 'Invalid data types' });
        }
        if (year <= 0 || !Number.isInteger(year)) {
            return res.status(422).json({ error: 'Year must be a positive integer' });
        }
        const course = await prisma.course.update({
            where: {
                id: course_id
            },
            data: {
                name,
                semester,
                year,
                uniCourseId
            }
        })
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json(course);
    }

    catch(err) {
        res.status(500).send(err);
    }
}

async function deleteCourse(req: Request, res: Response) {
    try {
        const {course_id} = req.params;
        const course = await prisma.course.delete({
            where: {
                id: course_id
            }
        })
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json(course);
    }

    catch(err) {
        res.status(500).send(err);
    }
}


export { getCourses, joinCourse, getCourseInfo, createCourse, updateCourseInfo, deleteCourse};
