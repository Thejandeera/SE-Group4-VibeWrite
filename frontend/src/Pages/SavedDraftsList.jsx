import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Trash2, Edit3 } from 'lucide-react';

const backendUrl = import.meta.env.VITE_BACKEND_URL ;

const SavedDraftsList = () => {
  const [drafts, setDrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${backendUrl}/drafts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Fetch drafts response:', response);
      
      if (response.ok) {
        const draftsData = await response.json();
        setDrafts(draftsData);
      } else {
        setError('Failed to fetch drafts');
      }
    } catch (error) {
      console.error('Error fetching drafts:', error);
      setError('Error loading drafts');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDraft = async (draftId) => {
    try {
      const response = await fetch(`${backendUrl}/drafts/${draftId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setDrafts(drafts.filter(draft => draft.id !== draftId));
      } else {
        console.error('Failed to delete draft');
      }
    } catch (error) {
      console.error('Error deleting draft:', error);
    }
  };

  const loadDraftInEditor = (draft) => {
    // Navigate to content editor with the draft content
    window.location.href = `/content-editor?draft=${encodeURIComponent(JSON.stringify(draft))}`;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

  const getContentPreview = (content) => {
    const plainText = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="text-center py-12">
              <div className="text-red-500 text-lg mb-4">{error}</div>
              <button 
                onClick={fetchDrafts}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Saved Drafts</h1>
            <button 
              onClick={fetchDrafts}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Refresh
            </button>
          </div>

          {drafts.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No saved drafts yet</h3>
              <p className="text-gray-500 mb-4">Start writing in the Content Editor to save your first draft</p>
              <button 
                onClick={() => window.location.href = '/content-editor'}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Go to Content Editor
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {drafts.map((draft, index) => {
                const { date, time } = formatDate(draft.timestamp);
                return (
                  <div
                    key={draft.id || index}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar size={16} className="text-gray-500" />
                          <span className="text-sm text-gray-500">{date} at {time}</span>
                        </div>
                        <div className="text-gray-800 mb-3">
                          {getContentPreview(draft.content)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {draft.content.replace(/<[^>]*>/g, '').length} characters
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => loadDraftInEditor(draft)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit this draft"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => deleteDraft(draft.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Delete this draft"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedDraftsList;
