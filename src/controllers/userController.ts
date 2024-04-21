import { Request, Response } from 'express';
import { prisma } from '../db/prismaClient';

async function getUserInfo(req: Request, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(400).json({ error: 'User ID not provided' });
        }
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                firstName: true,
                lastName: true,
                email: true,
                role: true
            }
        })
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch(err) {
        res.status(500).send(err);
    }
}

export { getUserInfo };