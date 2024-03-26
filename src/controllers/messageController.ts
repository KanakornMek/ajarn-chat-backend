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
        res.json(message);
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
        res.json(createdMessage);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
}


export { getAllMessages, createMessage, getSingleMessage, updateMessage};
