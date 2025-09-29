import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, X, AlertCircle, CheckCircle, Info, AlertTriangle, Trash2, Check } from 'lucide-react';
const backendUrl = import.meta.env.VITE_BACKEND_URL ;

const NotificationSystem = ({ 
  newNotification = null, 
  onNotificationProcessed = () => {},
  className = "" 
}) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  // Get user data from session storage
  useEffect(() => {
    try {
      const userDataString = sessionStorage.getItem('userData');
      if (userDataString) {
        const parsedData = JSON.parse(userDataString);
        setUserData(parsedData);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }, []);

  // Fetch permanent notifications from database
  const fetchNotifications = useCallback(async () => {
    if (!userData?.id) return;
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/v1/notifications/user/${userData.id}`);
      const responseData = await response.json();
      // Extract the data from the ApiResponse wrapper
      const apiResponse = responseData;
      if (apiResponse.success && apiResponse.data) {
        const permanentNotifications = apiResponse.data.map(notif => ({
          id: notif.id,
          title: notif.name || 'Notification',
          message: notif.description || '',
          type: 'permanent',
          priority: 'info', // You might want to add priority to your backend model
          read: notif.status === 'READ',
          timestamp: new Date(notif.createdAt || Date.now())
        }));

        // Get temporary notifications from session storage
        const tempNotifications = JSON.parse(sessionStorage.getItem('tempNotifications') || '[]');

        // Combine and sort by timestamp
        const allNotifications = [...permanentNotifications, ...tempNotifications]
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setNotifications(allNotifications);
        setUnreadCount(allNotifications.filter(notif => !notif.read).length);
      } else {
        console.error('API response indicates failure:', apiResponse.message);
        // Load only temporary notifications if API fails
        const tempNotifications = JSON.parse(sessionStorage.getItem('tempNotifications') || '[]');
        setNotifications(tempNotifications);
        setUnreadCount(tempNotifications.filter(notif => !notif.read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // If API fails, just load temporary notifications
      const tempNotifications = JSON.parse(sessionStorage.getItem('tempNotifications') || '[]');
      setNotifications(tempNotifications);
      setUnreadCount(tempNotifications.filter(notif => !notif.read).length);
    }
    setLoading(false);
  }, [userData?.id]);

  // Initial load
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Handle new notifications from props
  useEffect(() => {
    if (newNotification) {
      handleNewNotification(newNotification);
      onNotificationProcessed();
    }
  }, [newNotification, onNotificationProcessed]);

  const handleNewNotification = async (notif) => {
    const notification = {
      id: notif.id || `temp-${Date.now()}`,
      title: notif.title || 'New Notification',
      message: notif.message || '',
      type: notif.permanent ? 'permanent' : 'temporary',
      priority: notif.priority || 'info',
      read: false,
      timestamp: new Date(),
      actions: notif.actions || []
    };

    if (notif.permanent && userData?.id) {
      // Save to database
      try {
        const response = await fetch(`${backendUrl}/api/v1/notifications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userData.id,
            name: notification.title,
            description: notification.message
          })
        });
        fetchNotifications(); // Refresh to get the saved notification
      } catch (error) {
        console.error('Error saving notification:', error);
        // Fallback to temporary if database save fails
        addTemporaryNotification(notification);
      }
    } else {
      // Save as temporary
      addTemporaryNotification(notification);
    }
  };

  const addTemporaryNotification = (notification) => {
    const tempNotifications = JSON.parse(sessionStorage.getItem('tempNotifications') || '[]');
    tempNotifications.unshift(notification);
    sessionStorage.setItem('tempNotifications', JSON.stringify(tempNotifications));
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = async (notificationId) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification || notification.read) return;
    
    if (notification.type === 'permanent') {
      try {
        await fetch(`${backendUrl}/api/v1/notifications/${notificationId}/user/${userData.id}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'READ'
          })
        });
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    } else {
      // Update temporary notification in session storage
      const tempNotifications = JSON.parse(sessionStorage.getItem('tempNotifications') || '[]');
      const updatedTemp = tempNotifications.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      );
      sessionStorage.setItem('tempNotifications', JSON.stringify(updatedTemp));
    }
    
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => prev - 1);
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.read);

    // Update permanent notifications
    const permanentUnread = unreadNotifications.filter(n => n.type === 'permanent');
    if (permanentUnread.length > 0 && userData?.id) {
      try {
        await fetch(`${backendUrl}/api/v1/notifications/user/${userData.id}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'READ',
            userId: userData.id
          })
        });
      } catch (error) {
        console.error('Error marking all as read:', error);
      }
    }

    // Update temporary notifications
    const tempNotifications = JSON.parse(sessionStorage.getItem('tempNotifications') || '[]');
    const updatedTemp = tempNotifications.map(notif => ({ ...notif, read: true }));
    sessionStorage.setItem('tempNotifications', JSON.stringify(updatedTemp));
    
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = async (notificationId) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification) return;
    
    if (notification.type === 'permanent' && userData?.id) {
      try {
        await fetch(`${backendUrl}/api/v1/notifications/${notificationId}/user/${userData.id}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('Error deleting notification:', error);
        return;
      }
    } else {
      // Remove from session storage
      const tempNotifications = JSON.parse(sessionStorage.getItem('tempNotifications') || '[]');
      const filteredTemp = tempNotifications.filter(notif => notif.id !== notificationId);
      sessionStorage.setItem('tempNotifications', JSON.stringify(filteredTemp));
    }
    
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    if (!notification.read) {
      setUnreadCount(prev => prev - 1);
    }
  };

  const clearAll = async () => {
    // Clear temporary notifications
    sessionStorage.removeItem('tempNotifications');

    // Delete permanent notifications if user is logged in
    if (userData?.id) {
      try {
        await fetch(`${backendUrl}/api/v1/notifications/user/${userData.id}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('Error deleting all notifications:', error);
      }
    }

    setNotifications([]);
    setUnreadCount(0);
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'success': return <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />;
      case 'error': return <X className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />;
      default: return <Info className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />;
    }
  };

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'success': return 'bg-green-50 text-gray-800 border border-green-200';
      case 'error': return 'bg-red-50 text-gray-800 border border-red-200';
      case 'warning': return 'bg-yellow-50 text-gray-800 border border-yellow-200';
      default: return 'bg-blue-50 text-gray-800 border border-blue-200';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Add demo notifications for testing
  useEffect(() => {
    const demoNotifications = [
      {
        id: 'demo-1',
        title: 'Success',
        message: 'You can access all the files in this folder.',
        type: 'temporary',
        priority: 'success',
        read: false,
        timestamp: new Date(Date.now() - 60000)
      },
      {
        id: 'demo-2',
        title: 'Info',
        message: 'Anyone on the internet with this link can view.',
        type: 'temporary',
        priority: 'info',
        read: false,
        timestamp: new Date(Date.now() - 120000)
      },
      {
        id: 'demo-3',
        title: 'Warning',
        message: 'Viewers of this file can see comments and suggestions.',
        type: 'temporary',
        priority: 'warning',
        read: false,
        timestamp: new Date(Date.now() - 180000)
      },
      {
        id: 'demo-4',
        title: 'Error',
        message: 'Sorry, but you\'re not authorized to look at this page.',
        type: 'temporary',
        priority: 'error',
        read: false,
        timestamp: new Date(Date.now() - 240000)
      }
    ];

    if (notifications.length === 0) {
      setNotifications(demoNotifications);
      setUnreadCount(demoNotifications.length);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Notifications</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Check className="w-4 h-4" />
                  Mark all as read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="ml-4 text-gray-600 text-base sm:text-lg mt-4">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <Bell className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 text-gray-400" />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">No notifications</h2>
            <p className="text-gray-600 text-base sm:text-lg">You're all caught up!</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`${getPriorityStyles(notification.priority)} rounded-lg p-4 sm:p-5 lg:p-6 shadow-lg hover:shadow-xl transition-all duration-200 relative min-h-[180px] sm:min-h-[200px] flex flex-col`}
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {getPriorityIcon(notification.priority)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
                        {notification.title}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 ml-2 flex-shrink-0">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-1.5 sm:p-2 rounded-lg transition-colors duration-200 hover:bg-gray-200 text-gray-600"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-1.5 sm:p-2 rounded-lg transition-colors duration-200 hover:bg-gray-200 text-gray-600"
                      title="Delete notification"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 mb-4">
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed line-clamp-3">
                    {notification.message}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-200">
                  <span className="text-xs sm:text-sm text-gray-500">
                    {formatTimeAgo(notification.timestamp)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 sm:px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-300">
                      {notification.type}
                    </span>
                    {!notification.read && (
                      <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500"></span>
                    )}
                  </div>
                </div>

                {notification.actions && notification.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 pt-4 border-t border-gray-200">
                    {notification.actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => action.onClick?.()}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors duration-200 text-xs sm:text-sm ${
                          action.type === 'primary'
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'border border-gray-300 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSystem;