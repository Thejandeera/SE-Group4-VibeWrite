import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, Github, Eye, EyeOff, CheckCircle, XCircle, User, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import Navbar from '../../Components/LandingPage/Navbar';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();


  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 4000);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    
 
    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    if (!email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        
        sessionStorage.setItem('token', data.access_token);
        sessionStorage.setItem('token_type', data.token_type);
        
        if (rememberMe) {
       
          localStorage.setItem('token', data.access_token);
          localStorage.setItem('token_type', data.token_type);
        }

        showToast('Login successful! Welcome back.', 'success');
        
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
        
      } else {
        
        const errorMessage = data.message || data.error || 'Login failed. Please check your credentials.';
        showToast(errorMessage, 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      showToast('Network error. Please check your connection and try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    showToast('Google sign-in coming soon!', 'info');
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleGithubSignIn = async () => {
    setIsLoading(true);
    showToast('GitHub sign-in coming soon!', 'info');
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col relative overflow-hidden">
      
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600 rounded-full mix-blend-soft-light filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-600 rounded-full mix-blend-soft-light filter blur-3xl opacity-30 animate-pulse-slow animation-delay-2000"></div>
      </div>
      
      
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
          toast.type === 'success' ? 'bg-green-600/90 backdrop-blur-sm text-white' :
          toast.type === 'error' ? 'bg-red-600/90 backdrop-blur-sm text-white' :
          'bg-blue-600/90 backdrop-blur-sm text-white'
        } animate-slideIn`}>
          {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
          {toast.type === 'error' && <XCircle className="w-5 h-5" />}
          {toast.type === 'info' && <Mail className="w-5 h-5" />}
          <span className="font-medium">{toast.message}</span>
          <button
            onClick={() => setToast({ show: false, message: '', type: '' })}
            className="ml-2 text-white/80 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>
      )}
      
    
      <div className="p-4 sm:p-6 md:p-8 relative z-10">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 text-gray-300 hover:text-white transition-all duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-sm sm:text-base">Back to Home</span>
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 pb-8 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-gray-900/70 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-8 shadow-2xl animate-fadeIn">
            
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300 shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-75 -z-10 blur-md"></div>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">WriteAI</h1>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-400 text-sm">
                Sign in to your account to continue
              </p>
            </div>

            
            <div className="space-y-3 mb-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700/50 hover:border-gray-600/50 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <button
                onClick={handleGithubSignIn}
                disabled={isLoading}
                className="w-full bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700/50 hover:border-gray-600/50 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm"
              >
                <Github className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Continue with GitHub
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700/50"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-900/70 px-4 text-gray-400 font-medium backdrop-blur-sm">OR CONTINUE WITH EMAIL</span>
              </div>
            </div>

         
            <form onSubmit={handleSignIn} className="space-y-5">
           
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors duration-300" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-gray-800/40 border border-gray-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 text-white placeholder-gray-400 rounded-xl py-3 pl-11 pr-4 transition-all duration-300 focus:outline-none backdrop-blur-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors duration-300" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-gray-800/40 border border-gray-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 text-white placeholder-gray-400 rounded-xl py-3 pl-11 pr-12 transition-all duration-300 focus:outline-none backdrop-blur-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 border-2 rounded ${rememberMe ? 'bg-blue-500 border-blue-500' : 'border-gray-600'} flex items-center justify-center transition-all duration-300 group-hover:border-blue-400`}>
                    {rememberMe && (
                      <svg className="w-2.5 h-2.5 text-white animate-checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">Remember me</span>
                </label>
                
                <button
                  type="button"
                  className="text-gray-300 hover:text-white transition-colors duration-300 hover:underline focus:outline-none"
                >
                  Forgot password?
                </button>
              </div>

              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

          
            <p className="text-center text-gray-400 text-sm mt-6">
              Don't have an account?{' '}
              <button 
                onClick={() => navigate('/get-started')}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300 hover:underline focus:outline-none"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes checkmark {
          0% {
            transform: scale(0) rotate(45deg);
          }
          50% {
            transform: scale(1.2) rotate(45deg);
          }
          100% {
            transform: scale(1) rotate(45deg);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
          animation-fill-mode: both;
        }

        .animate-checkmark {
          animation: checkmark 0.3s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(300px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;