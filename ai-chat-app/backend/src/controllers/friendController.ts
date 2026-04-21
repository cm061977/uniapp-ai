import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';

// Search users
export const searchUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { query } = req.query;

    if (!query) {
      res.status(400).json({ message: 'Search query is required' });
      return;
    }

    const users = await User.find({
      username: { $regex: query as string, $options: 'i' },
      _id: { $ne: req.user?.id },
    }).select('-password');

    res.json({ users });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add friend
export const addFriend = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { friendId } = req.body;

    if (!friendId) {
      res.status(400).json({ message: 'Friend ID is required' });
      return;
    }

    // Check if user exists
    const user = await User.findById(friendId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if already friends
    const currentUser = await User.findById(req.user?.id);
    if (!currentUser) {
      res.status(404).json({ message: 'Current user not found' });
      return;
    }

    if (currentUser.friends.includes(friendId)) {
      res.status(400).json({ message: 'Already friends' });
      return;
    }

    // Add friend to both users
    currentUser.friends.push(friendId);
    await currentUser.save();

    user.friends.push(currentUser._id);
    await user.save();

    res.json({ message: 'Friend added successfully' });
  } catch (error) {
    console.error('Add friend error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get friends
export const getFriends = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).populate('friends', '-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ friends: user.friends });
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove friend
export const removeFriend = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { friendId } = req.params;

    const currentUser = await User.findById(req.user?.id);
    if (!currentUser) {
      res.status(404).json({ message: 'Current user not found' });
      return;
    }

    const friend = await User.findById(friendId);
    if (!friend) {
      res.status(404).json({ message: 'Friend not found' });
      return;
    }

    currentUser.friends = currentUser.friends.filter(
      (id) => id.toString() !== friendId
    );
    await currentUser.save();

    friend.friends = friend.friends.filter(
      (id) => id.toString() !== req.user?.id
    );
    await friend.save();

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
