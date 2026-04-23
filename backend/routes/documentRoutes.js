const express = require('express');
const multer = require('multer');
const path = require('path');
const { getDocuments, uploadDocument, deleteDocument, getDocumentContent } = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  console.log('File details:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    extension: path.extname(file.originalname).toLowerCase()
  });
  // Temporarily allow all files
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

router.route('/')
  .get(protect, getDocuments)
  .post(protect, upload.single('document'), uploadDocument);

router.route('/:id')
  .delete(protect, deleteDocument);

router.route('/:id/content')
  .get(protect, getDocumentContent);

module.exports = router;
