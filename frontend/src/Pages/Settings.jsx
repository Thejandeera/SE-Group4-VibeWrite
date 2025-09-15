import React, { useState } from 'react';
import { Camera, Upload, X, User, Mail, MapPin, Globe, FileText } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    location: 'San Francisco, CA',
    website: 'https://johndoe.com',
    bio: 'Content creator and AI writing enthusiast'
  });

  const tabs = ['Profile', 'Preferences', 'Billing', 'Security'];
  const stats = [
    { label: 'Words Written', value: '45,230', icon: '📝', color: 'blue' },
    { label: 'SEO Score Avg', value: '87', icon: '📊', color: 'green' },
    { label: 'Issues Fixed', value: '1,234', icon: '🔧', color: 'purple' },
    { label: 'Days Streak', value: '28', icon: '⚡', color: 'orange' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const StatCard = ({ stat }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:transform hover:scale-105 group">
      <div className="flex items-center justify-between mb-3">
        <div className="text-2xl group-hover:animate-bounce">{stat.icon}</div>
        <div className={`w-2 h-2 rounded-full ${
          stat.color === 'blue' ? 'bg-blue-500' :
          stat.color === 'green' ? 'bg-green-500' :
          stat.color === 'purple' ? 'bg-purple-500' :
          'bg-orange-500'
        }`}></div>
      </div>
      <div className={`text-3xl font-bold mb-1 ${
        stat.color === 'blue' ? 'text-blue-400' :
        stat.color === 'green' ? 'text-green-400' :
        stat.color === 'purple' ? 'text-purple-400' :
        'text-orange-400'
      }`}>
        {stat.value}
      </div>
      <div className="text-gray-400 text-sm">{stat.label}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Profile & Settings
            </h1>
            <p className="text-gray-400 mt-2">Manage your account and preferences</p>
          </div>
          
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} style={{ animationDelay: `${index * 0.1}s` }} className="animate-fade-in-up">
              <StatCard stat={stat} />
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
          <div className="flex border-b border-gray-700/50">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-4 text-center transition-all duration-300 relative overflow-hidden ${
                  activeTab === tab
                    ? 'text-white bg-gray-700/50'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'
                }`}
              >
                {activeTab === tab && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-fade-in"></div>
                )}
                <span className="relative z-10 font-medium">{tab}</span>
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 animate-expand-width"></div>
                )}
              </button>
            ))}
          </div>

          {/* Profile Content */}
          {activeTab === 'Profile' && (
            <div className="p-8 animate-fade-in">
              <div className="flex items-center gap-2 mb-8">
                <User className="w-5 h-5 text-gray-400" />
                <h2 className="text-xl font-semibold">Personal Information</h2>
              </div>

              {/* Profile Photo Section */}
              <div className="flex items-center gap-6 mb-8 p-6 bg-gray-800/30 rounded-2xl border border-gray-700/30">
                <div className="relative group">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center text-2xl font-bold border-2 border-gray-600 group-hover:border-blue-500 transition-all duration-300">
                    JD
                  </div>
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Camera className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Profile Photo</h3>
                  <p className="text-gray-400 text-sm mb-4">Upload a new profile photo or remove the current one</p>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl transition-all duration-300 hover:scale-105 text-sm font-medium">
                      <Upload className="w-4 h-4" />
                      Upload New
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl transition-all duration-300 hover:scale-105 text-sm font-medium">
                      <X className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Full Name</label>
                  <div className="relative">
                    <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300 text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Email Address</label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300 text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Location</label>
                  <div className="relative">
                    <MapPin className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300 text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Website</label>
                  <div className="relative">
                    <Globe className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="space-y-2 mb-8">
                <label className="text-sm font-medium text-gray-300">Bio</label>
                <div className="relative">
                  <FileText className="w-5 h-5 text-gray-400 absolute left-4 top-4" />
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300 text-white placeholder-gray-400 resize-none"
                  />
                </div>
              </div>

              {/* Save Button */}
              <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
                Save Changes
              </button>
            </div>
          )}

          {/* Other Tab Placeholders */}
          {activeTab !== 'Profile' && (
            <div className="p-8 text-center animate-fade-in">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚧</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{activeTab} Settings</h3>
              <p className="text-gray-400">This section is coming soon!</p>
            </div>
          )}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes expand-width {
          from { width: 0; }
          to { width: 100%; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .animate-expand-width {
          animation: expand-width 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}