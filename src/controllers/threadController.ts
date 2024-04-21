import { Request, Response } from 'express';
import { prisma } from '../db/prismaClient';
import { Status, UrgencyTag } from '@prisma/client';
import parseStatus from '../helpers/parseStatus';
import parseUrgency from '../helpers/parseUrgency';
import parseUrgencyInit from '../helpers/parseUrgencyInit';
import { Storage } from '@google-cloud/storage';
import { nanoid } from 'nanoid';

const storage = new Storage({
    projectId: 'thinc-thonc',
    keyFilename: './thinc-thonc.json' // Path to your service account JSON file
  });
const bucketName = 'thincthoncbucket';


async function getThreads(req: Request, res: Response) {
    let courseId = req.params.course_id;
    let status: Status | undefined;
    let urgencyTag: UrgencyTag | undefined;
    try {
        if (req.query.status) {
            const statusString = req.query.status as string;
            status = parseStatus(statusString);

            console.log(status);
            if (statusString in Status) {
                status = Status[statusString as keyof typeof Status];
            } else {
                // Handle invalid status string
                return res.status(400).json({ error: 'Invalid status value' });
            }
        }
        if (req.query.urgency) {
            const urgencyString = req.query.urgency as string;
            urgencyTag = parseUrgency(urgencyString);
            console.log(urgencyTag);
            if (urgencyString in UrgencyTag) {
                urgencyTag = UrgencyTag[urgencyString as keyof typeof UrgencyTag];
            } else {
                // Handle invalid urgency string
                return res.status(400).json({ error: 'Invalid urgency value' });
            }
        }
        const threads = await prisma.thread.findMany({
            where: {
                courseId: courseId, //Filter by course id
                status: status, //Filter by status
                urgencyTag: urgencyTag //Filter by urgency
            },
            include: {
                user: true,
                parentThread: true
            }
        })
        console.log(threads);
        res.status(200).json(threads);
        
    } catch (error) {
        console.error('Error fetching threads:', error);
        res.status(500).send(error);
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
            include: {
                user: true
            }
        });
        res.status(200).json(thread);
    }catch (error) {
        console.error('Error fetching thread:', error);
        throw error;
    }
}

async function createThread(req: Request, res: Response) {
    const bucketName = 'your-bucket-name';
    let attachment = null;
    if (req.file){
        const fileName = nanoid()
        const blob = storage.bucket('thincthoncbucket').file(fileName);
        const blobStream = blob.createWriteStream({
            resumable: false,
            gzip: true
        });
        blobStream.on('error', (err) => {
            res.status(500).send('Error uploading file: ' + err);
          });
        
          blobStream.on('finish', () => {
            res.status(200).send('File uploaded successfully.');
          });
        
        blobStream.end(req.file.buffer);
        attachment = 'https://storage.googleapis.com/${bucketName}/${fileName}';
    }
    let { urgencyTagString, topic, content, parentThread } = req.body;
    const { course_id } = req.params;
    console.log(course_id)
    let authorId = req.user?.id
    if (!parentThread){
        parentThread = null;
    }
    let urgencyTag: UrgencyTag | undefined;
    urgencyTag = parseUrgencyInit(urgencyTagString);
    try{
        const new_thread = await prisma.thread.create({
            data: {
                status: 'pending',
                urgencyTag,
                topic,
                content,
                attachment,
                course: {
                    connect: {id: course_id}
                },
                user: {
                    connect: {id: authorId}
                },
                ...(parentThread && {
                    parentThread: {
                        connect: { id: parentThread }
                    }
                })
            }
        });
        res.status(201).json(new_thread);
    }catch (error) {
        console.error('Error creating thread:', error);
        res.status(500).send(error)
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