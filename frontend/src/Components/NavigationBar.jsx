import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Edit3,
  TrendingUp,
  CheckCircle2,
  Bell,
  FileText,
  User,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Crown,
  Wand2
} from 'lucide-react';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const NavigationBar = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [unreadCount, setUnreadCount] = useState(0);

  // backendUrl is already defined at the top
  const fetchUserProfile = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const savedUserData = sessionStorage.getItem('userData');
      if (savedUserData) {
        setUserData(JSON.parse(savedUserData));
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${backendUrl}/api/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Profile response status:', response.status);

      if (response.ok) {
        const userData = await response.json();
        sessionStorage.setItem('userData', JSON.stringify(userData));
        setUserData(userData);
      } else {
        console.error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserIdFromSession = () => {
    try {
      const userData = JSON.parse(sessionStorage.getItem("userData"));
      return userData?.id || null;
    } catch (error) {
      console.error("Failed to parse userData from sessionStorage:", error);
      return null;
    }
  };

  const fetchUnreadCount = async () => {
    try {
      if (!backendUrl) return 0;
      const userId = getUserIdFromSession();   // assign userId here
      if (!userId) {
        console.warn("No userId found in session storage");
        return 0;
      }

      const token = sessionStorage.getItem("token");
      console.log("Fetching unread count for userId:", userId);
      
      const response = await fetch(
        `${backendUrl}/api/v1/notifications/user/${userId}/unread-count`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Unread count response status:", response.status);

      if (!response.ok) {
        throw new Error("Failed to fetch notification count");
      }

      const data = await response.json();
      return data.count || 0;
    } catch (error) {
      console.error("Error fetching notification count:", error);
      return 0;
    }
  };

  useEffect(() => {
    const savedUserData = sessionStorage.getItem('userData');
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
      setIsLoading(false);
    } else {
      fetchUserProfile();
    }
  }, []);

  useEffect(() => {
    const navigationItems = [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
      { name: 'Content Editor', icon: Edit3, path: '/content-editor' },
      { name: 'Text Enhancer', icon: Wand2, path: '/text-enhancer' },
      { name: 'SEO Tools', icon: TrendingUp, path: '/seo-tools', badge: 'New', badgeColor: 'bg-green-500' },
      { name: 'Grammar Checker', icon: CheckCircle2, path: '/grammar-check' },
      { name: 'Readability Score', icon: FileText, path: '/readability-score' },
      {
        name: "Notifications",
        icon: Bell,
        path: "/notifications",
        badge: unreadCount > 0 ? unreadCount.toString() : null,
        badgeColor: "bg-blue-500",
      }
    ];

    const quickActions = [
      { name: 'New Document', icon: FileText, path: '/new-document', badge: 'New', badgeColor: 'bg-green-500' },
      { name: 'View Drafts', icon: FileText, path: '/view-drafts' }
    ];

    const bottomItems = [
      { name: 'Profile & Settings', icon: User, path: '/profile' },
      { name: 'Help & Support', icon: HelpCircle, path: '/help' },
      { name: 'Logout', icon: LogOut, path: '/logout' }
    ];

    const allItems = [...navigationItems, ...quickActions, ...bottomItems];
    const currentItem = allItems.find(item => item && item.path === currentPath);
    if (currentItem) {
      setActiveItem(currentItem.name);
    }
  }, [currentPath, unreadCount]);

  useEffect(() => {
    const userId = getUserIdFromSession();
    if (userId) {
      fetchUnreadCount(userId).then((count) => setUnreadCount(count));
    } else {
      setUnreadCount(0);
    }
  }, [userData]);

  const navigationItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Content Editor', icon: Edit3, path: '/content-editor' },
    { name: 'Text Enhancer', icon: Wand2, path: '/text-enhancer' },
    { name: 'SEO Tools', icon: TrendingUp, path: '/seo-tools', badge: 'New', badgeColor: 'bg-green-500' },
    { name: 'Grammar Check', icon: CheckCircle2, path: '/grammar-check' },
    { name: 'Readability Score', icon: FileText, path: '/readability-score' },
    {
      name: "Notifications",
      icon: Bell,
      path: "/notifications",
      badge: unreadCount > 0 ? unreadCount.toString() : null,
      badgeColor: "bg-blue-500",
    }
  ];

  const quickActions = [
    { name: 'New Document', icon: FileText, path: '/new-document', badge: 'New', badgeColor: 'bg-green-500' },
    { name: 'View Drafts', icon: FileText, path: '/view-drafts' }
  ];

  const bottomItems = [
    { name: 'Profile & Settings', icon: User, path: '/profile' },
    { name: 'Help & Support', icon: HelpCircle, path: '/help' },
    { name: 'Logout', icon: LogOut, path: '/logout' }
  ];

  const handleNavClick = (item) => {
    if (item.name === 'Logout') {
      handleLogout();
      return;
    }
    setActiveItem(item.name);
    setCurrentPath(item.path);
    setIsMobileMenuOpen(false);
    window.location.href = item.path;
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('token_type');
    window.location.href = '/';
  };

  const getInitials = (name, email) => {
    if (name && name.trim()) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = () => {
    if (!userData) return 'Loading...';
    return userData.username || userData.email?.split('@')[0] || 'User';
  };

  const ProfileAvatar = ({ size = "w-8 h-8", textSize = "text-xs" }) => {
    const [imageError, setImageError] = useState(false);

    if (userData?.profile_picture_url && !imageError) {
      return (
        <img
          src={userData.profile_picture_url}
          alt="Profile"
          className={`${size} rounded-full object-cover`}
          onError={() => setImageError(true)}
        />
      );
    }

    return (
      <div className={`${size} bg-blue-600 rounded-full flex items-center justify-center text-white font-medium ${textSize}`}>
        {getInitials(userData?.username, userData?.email)}
      </div>
    );
  };

  if (isLoading) {
    return (
      <>
        {/* Mobile Loading Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#171717] border-b border-gray-800 p-4 z-[60]">
          <div className="animate-pulse flex items-center">
            <div className="w-8 h-8 bg-gray-700 rounded-lg mr-3"></div>
            <div className="h-4 bg-gray-700 rounded w-20"></div>
          </div>
        </div>

        {/* Desktop Loading Sidebar */}
        <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-[#171717] border-r border-gray-800 p-4 z-[50]">
          <div className="animate-pulse">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
              <div className="h-4 bg-gray-700 rounded w-20"></div>
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="mb-4 h-8 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#171717] border-b border-gray-800 p-4 z-[60] backdrop-blur-md bg-opacity-95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-gray-800 text-white p-2 rounded-xl shadow-lg hover:bg-gray-700 transition-all duration-200 active:scale-95"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Edit3 size={16} className="text-white" />
              </div>
              <span className="text-white font-semibold text-sm">VibeWrite</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ProfileAvatar />
            <div className="hidden sm:block">
              <div className="text-white font-medium text-xs">
                {getDisplayName()}
              </div>
              <div className="text-gray-400 text-xs">
                {userData?.email}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-[55] lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Dropdown Menu */}
      <div className={`
        lg:hidden fixed left-0 right-0 top-16 bg-[#171717] border-b border-gray-800 z-[58] 
        transform transition-all duration-300 ease-out shadow-2xl backdrop-blur-md bg-opacity-95
        ${isMobileMenuOpen
          ? 'translate-y-0 opacity-100 max-h-screen'
          : '-translate-y-full opacity-0 max-h-0'
        }
        overflow-hidden
      `}>
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {/* Mobile User Profile Section */}
          <div className="p-4 border-b border-gray-800 bg-gray-900 bg-opacity-50">
            <div className="flex items-center gap-3">
              <ProfileAvatar size="w-12 h-12" textSize="text-base" />
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-sm">
                  {getDisplayName()}
                </div>
                <div className="text-gray-400 text-xs truncate">
                  {userData?.email}
                </div>
              </div>
              <div className="flex items-center gap-1 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                <Crown size={12} />
                Pro Plan
              </div>
            </div>
          </div>

          {/* Mobile Navigation Items */}
          <div className="p-3 space-y-1">
            <div className="mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                Main Navigation
              </h3>
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item)}
                  className={`
                    w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left
                    transition-all duration-200 group relative
                    ${activeItem === item.name
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 transform scale-[1.02]'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white hover:transform hover:scale-[1.01] active:scale-95'
                    }
                  `}
                >
                  <item.icon size={18} className={`${activeItem === item.name ? 'text-blue-100' : ''} flex-shrink-0`} />
                  <span className="font-medium flex-1 text-sm">{item.name}</span>
                  {item.badge && (
                    <span className={`${item.badgeColor} text-white text-xs px-2 py-1 rounded-full font-bold ml-2`}>
                      {item.badge}
                    </span>
                  )}
                  {activeItem === item.name && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-200 rounded-r-full shadow-lg" />
                  )}
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                Quick Actions
              </h3>
              {quickActions.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item)}
                  className={`
                    w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 relative
                    ${activeItem === item.name
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 transform scale-[1.02]'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white hover:transform hover:scale-[1.01] active:scale-95'
                    }
                  `}
                >
                  <item.icon size={18} className={`${activeItem === item.name ? 'text-blue-100' : ''} flex-shrink-0`} />
                  <span className="font-medium text-sm">{item.name}</span>
                  {item.badge && (
                    <span className={`${item.badgeColor} text-white text-xs px-2 py-1 rounded-full font-bold ml-2`}>
                      {item.badge}
                    </span>
                  )}
                  {activeItem === item.name && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-200 rounded-r-full shadow-lg" />
                  )}
                </button>
              ))}
            </div>

            {/* Bottom Items */}
            <div className="border-t border-gray-800 pt-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                Account
              </h3>
              {bottomItems.filter(item => item.name !== 'Logout').map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item)}
                  className={`
                    w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 relative
                    ${activeItem === item.name
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 transform scale-[1.02]'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white hover:transform hover:scale-[1.01] active:scale-95'
                    }
                  `}
                >
                  <item.icon size={18} className={`${activeItem === item.name ? 'text-blue-100' : ''} flex-shrink-0`} />
                  <span className="font-medium text-sm">{item.name}</span>
                  {activeItem === item.name && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-200 rounded-r-full shadow-lg" />
                  )}
                </button>
              ))}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className={`
                  w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 relative mt-2
                  ${activeItem === 'Logout'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 transform scale-[1.02]'
                    : 'text-red-300 hover:bg-red-900 hover:bg-opacity-50 hover:text-white hover:transform hover:scale-[1.01] active:scale-95'
                  }
                `}
              >
                <LogOut size={18} className={`${activeItem === 'Logout' ? 'text-red-100' : ''} flex-shrink-0`} />
                <span className="font-medium text-sm">Logout</span>
                {activeItem === 'Logout' && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-200 rounded-r-full shadow-lg" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar - Unchanged */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-[#171717] border-r border-gray-800 z-50 flex flex-col">
        <div className="flex items-center gap-3 p-4 border-b border-gray-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Edit3 size={16} className="text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-sm">VibeWrite</span>
            <div className="flex items-center gap-1 bg-yellow-500 text-black px-2 py-0.5 rounded text-xs font-medium">
              <Crown size={12} />
              Pro Plan
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {navigationItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavClick(item)}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left
                transition-all duration-200 group relative
                ${activeItem === item.name
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 transform scale-[1.02]'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white hover:transform hover:scale-[1.01]'
                }
              `}
            >
              <item.icon size={16} className={activeItem === item.name ? 'text-blue-100' : ''} />
              <span className="font-medium flex-1 text-sm">{item.name}</span>
              {item.badge && (
                <span className={`
                  ${item.badgeColor} text-white text-xs px-1.5 py-0.5 rounded-full font-medium
                  ${activeItem === item.name ? 'opacity-90 ring-2 ring-white ring-opacity-30' : ''}
                `}>
                  {item.badge}
                </span>
              )}
              {activeItem === item.name && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-200 rounded-r-full shadow-lg" />
              )}
            </button>
          ))}

          <div className="pt-6">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 px-3">
              Quick Actions
            </h3>
            {quickActions.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                  ${activeItem === item.name
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 transform scale-[1.02]'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white hover:transform hover:scale-[1.01]'
                  }
                `}
              >
                <item.icon size={16} className={activeItem === item.name ? 'text-blue-100' : ''} />
                <span className="font-medium text-sm">{item.name}</span>
                {item.badge && (
                  <span className={`${item.badgeColor} text-white text-xs px-1.5 py-0.5 rounded-full font-medium`}>
                    {item.badge}
                  </span>
                )}
                {activeItem === item.name && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-200 rounded-r-full shadow-lg" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-800 p-4 space-y-1">
          {bottomItems.filter(item => item.name !== 'Logout').map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavClick(item)}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative
                ${activeItem === item.name
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 transform scale-[1.02]'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white hover:transform hover:scale-[1.01]'
                }
              `}
            >
              <item.icon size={16} className={activeItem === item.name ? 'text-blue-100' : ''} />
              <span className="font-medium text-sm">{item.name}</span>
              {activeItem === item.name && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-200 rounded-r-full shadow-lg" />
              )}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative
              ${activeItem === 'Logout'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 transform scale-[1.02]'
                : 'text-red-300 hover:bg-red-800 hover:text-white hover:transform hover:scale-[1.01]'
              }
            `}
          >
            <LogOut size={16} className={activeItem === 'Logout' ? 'text-red-100' : ''} />
            <span className="font-medium text-sm">Logout</span>
            {activeItem === 'Logout' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-200 rounded-r-full shadow-lg" />
            )}
          </button>

          <div className="flex items-center gap-3 px-3 py-3 mt-4 border-t border-gray-800">
            <ProfileAvatar />
            <div className="flex-1 min-w-0">
              <div className="text-white font-medium text-xs truncate">
                {getDisplayName()}
              </div>
              <div className="text-gray-400 text-xs truncate">
                {userData?.email}
              </div>
            </div>
            <div className="flex items-center gap-1 bg-yellow-500 text-black px-2 py-0.5 rounded text-xs font-medium">
              <Crown size={10} />
              Pro
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationBar;
