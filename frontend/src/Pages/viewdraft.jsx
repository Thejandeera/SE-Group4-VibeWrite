import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Trash2, Edit3, Clock, User, X } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ViewDraft = () => {
  const [drafts, setDrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDraft, setSelectedDraft] = useState(null);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    setIsLoading(true);
    setError(null);

    const token = sessionStorage.getItem("token");
    const userDataString = sessionStorage.getItem("userData");
    let userId = null;
    let username = null;

    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        userId = userData.id;
        username = userData.username;
      } catch (e) {
        console.error("Error parsing userData:", e);
      }
    }

    if (!token || !userId) {
      setError("Authentication error: Token or User ID missing. Please log in.");
      toast.error("Authentication error: Token or User ID missing. Please log in.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/drafts/by-user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      console.log("Fetch drafts response:", response);

      if (!response.ok) {
        const text = await response.text();
        console.error("Failed to fetch drafts:", text);
        setError("Server error: Could not fetch drafts.");
        toast.error("Server error: Could not fetch drafts.");
        setIsLoading(false);
        return;
      }

      let draftsData = await response.json();

      // Generate titles if missing
      draftsData = draftsData.map(d => ({
        ...d,
        title: d.title || (
          d.content && d.content.length > 0
            ? d.content.substring(0, 50).trim() + (d.content.length > 50 ? '...' : '')
            : 'Untitled Draft'
        )
      }));

      console.log("Fetched drafts data:", draftsData);
      setDrafts(draftsData);
      toast.success(`Loaded ${draftsData.length} draft${draftsData.length !== 1 ? 's' : ''}`);
    } catch (err) {
      console.error("Network error fetching drafts:", err);
      setError("Network error: Could not reach server.");
      toast.error("Network error: Could not reach server.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDraft = async (draftId, e) => {
    e.stopPropagation();
    const token = sessionStorage.getItem("token");

    if (!token) return;

    if (!window.confirm('Are you sure you want to delete this draft?')) {
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/drafts/${draftId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok || response.status === 204) {
        setDrafts(drafts.filter(d => d.id !== draftId));
        if (selectedDraft && selectedDraft.id === draftId) {
          setSelectedDraft(null);
        }
        toast.success('Draft deleted successfully!');
      } else {
        console.error('Failed to delete draft');
        toast.error('Failed to delete draft. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting draft:', err);
      toast.error('Error deleting draft. Please try again.');
    }
  };

  const loadDraftInEditor = (draft, e) => {
    e.stopPropagation();
    console.log('Loading draft in editor:', draft);
    
    // Store draft data in sessionStorage for the editor to pick up
    sessionStorage.setItem('draftToEdit', JSON.stringify({
      id: draft.id,
      content: draft.content,
      title: draft.title
    }));
    
    toast.success('Loading draft in editor...');
    
    // Navigate to content editor
    window.location.href = '/content-editor';
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      relative: getRelativeTime(date)
    };
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const getContentPreview = (content) => {
    const text = (content || '').replace(/<[^>]*>/g, '');
    return text.length > 200 ? text.substring(0, 200) + '...' : text;
  };

  // Get username for display
  const getUsername = () => {
    const userDataString = sessionStorage.getItem("userData");
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        return userData.username;
      } catch (e) {
        console.error("Error parsing userData:", e);
      }
    }
    return "Unknown User";
  };

  const openDraftModal = (draft) => {
    setSelectedDraft(draft);
  };

  const closeDraftModal = () => {
    setSelectedDraft(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#ffffff',
            color: '#000000',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
      
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Saved Drafts</h1>
      <div className="flex items-center text-sm text-gray-500 mt-2 mb-4">
        <User size={14} className="mr-1" />
        <span>Drafts for: {getUsername()}</span>
      </div>

      {drafts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded shadow">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No saved drafts yet</h3>
          <button
            onClick={() => window.location.href = '/content-editor'}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Content Editor
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {drafts.map(d => {
            const { date, time, relative } = formatDate(d.timestamp);
            return (
              <div 
                key={d.id} 
                className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md cursor-pointer transition-shadow"
                onClick={() => openDraftModal(d)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{d.title}</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => loadDraftInEditor(d, e)} 
                      className="text-blue-600 hover:bg-blue-50 p-1 rounded transition-colors"
                      title="Edit draft"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={(e) => deleteDraft(d.id, e)} 
                      className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                      title="Delete draft"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Calendar size={14} /> <span>{date}</span>
                  <Clock size={14} /> <span>{time}</span>
                  <span>({relative})</span>
                </div>

                <p className="text-gray-700 text-sm">{getContentPreview(d.content)}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal to show full content */}
      {selectedDraft && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 z-50" 
          style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
          onClick={closeDraftModal}
        >
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">{selectedDraft.title}</h2>
              <button onClick={closeDraftModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{formatDate(selectedDraft.timestamp).date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{formatDate(selectedDraft.timestamp).time}</span>
                </div>
                <span>({formatDate(selectedDraft.timestamp).relative})</span>
              </div>
              
              <div className="prose max-w-none">
                <div className="text-gray-800 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: selectedDraft.content || 'No content available' }} />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  loadDraftInEditor(selectedDraft, e);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
              >
                <Edit3 size={16} />
                Edit Draft
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteDraft(selectedDraft.id, e);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Draft
              </button>
              <button
                onClick={closeDraftModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewDraft;