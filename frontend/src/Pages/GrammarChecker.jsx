// GrammarChecker.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const GrammarChecker = () => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [characterCount, setCharacterCount] = useState(0);
  const textareaRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  useEffect(() => {
    setCharacterCount(text.length);
  }, [text]);
  
  const applyFormatting = (command) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    
    if (selectedText) {
      let formattedText = selectedText;
      switch (command) {
        case 'bold':
          formattedText = `**${selectedText}**`;
          break;
        case 'italic':
          formattedText = `*${selectedText}*`;
          break;
        case 'underline':
          formattedText = `<u>${selectedText}</u>`;
          break;
        case 'strikethrough':
          formattedText = `~~${selectedText}~~`;
          break;
        default:
          break;
      }
      
      const newText = text.substring(0, start) + formattedText + text.substring(end);
      setText(newText);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start + formattedText.length);
      }, 0);
    }
  };
  
  const insertList = (type) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const listItem = type === 'bullet' ? '• List item\n' : '1. List item\n';
    const newText = text.substring(0, start) + listItem + text.substring(start);
    setText(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + listItem.length, start + listItem.length);
    }, 0);
  };
  
  const insertHeading = (level) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const heading = level === 1 ? '# Heading 1\n' : '## Heading 2\n';
    const newText = text.substring(0, start) + heading + text.substring(start);
    setText(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + heading.length, start + heading.length);
    }, 0);
  };
  
  const navigateToPastGrammar = () => {
    navigate('/past-grammar');
  };
  
  const checkGrammar = async () => {
    if (!text.trim()) {
      alert(t('grammar.errors.enterText'));
      return;
    }
    setIsLoading(true);
    try {
      const userData = JSON.parse(sessionStorage.getItem('userData'));
      const token = sessionStorage.getItem('token');
      
      if (!userData || !token) {
        alert(t('grammar.errors.loginFirst'));
        return;
      }
      const response = await fetch(`${backendUrl}/api/v1/grammar/check`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userData.id,
          text: text,
          language: 'en'
        })
      });
      if (!response.ok) {
        throw new Error(t('grammar.errors.checkFailed'));
      }
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error checking grammar:', error);
      alert(t('grammar.errors.checkFailed'));
    } finally {
      setIsLoading(false);
    }
  };
  
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getErrorTypeColor = (errorType) => {
    switch (errorType) {
      case 'GRAMMAR':
        return 'bg-red-500';
      case 'SPELLING':
        return 'bg-orange-500';
      case 'PUNCTUATION':
        return 'bg-purple-500';
      case 'STYLE':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };
  
  return (
    <div className="min-h-screen bg-white text-gray-800 p-4 md:p-6">
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .gradient-text {
          background: linear-gradient(45deg, #3B82F6, #8B5CF6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
      
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold gradient-text">
            {t('grammar.title')}
          </h1>
          <button
            onClick={navigateToPastGrammar}
            className="px-4 py-2 md:px-6 md:py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 font-medium text-sm md:text-base w-full sm:w-auto text-white"
          >
            {t('grammar.pastChecks')}
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-4 md:p-6 shadow-lg border border-gray-200 mb-6 md:mb-8">
          {/* Formatting Toolbar */}
          <div className="flex flex-wrap gap-1 md:gap-2 mb-4 p-2 md:p-3 bg-gray-100 rounded-lg border border-gray-300">
            <button
              onClick={() => applyFormatting('bold')}
              className="px-2 py-1 md:px-3 md:py-2 bg-white hover:bg-gray-200 rounded border border-gray-300 transition-colors font-bold text-xs md:text-sm"
            >
              B
            </button>
            <button
              onClick={() => applyFormatting('italic')}
              className="px-2 py-1 md:px-3 md:py-2 bg-white hover:bg-gray-200 rounded border border-gray-300 transition-colors italic text-xs md:text-sm"
            >
              I
            </button>
            <button
              onClick={() => applyFormatting('underline')}
              className="px-2 py-1 md:px-3 md:py-2 bg-white hover:bg-gray-200 rounded border border-gray-300 transition-colors underline text-xs md:text-sm"
            >
              U
            </button>
            <button
              onClick={() => applyFormatting('strikethrough')}
              className="px-2 py-1 md:px-3 md:py-2 bg-white hover:bg-gray-200 rounded border border-gray-300 transition-colors line-through text-xs md:text-sm"
            >
              S
            </button>
            <div className="w-px bg-gray-300 mx-1 md:mx-2"></div>
            <button
              onClick={() => insertList('bullet')}
              className="px-2 py-1 md:px-3 md:py-2 bg-white hover:bg-gray-200 rounded border border-gray-300 transition-colors text-xs md:text-sm"
            >
              {t('grammar.toolbar.bulletList')}
            </button>
            <button
              onClick={() => insertList('numbered')}
              className="px-2 py-1 md:px-3 md:py-2 bg-white hover:bg-gray-200 rounded border border-gray-300 transition-colors text-xs md:text-sm"
            >
              {t('grammar.toolbar.numberedList')}
            </button>
            <div className="w-px bg-gray-300 mx-1 md:mx-2"></div>
            <button
              onClick={() => insertHeading(1)}
              className="px-2 py-1 md:px-3 md:py-2 bg-white hover:bg-gray-200 rounded border border-gray-300 transition-colors font-bold text-xs md:text-sm"
            >
              H1
            </button>
            <button
              onClick={() => insertHeading(2)}
              className="px-2 py-1 md:px-3 md:py-2 bg-white hover:bg-gray-200 rounded border border-gray-300 transition-colors font-bold text-xs md:text-sm"
            >
              H2
            </button>
            <button className="px-2 py-1 md:px-3 md:py-2 bg-white hover:bg-gray-200 rounded border border-gray-300 transition-colors text-xs md:text-sm">
              P
            </button>
          </div>
          
          {/* Text Area */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('grammar.placeholder')}
            className="w-full h-60 md:h-80 p-3 md:p-4 bg-white text-gray-800 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 resize-none transition-all duration-300"
            style={{ outline: 'none' }}
          />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 gap-2 md:gap-0">
            <div className="text-xs md:text-sm text-gray-600">
              <span>{t('editor.spellcheckNote')}</span>
            </div>
            <div className="text-xs md:text-sm text-gray-600">
              {t('editor.characterCount')} {characterCount}
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={checkGrammar}
              disabled={isLoading || !text.trim()}
              className="w-full md:w-auto px-6 py-2 md:px-8 md:py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 font-medium text-white shadow-lg text-sm md:text-base"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white mr-2"></div>
                  {t('grammar.checking')}
                </div>
              ) : (
                t('grammar.checkButton')
              )}
            </button>
          </div>
        </div>
        
        {/* Results Section */}
        {result && (
          <div className="space-y-6 md:space-y-8 animate-fadeIn">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-2 md:gap-4 md:grid-cols-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 md:p-6 rounded-xl shadow-lg text-white">
                <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2">{t('grammar.results.grammarScore')}</h3>
                <p className="text-xl md:text-3xl font-bold">{result.grammarScore}%</p>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 md:p-6 rounded-xl shadow-lg text-white">
                <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2">{t('grammar.results.totalErrors')}</h3>
                <p className="text-xl md:text-3xl font-bold">{result.totalErrors}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 md:p-6 rounded-xl shadow-lg text-white">
                <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2">{t('grammar.results.wordCount')}</h3>
                <p className="text-xl md:text-3xl font-bold">{result.metrics.wordCount}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 md:p-6 rounded-xl shadow-lg text-white">
                <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2">{t('grammar.results.readability')}</h3>
                <p className="text-xl md:text-3xl font-bold">{result.metrics.readabilityScore.toFixed(1)}</p>
              </div>
            </div>
            
            {/* Original vs Corrected Text */}
            <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
              <div className="bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-red-600">{t('grammar.results.originalText')}</h3>
                <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-300">
                  <p className="text-gray-700 whitespace-pre-wrap text-sm md:text-base">{result.originalText}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-green-600">{t('grammar.results.correctedText')}</h3>
                <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-300">
                  <p className="text-gray-700 whitespace-pre-wrap text-sm md:text-base">{result.correctedText}</p>
                </div>
              </div>
            </div>
            
            {/* Errors Table */}
            {result.errors.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-200">
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-orange-600">{t('grammar.results.detectedErrors')}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs md:text-sm">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left p-2 md:p-3 font-semibold">{t('grammar.table.position')}</th>
                        <th className="text-left p-2 md:p-3 font-semibold">{t('grammar.table.errorType')}</th>
                        <th className="text-left p-2 md:p-3 font-semibold">{t('grammar.table.original')}</th>
                        <th className="text-left p-2 md:p-3 font-semibold">{t('grammar.table.suggested')}</th>
                        <th className="text-left p-2 md:p-3 font-semibold hidden sm:table-cell">{t('grammar.table.description')}</th>
                        <th className="text-left p-2 md:p-3 font-semibold">{t('grammar.table.severity')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.errors.map((error, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-100 transition-colors">
                          <td className="p-2 md:p-3">{error.startPosition}-{error.endPosition}</td>
                          <td className="p-2 md:p-3">
                            <span className={`px-1 py-0.5 md:px-2 md:py-1 rounded-full text-xs text-white ${getErrorTypeColor(error.errorType)}`}>
                              {error.errorType}
                            </span>
                          </td>
                          <td className="p-2 md:p-3 font-mono bg-red-100 rounded px-1 py-0.5 md:px-2 md:py-1 text-xs md:text-sm">
                            "{error.originalText}"
                          </td>
                          <td className="p-2 md:p-3 font-mono bg-green-100 rounded px-1 py-0.5 md:px-2 md:py-1 text-xs md:text-sm">
                            "{error.suggestedText}"
                          </td>
                          <td className="p-2 md:p-3 text-gray-700 hidden sm:table-cell text-xs md:text-sm">{error.description}</td>
                          <td className="p-2 md:p-3">
                            <span className={`px-1 py-0.5 md:px-2 md:py-1 rounded border text-xs font-medium ${getSeverityColor(error.severity)}`}>
                              {error.severity}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Detailed Metrics */}
            <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-200">
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-blue-600">{t('grammar.results.detailedMetrics')}</h3>
              <div className="grid grid-cols-2 gap-2 md:gap-4 md:grid-cols-4">
                <div className="bg-white p-3 md:p-4 rounded-lg text-center border border-gray-200">
                  <p className="text-xl md:text-2xl font-bold text-blue-600">{result.metrics.sentenceCount}</p>
                  <p className="text-gray-600 text-xs md:text-sm">{t('grammar.metrics.sentences')}</p>
                </div>
                <div className="bg-white p-3 md:p-4 rounded-lg text-center border border-gray-200">
                  <p className="text-xl md:text-2xl font-bold text-red-600">{result.metrics.spellingErrors}</p>
                  <p className="text-gray-600 text-xs md:text-sm">{t('grammar.metrics.spellingErrors')}</p>
                </div>
                <div className="bg-white p-3 md:p-4 rounded-lg text-center border border-gray-200">
                  <p className="text-xl md:text-2xl font-bold text-orange-600">{result.metrics.grammarErrors}</p>
                  <p className="text-gray-600 text-xs md:text-sm">{t('grammar.metrics.grammarErrors')}</p>
                </div>
                <div className="bg-white p-3 md:p-4 rounded-lg text-center border border-gray-200">
                  <p className="text-xl md:text-2xl font-bold text-purple-600">{result.metrics.punctuationErrors}</p>
                  <p className="text-gray-600 text-xs md:text-sm">{t('grammar.metrics.punctuationErrors')}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default GrammarChecker;