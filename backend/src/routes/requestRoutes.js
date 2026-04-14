import express from 'express';
import {
  createRequest,
  getRequestById,
  getRequestsByUserId,
  getAllRequests,
  updateRequestStatus,
  updatePaymentStatus,
} from '../controllers/requestController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Citizen routes
router.post('/', protect, createRequest);
router.get('/:requestId', protect, getRequestById);
router.get('/user/:userId', protect, getRequestsByUserId);
router.put('/:requestId/payment', protect, updatePaymentStatus);

// Admin routes
router.get('/admin/all', protect, admin, getAllRequests);
router.put('/admin/:requestId/status', protect, admin, updateRequestStatus);

export default router;
