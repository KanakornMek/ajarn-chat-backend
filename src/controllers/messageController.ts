import express, { Request, Response, Router } from 'express';
import { prisma } from '../db/prismaClient';
import { UserRole, Status } from '@prisma/client';

const router: Router = express.Router();

// Sees all the messages associated with a given thread
async function getAllMessages(req: Request, res: Response) {
    try {
        const threadId = req.params.threadId as string;
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
        const messageId: string = req.params.message_id as string;
        const updateData = req.body;
        if (!updateData.message) {
            res.status(400).send("No contents in the request");
            return;
        }
        const message = await prisma.message.update({
            where: { id: messageId },
            data: {
                message: updateData.message,
                //Note: add LastUpdated (after modifying in Prisma Schema)
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
        const authorId = req.user?.id as string;
        const message = req.body.message;
        const threadId = req.params.threadId as string;
        const createdMessage = await prisma.message.create({
            data: {
                //Automatically generates a unique message id
                threadId,
                authorId,
                message,
            }
        });

        // Fetch message author details
        const messageAuthor = await prisma.user.findUnique({
            where: {
                id: authorId
            }
        });
        
        if (!messageAuthor) {
            res.status(401).send('Author not found');
            return;
        }

        // Check if message author is a Lecturer
        if (messageAuthor?.role === UserRole.Lecturer) {
            // Update thread status to answered
            await prisma.thread.update({
                where: {
                    id: threadId,
                },
                data: {
                    status: Status.answered,
                }
            });

            // Send success response with updated thread status
            res.status(200).send('Successfully posted message; Thread status has been changed to ' + Status.answered);
        } else {
            // Send success response without updating thread status
            res.status(200).send('Successfully posted message');
        }
    } catch (err: any) {
        // Send error response with detailed error message
        res.status(500).send('Error creating message: ' + err.message);
    }
}

// Deletes a single message from the database
// Assumes that the request passes an existing messageID
async function deleteMessage(req: Request, res: Response) { 
    try {
        const messageId: string = req.params.message_id;
        const message = await prisma.message.delete({
            where: {
                id: messageId
            }
        });
        if (!message) {
            res.status(404).send('Message not found');
        }
        res.status(200).json(message);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
}

export { getAllMessages, createMessage, getSingleMessage, updateMessage, deleteMessage};
