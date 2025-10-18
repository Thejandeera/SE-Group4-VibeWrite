import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, FileText, Activity, Calendar, Bell, Settings,
  ChevronDown, Plus, Filter, Search, MoreVertical, Eye, Edit, Trash2,
  Menu, X, Clock, CheckCircle, AlertCircle, Award, Zap, Target,
  BarChart2, PieChart, ArrowUp, ArrowDown, Sparkles, Star,
  BookOpen, MessageCircle, Share2, Download, Upload, Heart,
  Bookmark, Send, Mail, Phone, Globe, Shield, Lock, Image,
  Video, Music, Map, Coffee, Sun, Moon, Cloud, Droplet
} from 'lucide-react';

const Dashboard = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('week');
  const [userData, setUserData] = useState(null);
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  
  // Real data states
  const [draftsData, setDraftsData] = useState([]);
  const [grammarHistory, setGrammarHistory] = useState([]);
  const [stats, setStats] = useState([
    { 
      title: 'Total Drafts', 
      value: '0', 
      change: '+0%', 
      trend: 'up',
      icon: FileText, 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      title: 'Grammar Checks', 
      value: '0', 
      change: '+0%', 
      trend: 'up',
      icon: CheckCircle, 
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    { 
      title: 'Avg Grammar Score', 
      value: '0%', 
      change: '+0%', 
      trend: 'up',
      icon: TrendingUp, 
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    { 
      title: 'Total Words', 
      value: '0', 
      change: '+0%', 
      trend: 'up',
      icon: Activity, 
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Load user data
  useEffect(() => {
    const userDataString = sessionStorage.getItem('userData');
    if (userDataString) {
      try {
        const user = JSON.parse(userDataString);
        setUserData(user);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  // Update greeting and time
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting('Good Morning');
      else if (hour < 18) setGreeting('Good Afternoon');
      else setGreeting('Good Evening');
    };
    
    updateGreeting();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateGreeting();
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Fetch all real data
  useEffect(() => {
    if (userData?.id) {
      fetchAllData();
    }
  }, [userData?.id]);

  const fetchAllData = async () => {
    setLoading(true);
    const token = sessionStorage.getItem('token');
    
    try {
      await Promise.all([
        fetchDrafts(token),
        fetchGrammarHistory(token)
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrafts = async (token) => {
    try {
      const response = await fetch(`${backendUrl}/drafts/by-user/${userData.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDraftsData(data);
        updateDraftStats(data);
      }
    } catch (error) {
      console.error('Error fetching drafts:', error);
    }
  };

  const fetchGrammarHistory = async (token) => {
    try {
      const response = await fetch(`${backendUrl}/api/v1/grammar/history/user/${userData.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setGrammarHistory(data);
        updateGrammarStats(data);
      }
    } catch (error) {
      console.error('Error fetching grammar history:', error);
    }
  };

  const updateDraftStats = (drafts) => {
    const totalDrafts = drafts.length;
    const totalWords = drafts.reduce((sum, draft) => {
      const words = (draft.content || '').replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length;
      return sum + words;
    }, 0);

    setStats(prev => {
      const newStats = [...prev];
      newStats[0] = { ...newStats[0], value: totalDrafts.toString() };
      newStats[3] = { ...newStats[3], value: totalWords.toLocaleString() };
      return newStats;
    });
  };

  const updateGrammarStats = (history) => {
    const totalChecks = history.length;
    const avgScore = totalChecks > 0 
      ? Math.round(history.reduce((sum, check) => sum + check.grammarScore, 0) / totalChecks)
      : 0;

    setStats(prev => {
      const newStats = [...prev];
      newStats[1] = { ...newStats[1], value: totalChecks.toString() };
      newStats[2] = { ...newStats[2], value: `${avgScore}%` };
      return newStats;
    });
  };

  // Quick actions with real navigation
  const quickActions = [
    { 
      icon: Plus, 
      label: 'New Draft', 
      color: 'from-blue-500 to-blue-600', 
      onClick: () => window.location.href = '/content-editor' 
    },
    { 
      icon: FileText, 
      label: 'View Drafts', 
      color: 'from-green-500 to-green-600', 
      onClick: () => window.location.href = '/view-draft' 
    },
    { 
      icon: BarChart2, 
      label: 'SEO Analysis', 
      color: 'from-purple-500 to-purple-600', 
      onClick: () => window.location.href = '/seo-tools' 
    },
    { 
      icon: CheckCircle, 
      label: 'Grammar Check', 
      color: 'from-orange-500 to-orange-600', 
      onClick: () => window.location.href = '/grammar-check' 
    },
    { 
      icon: Target, 
      label: 'Readability', 
      color: 'from-pink-500 to-pink-600', 
      onClick: () => window.location.href = '/readability' 
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      color: 'from-gray-500 to-gray-600', 
      onClick: () => window.location.href = '/settings' 
    }
  ];

  // Recent activities from real data
  const getRecentActivities = () => {
    const activities = [];
    
    // Add recent drafts
    const recentDrafts = draftsData
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 3);
    
    recentDrafts.forEach(draft => {
      activities.push({
        id: `draft-${draft.id}`,
        user: userData?.username || 'You',
        action: 'Created new draft',
        time: getTimeAgo(new Date(draft.timestamp)),
        avatar: userData?.username?.charAt(0).toUpperCase() || 'U',
        type: 'create',
        icon: Plus
      });
    });

    // Add recent grammar checks
    const recentGrammar = grammarHistory
      .sort((a, b) => new Date(b.checkedAt) - new Date(a.checkedAt))
      .slice(0, 2);
    
    recentGrammar.forEach(check => {
      activities.push({
        id: `grammar-${check.id}`,
        user: userData?.username || 'You',
        action: `Grammar check (${check.grammarScore}% score)`,
        time: getTimeAgo(new Date(check.checkedAt)),
        avatar: userData?.username?.charAt(0).toUpperCase() || 'U',
        type: 'complete',
        icon: CheckCircle
      });
    });

    return activities.sort((a, b) => {
      const timeA = parseTimeAgo(a.time);
      const timeB = parseTimeAgo(b.time);
      return timeA - timeB;
    }).slice(0, 5);
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const parseTimeAgo = (timeStr) => {
    if (timeStr === 'Just now') return 0;
    const match = timeStr.match(/(\d+)\s+(minute|hour|day)/);
    if (!match) return Infinity;
    const value = parseInt(match[1]);
    const unit = match[2];
    if (unit === 'minute') return value;
    if (unit === 'hour') return value * 60;
    if (unit === 'day') return value * 1440;
    return Infinity;
  };

  // Projects from drafts
  const getProjects = () => {
    return draftsData
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 4)
      .map((draft, index) => {
        const content = (draft.content || '').replace(/<[^>]*>/g, '');
        const words = content.split(/\s+/).filter(w => w.length > 0).length;
        const progress = Math.min(Math.round((words / 500) * 100), 100);
        
        return {
          id: draft.id,
          name: draft.title || `Draft ${index + 1}`,
          status: progress === 100 ? 'Completed' : progress > 50 ? 'In Progress' : 'Planning',
          progress: progress,
          team: 1,
          deadline: new Date(draft.timestamp).toISOString().split('T')[0],
          priority: progress < 30 ? 'high' : progress < 70 ? 'medium' : 'low',
          tags: ['Writing', words > 200 ? 'Long-form' : 'Short-form']
        };
      });
  };

  // Achievements based on real data
  const getAchievements = () => {
    const totalDrafts = draftsData.length;
    const totalGrammar = grammarHistory.length;
    const avgScore = grammarHistory.length > 0 
      ? Math.round(grammarHistory.reduce((sum, check) => sum + check.grammarScore, 0) / grammarHistory.length)
      : 0;
    const totalWords = draftsData.reduce((sum, draft) => {
      const words = (draft.content || '').replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length;
      return sum + words;
    }, 0);

    return [
      { 
        icon: Award, 
        label: 'Pro Writer', 
        description: `${totalDrafts} drafts created`, 
        earned: totalDrafts >= 10 
      },
      { 
        icon: Star, 
        label: 'Grammar Master', 
        description: `${avgScore}% average score`, 
        earned: avgScore >= 90 
      },
      { 
        icon: Zap, 
        label: 'Speed Demon', 
        description: `${totalGrammar} grammar checks`, 
        earned: totalGrammar >= 50 
      },
      { 
        icon: Target, 
        label: 'Word Smith', 
        description: `${totalWords.toLocaleString()} words written`, 
        earned: totalWords >= 10000 
      },
    ];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'On Hold': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-600';
      case 'medium': return 'bg-yellow-100 text-yellow-600';
      case 'low': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const recentActivities = getRecentActivities();
  const projects = getProjects();
  const achievements = getAchievements();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
        
        {/* Header Card */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 animate-slide-down">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Left: Greeting & User Info */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg animate-scale overflow-hidden">
                {userData?.profile_picture_url ? (
                  <img
                    src={userData.profile_picture_url}
                    alt={userData.username || 'Profile'}
                    className="w-full h-full object-cover rounded-2xl"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  userData?.username ? userData.username.charAt(0).toUpperCase() : 'U'
                )}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 break-words">
                  {greeting}, {userData?.username || 'User'}!
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base flex items-center gap-2">
                  <Clock size={16} />
                  {currentTime.toLocaleTimeString()} • {currentTime.toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Right: Quick Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <button className="btn-glass relative">
                <Bell size={18} />
                <span className="badge-notification">3</span>
              </button>
              <button 
                className="btn-glass"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? <X size={18} /> : <Menu size={18} />}
              </button>
              <button 
                className="btn-primary"
                onClick={() => window.location.href = '/content-editor'}
              >
                <Plus size={18} />
                <span className="hidden sm:inline">New Draft</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search drafts, grammar checks, or content..."
              className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            />
          </div>
        </div>

        {/* Stats Grid with Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="stat-card animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={stat.textColor} size={24} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-gray-600 text-xs sm:text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${stat.color} progress-bar`}
                  style={{ width: '70%' }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 animate-fade-in">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="text-blue-600" size={24} />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="quick-action-card"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-2 mx-auto`}>
                  <action.icon className="text-white" size={20} />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 animate-fade-in">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="text-yellow-500" size={24} />
            Your Achievements
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}
              >
                <div className={`w-16 h-16 rounded-full ${achievement.earned ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gray-200'} flex items-center justify-center mb-3 mx-auto`}>
                  <achievement.icon className={achievement.earned ? 'text-white' : 'text-gray-400'} size={28} />
                </div>
                <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">{achievement.label}</h3>
                <p className="text-xs text-gray-600">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Projects List */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-4 sm:p-6 animate-slide-right">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="text-blue-600" size={24} />
                Recent Drafts
              </h2>
              <button
                onClick={() => window.location.href = '/view-draft'}
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All →
              </button>
            </div>
            
            {projects.length === 0 ? (
            <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">No drafts yet</p>
                <button
                  onClick={() => window.location.href = '/content-editor'}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Your First Draft
                </button>
            </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div 
                    key={project.id} 
                    className="project-card"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex flex-col md:flex-row items-start justify-between mb-3 gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2 text-xs sm:text-sm">{project.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(project.priority)}`}>
                            {project.priority}
                          </span>
                          {project.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical size={18} className="text-gray-400" />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold text-gray-900">{project.progress}%</span>
                      </div>
                      <div className="progress-container">
                        <div 
                          className="progress-fill"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center justify-between mt-4 pt-4 border-t border-gray-100 gap-2">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <Calendar size={16} />
                        <span>{new Date(project.deadline).toLocaleDateString()}</span>
                      </div>
                      <button
                        onClick={() => window.location.href = '/view-draft'}
                        className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium"
                      >
                        View →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <div className="glass-card rounded-2xl p-4 sm:p-6 animate-slide-left">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="text-green-600" size={24} />
              Recent Activity
            </h2>
            
            {recentActivities.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div 
                    key={activity.id} 
                    className="activity-item"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                        {activity.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-900">{activity.user}</p>
                        <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                          <activity.icon size={14} />
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-right {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slide-left {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes progress {
          from { width: 0; }
          to { width: var(--progress-width); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
        }

        .floating-circle {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1));
          animation: float 6s ease-in-out infinite;
        }

        .circle-1 {
          width: 300px;
          height: 300px;
          top: -150px;
          right: -150px;
        }

        .circle-2 {
          width: 400px;
          height: 400px;
          bottom: -200px;
          left: -200px;
          animation-delay: -2s;
        }

        .circle-3 {
          width: 250px;
          height: 250px;
          top: 50%;
          left: 50%;
          animation-delay: -4s;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .stat-card {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
          transition: all 0.3s ease;
          animation: fade-in 0.5s ease-out forwards;
        }

        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        .quick-action-card {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem 1rem;
          text-align: center;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
        }

        .quick-action-card:hover {
          border-color: #3B82F6;
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(59, 130, 246, 0.2);
        }

        .achievement-card {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s ease;
          border: 2px solid #E5E7EB;
        }

        .achievement-card.earned {
          border-color: #FBBF24;
          animation: pulse-glow 2s infinite;
        }

        .achievement-card.earned:hover {
          transform: scale(1.05);
        }

        .achievement-card.locked {
          opacity: 0.6;
          filter: grayscale(1);
        }

        .project-card {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
          border: 1px solid #E5E7EB;
        }

        .project-card:hover {
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          border-color: #3B82F6;
        }

        .activity-item {
          padding: 1rem;
          border-radius: 0.75rem;
          background: white;
          transition: all 0.3s ease;
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
          border: 1px solid #F3F4F6;
        }

        .activity-item:hover {
          background: #F9FAFB;
          border-color: #3B82F6;
        }

        .progress-container {
          width: 100%;
          height: 8px;
          background: #E5E7EB;
          border-radius: 999px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3B82F6, #8B5CF6);
          border-radius: 999px;
          animation: progress 1s ease-out forwards;
          position: relative;
          overflow: hidden;
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shimmer 2s infinite;
        }

        .progress-bar {
          animation: progress 1s ease-out forwards;
        }

        .btn-glass {
          padding: 0.75rem;
          border-radius: 0.75rem;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
          position: relative;
        }

        .btn-glass:hover {
          background: rgba(255, 255, 255, 0.9);
          transform: translateY(-2px);
        }

        .btn-primary {
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          background: linear-gradient(135deg, #3B82F6, #8B5CF6);
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
        }

        .badge-notification {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #EF4444;
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.125rem 0.375rem;
          border-radius: 999px;
          min-width: 1.25rem;
          text-align: center;
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out;
        }

        .animate-slide-right {
          animation: slide-right 0.6s ease-out;
        }

        .animate-slide-left {
          animation: slide-left 0.6s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-scale {
          animation: scale 3s ease-in-out infinite;
        }

        @media (max-width: 640px) {
          .glass-card {
            padding: 0.75rem;
          }
          .stat-card {
            padding: 0.75rem;
          }
          .quick-action-card {
            padding: 1rem 0.5rem;
          }
          .achievement-card {
            padding: 1rem;
          }
          .project-card {
            padding: 1rem;
          }
          .activity-item {
            padding: 0.75rem;
          }
          .grid-cols-2 {
            grid-template-columns: 1fr !important;
          }
          .grid-cols-3, .grid-cols-4, .grid-cols-6 {
            grid-template-columns: 1fr !important;
          }
          .lg\\:grid-cols-4, .lg\\:grid-cols-3 {
            grid-template-columns: 1fr !important;
          }
          .lg\\:col-span-2 {
            grid-column: span 1 / span 1 !important;
          }
          .gap-3, .gap-4, .gap-6, .sm\\:gap-4, .sm\\:gap-6, .lg\\:gap-6 {
            gap: 0.75rem !important;
          }
          .space-y-4, .sm\\:space-y-6 {
            row-gap: 0.75rem !important;
          }
          .p-4, .sm\\:p-6, .lg\\:p-6 {
            padding: 0.75rem !important;
          }
          .rounded-2xl {
            border-radius: 1rem !important;
          }
          .w-16, .h-16 {
            width: 3rem !important;
            height: 3rem !important;
          }
          .w-12, .h-12 {
            width: 2.5rem !important;
            height: 2.5rem !important;
          }
          .w-10, .h-10 {
            width: 2rem !important;
            height: 2rem !important;
          }
          .text-xl, .sm\\:text-2xl, .md\\:text-3xl {
            font-size: 1.1rem !important;
          }
        }
        /* Prevent horizontal overflow */
        html, body, #root, .min-h-screen, .max-w-full {
          max-width: 100vw !important;
          overflow-x: hidden !important;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;