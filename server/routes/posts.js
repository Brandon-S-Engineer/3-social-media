import express from 'express';
import { getFeedPosts, getUserPosts, likePost } from '../controllers/posts.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

//? READ Operations
// Route to get all posts for the user's feed, requires token verification
router.get('/', verifyToken, getFeedPosts);

// Route to get all posts by a specific user, requires token verification
router.get('/:userId/posts', verifyToken, getUserPosts);

//? UPDATE Operations
// Route to like a post, requires token verification
router.patch('/:id/like', verifyToken, likePost);

export default router;
