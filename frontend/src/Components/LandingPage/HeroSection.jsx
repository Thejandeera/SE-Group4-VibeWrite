import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
    const navigate = useNavigate();
  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8  pt-35 py-12 relative overflow-hidden">
      
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-50"></div>
      
    
      <div className="relative z-10 mb-8 sm:mb-12">
        <div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-4 py-2 text-sm">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-gray-300">Powered by Advanced AI</span>
        </div>
      </div>

     
      <div className="relative z-10 text-center max-w-5xl mx-auto mb-6 sm:mb-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
            Your AI Writing Assistant for
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
            Clarity, Tone & SEO
          </span>
        </h1>
      </div>

     
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
          Create compelling content with AI-powered suggestions, real-time SEO optimization, 
          and advanced grammar checking. Write better, faster, and with confidence.
        </p>
      </div>

      
      <div className="relative z-10 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12 sm:mb-16">
        <button onClick={() => navigate("/signin")} className="group bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 flex items-center space-x-2 w-full sm:w-auto justify-center">
          <span>Sign In</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
        <button onClick={() => navigate("/get-started")} className="bg-transparent border border-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-800/50 transition-all duration-200 w-full sm:w-auto">
          Try Now
        </button>
      </div>

      
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden shadow-2xl">
        
          <div className="bg-gray-700/80 px-4 py-3 flex items-center space-x-2">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
          
        
          <div className="p-6 space-y-4">
          
            <div className="flex flex-wrap items-center space-x-1 sm:space-x-2 pb-4 border-b border-gray-600/50">
              {['B', 'I', 'U'].map((item, index) => (
                <button key={index} className="w-8 h-8 bg-gray-600 hover:bg-gray-500 rounded text-sm font-semibold transition-colors duration-200">
                  {item}
                </button>
              ))}
              <div className="w-px h-6 bg-gray-600 mx-2"></div>
              <div className="flex space-x-1">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <div className="w-4 h-4 bg-green-500 rounded"></div>
              </div>
            </div>
            
           
            <div className="space-y-3">
             
              <div className="space-y-2">
                <div className="h-4 bg-gray-600 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-600 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-600 rounded w-4/5 animate-pulse"></div>
              </div>
              
            
              <div className="relative">
                <div className="h-4 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded w-3/4 border border-blue-500/50"></div>
                <div className="absolute right-0 top-0 w-1 h-4 bg-blue-500 rounded animate-pulse"></div>
              </div>
              
        
              <div className="space-y-2">
                <div className="h-4 bg-gray-600 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-600 rounded w-2/3 animate-pulse"></div>
              </div>
            </div>
            
           
            <div className="relative">
              <div className="absolute right-0 top-0 bg-gray-700/90 backdrop-blur-sm border border-gray-600/50 rounded-lg p-3 shadow-xl min-w-64">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-purple-400">AI Suggestion</span>
                </div>
                <div className="space-y-1">
                  <div className="h-2 bg-gray-600 rounded w-full"></div>
                  <div className="h-2 bg-gray-600 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}