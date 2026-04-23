const Document = require('../models/Document');
const fs = require('fs').promises;
const path = require('path');

const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching documents', error: error.message });
  }
};

const uploadDocument = async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('File:', req.file);
    console.log('Body:', req.body);
    console.log('User:', req.user);
    
    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title } = req.body;
    console.log('Creating document with title:', title);
    
    const document = new Document({
      title: title || req.file.originalname,
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      user: req.user.userId
    });

    console.log('Saving document to database...');
    await document.save();
    console.log('Document saved successfully:', document);
    
    res.status(201).json(document);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading document', error: error.message });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (document.user.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    try {
      await fs.unlink(document.filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }

    await document.deleteOne();
    res.json({ message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting document', error: error.message });
  }
};

const getDocumentContent = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (document.user.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (document.mimeType === 'text/plain' || document.originalName.endsWith('.txt')) {
      try {
        const content = await fs.readFile(document.filePath, 'utf8');
        res.json({ content });
      } catch (error) {
        res.status(500).json({ message: 'Error reading file content', error: error.message });
      }
    } else {
      res.status(400).json({ message: 'File type not supported for content extraction' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching document content', error: error.message });
  }
};

module.exports = {
  getDocuments,
  uploadDocument,
  deleteDocument,
  getDocumentContent
};
