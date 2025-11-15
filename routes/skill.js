import express from 'express';
import { createSkill, deleteSkill, getAllskills, getSkill, updateSkill } from '../controllers/skill.js';
import { authenticateUser } from '../middleware/authenticateUser.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
const router = express.Router();

// Public browsing
router.get('/', getAllskills);
router.get('/:id', getSkill);

// Protected: 
// Mentor creates skill listings
router.post('/',authenticateUser, authorizeRoles('mentor'), createSkill);
router.patch('/:id',authenticateUser, authorizeRoles('mentor'), updateSkill);

// Protected: 
// Only admin can delete
router.delete('/:id',authenticateUser, authorizeRoles('admin'), deleteSkill);

export default router;