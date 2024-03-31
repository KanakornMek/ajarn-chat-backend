import { Request, Response } from 'express';
import { prisma } from '../db/prismaClient';
import parseUserRole from '../helpers/userRoleParser';
/*{
    "student_id": "6638xxxxxx",
    "first_name": "John",
    "last_name": "Doe",
    "email": "johndoe@example.com",
    "password": "Password@123"
  }
*/
async function createUser(req: Request, res: Response) {
    try {
    const {id, firstName, lastName, email, password, string: role} = req.body;
    if (!id || !firstName || !lastName || !email || !password || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    if (typeof id !== "string" || typeof firstName !== "string" || typeof lastName !== "string" || typeof email !== "string" || typeof password !== "string" || typeof role !== "string") {
        return res.status(422).json({error: 'Invalid data types'})
    }

    const userRole = parseUserRole(role);
    const user = prisma.User.create({
        data:{
            id,
            firstName,
            lastName,
            email,
            password,
            userRole
        }
    })
    }

    catch(err) {
        res.status(500).send(err);
    }
}

async function getUserInfo(req: Request, res: Response) {
    try{
        const userId = req.user?.id
        if (!userId) {
            return res.status(400).json({ error: 'User ID not provided' });
        }
        if (typeof userId !== "string"){
            return res.status(422).json({ error: 'Invalid data types' });
        }
        const users = await prisma.users.findUnique({
            where: {
                id: userId,
            }
        })
        res.status(200).json(userId);
    } catch(err){
        res.status(500).send(err);
    }

}


export { getUserInfo, createUser };

