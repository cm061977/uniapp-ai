import express from 'express';
import { auth } from '../middleware/auth';
import {
  getOrCreateAIConversation,
  sendMessage,
  getMessages,
  getConversations,
} from '../controllers/messageController';

const router = express.Router();

router.get('/conversations', auth, getConversations);
router.get('/ai', auth, getOrCreateAIConversation);
router.post('/send', auth, sendMessage);
router.get('/:conversationId/messages', auth, getMessages);

export default router;
