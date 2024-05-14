import express from 'express';
import { login } from '../controllers/auth.js';

// Create a router object from express
const router = express.Router();

// Define the login route
router.post('/login', login);

export default router;
