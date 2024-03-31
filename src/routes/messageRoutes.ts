import express from 'express';
import { getAllMessages, createMessage, getSingleMessage,updateMessage,deleteMessage } from '../controllers/messageController';
const router = express.Router();

//Gets all the messages associated with the given thread
//Note: This assumes that the request passes a thread_id already 
router.get('/', getAllMessages); 

//Gets a single message 
//Note: This assumes that the request passes a message_id already 
router.get('/:message_id', getSingleMessage);

//Updates a single message 
//Note: This assumes that the request passes a message_id already 
router.put('/:message_id/update', updateMessage);

//Creates a new message with a unique ID
router.post('/', createMessage);

//Deletes a single message
//Note: This assumes that the request passes a message_id already
router.delete('/:message_id/delete', deleteMessage);

export default router;



