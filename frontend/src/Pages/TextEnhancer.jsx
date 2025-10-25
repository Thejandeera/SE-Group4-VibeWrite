import React, { useState, useEffect } from "react";
import { Wand2, FileText, TrendingUp, Sparkles, Loader2, AlertCircle, CheckCircle, History, Copy, Download, X, Calendar, Clock } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TextEnhancer() {
  const [originalText, setOriginalText] = useState("");
  const [enhancedText, setEnhancedText] = useState("");
  const [selectedOption, setSelectedOption] = useState("formal");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const userDataStr = sessionStorage.getItem("userData");
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        setUserId(userData.id);
      } catch (err) {
        console.error("Failed to parse user data:", err);
        toast.error("Failed to load user data");
      }
    }
  }, []);

  const enhanceWithGemini = async () => {
    if (!originalText.trim()) {
      toast.warning("Please enter some text to enhance");
      return;
    }

    if (!userId) {
      toast.error("User not logged in. Please login first.");
      return;
    }

    setLoading(true);
    setEnhancedText("");

    try {
      let prompt = "";
      
      switch (selectedOption) {
        case "formal":
          prompt = `Transform the following text into a formal, professional version. Maintain the original meaning but use sophisticated vocabulary, proper grammar, and professional tone. Make it suitable for business communication, academic writing, or official documents.

Original text:
"""
${originalText}
"""

Provide ONLY the enhanced formal text without any explanations, labels, or additional commentary.`;
          break;
        
        case "casual":
          prompt = `Transform the following text into a casual, friendly version. Make it conversational, relaxed, and approachable while maintaining clarity. Use everyday language and a warm tone suitable for informal communication.

Original text:
"""
${originalText}
"""

Provide ONLY the enhanced casual text without any explanations, labels, or additional commentary.`;
          break;
        
        case "emphatic":
          prompt = `Transform the following text into an emphatic, powerful version. Make it more impactful, persuasive, and emotionally engaging. Use strong vocabulary, compelling language, and confident tone to make the message more memorable and influential.

Original text:
"""
${originalText}
"""

Provide ONLY the enhanced emphatic text without any explanations, labels, or additional commentary.`;
          break;
        
        default:
          prompt = originalText;
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": GEMINI_API_KEY,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.8,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 8192,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text.trim();
      
      setEnhancedText(aiResponse);
      toast.success("Text enhanced successfully!");
      
      await saveToBackend(aiResponse);
      
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to enhance text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveToBackend = async (enhanced) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/text-enhancements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          normalText: originalText,
          enhancedText: enhanced,
          option: selectedOption,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend save failed: ${response.status}`);
      }

      const savedData = await response.json();
      console.log("Saved to backend:", savedData);
      toast.success("Saved to history!");
    } catch (err) {
      console.error("Backend save error:", err);
      toast.warning("Text enhanced but failed to save to history.");
    }
  };

  const fetchHistory = async () => {
    if (!userId) {
      toast.error("User not logged in");
      return;
    }

    setLoadingHistory(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/text-enhancements/user/${userId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch history: ${response.status}`);
      }

      const data = await response.json();
      setHistory(data);
      setShowHistory(true);
      toast.success(`Loaded ${data.length} enhancement${data.length !== 1 ? 's' : ''}`);
    } catch (err) {
      console.error("Error fetching history:", err);
      toast.error("Failed to load history. Please try again.");
    } finally {
      setLoadingHistory(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const downloadAsText = (text, filename) => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Downloaded successfully!");
  };

  const loadFromHistory = (item) => {
    setOriginalText(item.normalText);
    setEnhancedText(item.enhancedText);
    setSelectedOption(item.option);
    setShowHistory(false);
    toast.info("Loaded from history");
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 p-4 sm:p-6 lg:p-8">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Text Enhancer
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">Transform your text with AI-powered enhancement</p>
          </div>
          <button
            onClick={fetchHistory}
            disabled={loadingHistory}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:opacity-90 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loadingHistory ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <History size={18} />
            )}
            <span className="hidden sm:inline">Enhancement History</span>
            <span className="sm:hidden">History</span>
          </button>
        </div>

        {/* Enhancement Options */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-200 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles size={20} className="text-blue-600" /> 
            <span>Enhancement Style</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <button
              onClick={() => setSelectedOption("formal")}
              className={`p-4 sm:p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                selectedOption === "formal"
                  ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                  : "border-gray-300 bg-white hover:border-blue-300"
              }`}
            >
              <div className="flex items-center justify-center mb-2 sm:mb-3">
                <FileText size={28} className={selectedOption === "formal" ? "text-blue-600" : "text-gray-500"} />
              </div>
              <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">Formal</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Professional, sophisticated, business-appropriate
              </p>
            </button>

            <button
              onClick={() => setSelectedOption("casual")}
              className={`p-4 sm:p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                selectedOption === "casual"
                  ? "border-purple-500 bg-purple-50 shadow-lg scale-105"
                  : "border-gray-300 bg-white hover:border-purple-300"
              }`}
            >
              <div className="flex items-center justify-center mb-2 sm:mb-3">
                <Wand2 size={28} className={selectedOption === "casual" ? "text-purple-600" : "text-gray-500"} />
              </div>
              <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">Casual</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Friendly, conversational, relaxed tone
              </p>
            </button>

            <button
              onClick={() => setSelectedOption("emphatic")}
              className={`p-4 sm:p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                selectedOption === "emphatic"
                  ? "border-pink-500 bg-pink-50 shadow-lg scale-105"
                  : "border-gray-300 bg-white hover:border-pink-300"
              }`}
            >
              <div className="flex items-center justify-center mb-2 sm:mb-3">
                <TrendingUp size={28} className={selectedOption === "emphatic" ? "text-pink-600" : "text-gray-500"} />
              </div>
              <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">Emphatic</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Powerful, persuasive, impactful language
              </p>
            </button>
          </div>
        </div>

        {/* Text Input/Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {/* Original Text */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <FileText size={20} className="text-blue-600" /> 
              <span>Original Text</span>
            </h2>
            <textarea
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              className="w-full h-64 sm:h-80 lg:h-96 p-3 sm:p-4 rounded-xl bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 resize-none text-sm sm:text-base"
              placeholder="Enter your text here to enhance..."
            ></textarea>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-4">
              <p className="text-xs sm:text-sm text-gray-600">
                {originalText.length} characters • {originalText.split(/\s+/).filter(w => w).length} words
              </p>
              <button
                onClick={enhanceWithGemini}
                disabled={loading || !originalText.trim()}
                className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Enhancing...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Enhance Text
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Enhanced Text */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-6 rounded-2xl shadow-lg border border-blue-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <Sparkles size={20} className="text-purple-600" /> 
              <span>Enhanced Text</span>
            </h2>
            <div className="w-full h-64 sm:h-80 lg:h-96 p-3 sm:p-4 rounded-xl bg-white text-gray-800 border border-purple-300 overflow-y-auto text-sm sm:text-base">
              {enhancedText ? (
                <p className="whitespace-pre-wrap leading-relaxed">{enhancedText}</p>
              ) : (
                <p className="text-gray-400 italic">Enhanced text will appear here...</p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-4">
              <p className="text-xs sm:text-sm text-gray-600">
                {enhancedText.length} characters • {enhancedText.split(/\s+/).filter(w => w).length} words
              </p>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => copyToClipboard(enhancedText)}
                  disabled={!enhancedText}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                >
                  <Copy size={16} />
                  <span className="hidden sm:inline">Copy</span>
                </button>
                <button
                  onClick={() => downloadAsText(enhancedText, `enhanced-text-${selectedOption}.txt`)}
                  disabled={!enhancedText}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* History Modal */}
        {showHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-fadeIn">
              <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-purple-50 to-pink-50">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <History size={24} className="text-purple-600" />
                  <span>Enhancement History</span>
                </h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {history.length === 0 ? (
                  <div className="text-center py-12">
                    <History size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">No enhancement history found</p>
                    <p className="text-gray-400 text-sm mt-2">Start enhancing text to build your history</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="bg-gradient-to-br from-gray-50 to-white p-4 sm:p-5 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all cursor-pointer transform hover:scale-[1.02]"
                        onClick={() => loadFromHistory(item)}
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                              item.option === "formal" ? "bg-blue-100 text-blue-700" :
                              item.option === "casual" ? "bg-purple-100 text-purple-700" :
                              "bg-pink-100 text-pink-700"
                            }`}>
                              {item.option}
                            </span>
                            {item.option === "formal" && <FileText size={16} className="text-blue-600" />}
                            {item.option === "casual" && <Wand2 size={16} className="text-purple-600" />}
                            {item.option === "emphatic" && <TrendingUp size={16} className="text-pink-600" />}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>{formatDate(item.timestamp)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              <span>{formatTime(item.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Original</p>
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {item.normalText}
                            </p>
                          </div>
                          
                          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-3 rounded-lg border border-purple-200">
                            <p className="text-xs font-semibold text-purple-600 mb-1 uppercase tracking-wide">Enhanced</p>
                            <p className="text-sm text-gray-800 line-clamp-2 font-medium">
                              {item.enhancedText}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500">
                            Click to load this enhancement
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}   