import { Request, Response } from 'express';
import { prisma } from '../db/prismaClient';
import { Status, UrgencyTag, UserRole } from '@prisma/client';
import parseStatus from '../helpers/parseStatus';
import parseUrgency from '../helpers/parseUrgency';
import parseUrgencyInit from '../helpers/parseUrgencyInit';

async function getAnnouncements(req: Request, res: Response) {
    let courseId = req.params.course_id;
    try {
        const announcements = await prisma.thread.findMany({
            where: {
                courseId: courseId, //Filter by course id
            },
            include: {
                user: true
            }
        })
        console.log(announcements);
        res.status(200).json(announcements);
        
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).send(error);
    }
}

// get thread by thread id
async function getAnnouncement(req: Request, res: Response) {
    let announcementId = req.params.announcement_id;
    try{
        const thread = await prisma.thread.findUnique({
            where:{
                id: announcementId, //check thread id
            },
            include: {
                user: true
            }
        });
        res.status(200).json(thread);
    }catch (error) {
        console.error('Error fetching announcement:', error);
        throw error;
    }
}

async function createAnnouncement(req: Request, res: Response) {
    const { course_id } = req.params;
    const { topic, content } = req.body;
    const authorId = req.user?.id;
    try {
        const author = await prisma.user.findUnique({ where: { id: authorId } });
        if (!author) {
            res.status(404).send('No author found');
        } else {
            if (author.role===UserRole.Student) {
                res.status(404).send('Not a lecturer or TA');
            }
        }
        const create_announcement = await prisma.thread.create({
            data: {
                status: Status.announcement,
                urgencyTag : UrgencyTag.announcement,
                topic,
                content,
                course: {
                    connect: { id: course_id }
                },
                user: {
                    connect: { id: authorId }
                },
            }
        });
        res.status(201).json(create_announcement);
    } catch (error) {
        console.error('Error creating announcement:', error);
        res.status(500).send(error)
    }
}

async function updateAnnouncement(req: Request, res: Response) {
    const announcementId = req.params.announcement_id;
    const { topic, content } = req.body;
    const authorId = req.user?.id;
    try {
        const author = await prisma.user.findUnique({ where: { id: authorId } });
        if (!author) {
            res.status(404).send('No author found');
        } else {
            if (author.role === UserRole.Student) {
                res.status(404).send('Not a lecturer or TA');
            }
        }
        const updatedAnnouncement = await prisma.thread.update({
            where: {
                id: announcementId,
            },
            data: {
                topic,
                content,
            }
        });
        res.status(200).json(updatedAnnouncement)
    }catch(error){
        console.error('Error updating post:', error);
        res.json({error: 'Error updating post'});
    }
}



export { getAnnouncements, createAnnouncement, getAnnouncement, updateAnnouncement };