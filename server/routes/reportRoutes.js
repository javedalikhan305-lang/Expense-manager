import express from 'express';
import { getReportData } from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/reports?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
router.get('/', protect, getReportData);

export default router;
