// PastGrammar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const PastGrammar = () => {
  const [grammarHistory, setGrammarHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCheck, setSelectedCheck] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGrammarHistory();
  }, []);

  const fetchGrammarHistory = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userData = JSON.parse(sessionStorage.getItem('userData'));
      const token = sessionStorage.getItem('token');
      
      if (!userData || !token) {
        setError('Please login first');
        return;
      }

      const response = await fetch(
        `${backendUrl}/api/v1/grammar/history/user/${userData.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch grammar history');
      }

      const data = await response.json();
      setGrammarHistory(data);
    } catch (error) {
      console.error('Error fetching grammar history:', error);
      setError('Failed to load grammar history. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateBack = () => { 
    navigate('/grammar-check');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-2 border-blue-500 mx-auto mb-3 md:mb-4"></div>
          <p className="text-lg md:text-xl">Loading grammar history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-10 md:py-20">
            <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-lg p-4 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-red-400 mb-3 md:mb-4">Error</h2>
              <p className="text-gray-300 mb-4 md:mb-6">{error}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={fetchGrammarHistory}
                  className="px-4 py-2 md:px-6 md:py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm md:text-base"
                >
                  Retry
                </button>
                <button
                  onClick={navigateBack}
                  className="px-4 py-2 md:px-6 md:py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors text-sm md:text-base"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        .gradient-text {
          background: linear-gradient(45deg, #3B82F6, #8B5CF6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hover-scale {
          transition: transform 0.2s ease;
        }
        .hover-scale:hover {
          transform: scale(1.02);
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-2">
              Past Grammar Checks
            </h1>
            <p className="text-gray-400 text-sm md:text-base">Review your previous grammar analysis results</p>
          </div>
          <button
            onClick={navigateBack}
            className="px-4 py-2 md:px-6 md:py-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg hover:from-gray-700 hover:to-gray-800 transform hover:scale-105 transition-all duration-300 font-medium text-sm md:text-base w-full sm:w-auto"
          >
            ← Back to Editor
          </button>
        </div>

        {grammarHistory.length === 0 ? (
          <div className="text-center py-10 md:py-20">
            <div className="bg-gray-900 rounded-xl p-6 md:p-12 border border-gray-800">
              <div className="text-4xl md:text-6xl mb-4 md:mb-6">📝</div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-300 mb-3 md:mb-4">No Grammar Checks Yet</h2>
              <p className="text-gray-500 mb-6 md:mb-8 text-sm md:text-base">Start checking your grammar to see your history here.</p>
              <button
                onClick={navigateBack}
                className="px-6 py-2 md:px-8 md:py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 font-medium text-sm md:text-base"
              >
                Start Grammar Check
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6 animate-fadeIn">
            
            <div className="grid grid-cols-2 gap-2 md:gap-4 md:grid-cols-4 mb-6 md:mb-8">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 md:p-6 rounded-xl shadow-lg">
                <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2">Total Checks</h3>
                <p className="text-xl md:text-3xl font-bold">{grammarHistory.length}</p>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-green-700 p-4 md:p-6 rounded-xl shadow-lg">
                <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2">Average Score</h3>
                <p className="text-xl md:text-3xl font-bold">
                  {Math.round(grammarHistory.reduce((acc, check) => acc + check.grammarScore, 0) / grammarHistory.length)}%
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-4 md:p-6 rounded-xl shadow-lg">
                <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2">Total Errors Fixed</h3>
                <p className="text-xl md:text-3xl font-bold">
                  {grammarHistory.reduce((acc, check) => acc + check.totalErrors, 0)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-4 md:p-6 rounded-xl shadow-lg">
                <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2">Words Processed</h3>
                <p className="text-xl md:text-3xl font-bold">
                  {grammarHistory.reduce((acc, check) => acc + check.metrics.wordCount, 0)}
                </p>
              </div>
            </div>

           
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {grammarHistory.map((check, index) => (
                <div
                  key={check.id}
                  className="bg-gray-900 rounded-xl p-4 md:p-6 border border-gray-800 hover-scale cursor-pointer animate-slideIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedCheck(selectedCheck?.id === check.id ? null : check)}
                >
                  <div className="flex justify-between items-start mb-3 md:mb-4">
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-blue-400 mb-1 md:mb-2">
                        Check #{grammarHistory.length - index}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-400">
                        {formatDate(check.checkedAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl md:text-2xl font-bold ${getScoreColor(check.grammarScore)}`}>
                        {check.grammarScore}%
                      </div>
                      <div className="text-xs md:text-sm text-gray-400">
                        {check.totalErrors} errors
                      </div>
                    </div>
                  </div>

                 
                  <div className="bg-gray-800 p-2 md:p-3 rounded-lg mb-3 md:mb-4">
                    <p className="text-gray-300 text-xs md:text-sm line-clamp-3">
                      {check.originalText.length > 120 
                        ? `${check.originalText.substring(0, 120)}...`
                        : check.originalText
                      }
                    </p>
                  </div>

                  
                  <div className="grid grid-cols-4 gap-1 md:gap-2 text-center text-xs">
                    <div className="bg-gray-800 p-1 md:p-2 rounded">
                      <div className="font-semibold text-blue-400">{check.metrics.wordCount}</div>
                      <div className="text-gray-500 text-2xs md:text-xs">Words</div>
                    </div>
                    <div className="bg-gray-800 p-1 md:p-2 rounded">
                      <div className="font-semibold text-green-400">{check.metrics.sentenceCount}</div>
                      <div className="text-gray-500 text-2xs md:text-xs">Sentences</div>
                    </div>
                    <div className="bg-gray-800 p-1 md:p-2 rounded">
                      <div className="font-semibold text-orange-400">{check.metrics.grammarErrors}</div>
                      <div className="text-gray-500 text-2xs md:text-xs">Grammar</div>
                    </div>
                    <div className="bg-gray-800 p-1 md:p-2 rounded">
                      <div className="font-semibold text-purple-400">{check.metrics.readabilityScore.toFixed(0)}</div>
                      <div className="text-gray-500 text-2xs md:text-xs">Readability</div>
                    </div>
                  </div>

                  <div className="mt-3 md:mt-4 text-center text-xs md:text-sm text-gray-400">
                    Click to {selectedCheck?.id === check.id ? 'collapse' : 'expand'} details
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        
        {selectedCheck && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-2 md:p-4 z-50">
            <div className="bg-gray-900 rounded-xl p-4 md:p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-800">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-blue-400">
                  Grammar Check Details
                </h2>
                <button
                  onClick={() => setSelectedCheck(null)}
                  className="text-gray-400 hover:text-white text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              
              <div className="grid grid-cols-2 gap-2 md:gap-4 md:grid-cols-4 mb-6 md:mb-8">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 md:p-4 rounded-xl">
                  <h3 className="font-semibold mb-1 md:mb-2 text-xs md:text-sm">Grammar Score</h3>
                  <p className="text-lg md:text-2xl font-bold">{selectedCheck.grammarScore}%</p>
                </div>
                <div className="bg-gradient-to-br from-red-600 to-red-700 p-2 md:p-4 rounded-xl">
                  <h3 className="font-semibold mb-1 md:mb-2 text-xs md:text-sm">Total Errors</h3>
                  <p className="text-lg md:text-2xl font-bold">{selectedCheck.totalErrors}</p>
                </div>
                <div className="bg-gradient-to-br from-green-600 to-green-700 p-2 md:p-4 rounded-xl">
                  <h3 className="font-semibold mb-1 md:mb-2 text-xs md:text-sm">Word Count</h3>
                  <p className="text-lg md:text-2xl font-bold">{selectedCheck.metrics.wordCount}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-2 md:p-4 rounded-xl">
                  <h3 className="font-semibold mb-1 md:mb-2 text-xs md:text-sm">Readability</h3>
                  <p className="text-lg md:text-2xl font-bold">{selectedCheck.metrics.readabilityScore.toFixed(1)}</p>
                </div>
              </div>

           
              <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2 mb-6 md:mb-8">
                <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700">
                  <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-red-400">Original Text</h3>
                  <div className="bg-gray-700 p-3 md:p-4 rounded-lg">
                    <p className="text-gray-300 whitespace-pre-wrap text-sm md:text-base">{selectedCheck.originalText}</p>
                  </div>
                </div>
                <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700">
                  <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-green-400">Corrected Text</h3>
                  <div className="bg-gray-700 p-3 md:p-4 rounded-lg">
                    <p className="text-gray-300 whitespace-pre-wrap text-sm md:text-base">{selectedCheck.correctedText}</p>
                  </div>
                </div>
              </div>

              
              {selectedCheck.errors.length > 0 && (
                <div className="bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-700 mb-6 md:mb-8">
                  <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-orange-400">Detected Errors</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs md:text-sm">
                      <thead>
                        <tr className="border-b border-gray-600">
                          <th className="text-left p-2 md:p-3 font-semibold">Position</th>
                          <th className="text-left p-2 md:p-3 font-semibold">Error Type</th>
                          <th className="text-left p-2 md:p-3 font-semibold">Original</th>
                          <th className="text-left p-2 md:p-3 font-semibold">Suggested</th>
                          <th className="text-left p-2 md:p-3 font-semibold hidden sm:table-cell">Description</th>
                          <th className="text-left p-2 md:p-3 font-semibold">Severity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCheck.errors.map((error, index) => (
                          <tr key={index} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                            <td className="p-2 md:p-3">{error.startPosition}-{error.endPosition}</td>
                            <td className="p-2 md:p-3">
                              <span className={`px-1 py-0.5 md:px-2 md:py-1 rounded-full text-2xs md:text-xs font-medium text-white ${getErrorTypeColor(error.errorType)}`}>
                                {error.errorType}
                              </span>
                            </td>
                            <td className="p-2 md:p-3 font-mono bg-red-900 bg-opacity-30 rounded px-1 py-0.5 md:px-2 md:py-1 text-2xs md:text-xs">
                              "{error.originalText}"
                            </td>
                            <td className="p-2 md:p-3 font-mono bg-green-900 bg-opacity-30 rounded px-1 py-0.5 md:px-2 md:py-1 text-2xs md:text-xs">
                              "{error.suggestedText}"
                            </td>
                            <td className="p-2 md:p-3 text-gray-300 hidden sm:table-cell text-xs md:text-sm">{error.description}</td>
                            <td className="p-2 md:p-3">
                              <span className={`px-1 py-0.5 md:px-2 md:py-1 rounded border text-2xs md:text-xs font-medium ${getSeverityColor(error.severity)}`}>
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

              
              <div className="bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-700">
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-blue-400">Detailed Metrics</h3>
                <div className="grid grid-cols-2 gap-2 md:gap-4 md:grid-cols-4">
                  <div className="bg-gray-700 p-2 md:p-4 rounded-lg text-center">
                    <p className="text-lg md:text-2xl font-bold text-blue-400">{selectedCheck.metrics.sentenceCount}</p>
                    <p className="text-gray-400 text-xs md:text-sm">Sentences</p>
                  </div>
                  <div className="bg-gray-700 p-2 md:p-4 rounded-lg text-center">
                    <p className="text-lg md:text-2xl font-bold text-red-400">{selectedCheck.metrics.spellingErrors}</p>
                    <p className="text-gray-400 text-xs md:text-sm">Spelling Errors</p>
                  </div>
                  <div className="bg-gray-700 p-2 md:p-4 rounded-lg text-center">
                    <p className="text-lg md:text-2xl font-bold text-orange-400">{selectedCheck.metrics.grammarErrors}</p>
                    <p className="text-gray-400 text-xs md:text-sm">Grammar Errors</p>
                  </div>
                  <div className="bg-gray-700 p-2 md:p-4 rounded-lg text-center">
                    <p className="text-lg md:text-2xl font-bold text-purple-400">{selectedCheck.metrics.punctuationErrors}</p>
                    <p className="text-gray-400 text-xs md:text-sm">Punctuation Errors</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PastGrammar;