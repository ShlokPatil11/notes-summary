const Document = require('../models/Document');
const fs = require('fs').promises;
const pdfParse = require('pdf-parse');

const tokenizeSentences = (text) => {
  return text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).map(s => s.trim());
};

const tokenizeWords = (text) => {
  return text.toLowerCase().match(/\b[a-z]+\b/g) || [];
};

const summarizeText = (text, maxSentences = 3) => {
  if (!text || text.trim().length === 0) {
    return 'No content to summarize.';
  }

  const sentences = tokenizeSentences(text);
  
  if (sentences.length <= maxSentences) {
    return sentences.join('. ') + '.';
  }

  const words = tokenizeWords(text);
  const wordFreq = {};
  
  words.forEach(word => {
    if (word.length > 2) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });

  const sentenceScores = sentences.map(sentence => {
    const sentenceWords = tokenizeWords(sentence);
    let score = 0;
    
    sentenceWords.forEach(word => {
      if (wordFreq[word]) {
        score += wordFreq[word];
      }
    });
    
    return { sentence, score: sentenceWords.length > 0 ? score / sentenceWords.length : 0 };
  });

  sentenceScores.sort((a, b) => b.score - a.score);
  
  const topSentences = sentenceScores
    .slice(0, maxSentences)
    .map(item => item.sentence);

  topSentences.sort((a, b) => sentences.indexOf(a) - sentences.indexOf(b));
  
  return topSentences.join('. ') + '.';
};

const summarizeDocument = async (req, res) => {
  try {
    console.log('Summarization request received for document:', req.params.documentId);
    const { documentId } = req.params;
    
    const document = await Document.findById(documentId);
    console.log('Found document:', document);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (document.user.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    let content = '';
    
    if (document.mimeType === 'text/plain' || document.originalName.endsWith('.txt')) {
      if (document.content && document.content.startsWith('data:') || document.content.length > 100) {
        // Handle base64 content from production
        try {
          const base64Data = document.content.split(',')[1] || document.content;
          content = Buffer.from(base64Data, 'base64').toString('utf8');
        } catch (error) {
          return res.status(500).json({ message: 'Error decoding base64 content' });
        }
      } else {
        // Handle local file for development
        try {
          content = await fs.readFile(document.filePath, 'utf8');
        } catch (error) {
          return res.status(500).json({ message: 'Error reading file content' });
        }
      }
    } else if (document.mimeType === 'application/pdf' || document.originalName.endsWith('.pdf')) {
      // For now, return PDFs as not supported to get basic functionality working
      return res.status(400).json({ message: 'PDF summarization temporarily disabled - please use text files' });
    } else {
      return res.status(400).json({ message: 'Only text files and PDFs can be summarized' });
    }

    const summary = summarizeText(content);
    
    document.summary = summary;
    await document.save();

    res.json({ 
      summary,
      documentId: document._id,
      title: document.title
    });
  } catch (error) {
    res.status(500).json({ message: 'Error summarizing document', error: error.message });
  }
};

const summarizeTextDirect = async (req, res) => {
  try {
    const { text, maxSentences = 3 } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Text is required' });
    }

    const summary = summarizeText(text, parseInt(maxSentences));
    
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ message: 'Error summarizing text', error: error.message });
  }
};

module.exports = {
  summarizeDocument,
  summarizeTextDirect
};
