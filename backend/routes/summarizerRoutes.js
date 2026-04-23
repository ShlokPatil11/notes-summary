const express = require('express');
const { summarizeDocument, summarizeTextDirect } = require('../controllers/summarizerController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/text', protect, summarizeTextDirect);
router.post('/document/:documentId', protect, summarizeDocument);

module.exports = router;
