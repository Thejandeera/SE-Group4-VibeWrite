import React from 'react';
import LexicalEditor from '../Components/lexical/LexicalEditor.jsx';

const ContentEditor = () => {

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

        <LexicalEditor />
      </div>
    </div>
  );
};

export default ContentEditor;
