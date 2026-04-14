import express from 'express';
import { getReceipt } from '../controllers/receiptController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:requestId', protect, getReceipt);

export default router;
