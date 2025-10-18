import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import LexicalEditor from '../Components/lexical/LexicalEditor.jsx';

const ContentEditor = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [editingDraft, setEditingDraft] = useState(null);
  const [initialContent, setInitialContent] = useState('');
  const [currentContent, setCurrentContent] = useState('');
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    // Check if there's a draft to edit in sessionStorage
    const draftToEditString = sessionStorage.getItem('draftToEdit');
    if (draftToEditString) {
      try {
        const draftToEdit = JSON.parse(draftToEditString);
        setEditingDraft(draftToEdit);
        setInitialContent(draftToEdit.content || '');
        setCurrentContent(draftToEdit.content || '');
        console.log('Loading draft for editing:', draftToEdit);
        toast.success('Draft loaded for editing');
        // Clear the sessionStorage after loading
        sessionStorage.removeItem('draftToEdit');
      } catch (e) {
        console.error('Error parsing draft to edit:', e);
        toast.error('Failed to load draft');
      }
    }
  }, []);

  const handleContentChange = (htmlContent) => {
    setCurrentContent(htmlContent);
  };

  const saveDraft = async () => {
    setIsSaving(true);
    
    try {
      // Get userId from session storage
      const userDataString = sessionStorage.getItem('userData');
      if (!userDataString) {
        toast.error('Please login to save drafts');
        setIsSaving(false);
        return;
      }
      
      const userData = JSON.parse(userDataString);
      const userId = userData.id;
      
      if (!userId) {
        toast.error('User ID not found. Please login again.');
        setIsSaving(false);
        return;
      }

      // Only send plain text (no HTML tags) as content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = currentContent;
      const textContent = tempDiv.textContent || tempDiv.innerText || '';
      
      if (!textContent.trim()) {
        toast.error('Cannot save empty content');
        setIsSaving(false);
        return;
      }

      // Check if we're editing an existing draft or creating a new one
      if (editingDraft && editingDraft.id) {
        // Update existing draft using PUT
        const response = await fetch(`${backendUrl}/drafts/${editingDraft.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: textContent.trim(),
            userId: userId
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Update failed:', errorText);
          throw new Error(`Failed to update: ${response.status}`);
        }

        const result = await response.json();
        console.log('Draft updated:', result);
        toast.success('Draft updated successfully!');
        
        // Update the editing draft with new content
        setEditingDraft({ ...editingDraft, content: textContent.trim() });
        
      } else {
        // Create new draft using POST
        const response = await fetch(`${backendUrl}/drafts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: textContent.trim(),
            userId: userId
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Save failed:', errorText);
          throw new Error(`Failed to save: ${response.status}`);
        }

        const result = await response.json();
        console.log('Draft saved:', result);
        toast.success('Draft saved successfully!');
        
        // Set the newly created draft as the editing draft
        if (result.id) {
          setEditingDraft({ 
            id: result.id, 
            content: textContent.trim(),
            title: result.title 
          });
        }
      }
      
    } catch (error) {
      console.error('Save draft error:', error);
      toast.error('Failed to save draft. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel editing? Any unsaved changes will be lost.')) {
      setEditingDraft(null);
      setInitialContent('');
      setCurrentContent('');
      toast.success('Editing cancelled');
      window.location.reload();
    }
  };

  return (
    <div className="p-6 w-full">
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
      <div className="max-w-5xl mx-auto">
        <div className="mb-4">
          <div className="mb-1 flex items-center gap-2">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Editor</span>
            {editingDraft && (
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                Editing Draft
              </span>
            )}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Content Editor</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {editingDraft 
              ? `Editing: ${editingDraft.title || 'Draft'}`
              : 'Write, format, and refine with a professional rich text editor powered by Lexical.'
            }
          </p>
        </div>
        
        <LexicalEditor 
          initialContent={initialContent} 
          onContentChange={handleContentChange}
        />
        
        <div className="mt-4 flex justify-end gap-3">
          {editingDraft && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={saveDraft}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? 'Saving...' : editingDraft ? 'Update Draft' : 'Save Draft'}
          </button>
        </div> 
      </div>
    </div>
  );
};

export default ContentEditor;