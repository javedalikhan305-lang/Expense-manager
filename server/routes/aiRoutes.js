import express from 'express';
import { getInsights, scanReceipt } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.post('/insights', protect, getInsights);
router.post('/scan', protect, scanReceipt);

export default router;
