import React, { useState, useCallback, useMemo } from 'react';
import { 
  Camera, Upload, X, User, Mail, MapPin, Globe, FileText, 
  Settings, Moon, Languages, Save, Bell, CreditCard, Shield,
  Lock, Smartphone, Monitor, Download, AlertTriangle
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    location: 'San Francisco, CA',
    website: 'https://johndoe.com',
    bio: 'Content creator and AI writing enthusiast'
  });

  // Preferences state
  const [preferences, setPreferences] = useState({
    darkMode: true,
    language: 'English',
    autoSave: true,
    seoAlerts: true,
    grammarChecks: true,
    systemUpdates: false,
    weeklyReports: true,
    promotionalEmails: false
  });

  // Security state
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const tabs = useMemo(() => ['Profile', 'Preferences', 'Billing', 'Security'], []);
  
  const stats = useMemo(() => [
    { label: 'Words Written', value: '45,230', icon: '📝', color: 'blue' },
    { label: 'SEO Score Avg', value: '87', icon: '📊', color: 'green' },
    { label: 'Issues Fixed', value: '1,234', icon: '🔧', color: 'purple' },
    { label: 'Days Streak', value: '28', icon: '⚡', color: 'orange' }
  ], []);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handlePreferenceChange = useCallback((field, value) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSecurityChange = useCallback((field, value) => {
    setSecurity(prev => ({ ...prev, [field]: value }));
  }, []);

  const StatCard = React.memo(({ stat }) => {
    const colorClasses = useMemo(() => ({
      blue: { bg: 'bg-blue-500', text: 'text-blue-400' },
      green: { bg: 'bg-green-500', text: 'text-green-400' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-400' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-400' }
    }), []);

    const currentColor = colorClasses[stat.color];

    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:transform hover:scale-105 group">
        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl group-hover:animate-bounce">{stat.icon}</div>
          <div className={`w-2 h-2 rounded-full ${currentColor.bg}`}></div>
        </div>
        <div className={`text-3xl font-bold mb-1 ${currentColor.text}`}>
          {stat.value}
        </div>
        <div className="text-gray-400 text-sm">{stat.label}</div>
      </div>
    );
  });

  const Toggle = React.memo(({ enabled, onChange, size = 'default' }) => {
    const sizeClasses = size === 'small' ? 'w-10 h-6' : 'w-12 h-7';
    const thumbClasses = size === 'small' ? 'w-4 h-4' : 'w-5 h-5';
    const translateClass = size === 'small' 
      ? (enabled ? 'translate-x-4' : 'translate-x-1')
      : (enabled ? 'translate-x-5' : 'translate-x-1');
    
    return (
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex ${sizeClasses} items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
          enabled ? 'bg-blue-600' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block ${thumbClasses} transform transition-transform duration-300 bg-white rounded-full shadow-lg ${translateClass}`}
        />
      </button>
    );
  });

  const ProfileComponent = React.memo(() => (
    <div className="p-8 animate-fade-in">
      <div className="flex items-center gap-2 mb-8">
        <User className="w-5 h-5 text-gray-400" />
        <h2 className="text-xl font-semibold">Personal Information</h2>
      </div>
      
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

      <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
        Save Changes
      </button>
    </div>
  ));

  const PreferencesComponent = React.memo(() => {
    const notificationItems = useMemo(() => [
      { key: 'seoAlerts', title: 'SEO Alerts', description: 'Get notified when your SEO score improves' },
      { key: 'grammarChecks', title: 'Grammar Checks', description: 'Receive alerts for grammar issues' },
      { key: 'systemUpdates', title: 'System Updates', description: 'Notifications about new features' },
      { key: 'weeklyReports', title: 'Weekly Reports', description: 'Weekly summary of your writing activity' },
      { key: 'promotionalEmails', title: 'Promotional Emails', description: 'Marketing emails and special offers' }
    ], []);

    return (
      <div className="p-8 animate-fade-in">
        <div className="flex items-center gap-2 mb-8">
          <Settings className="w-5 h-5 text-gray-400" />
          <h2 className="text-xl font-semibold">App Preferences</h2>
        </div>

        <div className="space-y-6 mb-8">
          <div className="flex items-center justify-between p-6 bg-gray-800/30 rounded-2xl border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300">
            <div className="flex items-center gap-4">
              <Moon className="w-6 h-6 text-gray-400" />
              <div>
                <h3 className="font-semibold">Dark Mode</h3>
                <p className="text-gray-400 text-sm">Toggle dark mode theme</p>
              </div>
            </div>
            <Toggle 
              enabled={preferences.darkMode} 
              onChange={(value) => handlePreferenceChange('darkMode', value)} 
            />
          </div>

          <div className="flex items-center justify-between p-6 bg-gray-800/30 rounded-2xl border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300">
            <div className="flex items-center gap-4">
              <Languages className="w-6 h-6 text-gray-400" />
              <div>
                <h3 className="font-semibold">Language</h3>
                <p className="text-gray-400 text-sm">Choose your preferred language</p>
              </div>
            </div>
            <select 
              value={preferences.language}
              onChange={(e) => handlePreferenceChange('language', e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-6 bg-gray-800/30 rounded-2xl border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300">
            <div className="flex items-center gap-4">
              <Save className="w-6 h-6 text-gray-400" />
              <div>
                <h3 className="font-semibold">Auto-save</h3>
                <p className="text-gray-400 text-sm">Automatically save your work</p>
              </div>
            </div>
            <Toggle 
              enabled={preferences.autoSave} 
              onChange={(value) => handlePreferenceChange('autoSave', value)} 
            />
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-gray-400" />
            <h2 className="text-xl font-semibold">Notification Settings</h2>
          </div>
          <div className="space-y-4">
            {notificationItems.map((item) => (
              <div key={item.key} className="flex items-center justify-between py-4 border-b border-gray-700/50 last:border-0">
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
                <Toggle 
                  enabled={preferences[item.key]} 
                  onChange={(value) => handlePreferenceChange(item.key, value)}
                  size="small"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  });

  const BillingComponent = React.memo(() => {
    const billingHistory = useMemo(() => [
      { date: 'Feb 15, 2025', description: 'Monthly subscription', amount: '$19.00', status: 'Paid' },
      { date: 'Jan 15, 2025', description: 'Monthly subscription', amount: '$19.00', status: 'Paid' },
      { date: 'Dec 15, 2024', description: 'Monthly subscription', amount: '$19.00', status: 'Paid' }
    ], []);

    return (
      <div className="p-8 animate-fade-in">
        <div className="flex items-center gap-2 mb-8">
          <CreditCard className="w-5 h-5 text-gray-400" />
          <h2 className="text-xl font-semibold">Subscription Plan</h2>
        </div>

        <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-2xl p-6 border border-yellow-500/30 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-xl">👑</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Pro Plan</h3>
                <p className="text-gray-300">$19/month • Renews on March 15, 2025</p>
              </div>
            </div>
            <div className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30">
              Active
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Current billing period usage</h3>
            <span className="text-blue-400 font-medium">68% used</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '68%' }}></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">850 / 1000</div>
              <div className="text-gray-400 text-sm">AI Suggestions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">245 / 500</div>
              <div className="text-gray-400 text-sm">Grammar Checks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">32 / 100</div>
              <div className="text-gray-400 text-sm">SEO Analysis</div>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium transition-all duration-300 hover:scale-105">
              Change Plan
            </button>
            <button className="flex-1 py-3 bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30 rounded-xl font-medium transition-all duration-300 hover:scale-105">
              Cancel Subscription
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-6">Billing History</h3>
          <div className="space-y-4">
            {billingHistory.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300">
                <div>
                  <div className="font-medium">{item.date}</div>
                  <div className="text-gray-400 text-sm">{item.description}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold">{item.amount}</span>
                  <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded text-xs font-medium border border-green-500/30">
                    {item.status}
                  </span>
                  <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200">
                    <Download className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  });

  const SecurityComponent = React.memo(() => {
    const activeSessions = useMemo(() => [
      { device: 'MacBook Pro', location: 'San Francisco, CA', status: 'Active now', current: true },
      { device: 'iPhone 15', location: 'San Francisco, CA', status: '2 hours ago', current: false },
      { device: 'Chrome Browser', location: 'New York, NY', status: '3 days ago', current: false }
    ], []);

    const getDeviceIcon = (device) => {
      if (device.includes('MacBook')) return <Monitor className="w-5 h-5 text-gray-400" />;
      if (device.includes('iPhone')) return <Smartphone className="w-5 h-5 text-gray-400" />;
      if (device.includes('Chrome')) return <Globe className="w-5 h-5 text-gray-400" />;
      return <Monitor className="w-5 h-5 text-gray-400" />;
    };

    return (
      <div className="p-8 animate-fade-in">
        <div className="flex items-center gap-2 mb-8">
          <Shield className="w-5 h-5 text-gray-400" />
          <h2 className="text-xl font-semibold">Security Settings</h2>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between p-6 bg-gray-800/30 rounded-2xl border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 mb-6">
            <div className="flex items-center gap-4">
              <Lock className="w-6 h-6 text-gray-400" />
              <div>
                <h3 className="font-semibold">Two-Factor Authentication</h3>
                <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
              </div>
            </div>
            <Toggle 
              enabled={security.twoFactorAuth} 
              onChange={(value) => handleSecurityChange('twoFactorAuth', value)} 
            />
          </div>

          <div className="bg-gray-800/30 rounded-2xl border border-gray-700/30 p-6">
            <h3 className="font-semibold mb-6">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-2">Current password</label>
                <input
                  type="password"
                  value={security.currentPassword}
                  onChange={(e) => handleSecurityChange('currentPassword', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300 text-white placeholder-gray-400"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-2">New password</label>
                <input
                  type="password"
                  value={security.newPassword}
                  onChange={(e) => handleSecurityChange('newPassword', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300 text-white placeholder-gray-400"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-2">Confirm new password</label>
                <input
                  type="password"
                  value={security.confirmPassword}
                  onChange={(e) => handleSecurityChange('confirmPassword', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300 text-white placeholder-gray-400"
                  placeholder="Confirm new password"
                />
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-all duration-300 hover:scale-105">
                <Lock className="w-4 h-4" />
                Update Password
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-6">Active Sessions</h3>
          <div className="space-y-4">
            {activeSessions.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                      {getDeviceIcon(session.device)}
                    </div>
                    {session.current && <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>}
                  </div>
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {session.device}
                      {session.current && <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30">Current</span>}
                    </div>
                    <div className="text-gray-400 text-sm">{session.location} • {session.status}</div>
                  </div>
                </div>
                {!session.current && (
                  <button className="flex items-center gap-2 px-3 py-2 bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30 rounded-lg font-medium transition-all duration-300 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  });

  const renderActiveComponent = useCallback(() => {
    switch (activeTab) {
      case 'Profile':
        return <ProfileComponent />;
      case 'Preferences':
        return <PreferencesComponent />;
      case 'Billing':
        return <BillingComponent />;
      case 'Security':
        return <SecurityComponent />;
      default:
        return <ProfileComponent />;
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Profile & Settings
            </h1>
            <p className="text-gray-400 mt-2">Manage your account and preferences</p>
          </div>
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
            ⭐ Pro Plan
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} style={{ animationDelay: `${index * 0.1}s` }} className="animate-fade-in-up">
              <StatCard stat={stat} />
            </div>
          ))}
        </div>

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
          {renderActiveComponent()}
        </div>
      </div>

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