import express from 'express';
import { deleteUser, getUserById, getUsers } from '../controllers/user.js';
import { authenticateUser } from '../middleware/authenticateUser.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';

const router = express.Router();

router.get('/', authenticateUser, authorizeRoles('admin'), getUsers);
router.get('/:id', authenticateUser, authorizeRoles('admin'), getUserById);
router.delete('/:id', authenticateUser, authorizeRoles('admin'), deleteUser);

export default router;