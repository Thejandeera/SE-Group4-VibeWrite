import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Trash2, Edit3, Clock, User } from 'lucide-react';

const backendUrl = 'http://localhost:8080';

const ViewDraft = () => {
  const [drafts, setDrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      setError("Authentication error: Token or User ID missing. Please log in.");
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

      if (!response.ok) {
        const text = await response.text();
        console.error("Failed to fetch drafts:", text);
        setError("Server error: Could not fetch drafts.");
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

      setDrafts(draftsData);
    } catch (err) {
      console.error("Network error fetching drafts:", err);
      setError("Network error: Could not reach server.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDraft = async (draftId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${backendUrl}/drafts/${draftId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setDrafts(drafts.filter(d => d.id !== draftId));
      } else {
        console.error('Failed to delete draft');
      }
    } catch (err) {
      console.error('Error deleting draft:', err);
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
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Saved Drafts</h1>
      <div className="flex items-center text-sm text-gray-500 mt-2 mb-4">
        <User size={14} className="mr-1" />
        <span>Drafts for: {localStorage.getItem("username") || "Unknown User"}</span>
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
              <div key={d.id} className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{d.title}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => loadDraftInEditor(d)} className="text-blue-600 hover:underline">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => deleteDraft(d.id)} className="text-red-600 hover:underline">
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
    </div>
  );
};

export default ViewDraft;


