import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Trash2, Edit3, Clock, User } from 'lucide-react';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

const ViewDraft = () => {
  const [drafts, setDrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use a single useEffect to handle the initial fetch
  useEffect(() => {
    fetchDrafts();
  }, []); // Empty dependency array means this runs once on component mount

  const fetchDrafts = async () => {
    try {
      setIsLoading(true);

      const username = localStorage.getItem("username");
      const token = localStorage.getItem("token"); 

      if (!token || !username) {
        setError("Authentication error: Token or username is missing. Please log in.");
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `${backendUrl}/drafts/by-username/${username}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, 
          },
        }
      );

      if (response.ok) {
        let draftsData = await response.json();

        // 🌟 FIX: Map the data to add a 'title' property 🌟
        draftsData = draftsData.map(draft => ({
            ...draft,
            // Generate a title if one is not present from the backend
            title: draft.title || (
                draft.content && draft.content.length > 0 
                ? draft.content.substring(0, 50).trim() + (draft.content.length > 50 ? '...' : '') 
                : 'Untitled Draft'
            )
        }));
        // 🌟 END FIX 🌟

        setDrafts(draftsData);
      } else {
        const errText = await response.text();
        console.error("Failed to fetch drafts:", errText);
        setError("Server error: Failed to fetch drafts.");
      }
    } catch (error) {
      console.error("Error fetching drafts:", error);
      setError("Network error or server unreachable.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDraft = async (draftId) => {
    // You'd also need the token here for a real application
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token available for deletion.");
      return;
    }
    
    try {
      const response = await fetch(`${backendUrl}/drafts/${draftId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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
    window.location.href = `/content-editor?draft=${encodeURIComponent(JSON.stringify(draft))}`;
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
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const getContentPreview = (content) => {
    const plainText = (content || '').replace(/<[^>]*>/g, '');
    return plainText.length > 200 ? plainText.substring(0, 200) + '...' : plainText;
  };

  // Loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="text-center py-12 text-red-500">{error}</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Saved Drafts</h1>
      <div className="flex items-center text-sm text-gray-500 mt-2 mb-4">
        <User size={14} className="mr-1" />
        <span>Drafts for: **{localStorage.getItem("username")}**</span>
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
          {drafts.map((draft) => {
            const { date, time, relative } = formatDate(draft.timestamp);
            return (
              <div key={draft.id} className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md">
                <div className="flex items-start justify-between mb-3">
                  {/* The title now exists because of the map function */}
                  <h3 className="font-medium text-gray-900">{draft.title}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => loadDraftInEditor(draft)} className="text-blue-600 hover:underline">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => deleteDraft(draft.id)} className="text-red-600 hover:underline">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Calendar size={14} /> <span>{date}</span>
                  <Clock size={14} /> <span>{time}</span>
                  <span>({relative})</span>
                </div>
                <p className="text-gray-700 text-sm">{getContentPreview(draft.content)}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ViewDraft;