import React, { useState } from "react";
import { BarChart2, FileText, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SEOTools() {
  const [content, setContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [keywords, setKeywords] = useState([]);

  // Example starter data
  const keywordData = [
    { keyword: "AI", count: 4 },
    { keyword: "writing", count: 3 },
    { keyword: "SEO", count: 2 },
    { keyword: "content", count: 2 },
  ];

  const handleAnalyze = () => {
    const words = content.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const total = words.length;
    setWordCount(total);

    // Count frequency
    const freq = {};
    words.forEach((w) => {
      freq[w] = (freq[w] || 0) + 1;
    });

    // Convert to array with density %
    const result = Object.entries(freq).map(([keyword, count]) => ({
      keyword,
      count,
      density: ((count / total) * 100).toFixed(1),
    }));

    setKeywords(result);
  };

  return (
    <div className="flex-1 bg-[#0B0F19] text-gray-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-400">SEO Tools</h1>
        <button className="px-4 py-2 rounded-md bg-gradient-to-r from-pink-500 to-purple-600 font-medium hover:opacity-90 transition">
          Past SEO Reports
        </button>
      </div>

      {/* Content Analyzer */}
      <div className="bg-[#111827] p-6 rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
          <FileText size={18} /> Content Analyzer
        </h2>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-48 p-4 rounded-lg bg-[#1F2937] text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Paste your content here for SEO analysis..."
        ></textarea>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleAnalyze}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition"
          >
            Analyze SEO
          </button>
        </div>
      </div>

      {/* Quick Insights + Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Quick Insights */}
        <div className="bg-[#111827] p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <BarChart2 size={18} /> Quick Insights
          </h2>

          <ul className="space-y-3 text-sm mb-6">
            <li className="flex justify-between border-b border-gray-700 pb-2">
              <span className="text-gray-400">Word Count</span>
              <span className="font-bold text-blue-400">{wordCount}</span>
            </li>
            <li className="flex justify-between border-b border-gray-700 pb-2">
              <span className="text-gray-400">Keyword Density</span>
              <span className="font-bold text-blue-400">
                {keywords.length > 0 ? `${keywords[0].density}%` : "--%"}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-400">Readability Score</span>
              <span className="font-bold text-blue-400">--</span>
            </li>
          </ul>

          {/* Keyword Frequency Table (SCRUM-22) */}
          {keywords.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-2">
                Keyword Frequency Table
              </h3>
              <table className="w-full text-sm border border-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-[#1F2937] text-gray-300">
                  <tr>
                    <th className="p-2 text-left">Keyword</th>
                    <th className="p-2 text-right">Count</th>
                    <th className="p-2 text-right">Density</th>
                  </tr>
                </thead>
                <tbody>
                  {keywords.map((k) => (
                    <tr
                      key={k.keyword}
                      className="border-t border-gray-700 hover:bg-[#1F2937]"
                    >
                      <td className="p-2">{k.keyword}</td>
                      <td className="p-2 text-right">{k.count}</td>
                      <td className="p-2 text-right">{k.density}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Chart */}
          <h3 className="text-sm font-semibold text-gray-300 mt-6 mb-2">
            Keyword Frequency Chart
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={keywords.length > 0 ? keywords : keywordData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="keyword" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #374151",
                    color: "#F9FAFB",
                  }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SEO Suggestions */}
        <div className="bg-[#111827] p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <TrendingUp size={18} /> SEO Suggestions
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm">
            <li>Use more H1 and H2 headings.</li>
            <li>Add meta description for better CTR.</li>
            <li>Increase keyword usage naturally.</li>
            <li>Improve internal linking structure.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
