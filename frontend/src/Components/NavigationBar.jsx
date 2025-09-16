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
  Crown
} from 'lucide-react';

const NavigationBar = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

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

  useEffect(() => {
    const savedUserData = sessionStorage.getItem('userData');
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
      setIsLoading(false);
    } else {
      fetchUserProfile();
    }

    const allItems = [...navigationItems, ...quickActions, ...bottomItems];
    const currentItem = allItems.find(item => item.path === currentPath);
    if (currentItem) {
      setActiveItem(currentItem.name);
    }
  }, [currentPath]);

  const navigationItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Content Editor', icon: Edit3, path: '/content-editor' },
    { name: 'SEO Tools', icon: TrendingUp, path: '/seo-tools', badge: 'New', badgeColor: 'bg-green-500' },
    { name: 'Grammar Check', icon: CheckCircle2, path: '/grammar-check' },
    { name: 'Notifications', icon: Bell, path: '/notifications', badge: '3', badgeColor: 'bg-blue-500' },
  ];

  const quickActions = [
    { name: 'New Document', icon: FileText, path: '/new-document' }
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
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#171717] border-b border-gray-800 p-4 z-[60]">
          <div className="animate-pulse flex items-center">
            <div className="w-8 h-8 bg-gray-700 rounded-lg mr-3"></div>
            <div className="h-4 bg-gray-700 rounded w-20"></div>
          </div>
        </div>

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
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#171717] border-b border-gray-800 p-4 z-[60]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-gray-800 text-white p-2 rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-200"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Edit3 size={16} className="text-white" />
              </div>
              <span className="text-white font-semibold text-sm">WriteAI</span>
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

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className={`
        fixed left-0 top-16 lg:top-0 h-full lg:h-full w-64 bg-[#171717] border-r border-gray-800 z-50 
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        <div className="hidden lg:flex items-center gap-3 p-4 border-b border-gray-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Edit3 size={16} className="text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-sm">WriteAI</span>
            <div className="flex items-center gap-1 bg-yellow-500 text-black px-2 py-0.5 rounded text-xs font-medium">
              <Crown size={12} />
              Pro Plan
            </div>
          </div>
        </div>

        <div className="lg:hidden p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <ProfileAvatar size="w-10 h-10" textSize="text-sm" />
            <div className="flex-1 min-w-0">
              <div className="text-white font-medium text-xs">
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

          <div className="hidden lg:flex items-center gap-3 px-3 py-3 mt-4 border-t border-gray-800">
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