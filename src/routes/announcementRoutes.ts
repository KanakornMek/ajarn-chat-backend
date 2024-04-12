import express, { Request, Response, NextFunction } from 'express';
import { getAnnouncements, createAnnouncement, getAnnouncement , updateAnnouncement } from '../controllers/announcementController';
import messageRoutes from "../routes/messageRoutes";
const router = express.Router({mergeParams: true});

router.use('/:announcement_id/messages', messageRoutes);
router.get('/', getAnnouncements);
router.get('/:announcement_id', getAnnouncement);
router.post('/', createAnnouncement);
router.put('/:announcement_id', updateAnnouncement);

export default router;