import React, { useState, useRef, useEffect } from 'react';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const toolbarButtonClass = 'px-3 py-1 border rounded text-sm hover:bg-gray-100';

const ContentEditor = () => {
  const editorRef = useRef(null);
  const [plainText, setPlainText] = useState('');

  useEffect(() => {
    if (editorRef.current) {
      setPlainText(editorRef.current.innerText || '');
    }
  }, []);

  const exec = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      setPlainText(editorRef.current.innerText || '');
    }
  };

  const onInput = () => {
    if (editorRef.current) {
      setPlainText(editorRef.current.innerText || '');
    }
  };

  return (
    <div className="p-6 w-full">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Content Editor</h1>

        <div className="flex gap-2 flex-wrap mb-3">
          <button className={toolbarButtonClass} onClick={() => exec('bold')}><strong>B</strong></button>
          <button className={toolbarButtonClass} onClick={() => exec('italic')}><em>I</em></button>
          <button className={toolbarButtonClass} onClick={() => exec('underline')}><u>U</u></button>
          <button className={toolbarButtonClass} onClick={() => exec('strikeThrough')}><span className="line-through">S</span></button>
          <span className="mx-2" />
          <button className={toolbarButtonClass} onClick={() => exec('insertUnorderedList')}>• List</button>
          <button className={toolbarButtonClass} onClick={() => exec('insertOrderedList')}>1. List</button>
          <span className="mx-2" />
          <button className={toolbarButtonClass} onClick={() => exec('formatBlock', 'H1')}>H1</button>
          <button className={toolbarButtonClass} onClick={() => exec('formatBlock', 'H2')}>H2</button>
          <button className={toolbarButtonClass} onClick={() => exec('formatBlock', 'P')}>P</button>
        </div>

        <div
          ref={editorRef}
          className="min-h-80 border rounded p-4 focus:outline-none bg-white"
          contentEditable
          spellCheck={true}
          lang="en"
          onInput={onInput}
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
        >
          Start writing here...
        </div>

        <div className="mt-2 text-xs text-gray-500">Spelling mistakes are underlined by your browser.</div>

        <div className="mt-4 text-sm text-gray-600">
          <span className="font-medium">Character count:</span> {plainText.length}
        </div>

        <div className="mt-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => {
              fetch(`${backendUrl}/draft`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: plainText }),
              })
                .then((res) => res.json())
                .then((data) => console.log("Draft saved:", data))
                .catch((err) => console.error("Error saving draft:", err));
            }}
          >
            Save Draft
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;
