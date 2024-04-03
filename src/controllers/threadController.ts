import { Request, Response } from 'express';
import { prisma } from '../db/prismaClient';
import { Status, UrgencyTag } from '@prisma/client';


function parseStatus(status: string): Status | undefined {
    switch (status.toLowerCase()) {
        case 'pending':
            return Status.pending;
        case 'answers':
            return Status.answered;
        case 'archieved':
            return Status.archived;
        default:
            return undefined;
    }
}

function parseUrgency(ungency: string): UrgencyTag | undefined {
    switch (ungency.toLowerCase()) {
        case 'urgent':
            return UrgencyTag.urgent;
        case 'regular':
            return UrgencyTag.regular;
        case'lowpriority':
            return UrgencyTag.lowPriority;
        default:
            return undefined;
    }
}

function parseUrgencyInit(ungency: string): UrgencyTag{
    switch (ungency.toLowerCase()) {
        case 'urgent':
            return UrgencyTag.urgent;
        case 'regular':
            return UrgencyTag.regular;
        default:
            return UrgencyTag.lowPriority;
    }
}
async function getThreads(req: Request, res: Response) {
    let courseId = req.params.course_id;
    let status: Status | undefined;
    try {
        if (req.query.status) {
            const statusString = req.query.status as string;
            status = parseStatus(statusString);

            // Convert string to enum value
            if (statusString in Status) {
                status = Status[statusString as keyof typeof Status];
            } else {
                // Handle invalid status string
                return res.status(400).json({ error: 'Invalid status value' });
            }
            const threads = await prisma.thread.findMany({
                where: {
                    courseId: courseId, //Filter by course id
                    status: status //Filter by status
                }
            })

            res.status(200).json(threads);
        }
    } catch (error) {
        console.error('Error fetching threads:', error);
        throw error;
    }

}

// get thread by thread id
async function getThread(req: Request, res: Response) {
    let threadId = req.params.thread_id
    try{
        const thread = await prisma.thread.findUnique({
            where:{
                id: threadId, //check thread id
            },
        });
        res.status(200).json(thread);
    }catch (error) {
        console.error('Error fetching thread:', error);
        throw error;
    }
}

async function createThread(req: Request, res: Response) {
    let {course_id, urgencyTagString, topic, content, parentThread} = req.body;
    let authorId = req.user?.id
    if (!parentThread){
        parentThread = null;
    }
    let urgencyTag: UrgencyTag;
    urgencyTag = parseUrgencyInit(urgencyTagString);
    try{
        const new_thread = await prisma.thread.create({
            data: {
                status: 'pending',
                urgencyTag,
                topic,
                content,
                course: {
                    connect: {id: course_id}
                },
                user: {
                    connect: {id: authorId}
                },
                parentThread: {
                    connect: {id: parentThread}
                }
            }
        });
    }catch (error) {
    }
}

async function updateThread(req: Request, res: Response) {
    let thread_id = req.params.thread_id;
    let statusString = req.query.status as string;
    let urgencyString = req.query.urgency as string;
    let status: Status | undefined;
    let urgency: UrgencyTag | undefined;
    status = parseStatus(statusString);
    urgency = parseUrgency(urgencyString);
    try{
        const update_thread = await prisma.thread.update({
            where: {
                id: thread_id,
            },
            data: {
                status: status,
                urgencyTag: urgency,
            }
        });
        res.status(200).json(update_thread)
    }catch(error){
        console.error('Error updating post:', error);
        res.json({error: 'Error updating post'});
    }
}


export { getThreads, createThread, getThread, updateThread };