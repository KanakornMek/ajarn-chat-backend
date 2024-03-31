import express from 'express';
import { getAllMessages, createMessage, getSingleMessage,updateMessage,deleteMessage } from '../controllers/messageController';
const router = express.Router();

//Gets all the messages associated with the given thread
//Note: This assumes that the request passes a thread_id already 
router.get('/messages', getAllMessages); 

//Gets a single message 
//Note: This assumes that the request passes a message_id already 
router.get('/messeges/:message_id', getSingleMessage);

//Updates a single message 
//Note: This assumes that the request passes a message_id already 
router.put('/messages/:message_id/update', updateMessage);

//Creates a new message with a unique ID
router.post('/messages', createMessage);

//Deletes a single message
//Note: This assumes that the request passes a message_id already
router.delete('/messages/:message_id/delete', deleteMessage);

export default router;



