import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Activity,
  Calendar,
  Bell,
  Settings,
  ChevronDown,
  Plus,
  Filter,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Menu,
  X
} from 'lucide-react';

const Dashboard = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Sample data
  const stats = [
    { title: 'Total Users', value: '12,345', change: '+12%', icon: Users, color: 'text-blue-500' },
    { title: 'Active Projects', value: '89', change: '+5%', icon: FileText, color: 'text-green-500' },
    { title: 'Revenue', value: '$54,321', change: '+18%', icon: TrendingUp, color: 'text-purple-500' },
    { title: 'Performance', value: '94%', change: '+2%', icon: Activity, color: 'text-orange-500' }
  ];

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'Created new project', time: '2 hours ago', avatar: 'JD' },
    { id: 2, user: 'Sarah Smith', action: 'Updated dashboard', time: '4 hours ago', avatar: 'SS' },
    { id: 3, user: 'Mike Johnson', action: 'Completed task', time: '6 hours ago', avatar: 'MJ' },
    { id: 4, user: 'Emily Brown', action: 'Added new user', time: '8 hours ago', avatar: 'EB' },
    { id: 5, user: 'David Wilson', action: 'Generated report', time: '1 day ago', avatar: 'DW' }
  ];

  const projects = [
    { id: 1, name: 'Website Redesign', status: 'In Progress', progress: 75, team: 4, deadline: '2025-09-15' },
    { id: 2, name: 'Mobile App', status: 'Planning', progress: 25, team: 6, deadline: '2025-10-01' },
    { id: 3, name: 'API Integration', status: 'Completed', progress: 100, team: 3, deadline: '2025-08-30' },
    { id: 4, name: 'Database Migration', status: 'On Hold', progress: 50, team: 2, deadline: '2025-09-20' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        {/* Mobile-First Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          {/* Mobile Header Layout */}
          <div className="space-y-4">
            {/* Title and Menu Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Dashboard</h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1 hidden sm:block">
                  Welcome back! Here's what's happening today.
                </p>
              </div>
              
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

            {/* Mobile Menu Overlay */}
            {showMobileMenu && (
              <div className="sm:hidden space-y-3 border-t border-gray-200 pt-4">
                {/* Mobile Search Toggle */}
                <button
                  onClick={() => {
                    setShowMobileSearch(!showMobileSearch);
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center gap-3 w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Search size={18} />
                  <span>Search</span>
                </button>
                
                {/* Mobile Filter */}
                <button
                  onClick={() => {
                    setShowDropdown(!showDropdown);
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center gap-3 w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Filter size={18} />
                  <span>Filter</span>
                  <ChevronDown size={16} className="ml-auto" />
                </button>

                {/* Mobile New Project */}
                <button
                  onClick={() => {
                    setShowModal(true);
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center gap-3 w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Plus size={18} />
                  <span>New Project</span>
                </button>
              </div>
            )}

            {/* Mobile Search Bar */}
            {showMobileSearch && (
              <div className="sm:hidden border-t border-gray-200 pt-4">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {/* Desktop Header Actions */}
            <div className="hidden sm:flex items-center justify-between">
              <p className="text-gray-600 sm:hidden">Welcome back! Here's what's happening today.</p>
              
              <div className="flex items-center gap-3">
                {/* Desktop Search */}
                <div className="relative hidden md:block">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48 lg:w-64"
                  />
                </div>
                
                {/* Desktop Filter Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm lg:text-base"
                  >
                    <Filter size={16} lg:size={18} />
                    <span className="hidden sm:inline">Filter</span>
                    <ChevronDown size={14} lg:size={16} />
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-2">
                        <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg text-sm">All Projects</button>
                        <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg text-sm">Active Only</button>
                        <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg text-sm">Completed</button>
                        <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg text-sm">On Hold</button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Notification Bell */}
                <button 
                  className="relative p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <Bell size={16} lg:size={18} />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center text-xs">
                    3
                  </span>
                  {showTooltip && (
                    <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-50">
                      3 new notifications
                    </div>
                  )}
                </button>
                
                {/* Desktop New Project Button */}
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm lg:text-base"
                >
                  <Plus size={16} lg:size={18} />
                  <span className="hidden sm:inline">New Project</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-Responsive Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow">
              <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-gray-600 text-xs sm:text-sm font-medium truncate">{stat.title}</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mt-1 truncate">{stat.value}</p>
                  <p className="text-green-500 text-xs sm:text-sm font-medium mt-1">{stat.change}</p>
                </div>
                <div className={`p-2 sm:p-3 rounded-lg bg-gray-50 ${stat.color} self-center sm:self-auto`}>
                  <stat.icon size={20} className="sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile-Responsive Main Content */}
        <div className="space-y-4 sm:space-y-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">
          {/* Projects List - Mobile First */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="space-y-3">
                      {/* Project Header */}
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base flex-1 mr-2">{project.name}</h3>
                        <button className="p-1 sm:p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0">
                          <MoreVertical size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                      
                      {/* Mobile Status and Info */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
                            project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            project.status === 'Planning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {project.status}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-600">{project.team} members</span>
                        </div>
                        
                        {/* Deadline - Mobile Friendly */}
                        <div className="text-xs sm:text-sm text-gray-600">
                          Due: {new Date(project.deadline).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: '2-digit'
                          })}
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-2">
                          <span>Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities - Mobile Responsive */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium flex-shrink-0">
                      {activity.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.user}</p>
                      <p className="text-xs sm:text-sm text-gray-600 break-words">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Mobile Responsive */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center">
              <Plus size={20} className="sm:w-6 sm:h-6 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium text-gray-600">Create Document</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center">
              <Calendar size={20} className="sm:w-6 sm:h-6 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium text-gray-600">Schedule Meeting</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center sm:col-span-2 lg:col-span-1">
              <Settings size={20} className="sm:w-6 sm:h-6 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium text-gray-600">Manage Settings</p>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile-Responsive Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Create New Project</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base resize-none"
                    placeholder="Enter project description"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:justify-end sticky bottom-0 bg-white rounded-b-xl">
              <button
                onClick={() => setShowModal(false)}
                className="w-full sm:w-auto px-4 py-2 sm:py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button className="w-full sm:w-auto px-4 py-2 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors order-1 sm:order-2">
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;