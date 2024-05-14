import express from 'express';
import { getUser, getUserFriends, addRemoveFriend } from '../controllers/users.js';
import { verifyToken } from '../middleware/auth.js';

// Initialize the Express router
const router = express.Router();

/* ---------------------------- Route Definitions --------------------------- */

// Route to get user details: Requires token verification
router.get('/:id', verifyToken, getUser);

// Route to get a user's friends list: Also requires token verification
router.get('/:id/friends', verifyToken, getUserFriends);

// Route to add or remove a friend: Requires token verification
router.patch('/:id/:friendId', verifyToken, addRemoveFriend);

// Export the configured router
export default router;
