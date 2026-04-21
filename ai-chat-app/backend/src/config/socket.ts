import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Message from './models/Message';
import Conversation from './models/Conversation';

interface SocketUser {
  id: string;
  username: string;
  email: string;
}

export const setupSocketIO = (io: Server): void => {
  // Middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as SocketUser;
      (socket as any).user = decoded;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const user = (socket as any).user;
    console.log(`User connected: ${user.username} (${user.id})`);

    // Join user's personal room
    socket.join(`user:${user.id}`);

    // Handle joining a conversation room
    socket.on('join-conversation', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`User ${user.username} joined conversation ${conversationId}`);
    });

    // Handle leaving a conversation room
    socket.on('leave-conversation', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(`User ${user.username} left conversation ${conversationId}`);
    });

    // Handle sending a message
    socket.on('send-message', async ({ conversationId, content, type = 'text' }) => {
      try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          socket.emit('error', { message: 'Conversation not found' });
          return;
        }

        const message = new Message({
          sender: user.id,
          content,
          type,
        });

        await message.save();

        conversation.messages.push(message._id);
        conversation.markModified('messages');
        await conversation.save();

        const populatedMessage = await Message.findById(message._id).populate('sender', '-password');

        // Emit to all participants in the conversation
        io.to(`conversation:${conversationId}`).emit('new-message', populatedMessage);

        // If it's an AI conversation, simulate AI response
        if (conversation.type === 'ai') {
          setTimeout(async () => {
            const aiResponse = new Message({
              sender: null, // AI doesn't have a user ID
              content: `This is an AI response to: "${content}". In production, integrate with OpenAI or other AI APIs.`,
              type: 'ai',
            });

            await aiResponse.save();
            conversation.messages.push(aiResponse._id);
            await conversation.save();

            const populatedAIResponse = await Message.findById(aiResponse._id);
            io.to(`conversation:${conversationId}`).emit('new-message', populatedAIResponse);
          }, 1000);
        }
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing', ({ conversationId, isTyping }) => {
      socket.to(`conversation:${conversationId}`).emit('user-typing', {
        userId: user.id,
        username: user.username,
        isTyping,
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${user.username}`);
    });
  });
};
