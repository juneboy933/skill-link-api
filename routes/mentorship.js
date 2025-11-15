import express from 'express';
import { createMentorship, deleteMentorshipRequest, getAllMentorship, getMentorship, updateMentorshipRequest } from '../controllers/mentorship.js';
import { authenticateUser } from '../middleware/authenticateUser.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';

const router = express.Router();

// public - anyone can browse the mentors and mentorship offers
router.get('/', getAllMentorship);
router.get('/:id', getMentorship);

// Protected: 
// learner request mentorship sessions
router.post('/', authenticateUser, authorizeRoles('learner'), createMentorship);

// mentors can accept or reject mentorship requests
// Learners can cancel/change their own requests 
router.patch('/:id', authenticateUser, authorizeRoles('learner', 'mentor', 'admin'), updateMentorshipRequest);

// Protected: admin moderate/remove sessions
router.delete('/:id', authenticateUser, authorizeRoles('admin'), deleteMentorshipRequest);

export default router;