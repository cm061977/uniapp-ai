import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Conversation from '../models/Conversation';
import Message from '../models/Message';

// Get or create AI conversation
export const getOrCreateAIConversation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let conversation = await Conversation.findOne({
      type: 'ai',
      participants: req.user?.id,
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [req.user?.id],
        type: 'ai',
        name: 'AI Assistant',
      });
      await conversation.save();
    }

    res.json({ conversation });
  } catch (error) {
    console.error('Get AI conversation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send message (AI or private)
export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { conversationId, content, type = 'text' } = req.body;

    if (!content) {
      res.status(400).json({ message: 'Content is required' });
      return;
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      res.status(404).json({ message: 'Conversation not found' });
      return;
    }

    // Check if user is participant
    if (!conversation.participants.some((p) => p.toString() === req.user?.id)) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    const message = new Message({
      sender: req.user?.id,
      content,
      type,
    });

    await message.save();

    conversation.messages.push(message._id);
    await conversation.save();

    const populatedMessage = await Message.findById(message._id).populate('sender', '-password');

    res.json({ message: populatedMessage });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get conversation messages
export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId)
      .populate({
        path: 'messages',
        populate: { path: 'sender', select: '-password' },
      });

    if (!conversation) {
      res.status(404).json({ message: 'Conversation not found' });
      return;
    }

    res.json({ messages: conversation.messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all conversations for user
export const getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const conversations = await Conversation.find({
      participants: req.user?.id,
    })
      .populate('participants', '-password')
      .populate({
        path: 'messages',
        options: { sort: { createdAt: -1 }, limit: 1 },
        populate: { path: 'sender', select: '-password' },
      })
      .sort({ updatedAt: -1 });

    res.json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
