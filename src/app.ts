import express, { Request, Response } from 'express';
import cors from 'cors';
import authMiddleware from './middlewares/authMiddleware';
import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import threadRoutes from './routes/threadRoutes';


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(authMiddleware);

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
})
app.use('/auth', authRoutes);
app.use('/courses', courseRoutes);
app.use('/threads', threadRoutes);

export default app;