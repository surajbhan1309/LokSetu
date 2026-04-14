import Request from '../models/Request.js';

// @desc    Get receipt for a request
// @route   GET /api/receipt/:requestId
// @access  Private
export const getReceipt = async (req, res) => {
  const request = await Request.findOne({ id: req.params.requestId });

  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }

  // Citizens can only view their own receipts
  if (req.user.role === 'citizen' && request.userId !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  // Generate receipt data
  const receipt = {
    requestId: request.id,
    serviceType: request.serviceType,
    department: request.department,
    category: request.category,
    description: request.description,
    status: request.status,
    submittedAt: request.createdAt,
    lastUpdated: request.updatedAt,
    qrCode: `SUVIDHA-${request.id}`, // Simple QR token
  };

  res.json(receipt);
};
