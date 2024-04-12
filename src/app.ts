import express, { Request, Response } from 'express';
import cors from 'cors';
import authMiddleware from './middlewares/authMiddleware';
import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import userRoutes from './routes/userRoutes';


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);


app.use(authMiddleware);
// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
})
app.use('/user', userRoutes);
app.use('/courses', courseRoutes);

export default app;