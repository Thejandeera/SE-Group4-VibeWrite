import React, { useState, useRef } from 'react';
import LexicalEditor from '../Components/lexical/LexicalEditor.jsx';

const ContentEditor = () => {
  const [isSaving, setIsSaving] = useState(false);
  const contentRef = useRef(null);
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const saveDraft = async () => {
    setIsSaving(true);
    
    try {
      // Get userId from session storage
      const userDataString = sessionStorage.getItem('userData');
      if (!userDataString) {
        alert('Please login to save drafts');
        return;
      }
      const userData = JSON.parse(userDataString);
      const userId = userData.id;
      if (!userId) {
        alert('User ID not found. Please login again.');
        return;
      }
      // Get editor content
      const editorContent = contentRef.current?.querySelector('.editor-input');
      if (!editorContent || !editorContent.textContent.trim()) {
        alert('Cannot save empty content');
        return;
      }
      const content = editorContent.innerHTML;
      // Send POST request
      const response = await fetch(`${backendUrl}/drafts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content,
          userId: userId
        })
      });
      if (!response.ok) {
        throw new Error(`Failed to save: ${response.status}`);
      }
      const result = await response.json();
      alert('Draft saved successfully!');
      
    } catch (error) {
      console.error('Save draft error:', error);
      alert('Failed to save draft. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 w-full">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4">
          <div className="mb-1 flex items-center gap-2">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Editor</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Content Editor</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500">Write, format, and refine with a professional rich text editor powered by Lexical.</p>
        </div>
        <div ref={contentRef}>
          <LexicalEditor />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={saveDraft}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>
        </div> 
      </div>
    </div>
  );
};

export default ContentEditor;