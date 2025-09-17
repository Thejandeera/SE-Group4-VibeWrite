import React, { useState, useRef, useEffect } from 'react';

const toolbarButtonClass = 'px-3 py-1 border rounded text-sm hover:bg-gray-100';

const ReadabilityScoreEditor = () => {
  const editorRef = useRef(null);
  const [plainText, setPlainText] = useState('');
  const [result, setResult] = useState(null); // store full result
  const [loading, setLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

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

  const calculateReadability = async () => {
    if (!plainText.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${backendUrl}/api/readability/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: plainText })
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data); // set the full object
      } else {
        console.error('Failed to calculate readability');
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 w-full">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Readability Score</h1>

        {/* Toolbar */}
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

        {/* Editable Area */}
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

        <div className="mt-2 text-xs text-gray-500">
          Spelling mistakes are underlined by your browser.
        </div>

        {/* Character Count */}
        <div className="mt-4 text-sm text-gray-600">
          <span className="font-medium">Character count:</span> {plainText.length}
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateReadability}
          disabled={loading || !plainText.trim()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Calculating...' : 'Calculate Readability'}
        </button>

        {/* Display Result */}
        {result && (
          <div className="mt-4 text-gray-700 space-y-1">
            <div><strong>Flesch-Kincaid Score:</strong> {result.fleschKincaidScore}</div>
            <div><strong>Grade Level:</strong> {result.gradeLevel}</div>
            <div><strong>Total Words:</strong> {result.totalWords}</div>
            <div><strong>Total Sentences:</strong> {result.totalSentences}</div>
            <div><strong>Total Syllables:</strong> {result.totalSyllables}</div>
            <div><strong>Average Words Per Sentence:</strong> {result.averageWordsPerSentence}</div>
            <div><strong>Average Syllables Per Word:</strong> {result.averageSyllablesPerWord}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadabilityScoreEditor;
