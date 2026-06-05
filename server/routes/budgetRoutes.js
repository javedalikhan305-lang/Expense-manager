import express from 'express';
import { getBudgets, setBudget, updateBudget, deleteBudget } from '../controllers/budgetController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.route('/').get(protect, getBudgets).post(protect, setBudget);
router.route('/:id').put(protect, updateBudget).delete(protect, deleteBudget);

export default router;
