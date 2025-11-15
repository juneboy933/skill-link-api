import express from 'express'
import { createReview, deleteReview, getAllReviews, getReview, updateReview } from '../controllers/review.js';
import { authenticateUser } from '../middleware/authenticateUser.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';

const router = express.Router();

// public
router.get('/', getAllReviews);
router.get('/:id', getReview);

// Protected: 
// Learners write reviews
router.post('/',authenticateUser, authorizeRoles('learner'), createReview);

// Protected: 
// learner updates own reviews 
// Admin moderates
router.patch('/:id',authenticateUser, authorizeRoles('learner', 'admin'), updateReview);

// Protected: 
// Admin moderates(delete)
router.delete('/:id',authenticateUser, authorizeRoles('admin'), deleteReview);

export default router;