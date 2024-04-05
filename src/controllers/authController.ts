import { Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import { prisma } from '../db/prismaClient';
import { UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import parseUserRole from '../helpers/userRoleParser';

async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        const auth = await prisma.auth.findUnique({
            where: {
                email
            }, include: {
                user: true
            }
        });

        if (!auth) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        if (!bcrypt.compareSync(password, auth.password)) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const accessToken = jwt.sign({ userId: auth.user.id }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '30m' });
        const refreshToken = jwt.sign({ userId: auth.user.id }, process.env.REFRESH_TOKEN_SECRET as string);

        res.json({ accessToken, refreshToken });
    } catch(err) {
        res.status(500).send(err);
    }
    
}

async function refreshaccessToken(req: Request, res: Response) {
    try {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, (err: jwt.VerifyErrors | null, decoded: any) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid refresh token' });
            }

            const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '15m' });

            res.json({ accessToken });
        });
    } catch (err) {
        res.status(500).send(err);
    }
    
}

async function logout(req: Request, res: Response) {
    try {
        const userId = req.user?.id;
        
    } catch(err) {

    }
}

async function signup(req: Request, res: Response) {
    try {
        const { password, email, firstName, lastName, role, year } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                year,
                role: parseUserRole(role),
                auth: {
                    create: {
                        password: hashedPassword,
                        email
                    }
                }
            }
        });

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).send(err);
    }
    
}


export { login, refreshaccessToken, signup };
