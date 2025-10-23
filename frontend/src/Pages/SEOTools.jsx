import React, { useState, useEffect } from "react";
import { BarChart2, FileText, TrendingUp, Sparkles, Loader2, AlertCircle, CheckCircle, XCircle, X } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from "recharts";

export default function SEOTools() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [userId, setUserId] = useState(null);
  const [showPastReports, setShowPastReports] = useState(false);
  const [pastReports, setPastReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportDetails, setShowReportDetails] = useState(false);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Get userId from sessionStorage on component mount
  useEffect(() => {
    try {
      const userDataStr = sessionStorage.getItem("userData");
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        setUserId(userData.id);
      } else {
        setError("User not logged in. Please log in to use SEO tools.");
      }
    } catch (err) {
      console.error("Error reading userData from sessionStorage:", err);
      setError("Failed to retrieve user information.");
    }
  }, []);

  const fetchPastReports = async () => {
    if (!userId) {
      setError("User not logged in. Please log in to view past reports.");
      return;
    }

    setLoadingReports(true);
    try {
      const response = await fetch(`${backendUrl}/api/analyze/seo/user/${userId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch reports: ${response.status}`);
      }
      const reports = await response.json();
      setPastReports(reports);
    } catch (err) {
      console.error("Error fetching past reports:", err);
      setError("Failed to load past SEO reports.");
    } finally {
      setLoadingReports(false);
    }
  };

  const openPastReports = () => {
    setShowPastReports(true);
    fetchPastReports();
  };

  const closePastReports = () => {
    setShowPastReports(false);
    setSelectedReport(null);
    setShowReportDetails(false);
  };

  const openReportDetails = (report) => {
    setSelectedReport(report);
    setShowReportDetails(true);
  };

  const closeReportDetails = () => {
    setSelectedReport(null);
    setShowReportDetails(false);
  };

  const analyzeWithGemini = async () => {
    if (!content.trim()) {
      setError("Please enter some content to analyze");
      return;
    }
    if (!userId) {
      setError("User not logged in. Please log in to analyze content.");
      return;
    }
    setLoading(true);
    setError("");
    setAnalysis(null);
    try {
      const prompt = `You are an expert SEO analyst. Analyze the following content and provide a comprehensive SEO report in JSON format.
                      Content to analyze:
                      """
                      ${content}
                      """
                      Provide your analysis in the following JSON structure (respond ONLY with valid JSON, no markdown or code blocks):
                      {
                        "wordCount": number,
                        "characterCount": number,
                        "readabilityScore": number (0-100),
                        "seoScore": number (0-100),
                        "keywords": [
                          {"keyword": "string", "count": number, "density": "string (e.g., '2.5')"}
                        ],
                        "topKeywords": [
                          {"keyword": "string", "count": number, "relevance": number (0-100)}
                        ],
                        "suggestions": [
                          {"type": "success|warning|error", "message": "string"}
                        ],
                        "metaAnalysis": {
                          "titleQuality": number (0-100),
                          "keywordOptimization": number (0-100),
                          "contentStructure": number (0-100),
                          "readability": number (0-100),
                          "linkPotential": number (0-100)
                        },
                        "sentimentAnalysis": {
                          "tone": "string (e.g., professional, casual, formal)",
                          "sentiment": "positive|neutral|negative",
                          "score": number (0-100)
                        },
                        "improvements": [
                          "string array of specific improvement recommendations"
                        ]
                      }`;
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
              temperature: 0.7,
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
      const aiResponse = data.candidates[0].content.parts[0].text;
      
      // Clean the response - remove markdown code blocks if present
      let cleanedResponse = aiResponse.trim();
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      } else if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.replace(/```\n?/g, "");
      }
      
      const analysisData = JSON.parse(cleanedResponse);
      setAnalysis(analysisData);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to analyze content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle size={16} className="text-green-500" />;
      case "warning":
        return <AlertCircle size={16} className="text-yellow-500" />;
      case "error":
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <AlertCircle size={16} className="text-blue-500" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const saveToBackend = async () => {
    if (!analysis) return;
    if (!userId) {
      setSaveError("User not logged in. Please log in to save reports.");
      return;
    }
    setSaving(true);
    setSaveError("");
    const documentId = `doc-${Date.now()}`;
    const dto = {
      documentId,
      userId,  // Include userId from sessionStorage
      content,
      seoScore: analysis.seoScore,
      readabilityScore: analysis.readabilityScore,
      wordCount: analysis.wordCount,
      sentimentLabel: analysis.sentimentAnalysis?.sentiment?.toUpperCase(),
      keywordDensity: Object.fromEntries(
        (analysis.keywords || []).slice(0, 20).map(k => [k.keyword, parseFloat(String(k.density).replace('%', ''))])
      ),
      performanceMetrics: {
        titleQuality: analysis.metaAnalysis?.titleQuality,
        keywordOptimization: analysis.metaAnalysis?.keywordOptimization,
        contentStructure: analysis.metaAnalysis?.contentStructure,
        readability: analysis.metaAnalysis?.readability,
        linkPotential: analysis.metaAnalysis?.linkPotential
      },
      aiSuggestions: (analysis.suggestions || []).map(s => s.message),
      recommendations: analysis.improvements || [],
      metaDescription: null
    };
    try {
      const res = await fetch(`${backendUrl}/api/analyze/seo/client`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto)
      });
      console.log(res);
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Save failed: ${res.status} ${text}`);
      }
      // show success modal
      setSaveSuccess(true);
      // auto-hide after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Save error:", err);
      setSaveError("Failed to save SEO report. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Helper function to format date from documentId
  const formatDateFromDocId = (docId) => {
    const timestamp = docId.replace('doc-', '');
    const date = new Date(parseInt(timestamp));
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI-Powered SEO Analyzer
            </h1>
            <p className="text-gray-600 mt-2">Powered by Google Gemini AI</p>
          </div>
          <button 
            onClick={openPastReports}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:opacity-90 transition shadow-lg"
          >
            Past SEO Reports
          </button>
        </div>
        {/* Content Analyzer */}
        <div className="bg-gray-50 p-6 rounded-2xl shadow-lg border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-blue-600" /> Content Analyzer
          </h2>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-56 p-4 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 resize-none"
            placeholder="Paste your content here for advanced AI-powered SEO analysis..."
          ></textarea>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center gap-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}
          <div className="flex justify-end mt-4">
            <button
              onClick={analyzeWithGemini}
              disabled={loading || !userId}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Analyze with AI
                </>
              )}
            </button>
          </div>
        </div>
        {/* Analysis Results */}
        {analysis && (
          <>
            {/* Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 shadow-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-gray-600 text-sm">SEO Score</h3>
                  <BarChart2 size={20} className="text-blue-600" />
                </div>
                <div className={`text-4xl font-bold ${getScoreColor(analysis.seoScore)}`}>
                  {analysis.seoScore}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div
                    className={`h-2 rounded-full ${getScoreBgColor(analysis.seoScore)}`}
                    style={{ width: `${analysis.seoScore}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 shadow-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-gray-600 text-sm">Readability</h3>
                  <FileText size={20} className="text-purple-600" />
                </div>
                <div className={`text-4xl font-bold ${getScoreColor(analysis.readabilityScore)}`}>
                  {analysis.readabilityScore}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div
                    className={`h-2 rounded-full ${getScoreBgColor(analysis.readabilityScore)}`}
                    style={{ width: `${analysis.readabilityScore}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 shadow-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-gray-600 text-sm">Word Count</h3>
                  <FileText size={20} className="text-green-600" />
                </div>
                <div className="text-4xl font-bold text-green-600">
                  {analysis.wordCount}
                </div>
                <p className="text-gray-600 text-sm mt-2">{analysis.characterCount} characters</p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-2xl border border-pink-200 shadow-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-gray-600 text-sm">Sentiment</h3>
                  <TrendingUp size={20} className="text-pink-600" />
                </div>
                <div className="text-2xl font-bold text-pink-600 capitalize">
                  {analysis.sentimentAnalysis.sentiment}
                </div>
                <p className="text-gray-600 text-sm mt-2 capitalize">{analysis.sentimentAnalysis.tone}</p>
              </div>
            </div>
            {/* Main Analysis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Keyword Analysis */}
              <div className="bg-gray-50 p-6 rounded-2xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart2 size={20} className="text-blue-600" /> Keyword Analysis
                </h2>
                
                {analysis.keywords.length > 0 && (
                  <>
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        Top Keywords by Frequency
                      </h3>
                      <table className="w-full text-sm border border-gray-300 rounded-lg overflow-hidden">
                        <thead className="bg-gray-100 text-gray-700">
                          <tr>
                            <th className="p-3 text-left">Keyword</th>
                            <th className="p-3 text-right">Count</th>
                            <th className="p-3 text-right">Density</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analysis.keywords.slice(0, 10).map((k, idx) => (
                            <tr
                              key={idx}
                              className="border-t border-gray-200 hover:bg-gray-100 transition"
                            >
                              <td className="p-3 text-gray-800">{k.keyword}</td>
                              <td className="p-3 text-right font-semibold text-blue-600">{k.count}</td>
                              <td className="p-3 text-right text-purple-600">{k.density}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Keyword Distribution Chart
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analysis.topKeywords.slice(0, 8)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#D1D5DB" />
                          <XAxis dataKey="keyword" stroke="#4B5563" angle={-45} textAnchor="end" height={80} />
                          <YAxis stroke="#4B5563" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#ffffff",
                              border: "1px solid #D1D5DB",
                              borderRadius: "8px",
                              color: "#111827",
                            }}
                          />
                          <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                )}
              </div>
              {/* Meta Analysis Radar */}
              <div className="bg-gray-50 p-6 rounded-2xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp size={20} className="text-purple-600" /> SEO Performance Metrics
                </h2>
                
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={[
                      { metric: "Title Quality", value: analysis.metaAnalysis.titleQuality },
                      { metric: "Keywords", value: analysis.metaAnalysis.keywordOptimization },
                      { metric: "Structure", value: analysis.metaAnalysis.contentStructure },
                      { metric: "Readability", value: analysis.metaAnalysis.readability },
                      { metric: "Link Potential", value: analysis.metaAnalysis.linkPotential }
                    ]}>
                      <PolarGrid stroke="#D1D5DB" />
                      <PolarAngleAxis dataKey="metric" stroke="#4B5563" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#4B5563" />
                      <Radar name="Score" dataKey="value" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.6} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {Object.entries(analysis.metaAnalysis).map(([key, value]) => (
                    <div key={key} className="bg-white p-3 rounded-lg border border-gray-200">
                      <p className="text-gray-600 text-xs capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className={`text-2xl font-bold ${getScoreColor(value)}`}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Suggestions and Improvements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Suggestions */}
              <div className="bg-gray-50 p-6 rounded-2xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles size={20} className="text-yellow-600" /> AI Suggestions
                </h2>
                <div className="space-y-3">
                  {analysis.suggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                    >
                      {getSuggestionIcon(suggestion.type)}
                      <p className="text-sm text-gray-700 flex-1">{suggestion.message}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Improvement Recommendations */}
              <div className="bg-gray-50 p-6 rounded-2xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp size={20} className="text-green-600" /> Improvement Recommendations
                </h2>
                <ul className="space-y-3">
                  {analysis.improvements.map((improvement, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-gray-700 p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                    >
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span className="flex-1">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-8 flex flex-col items-center gap-3">
              <div className="w-full max-w-2xl">
                <button
                  type="button"
                  onClick={saveToBackend}
                  disabled={!analysis || saving || !userId}
                  className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium shadow-lg hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save SEO Report"
                  )}
                </button>
              </div>
              {saveError && (
                <div className="mt-2 w-full max-w-2xl p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span className="text-sm">{saveError}</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Save Success Modal */}
      {saveSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
            <div className="mx-auto mb-3 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="text-green-600" size={22} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">SEO Report Saved</h3>
            <p className="text-gray-600 mt-1">Your analysis has been stored successfully.</p>
          </div>
        </div>
      )}

      {/* Past SEO Reports Modal */}
      {showPastReports && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden mx-4">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Past SEO Reports
              </h2>
              <button
                onClick={closePastReports}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {loadingReports ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 size={32} className="animate-spin text-blue-600" />
                  <span className="ml-3 text-gray-600">Loading reports...</span>
                </div>
              ) : pastReports.length === 0 ? (
                <div className="text-center py-12">
                  <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Reports Found</h3>
                  <p className="text-gray-500">You haven't saved any SEO reports yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastReports.map((report, index) => (
                    <div
                      key={report.documentId}
                      className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition cursor-pointer"
                      onClick={() => openReportDetails(report)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className={`text-3xl font-bold ${getScoreColor(report.score)}`}>
                          {Math.round(report.score)}
                        </div>
                        <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                          {formatDateFromDocId(report.documentId)}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Content Preview</p>
                          <p className="text-sm text-gray-800 line-clamp-3">
                            {report.content.substring(0, 100)}...
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Top Keywords</p>
                          <div className="flex flex-wrap gap-1">
                            {report.keywords.slice(0, 3).map((keyword, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                              >
                                {keyword.term}
                              </span>
                            ))}
                            {report.keywords.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{report.keywords.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {report.recommendations && report.recommendations.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Recommendations</p>
                            <p className="text-xs text-gray-700 line-clamp-2">
                              {report.recommendations[0]}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Report Details Modal */}
      {showReportDetails && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden mx-4">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Report Details
              </h2>
              <button
                onClick={closeReportDetails}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Score Overview */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">SEO Score</h3>
                  <div className={`text-5xl font-bold text-center ${getScoreColor(selectedReport.score)} mb-4`}>
                    {Math.round(selectedReport.score)}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${getScoreBgColor(selectedReport.score)}`}
                      style={{ width: `${selectedReport.score}%` }}
                    ></div>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Report Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Document ID</p>
                      <p className="text-sm font-medium text-gray-800">{selectedReport.documentId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Created</p>
                      <p className="text-sm font-medium text-gray-800">
                        {formatDateFromDocId(selectedReport.documentId)}
                      </p>
                    </div>
                    {selectedReport.wordCount && (
                      <div>
                        <p className="text-sm text-gray-600">Word Count</p>
                        <p className="text-sm font-medium text-gray-800">{selectedReport.wordCount}</p>
                      </div>
                    )}
                    {selectedReport.sentimentLabel && (
                      <div>
                        <p className="text-sm text-gray-600">Sentiment</p>
                        <p className="text-sm font-medium text-gray-800 capitalize">
                          {selectedReport.sentimentLabel.toLowerCase()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Content</h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200 max-h-40 overflow-y-auto">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedReport.content}</p>
                </div>
              </div>

              {/* Keywords */}
              {selectedReport.keywords && selectedReport.keywords.length > 0 && (
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedReport.keywords.map((keyword, idx) => (
                      <div
                        key={idx}
                        className="bg-white px-3 py-2 rounded-lg border border-gray-200 flex items-center gap-2"
                      >
                        <span className="text-sm font-medium text-gray-800">{keyword.term}</span>
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                          {keyword.score.toFixed(3)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {selectedReport.recommendations && selectedReport.recommendations.length > 0 && (
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommendations</h3>
                  <ul className="space-y-2">
                    {selectedReport.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                        <span className="text-green-600 font-bold mt-0.5">•</span>
                        <span className="flex-1">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* AI Suggestions */}
              {selectedReport.aiSuggestions && selectedReport.aiSuggestions.length > 0 && (
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Suggestions</h3>
                  <div className="space-y-2">
                    {selectedReport.aiSuggestions.map((suggestion, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200"
                      >
                        <Sparkles size={16} className="text-yellow-600 mt-0.5" />
                        <p className="text-sm text-gray-700 flex-1">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}