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
        const userId = req.user?.id
        if (!userId) {
            return res.status(400).json({ error: 'User ID not provided' });
        }
        console.log(userId)
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

export { getCourses, joinCourse };
