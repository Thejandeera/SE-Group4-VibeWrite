import React, { useState, useRef, useEffect } from 'react';

const toolbarButtonClass = 'px-3 py-1 border rounded text-sm hover:bg-gray-100';

const ContentEditor = () => {
  const editorRef = useRef(null);
  const [plainText, setPlainText] = useState('');
  const [active, setActive] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    subscript: false,
    superscript: false,
    unorderedList: false,
    orderedList: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
    justifyFull: false,
  });
  const [blockTag, setBlockTag] = useState('P');

  useEffect(() => {
    if (editorRef.current) {
      setPlainText(editorRef.current.innerText || '');
    }
  }, []);

  const refreshToolbarState = () => {
    try {
      const newActive = {
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikeThrough: document.queryCommandState('strikeThrough'),
        subscript: document.queryCommandState('subscript'),
        superscript: document.queryCommandState('superscript'),
        unorderedList: document.queryCommandState('insertUnorderedList'),
        orderedList: document.queryCommandState('insertOrderedList'),
        justifyLeft: document.queryCommandState('justifyLeft'),
        justifyCenter: document.queryCommandState('justifyCenter'),
        justifyRight: document.queryCommandState('justifyRight'),
        justifyFull: document.queryCommandState('justifyFull'),
      };
      setActive(newActive);
      const currentBlock = document.queryCommandValue('formatBlock') || 'P';
      setBlockTag((currentBlock || 'P').toString().replace(/[<>]/g, '').toUpperCase());
    } catch (e) {
      // noop
    }
  };

  const exec = (command, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    // For headings/blockquote, ensure proper tag format for better browser support
    const normalizedValue = typeof value === 'string' && /^(H\d|P|BLOCKQUOTE)$/i.test(value)
      ? `<${value.toLowerCase()}>`
      : value;
    document.execCommand(command, false, normalizedValue);
    if (editorRef.current) {
      editorRef.current.focus();
      setPlainText(editorRef.current.innerText || '');
    }
    refreshToolbarState();
  };

  const onInput = () => {
    if (editorRef.current) {
      setPlainText(editorRef.current.innerText || '');
    }
    refreshToolbarState();
  };

  useEffect(() => {
    const handleSelection = () => {
      refreshToolbarState();
    };
    document.addEventListener('selectionchange', handleSelection);
    return () => document.removeEventListener('selectionchange', handleSelection);
  }, []);

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
          <p className="mt-1 text-sm text-gray-500">Write, format, and refine with a clean, focused canvas.</p>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white/70 px-2.5 py-1.5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/50">
            <button title="Undo" className="rounded-full px-3.5 py-1.5 text-sm text-gray-700 hover:bg-gray-100 active:scale-[0.98] transition" onClick={() => exec('undo')}>
              ↶
            </button>
            <button title="Redo" className="rounded-full px-3.5 py-1.5 text-sm text-gray-700 hover:bg-gray-100 active:scale-[0.98] transition" onClick={() => exec('redo')}>
              ↷
            </button>

            <span className="mx-1 h-5 w-px bg-gray-200" />

            <button title="Bold" className={`rounded-full px-3.5 py-1.5 text-sm transition ${active.bold ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => exec('bold')}>
              <strong>B</strong>
            </button>
            <button title="Italic" className={`rounded-full px-3.5 py-1.5 text-sm transition ${active.italic ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => exec('italic')}>
              <em>I</em>
            </button>
            <button title="Underline" className={`rounded-full px-3.5 py-1.5 text-sm transition ${active.underline ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => exec('underline')}>
              <u>U</u>
            </button>
            <button title="Strikethrough" className={`rounded-full px-3.5 py-1.5 text-sm transition ${active.strikeThrough ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => exec('strikeThrough')}>
              <span className="line-through">S</span>
            </button>
            <button title="Subscript" className={`rounded-full px-3.5 py-1.5 text-sm transition ${active.subscript ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => exec('subscript')}>
              x<sub>2</sub>
            </button>
            <button title="Superscript" className={`rounded-full px-3.5 py-1.5 text-sm transition ${active.superscript ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => exec('superscript')}>
              x<sup>2</sup>
            </button>

            <span className="mx-1 h-5 w-px bg-gray-200" />

            <button title="Bulleted List" className={`rounded-full px-3.5 py-1.5 text-sm transition ${active.unorderedList ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => exec('insertUnorderedList')}>
              • List
            </button>
            <button title="Numbered List" className={`rounded-full px-3.5 py-1.5 text-sm transition ${active.orderedList ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => exec('insertOrderedList')}>
              1. List
            </button>
            <button title="Decrease Indent" className="rounded-full px-3.5 py-1.5 text-sm text-gray-700 hover:bg-gray-100 active:scale-[0.98] transition" onClick={() => exec('outdent')}>
              ⟵
            </button>
            <button title="Increase Indent" className="rounded-full px-3.5 py-1.5 text-sm text-gray-700 hover:bg-gray-100 active:scale-[0.98] transition" onClick={() => exec('indent')}>
              ⟶
            </button>

            <span className="mx-1 h-5 w-px bg-gray-200" />

            <button title="Align Left" className={`rounded-full px-3.5 py-1.5 text-sm transition ${active.justifyLeft ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => exec('justifyLeft')}>
              ⟸
            </button>
            <button title="Align Center" className={`rounded-full px-3.5 py-1.5 text-sm transition ${active.justifyCenter ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => exec('justifyCenter')}>
              ≡
            </button>
            <button title="Align Right" className={`rounded-full px-3.5 py-1.5 text-sm transition ${active.justifyRight ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => exec('justifyRight')}>
              ⟹
            </button>
            <button title="Justify" className={`rounded-full px-3.5 py-1.5 text-sm transition ${active.justifyFull ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => exec('justifyFull')}>
              ☰
            </button>

            <span className="mx-1 h-5 w-px bg-gray-200" />

            <button title="H1" className={`rounded-full px-3.5 py-1.5 text-sm transition ${blockTag === 'H1' ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => exec('formatBlock', 'H1')}>
              H1
            </button>
            <button title="H2" className={`rounded-full px-3.5 py-1.5 text-sm transition ${blockTag === 'H2' ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => exec('formatBlock', 'H2')}>
              H2
            </button>
            <button title="H3" className={`rounded-full px-3.5 py-1.5 text-sm transition ${blockTag === 'H3' ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => exec('formatBlock', 'H3')}>
              H3
            </button>
            <button title="Paragraph" className={`rounded-full px-3.5 py-1.5 text-sm transition ${blockTag === 'P' ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => exec('formatBlock', 'P')}>
              P
            </button>
            <button title="Block Quote" className={`rounded-full px-3.5 py-1.5 text-sm transition ${blockTag === 'BLOCKQUOTE' ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => exec('formatBlock', 'BLOCKQUOTE')}>
              ❝
            </button>

            <span className="mx-1 h-5 w-px bg-gray-200" />

            <button title="Clear Formatting" className="rounded-full px-3.5 py-1.5 text-sm text-gray-700 hover:bg-gray-100 active:scale-[0.98] transition" onClick={() => exec('removeFormat')}>
              ⌫
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
