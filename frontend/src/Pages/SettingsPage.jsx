import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { 
  Camera, Upload, X, User, Mail, 
  Settings, Moon, Languages, Save, Bell, CreditCard, Shield,
  Lock, Smartphone, Monitor, Download, AlertTriangle, CheckCircle, Globe
} from 'lucide-react';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function SettingsPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [userData, setUserData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  
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
  
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

 
  
  const getAuthToken = () => {
    const token = sessionStorage.getItem('token');
    return token;
  };

  const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const getMultipartHeaders = () => {
    const token = getAuthToken();
    return {
      'Authorization': `Bearer ${token}`,
    };
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/users/profile`, {
        headers: getAuthHeaders(),
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  };

  const loadUserData = async () => {
    try {
      let user = null;
      
      const storedUserData = sessionStorage.getItem('userData');
      if (storedUserData) {
        user = JSON.parse(storedUserData);
      }

      try {
        const freshUserData = await fetchUserProfile();
        user = freshUserData;
        sessionStorage.setItem('userData', JSON.stringify(user));
      } catch (fetchError) {
        if (!user) {
          throw new Error('No user data available');
        }
      }

      if (user) {
        setUserData(user);
        setFormData({
          username: user.username || '',
          email: user.email || ''
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setMessage({ type: 'error', text: 'Failed to load user data' });
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 5000);
  };

  // NEW FUNCTION: Send Notification
  const sendNotification = async (name, description) => {
    try {
      const storedUserData = sessionStorage.getItem('userData');
      if (!storedUserData) {
        console.error('User data not found in session storage.');
        return;
      }
      const user = JSON.parse(storedUserData);
      const userId = user.id;

      if (!userId) {
        console.error('User ID not found in user data.');
        return;
      }

      const notificationData = {
        userId: userId,
        name: name,
        description: description,
      };

      await axios.post(
        `${backendUrl}/api/v1/notifications`,
        notificationData,
        {
          headers: getAuthHeaders(),
          timeout: 5000
        }
      );
      // console.log('Notification sent successfully:', notificationData);
    } catch (error) {
      console.error('Error sending notification:', error);
      // Fail silently for notifications to not disrupt main flow
    }
  };

  const stats = [
    { label: 'Words Written', value: '45,230', icon: '📝', color: 'blue' },
    { label: 'SEO Score Avg', value: '87', icon: '📊', color: 'green' },
    { label: 'Issues Fixed', value: '1,234', icon: '🔧', color: 'purple' },
    { label: 'Days Streak', value: '28', icon: '⚡', color: 'orange' }
  ];

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handlePreferenceChange = useCallback((field, value) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSecurityChange = useCallback((field, value) => {
    setSecurity(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showMessage('error', 'Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showMessage('error', 'Image size must be less than 5MB');
        return;
      }
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const checkBackendConnection = async () => {
    try {
      await axios.get(`${backendUrl}/api/hello/hello`, { timeout: 3000 });
      return true;
    } catch (error) {
      return false;
    }
  };

  const hasProfileChanges = useMemo(() => {
    const usernameChanged = userData && formData.username !== userData.username;
    const pictureSelected = profilePicture !== null;
    return usernameChanged || pictureSelected;
  }, [formData.username, userData?.username, profilePicture]);

  const updateProfile = async () => {
    if (!hasProfileChanges) {
      showMessage('error', 'No changes to save');
      return;
    }

    

    setLoading(true);
    try {
      const formDataObj = new FormData();
      if (formData.username && formData.username.trim() !== '' && formData.username !== userData?.username) {
        formDataObj.append('username', formData.username.trim());
      }
      if (profilePicture) {
        formDataObj.append('profilePicture', profilePicture);
      }
      const response = await axios.put(
        `${backendUrl}/api/users/profile`,
        formDataObj,
        {
          headers: getMultipartHeaders(),
          timeout: 10000
        }
      );
      const updatedUser = response.data;
      setUserData(updatedUser);
      sessionStorage.setItem('userData', JSON.stringify(updatedUser));
      setFormData({
        username: updatedUser.username || '',
        email: updatedUser.email || ''
      });
      showMessage('success', 'Profile updated successfully! Refreshing website...');
      setProfilePicture(null);
      setPreviewImage(null);

      // Send Notification on success
      await sendNotification(
        'Profile Updated',
        `Your profile information (username and/or picture) has been successfully updated.`
      );

      // FIX: Increased timeout to 1500ms so the user can see the success message
      setTimeout(() => {
        window.location.reload();
      }, 1500); 
    } catch (error) {
      console.error('Profile update error:', error);
      let errorMessage = 'Failed to update profile';
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check if the backend server is running.';
      } else if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'No response from server. Please try again.';
      }
      showMessage('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (security.newPassword !== security.confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }
    if (security.newPassword.length < 6) {
      showMessage('error', 'New password must be at least 6 characters');
      return;
    }

    

    setLoading(true);
    try {
      await axios.put(
        `${backendUrl}/api/users/change-password`,
        {
          current_password: security.currentPassword,
          new_password: security.newPassword
        },
        {
          headers: getAuthHeaders(),
          timeout: 10000
        }
      );
      showMessage('success', 'Password changed successfully! Refreshing website...');
      setSecurity({
        ...security,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Send Notification on success
      await sendNotification(
        'Password Changed',
        `Your account password has been successfully changed.`
      );

      // FIX: Increased timeout to 1500ms so the user can see the success message
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Password change error:', error);
      let errorMessage = 'Failed to change password';
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check if the backend server is running.';
      } else if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      }
      showMessage('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const removeProfilePicture = async () => {
    if (!userData?.profile_picture_url) {
      showMessage('error', 'No profile picture to remove');
      return;
    }

    

    setLoading(true);
    try {
      const formDataObj = new FormData();
      if (userData.username) {
        formDataObj.append('username', userData.username);
      }
      // Note: Backend logic is expected to handle the removal when profilePicture is absent from the form data
      const response = await axios.put(
        `${backendUrl}/api/users/profile`,
        formDataObj,
        {
          headers: getMultipartHeaders(),
          timeout: 10000
        }
      );
      const updatedUser = { ...response.data, profile_picture_url: null };
      setUserData(updatedUser);
      sessionStorage.setItem('userData', JSON.stringify(updatedUser));
      showMessage('success', 'Profile picture removed successfully! Refreshing website...');

      // Send Notification on success
      await sendNotification(
        'Profile Picture Removed',
        `Your profile picture has been successfully removed.`
      );

      // FIX: Increased timeout to 1500ms so the user can see the success message
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Remove profile picture error:', error);
      let errorMessage = 'Failed to remove profile picture';
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check if the backend server is running.';
      } else if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      }
      showMessage('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ stat }) => {
    const colorClasses = {
      blue: { bg: 'bg-blue-500', text: 'text-blue-600' },
      green: { bg: 'bg-green-500', text: 'text-green-600' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-600' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-600' }
    };
    const currentColor = colorClasses[stat.color];
    
    return (
      <div className="bg-gray-50 backdrop-blur-sm rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:transform hover:scale-105 group min-h-[120px] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="text-lg sm:text-xl lg:text-2xl group-hover:animate-bounce">{stat.icon}</div>
          <div className={`w-2 h-2 rounded-full ${currentColor.bg}`}></div>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-1 ${currentColor.text} leading-tight`}>
            {stat.value}
          </div>
          <div className="text-gray-600 text-xs sm:text-sm leading-tight break-words">{stat.label}</div>
        </div>
      </div>
    );
  };

  const Toggle = ({ enabled, onChange, size = 'default' }) => {
    const sizeClasses = size === 'small' ? 'w-10 h-6' : 'w-12 h-7';
    const thumbClasses = size === 'small' ? 'w-4 h-4' : 'w-5 h-5';
    const translateClass = size === 'small' 
      ? (enabled ? 'translate-x-4' : 'translate-x-1')
      : (enabled ? 'translate-x-5' : 'translate-x-1');
    
    return (
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex ${sizeClasses} items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
          enabled ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block ${thumbClasses} transform transition-transform duration-300 bg-white rounded-full shadow-lg ${translateClass}`}
        />
      </button>
    );
  };

  const MessageAlert = ({ message }) => {
    if (!message.text) return null;
    
    const bgColor = message.type === 'success' ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200';
    const textColor = message.type === 'success' ? 'text-green-700' : 'text-red-700';
    const icon = message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />;
    
    return (
      <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl border ${bgColor} ${textColor} flex items-center gap-3 animate-fade-in max-w-md shadow-lg`}>
        {icon}
        <span className="text-sm">{message.text}</span>
      </div>
    );
  };

  const notificationItems = [
    { key: 'seoAlerts', title: 'SEO Alerts', description: 'Get notified when your SEO score improves' },
    { key: 'grammarChecks', title: 'Grammar Checks', description: 'Receive alerts for grammar issues' },
    { key: 'systemUpdates', title: 'System Updates', description: 'Notifications about new features' },
    { key: 'weeklyReports', title: 'Weekly Reports', description: 'Weekly summary of your writing activity' },
    { key: 'promotionalEmails', title: 'Promotional Emails', description: 'Marketing emails and special offers' }
  ];

  const billingHistory = [
    { date: 'Feb 15, 2025', description: 'Monthly subscription', amount: '$19.00', status: 'Paid' },
    { date: 'Jan 15, 2025', description: 'Monthly subscription', amount: '$19.00', status: 'Paid' },
    { date: 'Dec 15, 2024', description: 'Monthly subscription', amount: '$19.00', status: 'Paid' }
  ];

  const activeSessions = [
    { device: 'MacBook Pro', location: 'San Francisco, CA', status: 'Active now', current: true },
    { device: 'iPhone 15', location: 'San Francisco, CA', status: '2 hours ago', current: false },
    { device: 'Chrome Browser', location: 'New York, NY', status: '3 days ago', current: false }
  ];

  const getDeviceIcon = (device) => {
    if (device.includes('MacBook')) return <Monitor className="w-5 h-5 text-gray-500" />;
    if (device.includes('iPhone')) return <Smartphone className="w-5 h-5 text-gray-500" />;
    if (device.includes('Chrome')) return <Globe className="w-5 h-5 text-gray-500" />;
    return <Monitor className="w-5 h-5 text-gray-500" />;
  };

  const hasPasswordChanges = security.currentPassword && security.newPassword && security.confirmPassword;

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <MessageAlert message={message} />
      
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent">
              {t('settings.title')}
            </h1>
            <p className="text-gray-600 mt-2">{t('settings.subtitle')}</p>
            {userData && (
              <p className="text-sm text-gray-500 mt-1">
                {t('settings.welcomeBack', { name: userData.username || userData.email })}
              </p>
            )}
          </div>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-800 px-4 py-2 rounded-full text-sm font-semibold animate-pulse self-start sm:self-auto">
            ⭐ {t('settings.plan', { tier: (userData?.role === 'ADMIN' ? t('settings.tier.ADMIN') : userData?.role === 'CREATOR' ? t('settings.tier.CREATOR') : t('settings.tier.PRO')) })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} style={{ animationDelay: `${index * 0.1}s` }} className="animate-fade-in-up">
              <StatCard stat={stat} />
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Left Column */}
          <div className="space-y-6 sm:space-y-8">
            
            {/* Personal Information */}
            <div className="bg-gray-50 backdrop-blur-sm rounded-2xl border border-gray-200 p-4 sm:p-8 animate-fade-in flex flex-col h-auto min-h-[600px]">
              <div className="flex items-center gap-2 mb-6 sm:mb-8">
                <User className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg sm:text-xl font-semibold">Personal Information</h2>
              </div>
              
              {/* Profile Picture Section */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8 p-4 sm:p-6 bg-white rounded-2xl border border-gray-300 w-full">
                <div className="relative group flex-shrink-0 mx-auto sm:mx-0">
                  <div className="w-24 h-24 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-2xl font-bold border-2 border-gray-300 group-hover:border-blue-500 transition-all duration-300 overflow-hidden">
                    {previewImage ? (
                      <img 
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : userData?.profile_picture_url ? (
                      <img 
                        src={userData.profile_picture_url} 
                        alt="Profile" 
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling && (e.target.nextSibling.style.display = 'flex');
                        }}
                      />
                    ) : (
                      <span className="text-gray-700 text-2xl sm:text-xl">
                        {formData.username ? formData.username.charAt(0).toUpperCase() : 'U'}
                      </span>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Camera className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <h3 className="font-semibold mb-2 text-center sm:text-left">Profile Photo</h3>
                  <p className="text-gray-600 text-sm mb-4 text-center sm:text-left">Upload a new profile photo or remove the current one</p>
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl transition-all duration-300 hover:scale-105 text-sm font-medium cursor-pointer w-full sm:w-auto justify-center text-white">
                      <Upload className="w-4 h-4" />
                      Upload New
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                      />
                    </label>
                    {userData?.profile_picture_url && (
                      <button 
                        onClick={removeProfilePicture}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl transition-all duration-300 hover:scale-105 text-sm font-medium disabled:opacity-50 w-full sm:w-auto justify-center text-gray-700"
                      >
                        <X className="w-4 h-4" />
                        Remove
                      </button>
                    )}
                  </div>
                  {profilePicture && (
                    <p className="text-green-600 text-sm mt-2 break-all text-center sm:text-left">Selected: {profilePicture.name}</p>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 gap-6 mb-6 sm:mb-8 flex-grow">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Username</label>
                  <div className="relative">
                    <User className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300 text-gray-800 placeholder-gray-400"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-500 cursor-not-allowed"
                      placeholder="Email cannot be changed"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Email address cannot be modified for security reasons</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-auto">
                <button 
                  onClick={updateProfile}
                  disabled={loading || !hasProfileChanges}
                  className={`w-full sm:w-auto px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-white ${
                    hasProfileChanges 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-blue-500/25' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                
                {userData && (
                  <div className="text-sm text-gray-600 space-y-1 w-full sm:w-auto">
                    <p>Role: <span className="text-blue-600 capitalize">{userData.role?.toLowerCase()}</span></p>
                    <p>Status: <span className="text-green-600">{userData.status}</span></p>
                    <p>Joined: {userData.created_at ? new Date(userData.created_at).toLocaleDateString() : 'N/A'}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-gray-50 backdrop-blur-sm rounded-2xl border border-gray-200 p-4 sm:p-8 animate-fade-in flex flex-col h-auto min-h-[600px]">
              <div className="flex items-center gap-2 mb-6 sm:mb-8">
                <Shield className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg sm:text-xl font-semibold">Security Settings</h2>
              </div>
              
              {/* 2FA Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 bg-white rounded-2xl border border-gray-300 hover:border-gray-400 transition-all duration-300 mb-6">
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <Lock className="w-6 h-6 text-gray-500" />
                  <div>
                    <h3 className="font-semibold">Two-Factor Authentication</h3>
                    <p className="text-gray-600 text-sm">Add an extra layer of security to your account</p>
                  </div>
                </div>
                <Toggle 
                  enabled={security.twoFactorAuth} 
                  onChange={(value) => handleSecurityChange('twoFactorAuth', value)} 
                />
              </div>

              {/* Change Password */}
              <div className="bg-white rounded-2xl border border-gray-300 p-4 sm:p-6 flex-grow">
                <h3 className="font-semibold mb-6">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Current password</label>
                    <input
                      type="password"
                      value={security.currentPassword}
                      onChange={(e) => handleSecurityChange('currentPassword', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300 text-gray-800 placeholder-gray-400"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">New password</label>
                    <input
                      type="password"
                      value={security.newPassword}
                      onChange={(e) => handleSecurityChange('newPassword', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300 text-gray-800 placeholder-gray-400"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Confirm new password</label>
                    <input
                      type="password"
                      value={security.confirmPassword}
                      onChange={(e) => handleSecurityChange('confirmPassword', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300 text-gray-800 placeholder-gray-400"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <button 
                    onClick={changePassword}
                    disabled={loading || !hasPasswordChanges}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-white ${
                      hasPasswordChanges 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 sm:space-y-8">
            
            {/* App Preferences */}
            <div className="bg-gray-50 backdrop-blur-sm rounded-2xl border border-gray-200 p-4 sm:p-8 animate-fade-in flex flex-col h-auto min-h-[600px]">
              <div className="flex items-center gap-2 mb-6 sm:mb-8">
                <Settings className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg sm:text-xl font-semibold">App Preferences</h2>
              </div>
              
              <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8 flex-grow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 bg-white rounded-2xl border border-gray-300 hover:border-gray-400 transition-all duration-300 gap-4 sm:gap-0">
                  <div className="flex items-center gap-4">
                    <Moon className="w-6 h-6 text-gray-500" />
                    <div>
                      <h3 className="font-semibold">Dark Mode</h3>
                      <p className="text-gray-600 text-sm">Toggle dark mode theme</p>
                    </div>
                  </div>
                  <Toggle 
                    enabled={preferences.darkMode} 
                    onChange={(value) => handlePreferenceChange('darkMode', value)} 
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 bg-white rounded-2xl border border-gray-300 hover:border-gray-400 transition-all duration-300 gap-4 sm:gap-0">
                  <div className="flex items-center gap-4">
                    <Languages className="w-6 h-6 text-gray-500" />
                    <div>
                      <h3 className="font-semibold">Language</h3>
                      <p className="text-gray-600 text-sm">Choose your preferred language</p>
                    </div>
                  </div>
                  <select 
                    value={preferences.language}
                    onChange={(e) => handlePreferenceChange('language', e.target.value)}
                    className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300 w-full sm:w-auto"
                  >
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 bg-white rounded-2xl border border-gray-300 hover:border-gray-400 transition-all duration-300 gap-4 sm:gap-0">
                  <div className="flex items-center gap-4">
                    <Save className="w-6 h-6 text-gray-500" />
                    <div>
                      <h3 className="font-semibold">Auto-save</h3>
                      <p className="text-gray-600 text-sm">Automatically save your work</p>
                    </div>
                  </div>
                  <Toggle 
                    enabled={preferences.autoSave} 
                    onChange={(value) => handlePreferenceChange('autoSave', value)} 
                  />
                </div>
              </div>

              {/* Notification Settings */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <Bell className="w-5 h-5 text-gray-500" />
                  <h3 className="text-lg font-semibold">Notification Settings</h3>
                </div>
                <div className="space-y-4">
                  {notificationItems.map((item) => (
                    <div key={item.key} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-gray-300 last:border-0 gap-4 sm:gap-0">
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-gray-600 text-sm">{item.description}</p>
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

            {/* Active Sessions */}
            <div className="bg-gray-50 backdrop-blur-sm rounded-2xl border border-gray-200 p-4 sm:p-8 animate-fade-in flex flex-col h-auto min-h-[600px]">
              <div className="flex items-center gap-2 mb-6 sm:mb-8">
                <Monitor className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg sm:text-xl font-semibold">Active Sessions</h2>
              </div>
              <div className="space-y-4 flex-grow">
                {activeSessions.map((session, index) => (
                  <div key={index} className="p-4 sm:p-6 bg-white rounded-xl border border-gray-300 hover:border-gray-400 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            {getDeviceIcon(session.device)}
                          </div>
                          {session.current && <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>}
                        </div>
                        <div>
                          <div className="font-medium flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <span>{session.device}</span>
                            {session.current && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded border border-blue-200 self-start">Current</span>}
                          </div>
                        </div>
                      </div>
                      {!session.current && (
                        <button className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-600 border border-red-200 hover:bg-red-200 rounded-lg font-medium transition-all duration-300 text-sm self-start">
                          <AlertTriangle className="w-4 h-4" />
                          Revoke
                        </button>
                      )}
                    </div>
                    <div className="text-gray-600 text-sm">{session.location}</div>
                    <div className="text-gray-500 text-xs mt-1">{session.status}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscription Plan */}
            <div className="bg-gray-50 backdrop-blur-sm rounded-2xl border border-gray-200 p-4 sm:p-8 animate-fade-in flex flex-col h-auto min-h-[600px]">
              <div className="flex items-center gap-2 mb-6 sm:mb-8">
                <CreditCard className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg sm:text-xl font-semibold">Subscription Plan</h2>
              </div>
              
              {/* Plan Info */}
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 sm:p-6 border border-yellow-200 mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                      <span className="text-xl">👑</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">
                        {userData?.role === 'ADMIN' ? 'Admin' : userData?.role === 'CREATOR' ? 'Creator' : 'Pro'} Plan
                      </h3>
                      <p className="text-gray-600">$19/month • Renews on March 15, 2025</p>
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium border border-green-200 self-start sm:self-auto">
                    Active
                  </div>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="mb-6 sm:mb-8 flex-grow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Current billing period usage</h3>
                  <span className="text-blue-600 font-medium">68% used</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-white rounded-xl border border-gray-300">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">850 / 1000</div>
                    <div className="text-gray-600 text-sm">AI Suggestions</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl border border-gray-300">
                    <div className="text-xl sm:text-2xl font-bold text-green-600">245 / 500</div>
                    <div className="text-gray-600 text-sm">Grammar Checks</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl border border-gray-300">
                    <div className="text-xl sm:text-2xl font-bold text-purple-600">32 / 100</div>
                    <div className="text-gray-600 text-sm">SEO Analysis</div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <button className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-medium transition-all duration-300 hover:scale-105 text-gray-700">
                    Change Plan
                  </button>
                  <button className="flex-1 py-3 bg-red-100 text-red-600 border border-red-200 hover:bg-red-200 rounded-xl font-medium transition-all duration-300 hover:scale-105">
                    Cancel Subscription
                  </button>
                </div>

                {/* Billing History */}
                <div>
                  <h3 className="font-semibold mb-6">Billing History</h3>
                  <div className="space-y-4">
                    {billingHistory.map((item, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-xl border border-gray-300 hover:border-gray-400 transition-all duration-300 gap-4">
                        <div>
                          <div className="font-medium">{item.date}</div>
                          <div className="text-gray-600 text-sm">{item.description}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold">{item.amount}</span>
                          <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-medium border border-green-200">
                            {item.status}
                          </span>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                            <Download className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
.animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}