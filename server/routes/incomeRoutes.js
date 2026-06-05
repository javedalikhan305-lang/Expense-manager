import express from 'express';
import { getIncomes, createIncome, deleteIncome, updateIncome } from '../controllers/incomeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.route('/').get(protect, getIncomes).post(protect, createIncome);
router.route('/:id').delete(protect, deleteIncome).put(protect, updateIncome);

export default router;
