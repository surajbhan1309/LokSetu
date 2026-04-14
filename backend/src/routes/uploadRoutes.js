import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import Document from '../models/Document.js';

const router = express.Router();

// @desc    Upload document
// @route   POST /api/uploads
// @access  Private
router.post('/', protect, upload.single('document'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const { requestId } = req.body;

  if (!requestId) {
    return res.status(400).json({ message: 'Request ID is required' });
  }

  const documentData = {
    id: `DOC${Date.now()}${Math.floor(Math.random() * 1000)}`,
    requestId,
    fileName: req.file.filename,
    filePath: req.file.path,
    fileType: req.file.mimetype,
    fileSize: req.file.size,
  };

  const document = await Document.create(documentData);

  res.status(201).json({
    message: 'File uploaded successfully',
    document,
  });
});

// @desc    Get document by ID
// @route   GET /api/uploads/:fileId
// @access  Private
router.get('/:fileId', protect, async (req, res) => {
  const document = await Document.findOne({ id: req.params.fileId });

  if (!document) {
    return res.status(404).json({ message: 'Document not found' });
  }

  res.json(document);
});

export default router;
