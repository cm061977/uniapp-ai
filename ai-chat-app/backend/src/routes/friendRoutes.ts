import express from 'express';
import { auth } from '../middleware/auth';
import { searchUsers, addFriend, getFriends, removeFriend } from '../controllers/friendController';

const router = express.Router();

router.get('/search', auth, searchUsers);
router.post('/add', auth, addFriend);
router.get('/', auth, getFriends);
router.delete('/:friendId', auth, removeFriend);

export default router;
