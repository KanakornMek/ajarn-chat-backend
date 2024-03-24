import { Request, Response } from 'express';
import { prisma } from '../db/prismaClient';
async function getCourses(req: Request, res: Response) {
    try{
        const courses = await prisma.course.findMany();
        res.status(200).json(courses);
    } catch(err) {
        res.status(500).send(err);
    }
}

function joinCourse(req: Request, res: Response) {
    
}

export { getCourses, joinCourse };
