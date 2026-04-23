import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Zap, Copy, Check, FileText as DocumentIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function Summarizer() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState('');
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [maxSentences, setMaxSentences] = useState(3);
  const [activeTab, setActiveTab] = useState('text');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchDocuments();
    }
  }, [navigate]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/documents');
      const textDocuments = data.filter(doc => 
        doc.mimeType === 'text/plain' || 
        doc.originalName.endsWith('.txt')
      );
      setDocuments(textDocuments);
    } catch (error) {
      toast.error('Failed to fetch documents');
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSummarizeText = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text to summarize');
      return;
    }

    try {
      setSummarizing(true);
      const { data } = await api.post('/summarizer/text', {
        text: text.trim(),
        maxSentences
      });
      setSummary(data.summary);
      toast.success('Text summarized successfully');
    } catch (error) {
      toast.error('Failed to summarize text');
    } finally {
      setSummarizing(false);
    }
  };

  const handleSummarizeDocument = async () => {
    if (!selectedDocument) {
      toast.error('Please select a document to summarize');
      return;
    }

    try {
      setSummarizing(true);
      const { data } = await api.post(`/summarizer/document/${selectedDocument}`);
      setSummary(data.summary);
      toast.success('Document summarized successfully');
      
      // Update the document in the list to show it has a summary
      setDocuments(prev => prev.map(doc => 
        doc._id === selectedDocument 
          ? { ...doc, summary: data.summary }
          : doc
      ));
    } catch (error) {
      toast.error('Failed to summarize document');
    } finally {
      setSummarizing(false);
    }
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      toast.success('Summary copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy summary');
    }
  };

  const handleClearAll = () => {
    setText('');
    setSummary('');
    setSelectedDocument('');
    setCopied(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Text Summarizer</h1>
          <p className="mt-2 text-gray-600">Generate concise summaries from your text or documents</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('text')}
                    className={`py-3 px-6 border-b-2 font-medium text-sm ${
                      activeTab === 'text'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <FileText size={18} className="inline mr-2" />
                    Text Input
                  </button>
                  <button
                    onClick={() => setActiveTab('document')}
                    className={`py-3 px-6 border-b-2 font-medium text-sm ${
                      activeTab === 'document'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <DocumentIcon size={18} className="inline mr-2" />
                    Document
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'text' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter Text to Summarize
                      </label>
                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Paste or type your text here..."
                        className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Document
                      </label>
                      {loading ? (
                        <div className="flex items-center justify-center h-32">
                          <Loader2 className="animate-spin text-indigo-600" size={24} />
                        </div>
                      ) : documents.length > 0 ? (
                        <select
                          value={selectedDocument}
                          onChange={(e) => setSelectedDocument(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Choose a document...</option>
                          {documents.map(doc => (
                            <option key={doc._id} value={doc._id}>
                              {doc.title} ({doc.originalName})
                              {doc.summary && ' ✓'}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <DocumentIcon className="mx-auto mb-2" size={32} />
                          <p>No text documents available</p>
                          <p className="text-sm">Upload text files first to use document summarization</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Settings */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Summary Length
                      </label>
                      <select
                        value={maxSentences}
                        onChange={(e) => setMaxSentences(parseInt(e.target.value))}
                        className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value={2}>Very Short (2 sentences)</option>
                        <option value={3}>Short (3 sentences)</option>
                        <option value={5}>Medium (5 sentences)</option>
                        <option value={7}>Long (7 sentences)</option>
                      </select>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={handleClearAll}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Clear
                      </button>
                      <button
                        onClick={activeTab === 'text' ? handleSummarizeText : handleSummarizeDocument}
                        disabled={summarizing || (activeTab === 'text' ? !text.trim() : !selectedDocument)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center"
                      >
                        {summarizing ? (
                          <>
                            <Loader2 className="animate-spin mr-2" size={18} />
                            Summarizing...
                          </>
                        ) : (
                          <>
                            <Zap size={18} className="mr-2" />
                            Summarize
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Summary</h2>
                  {summary && (
                    <button
                      onClick={handleCopySummary}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      {copied ? (
                        <>
                          <Check size={16} className="mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={16} className="mr-1" />
                          Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
                
                {summary ? (
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed">{summary}</p>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Zap className="mx-auto mb-3" size={48} />
                    <p>Your summary will appear here</p>
                    <p className="text-sm mt-1">Enter text or select a document and click summarize</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Tips</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• For best results, use clear and well-structured text</li>
                <li>• Longer texts provide better context for summarization</li>
                <li>• Adjust summary length based on your needs</li>
                <li>• Document summarization works with text files (.txt)</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
