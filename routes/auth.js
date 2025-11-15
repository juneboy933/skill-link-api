import express from 'express';
import { login, logout, register } from '../controllers/auth.js';
import { authenticateUser } from '../middleware/authenticateUser.js';
import { refreshToken } from '../controllers/refreshToken.js';

const router = express.Router();

// public route
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

// protected route
router.post('/logout',authenticateUser, logout);

export default router;