import Request from '../models/Request.js';

const generateRequestId = () => `REQ${Date.now()}${Math.floor(Math.random() * 1000)}`;

// @desc    Create new request (grievance or service)
// @route   POST /api/requests
// @access  Private (Citizen)
export const createRequest = async (req, res) => {
  const { department, serviceType, category, description, address, pincode, requiresPayment } = req.body;

  // Validation
  if (!department || !serviceType || !description) {
    return res.status(400).json({ 
      message: 'Department, service type, and description are required' 
    });
  }

  const requestData = {
    id: generateRequestId(),
    userId: req.user.id, // From JWT token
    department,
    serviceType,
    category,
    description,
    address,
    pincode,
    requiresPayment: requiresPayment || false,
  };

  const request = await Request.create({
    ...requestData,
    status: 'Submitted',
    paymentStatus: requestData.requiresPayment ? 'NOT_INITIATED' : null,
  });

  res.status(201).json(request);
};

// @desc    Get request by ID
// @route   GET /api/requests/:requestId
// @access  Private
export const getRequestById = async (req, res) => {
  const request = await Request.findOne({ id: req.params.requestId });

  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }

  // Citizens can only view their own requests
  if (req.user.role === 'citizen' && request.userId !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to view this request' });
  }

  res.json(request);
};

// @desc    Get requests by user ID
// @route   GET /api/requests/user/:userId
// @access  Private (Citizen - own requests only)
export const getRequestsByUserId = async (req, res) => {
  const { userId } = req.params;

  // Citizens can only view their own requests
  if (req.user.role === 'citizen' && userId !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const requests = await Request.find({ userId }).sort({ createdAt: -1 });
  res.json(requests);
};

// @desc    Get all requests (Admin only)
// @route   GET /api/admin/requests
// @access  Private (Admin)
export const getAllRequests = async (req, res) => {
  const requests = await Request.find({}).sort({ createdAt: -1 });
  res.json(requests);
};

// @desc    Update request status (Admin only)
// @route   PUT /api/admin/requests/:requestId/status
// @access  Private (Admin)
export const updateRequestStatus = async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  const validStatuses = ['Submitted', 'In Progress', 'Resolved', 'Rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
    });
  }

  const request = await Request.findOneAndUpdate(
    { id: req.params.requestId },
    { status },
    { new: true }
  );

  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }

  res.json(request);
};

// @desc    Update payment status
// @route   PUT /api/requests/:requestId/payment
// @access  Private (Citizen - own requests only)
export const updatePaymentStatus = async (req, res) => {
  const { paymentStatus } = req.body;
  const { requestId } = req.params;

  if (!paymentStatus) {
    return res.status(400).json({ message: 'Payment status is required' });
  }

  const validStatuses = ['NOT_INITIATED', 'PENDING', 'SUCCESS', 'FAILED'];
  if (!validStatuses.includes(paymentStatus)) {
    return res.status(400).json({ 
      message: `Invalid payment status. Must be one of: ${validStatuses.join(', ')}` 
    });
  }

  const request = await Request.findOne({ id: requestId });
  
  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }

  // Citizens can only update their own requests
  if (req.user.role === 'citizen' && request.userId !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const updateData = { paymentStatus };
  if (paymentStatus === 'SUCCESS' && request.status === 'Pending Payment') {
    updateData.status = 'Submitted';
  }

  const updatedRequest = await Request.findOneAndUpdate(
    { id: requestId },
    updateData,
    { new: true }
  );
  res.json({ request: updatedRequest });
};
