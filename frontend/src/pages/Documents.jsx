import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FileText, Trash2, Upload, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentTitle, setDocumentTitle] = useState('');
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
      setDocuments(data);
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

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('document', selectedFile);
    if (documentTitle) {
      formData.append('title', documentTitle);
    }

    try {
      setUploading(true);
      await api.post('/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Document uploaded successfully');
      setShowUploadModal(false);
      setSelectedFile(null);
      setDocumentTitle('');
      fetchDocuments();
    } catch (error) {
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await api.delete(`/documents/${id}`);
        toast.success('Document deleted');
        fetchDocuments();
      } catch (error) {
        toast.error('Failed to delete document');
      }
    }
  };

  const handleViewDocument = async (doc) => {
    try {
      // For now, just show a toast since we don't have a document viewer
      toast.success(`Document "${doc.title}" selected for viewing`);
      // TODO: Implement document viewer or download functionality
    } catch (error) {
      toast.error('Failed to view document');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(search.toLowerCase()) || 
    doc.originalName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
          
          <div className="flex w-full sm:w-auto space-x-4">
            <div className="relative flex-grow sm:flex-grow-0">
              <input
                type="text"
                placeholder="Search documents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center shadow-sm"
            >
              <Upload size={18} className="mr-2" /> Upload Document
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map(doc => (
              <div key={doc._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <FileText className="text-indigo-600 mr-3" size={24} />
                    <div>
                      <h3 className="font-medium text-gray-900 truncate">{doc.title}</h3>
                      <p className="text-sm text-gray-500 truncate">{doc.originalName}</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-4">
                  <p>Size: {formatFileSize(doc.fileSize)}</p>
                  <p>Uploaded: {new Date(doc.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleViewDocument(doc)}
                    className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                    title="View document"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteDocument(doc._id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete document"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No documents found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {search ? 'Try adjusting your search' : 'Get started by uploading a new document.'}
            </p>
          </div>
        )}
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Upload Document</h2>
            <form onSubmit={handleFileUpload}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Title (optional)
                </label>
                <input
                  type="text"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter document title"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select File
                </label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  accept=".txt,.pdf,.doc,.docx"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: TXT, PDF, DOC, DOCX (Max 10MB)
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFile(null);
                    setDocumentTitle('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
