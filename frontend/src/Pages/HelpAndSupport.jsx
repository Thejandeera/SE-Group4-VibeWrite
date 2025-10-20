import React, { useState, useRef } from 'react';
import { 
  Search, MessageCircle, Phone, Mail, Clock, 
  ChevronRight, ExternalLink, BookOpen, Video, 
  FileText, Users, Zap, CheckCircle, Star,
  ArrowRight, HelpCircle, Shield, Globe,
  Smartphone, Monitor, Database, Cloud
} from 'lucide-react';

const HelpAndSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'normal'
  });

  const contactFormRef = useRef(null);

  const categories = [
    { id: 'all', name: 'All Topics', icon: <BookOpen className="w-5 h-5" />, count: 45 },
    { id: 'getting-started', name: 'Getting Started', icon: <Zap className="w-5 h-5" />, count: 12 },
    { id: 'account', name: 'Account & Billing', icon: <Users className="w-5 h-5" />, count: 8 },
    { id: 'technical', name: 'Technical Issues', icon: <Monitor className="w-5 h-5" />, count: 15 },
    { id: 'features', name: 'Features & Tools', icon: <FileText className="w-5 h-5" />, count: 10 }
  ];

  const popularArticles = [
    {
      id: 1,
      title: 'How to optimize your content for SEO',
      description: 'Learn the best practices for improving your SEO scores',
      category: 'features',
      readTime: '5 min read',
      likes: 234
    },
    {
      id: 2,
      title: 'Setting up your account and preferences',
      description: 'Complete guide to configuring your workspace',
      category: 'getting-started',
      readTime: '3 min read',
      likes: 189
    },
    {
      id: 3,
      title: 'Troubleshooting common grammar check issues',
      description: 'Solutions for frequent grammar analysis problems',
      category: 'technical',
      readTime: '4 min read',
      likes: 156
    },
    {
      id: 4,
      title: 'Understanding readability scores',
      description: 'What your readability scores mean and how to improve them',
      category: 'features',
      readTime: '6 min read',
      likes: 278
    }
  ];

  const faqs = [
    {
      question: 'How do I reset my password?',
      answer: 'You can reset your password by clicking on "Forgot Password" on the login page. You\'ll receive an email with instructions to create a new password.',
      category: 'account'
    },
    {
      question: 'What is the difference between free and premium plans?',
      answer: 'Our free plan includes basic grammar checking and SEO analysis, while premium offers advanced features like unlimited analysis, priority support, and detailed reporting.',
      category: 'account'
    },
    {
      question: 'How accurate is the grammar checker?',
      answer: 'Our AI-powered grammar checker is 95% accurate for common writing issues. It continuously learns and improves from user feedback and new data.',
      category: 'technical'
    },
    {
      question: 'Can I use this tool for multiple languages?',
      answer: 'Currently, we support English language analysis. We\'re working on adding support for additional languages in future updates.',
      category: 'features'
    },
    {
      question: 'How do I export my analysis reports?',
      answer: 'You can export reports in PDF, CSV, or HTML format from the analysis results page. Premium users get access to advanced export options.',
      category: 'features'
    },
    {
      question: 'Is my content stored on your servers?',
      answer: 'We take privacy seriously. Your content is processed securely and automatically deleted after analysis, unless you choose to save it for future reference.',
      category: 'account'
    }
  ];

  const supportChannels = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'Live Chat',
      description: 'Instant help from our support team',
      availability: 'Available now',
      responseTime: '< 2 minutes',
      action: 'Start Chat',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: 'Email Support',
      description: 'Detailed assistance via email',
      availability: '24/7',
      responseTime: '< 4 hours',
      action: 'Send Email',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: 'Phone Support',
      description: 'Talk directly with our experts',
      availability: 'Mon-Fri, 9AM-6PM EST',
      responseTime: 'Immediate',
      action: 'Call Now',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const resources = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Documentation',
      description: 'Comprehensive guides and API documentation',
      link: '/docs'
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      link: '/tutorials'
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Blog & Updates',
      description: 'Latest features and writing tips',
      link: '/blog'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Community Forum',
      description: 'Connect with other users',
      link: '/community'
    }
  ];

  const filteredFAQs = faqs.filter(faq => 
    activeCategory === 'all' || faq.category === activeCategory
  ).filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredArticles = popularArticles.filter(article =>
    activeCategory === 'all' || article.category === activeCategory
  ).filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      priority: 'normal'
    });
    
    // Show success message
    alert('Thank you for your message! We\'ll get back to you within 24 hours.');
  };

  const scrollToContact = () => {
    contactFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="relative overflow-hidden bg-white shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 animate-fade-in">
              Help & Support
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in-up">
              Get the help you need to make the most of our platform. Find answers, watch tutorials, or contact our support team.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for help articles, FAQs, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-lg transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Articles', value: '250+' },
            { label: 'Happy Users', value: '50K+' },
            { label: 'Support Tickets', value: '98%' },
            { label: 'Response Time', value: '< 2h' }
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <div className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Categories */}
        <div className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                  activeCategory === category.id
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`p-3 rounded-xl mb-3 ${
                    activeCategory === category.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {category.icon}
                  </div>
                  <div className="font-semibold text-gray-900 mb-1">{category.name}</div>
                  <div className="text-sm text-gray-500">{category.count} articles</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        <div className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Popular Articles</h2>
            <button className="flex items-center text-blue-600 hover:text-blue-700 font-semibold">
              View all articles <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {filteredArticles.slice(0, 4).map((article, index) => (
              <div 
                key={article.id}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                    {article.category.replace('-', ' ')}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {article.readTime}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-4">{article.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm">{article.likes} found helpful</span>
                  </div>
                  <button className="flex items-center text-blue-600 hover:text-blue-700 font-semibold text-sm">
                    Read more <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.map((faq, index) => (
              <div 
                key={index}
                className="mb-4 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                <button
                  onClick={() => setSelectedFAQ(selectedFAQ === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <ChevronRight 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                      selectedFAQ === index ? 'rotate-90' : ''
                    }`} 
                  />
                </button>
                {selectedFAQ === index && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 animate-fade-in">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    <div className="mt-4 flex items-center space-x-4">
                      <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-semibold">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Helpful
                      </button>
                      <button className="flex items-center text-gray-500 hover:text-gray-700 text-sm">
                        Share
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Support Channels */}
        <div className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Get in Touch</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {supportChannels.map((channel, index) => (
              <div 
                key={channel.title}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                style={{ animationDelay: `${0.8 + index * 0.1}s` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${channel.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {channel.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{channel.title}</h3>
                <p className="text-gray-600 mb-4">{channel.description}</p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-2" />
                    {channel.availability}
                  </div>
                  <div className="text-sm text-gray-500">
                    Avg. response: {channel.responseTime}
                  </div>
                </div>
                <button 
                  onClick={scrollToContact}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {channel.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Learning Resources</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <a
                key={resource.title}
                href={resource.link}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                style={{ animationDelay: `${0.9 + index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  {resource.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                <div className="flex items-center text-blue-600 font-semibold text-sm">
                  Explore <ExternalLink className="w-4 h-4 ml-2" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div 
          ref={contactFormRef}
          className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in-up"
          style={{ animationDelay: '1s' }}
        >
          <div className="md:flex">
            {/* Form Section */}
            <div className="md:w-2/3 p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Send us a message</h2>
              <p className="text-gray-600 mb-8">We're here to help and answer any questions you might have.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      placeholder="What's this about?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Sending Message...
                    </div>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>
            
            {/* Info Section */}
            <div className="md:w-1/3 bg-gradient-to-br from-blue-600 to-purple-600 text-white p-8 md:p-12">
              <div className="space-y-8">
                <div>
                  <HelpCircle className="w-12 h-12 mb-4 opacity-90" />
                  <h3 className="text-2xl font-bold mb-4">Need immediate help?</h3>
                  <p className="text-blue-100 leading-relaxed">
                    Our support team is ready to assist you with any questions or issues you might encounter.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-3 opacity-90" />
                    <div>
                      <div className="font-semibold">Response Time</div>
                      <div className="text-blue-100 text-sm">Usually within 2 hours</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 mr-3 opacity-90" />
                    <div>
                      <div className="font-semibold">Secure & Private</div>
                      <div className="text-blue-100 text-sm">Your data is protected</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 mr-3 opacity-90" />
                    <div>
                      <div className="font-semibold">24/7 Support</div>
                      <div className="text-blue-100 text-sm">Always here to help</div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-blue-500">
                  <div className="text-sm text-blue-100 mb-2">Prefer other methods?</div>
                  <div className="space-y-2 text-sm">
                    <div>📧 thejan.info@gmail.com</div>
                    <div>📞 +94 71 886 09 59</div>
                    <div>💬 Live chat available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default HelpAndSupport;