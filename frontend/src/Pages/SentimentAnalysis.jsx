import React, { useState, useRef } from 'react';
import { Smile, Frown, Meh, Star, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const SentimentAnalysis = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  const analyzeSentiment = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze.');
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch(`${backendUrl}/api/v1/sentiment/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze sentiment.');
      }

      setResult(data);
    } catch (err) {
      console.error('Error analyzing sentiment:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'very positive':
        return <Star className="w-6 h-6 text-yellow-400" />;
      case 'positive':
        return <Smile className="w-6 h-6 text-green-400" />;
      case 'neutral':
        return <Meh className="w-6 h-6 text-gray-400" />;
      case 'negative':
        return <Frown className="w-6 h-6 text-orange-400" />;
      case 'very negative':
        return <ThumbsDown className="w-6 h-6 text-red-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-blue-400" />;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'very positive': return 'border-yellow-500/50 bg-yellow-900/20';
      case 'positive': return 'border-green-500/50 bg-green-900/20';
      case 'neutral': return 'border-gray-500/50 bg-gray-800/20';
      case 'negative': return 'border-orange-500/50 bg-orange-900/20';
      case 'very negative': return 'border-red-500/50 bg-red-900/20';
      default: return 'border-blue-500/50 bg-blue-900/20';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        .gradient-text {
          background: linear-gradient(45deg, #60A5FA, #A78BFA);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
            Sentiment Analyzer
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Discover the emotional tone behind your text.
          </p>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 md:p-6 shadow-2xl border border-gray-800 mb-6 md:mb-8">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to analyze its sentiment..."
            className="w-full h-48 md:h-60 p-3 md:p-4 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 resize-y transition-all duration-300"
            style={{ outline: 'none' }}
          />
          <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
            <p className="text-sm text-gray-400">
              Character count: {text.length}
            </p>
            <button
              onClick={analyzeSentiment}
              disabled={isLoading || !text.trim()}
              className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 font-medium text-white shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </div>
              ) : 'Analyze Sentiment'}
            </button>
          </div>
        </div>

        {error && (
          <div className="animate-fadeIn bg-red-900/30 border border-red-500/50 text-red-300 p-4 rounded-lg text-center">
            {error}
          </div>
        )}

        {result && (
          <div className="animate-fadeIn space-y-6">
            <div className={`text-center p-6 rounded-xl border ${getSentimentColor(result.overallSentiment)}`}>
              <h2 className="text-lg font-semibold text-gray-300 mb-2">Overall Sentiment</h2>
              <div className="flex items-center justify-center gap-3">
                {getSentimentIcon(result.overallSentiment)}
                <p className="text-3xl font-bold">{result.overallSentiment}</p>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-4 md:p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Sentence-by-Sentence Analysis</h3>
              <div className="space-y-4">
                {Object.entries(result.sentenceSentiments).map(([sentence, sentiment], index) => (
                  <div key={index} className={`p-4 rounded-lg border ${getSentimentColor(sentiment)}`}>
                    <p className="text-gray-300 mb-2">"{sentence}"</p>
                    <div className="flex items-center gap-2">
                      {getSentimentIcon(sentiment)}
                      <span className="font-medium">{sentiment}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                <h3 className="font-semibold text-gray-400 mb-1">Original Text</h3>
                <p className="text-gray-300 whitespace-pre-wrap text-sm">{result.originalText}</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                <h3 className="font-semibold text-gray-400 mb-1">Analysis Details</h3>
                <ul className="text-sm space-y-1 text-gray-300">
                  <li><strong>Total Sentences:</strong> {result.totalSentences}</li>
                  <li>
                    <strong>Analyzed At:</strong> {new Date(result.analyzedAt).toLocaleString()}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SentimentAnalysis;