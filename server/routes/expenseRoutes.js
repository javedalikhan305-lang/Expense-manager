import express from 'express';
import { getExpenses, createExpense, deleteExpense, updateExpense } from '../controllers/expenseController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.route('/').get(protect, getExpenses).post(protect, createExpense);
router.route('/:id').delete(protect, deleteExpense).put(protect, updateExpense);

export default router;
