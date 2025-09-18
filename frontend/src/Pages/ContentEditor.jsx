import React, { useState, useRef, useEffect } from 'react';

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

        <div className="mb-3 flex flex-wrap items-center gap-1">
          <div className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white/70 px-2 py-1 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/50">
            <button title="Bold" className="rounded-full px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 active:scale-[0.98] transition" onClick={() => exec('bold')}>
              <strong>B</strong>
            </button>
            <button title="Italic" className="rounded-full px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 active:scale-[0.98] transition" onClick={() => exec('italic')}>
              <em>I</em>
            </button>
            <button title="Underline" className="rounded-full px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 active:scale-[0.98] transition" onClick={() => exec('underline')}>
              <u>U</u>
            </button>
            <button title="Strikethrough" className="rounded-full px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 active:scale-[0.98] transition" onClick={() => exec('strikeThrough')}>
              <span className="line-through">S</span>
            </button>

            <span className="mx-1 h-5 w-px bg-gray-200" />

            <button title="Bulleted List" className="rounded-full px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 active:scale-[0.98] transition" onClick={() => exec('insertUnorderedList')}>
              • List
            </button>
            <button title="Numbered List" className="rounded-full px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 active:scale-[0.98] transition" onClick={() => exec('insertOrderedList')}>
              1. List
            </button>

            <span className="mx-1 h-5 w-px bg-gray-200" />

            <button title="Heading 1" className="rounded-full px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 active:scale-[0.98] transition" onClick={() => exec('formatBlock', 'H1')}>
              H1
            </button>
            <button title="Heading 2" className="rounded-full px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 active:scale-[0.98] transition" onClick={() => exec('formatBlock', 'H2')}>
              H2
            </button>
            <button title="Paragraph" className="rounded-full px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 active:scale-[0.98] transition" onClick={() => exec('formatBlock', 'P')}>
              P
            </button>
          </div>
        </div>

        <div className="relative">
          {(!plainText || plainText.trim().length === 0) && (
            <span className="pointer-events-none absolute left-4 top-4 text-gray-400 select-none">
              Start writing here...
            </span>
          )}
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
            aria-label="Rich text editor"
          />
        </div>

        <div className="mt-2 text-xs text-gray-500">Spelling mistakes are underlined by your browser.</div>

        <div className="mt-4 text-sm text-gray-600">
          <span className="font-medium">Character count:</span> {plainText.length}
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;
