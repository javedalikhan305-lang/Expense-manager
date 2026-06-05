import express from 'express';
import { registerUser, loginUser, getUsers, makeAdmin } from '../controllers/authController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', protect, admin, getUsers);
router.put('/users/:id/make-admin', protect, admin, makeAdmin);

export default router;
