import React, { useState, useRef, useEffect } from 'react';

const ReadabilityScoreEditor = () => {
  const editorRef = useRef(null);
  const [plainText, setPlainText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

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
    setIsPulsing(true);

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
        setResult(data);
      } else {
        console.error('Failed to calculate readability');
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
      setTimeout(() => setIsPulsing(false), 300);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 w-full">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white text-center animate-fade-in">
          Readability Score Analyzer
        </h1>

        {/* Toolbar */}
        <div className="flex gap-2 flex-wrap mb-5 justify-center p-4 bg-black rounded-lg border border-white">
          <button 
            className="px-4 py-2 bg-black text-white rounded-lg transition-all duration-200 hover:bg-white hover:text-black active:scale-95 border border-white"
            onClick={() => exec('bold')}
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button 
            className="px-4 py-2 bg-black text-white rounded-lg transition-all duration-200 hover:bg-white hover:text-black active:scale-95 border border-white"
            onClick={() => exec('italic')}
            title="Italic"
          >
            <em>I</em>
          </button>
          <button 
            className="px-4 py-2 bg-black text-white rounded-lg transition-all duration-200 hover:bg-white hover:text-black active:scale-95 border border-white"
            onClick={() => exec('underline')}
            title="Underline"
          >
            <u>U</u>
          </button>
          <button 
            className="px-4 py-2 bg-black text-white rounded-lg transition-all duration-200 hover:bg-white hover:text-black active:scale-95 border border-white"
            onClick={() => exec('strikeThrough')}
            title="Strikethrough"
          >
            <span className="line-through">S</span>
          </button>
          
          <div className="mx-2 border-l border-white h-8 self-center"></div>
          
          <button 
            className="px-4 py-2 bg-black text-white rounded-lg transition-all duration-200 hover:bg-white hover:text-black active:scale-95 border border-white"
            onClick={() => exec('insertUnorderedList')}
            title="Bullet List"
          >
            • List
          </button>
          <button 
            className="px-4 py-2 bg-black text-white rounded-lg transition-all duration-200 hover:bg-white hover:text-black active:scale-95 border border-white"
            onClick={() => exec('insertOrderedList')}
            title="Numbered List"
          >
            1. List
          </button>
          
          <div className="mx-2 border-l border-white h-8 self-center"></div>
          
          <button 
            className="px-4 py-2 bg-black text-white rounded-lg transition-all duration-200 hover:bg-white hover:text-black active:scale-95 border border-white"
            onClick={() => exec('formatBlock', 'H1')}
            title="Heading 1"
          >
            H1
          </button>
          <button 
            className="px-4 py-2 bg-black text-white rounded-lg transition-all duration-200 hover:bg-white hover:text-black active:scale-95 border border-white"
            onClick={() => exec('formatBlock', 'H2')}
            title="Heading 2"
          >
            H2
          </button>
          <button 
            className="px-4 py-2 bg-black text-white rounded-lg transition-all duration-200 hover:bg-white hover:text-black active:scale-95 border border-white"
            onClick={() => exec('formatBlock', 'P')}
            title="Paragraph"
          >
            P
          </button>
        </div>

        {/* Editable Area */}
        <div
          ref={editorRef}
          className="min-h-80 border border-white rounded-lg p-6 focus:outline-none bg-black 
                     transition-all duration-300 focus:ring-2 focus:ring-white text-white text-lg"
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

        <div className="mt-3 text-sm text-gray-300 text-center">
          Spelling mistakes are underlined by your browser.
        </div>

        {/* Character Count */}
        <div className="mt-5 text-md text-white flex justify-center">
          <span className="font-medium bg-black py-2 px-4 rounded-lg border border-white">
            Character count: <span className="text-white font-bold">{plainText.length}</span>
          </span>
        </div>

        {/* Calculate Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={calculateReadability}
            disabled={loading || !plainText.trim()}
            className={`px-8 py-3 bg-black text-white rounded-lg 
                       hover:bg-white hover:text-black disabled:bg-gray-800 disabled:hover:bg-gray-800 disabled:hover:text-white
                       transition-all duration-300 transform hover:scale-105 active:scale-95 
                       font-semibold flex items-center justify-center border border-white
                       ${isPulsing && !loading ? 'animate-pulse' : ''}`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Calculating...
              </>
            ) : 'Calculate Readability'}
          </button>
        </div>

        {/* Display Result */}
        {result && (
          <div className="mt-6 p-6 bg-black rounded-lg border border-white animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 text-white text-center border-b border-white pb-2">
              Readability Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
              <div className="p-4 bg-black rounded-lg border border-white transition-transform duration-200 hover:scale-[1.02]">
                <strong className="text-white">Flesch-Kincaid Score:</strong> 
                <span className="float-right text-white font-bold text-xl">{result.fleschKincaidScore}</span>
              </div>
              <div className="p-4 bg-black rounded-lg border border-white transition-transform duration-200 hover:scale-[1.02]">
                <strong className="text-white">Grade Level:</strong> 
                <span className="float-right text-white font-bold text-xl">{result.gradeLevel}</span>
              </div>
              <div className="p-4 bg-black rounded-lg border border-white transition-transform duration-200 hover:scale-[1.02]">
                <strong className="text-white">Total Words:</strong> 
                <span className="float-right">{result.totalWords}</span>
              </div>
              <div className="p-4 bg-black rounded-lg border border-white transition-transform duration-200 hover:scale-[1.02]">
                <strong className="text-white">Total Sentences:</strong> 
                <span className="float-right">{result.totalSentences}</span>
              </div>
              <div className="p-4 bg-black rounded-lg border border-white transition-transform duration-200 hover:scale-[1.02]">
                <strong className="text-white">Total Syllables:</strong> 
                <span className="float-right">{result.totalSyllables}</span>
              </div>
              <div className="p-4 bg-black rounded-lg border border-white transition-transform duration-200 hover:scale-[1.02]">
                <strong className="text-white">Average Words Per Sentence:</strong> 
                <span className="float-right">{result.averageWordsPerSentence}</span>
              </div>
              <div className="p-4 bg-black rounded-lg border border-white md:col-span-2 transition-transform duration-200 hover:scale-[1.02]">
                <strong className="text-white">Average Syllables Per Word:</strong> 
                <span className="float-right">{result.averageSyllablesPerWord}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default ReadabilityScoreEditor;