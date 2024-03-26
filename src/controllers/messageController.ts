import express, { Request, Response, Router } from 'express';
import { prisma } from '../db/prismaClient';

const router: Router = express.Router();

// Sees all the messages associated with a given thread
async function getAllMessages(req: Request, res: Response) {
    try {
        const threadId: string = req.query.threadId as string;
        const limit: number = parseInt(req.query.limit as string, 10);
        const messages = await prisma.message.findMany({
            where: {
                threadId // threadId: threadId
            },
            take: limit
        });
        res.json(messages);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
}


// Gets a single message from the database
async function getSingleMessage(req: Request, res: Response) {
    try {
        const messageId: string = req.params.message_id;
        const message = await prisma.message.findUnique({
            where: {
                id: messageId
            }
        });
        if (message) {
            res.json(message);
        } else {
            res.status(404).send('Message not found');
        }
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
}

// Updates the message contents from FrontEnd
async function updateMessage(req: Request, res: Response) {
    try {
        const messageId: string = req.params.message_id;
        const updateData = req.body;
        if (!updateData.message) {
            res.status(400).send("No contents in the request");
            return;
        }
        const message = await prisma.message.update({
            where: { id: messageId },
            data: {
                message: updateData.message,
                lastUpdated: new Date(Date.now())
            }
        });
        res.status(200).json(message);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
}


// Creates a new message in the database with a reference to the given thread
async function createMessage(req: Request, res: Response) {
    try {
        const { threadId, authorId, message } = req.body;
        const createdMessage = await prisma.message.create({
            data: {
                threadId,
                authorId,
                message,
            }
        });

        //This code checks to see if the message is posted by an Ajarn
        //If it is, then the code modifies the status of the thread
        const messageAuthor = await prisma.user.findUnique({
            where: {
                authorId
            }
        })
        if (messageAuthor.UserRole == prisma.UserRole.Lecturer) {
            await prisma.thread.update(
                {
                    where: {
                        threadId,
                    },
                    data: {
                        status: prisma.Status.answered,
                    }
                }
            )
            res.status(200).send('Successfully posted message; Thread status has been changed to ' + prisma.Status.);
        } else {
            res.status(200).send('Successfully posted message');
        }
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
}


export { getAllMessages, createMessage, getSingleMessage, updateMessage};
