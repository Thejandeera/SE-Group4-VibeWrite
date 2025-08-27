// import { useState, useEffect, useRef } from 'react';
// import { 
//   FiCode, 
//   FiCpu, 
//   FiSearch, 
//   FiEdit, 
//   FiTrendingUp, 
//   FiMail, 
//   FiClock, 
//   FiServer,
//   FiCircle,
//   FiAward,
//   FiLayers,
//   FiCheck
// } from 'react-icons/fi';
// import { motion } from 'framer-motion';

// const App = () => {
//   const [loaded, setLoaded] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);
//   const containerRef = useRef(null);

//   useEffect(() => {
//     setLoaded(true);
    
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsVisible(true);
//         }
//       },
//       { threshold: 0.1 }
//     );
    
//     if (containerRef.current) {
//       observer.observe(containerRef.current);
//     }
    
//     return () => {
//       if (containerRef.current) {
//         observer.unobserve(containerRef.current);
//       }
//     };
//   }, []);

//   // Floating particles background component
//   const FloatingParticles = () => {
//     return (
//       <div className="absolute inset-0 overflow-hidden z-0">
//         {[...Array(15)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-20"
//             initial={{
//               x: Math.random() * 100 + 'vw',
//               y: Math.random() * 100 + 'vh',
//             }}
//             animate={{
//               x: [null, Math.random() * 100 + 'vw'],
//               y: [null, Math.random() * 100 + 'vh'],
//             }}
//             transition={{
//               duration: Math.random() * 20 + 20,
//               repeat: Infinity,
//               repeatType: "reverse",
//             }}
//           />
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
//       <FloatingParticles />
      
//       <div className="max-w-5xl w-full mx-auto z-10" ref={containerRef}>
//         {/* Header */}
//         <motion.header 
//           className="text-center mb-16"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//         >
//           <div className="flex justify-center mb-6">
//             <motion.div 
//               className="relative w-24 h-24"
//               animate={{ rotate: 360 }}
//               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//             >
//               <FiCircle className="w-full h-full text-blue-200" />
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
//                   <FiEdit className="w-8 h-8 text-white" />
//                 </div>
//               </div>
//             </motion.div>
//           </div>
          
//           <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
//             Vibe Write
//           </h1>
//           <p className="text-xl md:text-2xl text-gray-700 font-medium mb-2">
//             AI-Powered Content Creation Studio
//           </p>
//           <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto my-6"></div>
//         </motion.header>

//         {/* Main Content */}
//         <main className="mb-16">
//           {/* Status Card */}
//           <motion.div 
//             className="bg-white rounded-3xl shadow-2xl p-8 mb-16 border border-gray-100 relative overflow-hidden"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.2 }}
//           >
//             <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-100 rounded-full opacity-30"></div>
//             <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-purple-100 rounded-full opacity-30"></div>
            
//             <div className="flex flex-col md:flex-row items-center justify-between mb-6">
//               <div className="flex items-center mb-4 md:mb-0">
//                 <motion.div 
//                   className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4"
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
//                 >
//                   <FiCode className="w-8 h-8 text-blue-600" />
//                 </motion.div>
//                 <h2 className="text-2xl md:text-3xl font-bold text-gray-800">We're Under Development</h2>
//               </div>
              
//               <motion.div 
//                 className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-full"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <FiClock className="mr-2" />
//                 Coming Soon
//               </motion.div>
//             </div>
            
//             <p className="text-center text-gray-700 text-lg mb-6 max-w-2xl mx-auto">
//               We're crafting the ultimate AI-powered content creation experience. Our team is working tirelessly to bring you revolutionary writing tools.
//             </p>
            
//             <div className="flex justify-center">
//               <motion.div 
//                 className="flex items-center"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 1 }}
//               >
//                 <div className="relative w-12 h-12 mr-4">
//                   <motion.div 
//                     className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
//                     animate={{ rotate: 360 }}
//                     transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
//                   />
//                 </div>
//                 <span className="text-gray-600">Crafting something amazing...</span>
//               </motion.div>
//             </div>
//           </motion.div>

//           {/* Features Grid */}
//           <motion.h3 
//             className="text-3xl font-bold text-center mb-12 text-gray-800"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.4 }}
//           >
//             Revolutionary Features We're Building
//           </motion.h3>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
//             {/* Feature 1 */}
//             <motion.div 
//               className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               whileHover={{ y: -5 }}
//             >
//               <div className="flex items-center mb-4">
//                 <motion.div 
//                   className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mr-4"
//                   whileHover={{ rotate: 360 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <FiEdit className="w-6 h-6 text-purple-600" />
//                 </motion.div>
//                 <h4 className="font-bold text-lg text-gray-800">AI Writing Assistant</h4>
//               </div>
//               <p className="text-gray-700">Generate high-quality content with our advanced AI algorithms that understand context and tone.</p>
//             </motion.div>

//             {/* Feature 2 */}
//             <motion.div 
//               className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.4 }}
//               whileHover={{ y: -5 }}
//             >
//               <div className="flex items-center mb-4">
//                 <motion.div 
//                   className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mr-4"
//                   whileHover={{ rotate: 360 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <FiSearch className="w-6 h-6 text-blue-600" />
//                 </motion.div>
//                 <h4 className="font-bold text-lg text-gray-800">SEO Optimization</h4>
//               </div>
//               <p className="text-gray-700">Optimize your content for search engines with smart recommendations and keyword analysis.</p>
//             </motion.div>

//             {/* Feature 3 */}
//             <motion.div 
//               className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.6 }}
//               whileHover={{ y: -5 }}
//             >
//               <div className="flex items-center mb-4">
//                 <motion.div 
//                   className="w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center mr-4"
//                   whileHover={{ rotate: 360 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <FiTrendingUp className="w-6 h-6 text-cyan-600" />
//                 </motion.div>
//                 <h4 className="font-bold text-lg text-gray-800">Grammar Master</h4>
//               </div>
//               <p className="text-gray-700">Eliminate errors and polish your writing to perfection with our advanced grammar checking.</p>
//             </motion.div>
            
//             {/* Feature 4 */}
//             <motion.div 
//               className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.8 }}
//               whileHover={{ y: -5 }}
//             >
//               <div className="flex items-center mb-4">
//                 <motion.div 
//                   className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mr-4"
//                   whileHover={{ rotate: 360 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <FiAward className="w-6 h-6 text-green-600" />
//                 </motion.div>
//                 <h4 className="font-bold text-lg text-gray-800">Content Scoring</h4>
//               </div>
//               <p className="text-gray-700">Get instant feedback on your content quality with our AI-powered scoring system.</p>
//             </motion.div>
            
//             {/* Feature 5 */}
//             <motion.div 
//               className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 1.0 }}
//               whileHover={{ y: -5 }}
//             >
//               <div className="flex items-center mb-4">
//                 <motion.div 
//                   className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mr-4"
//                   whileHover={{ rotate: 360 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <FiLayers className="w-6 h-6 text-orange-600" />
//                 </motion.div>
//                 <h4 className="font-bold text-lg text-gray-800">Tone Adjustment</h4>
//               </div>
//               <p className="text-gray-700">Adapt your writing tone for different audiences and purposes with a single click.</p>
//             </motion.div>
            
//             {/* Feature 6 */}
//             <motion.div 
//               className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 1.2 }}
//               whileHover={{ y: -5 }}
//             >
//               <div className="flex items-center mb-4">
//                 <motion.div 
//                   className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center mr-4"
//                   whileHover={{ rotate: 360 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <FiCheck className="w-6 h-6 text-pink-600" />
//                 </motion.div>
//                 <h4 className="font-bold text-lg text-gray-800">Plagiarism Check</h4>
//               </div>
//               <p className="text-gray-700">Ensure your content is original with our comprehensive plagiarism detection system.</p>
//             </motion.div>
//           </div>

//           {/* Progress Section */}
//           <motion.div 
//             className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden relative"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.6 }}
//           >
//             <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-16 translate-x-16"></div>
//             <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500 opacity-10 rounded-full -translate-x-12 translate-y-12"></div>
            
//             <h3 className="text-2xl font-bold text-center mb-8">Our Development Progress</h3>
//             <div className="space-y-8">
//               {/* Progress Bar */}
//               <div>
//                 <div className="flex justify-between mb-3">
//                   <span>Overall Completion</span>
//                   <span>65%</span>
//                 </div>
//                 <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
//                   <motion.div 
//                     className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full relative"
//                     initial={{ width: 0 }}
//                     animate={{ width: '65%' }}
//                     transition={{ duration: 2, ease: "easeOut" }}
//                   >
//                     <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-20 animate-pulse"></div>
//                   </motion.div>
//                 </div>
//               </div>

//               {/* Progress Items */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="flex items-center">
//                   <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mr-4">
//                     <FiServer className="w-5 h-5 text-white" />
//                   </div>
//                   <div>
//                     <p className="font-medium">Backend API</p>
//                     <p className="text-sm text-gray-300">Complete</p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center">
//                   <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-4">
//                     <FiCpu className="w-5 h-5 text-white" />
//                   </div>
//                   <div>
//                     <p className="font-medium">AI Models</p>
//                     <p className="text-sm text-gray-300">In Progress</p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center">
//                   <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center mr-4">
//                     <FiEdit className="w-5 h-5 text-white" />
//                   </div>
//                   <div>
//                     <p className="font-medium">Editor Interface</p>
//                     <p className="text-sm text-gray-300">In Progress</p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center">
//                   <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-4">
//                     <FiTrendingUp className="w-5 h-5 text-white" />
//                   </div>
//                   <div>
//                     <p className="font-medium">SEO Tools</p>
//                     <p className="text-sm text-gray-300">Planning</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </main>

//         {/* Footer */}
//         <motion.footer 
//           className="text-center mt-20"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 1 }}
//         >
//           <h4 className="font-bold text-2xl mb-6 text-gray-800">Stay Updated</h4>
//           <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
//             Be the first to know when we launch. Join our early access list for exclusive updates and features.
//           </p>
          
//           <motion.div 
//             className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-10"
//             whileInView={{ opacity: 1, y: 0 }}
//             initial={{ opacity: 0, y: 20 }}
//             transition={{ duration: 0.5 }}
//           >
//             <div className="relative">
//               <FiMail className="absolute left-4 top-3.5 text-gray-400" />
//               <input 
//                 type="email" 
//                 placeholder="Your email address" 
//                 className="pl-12 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80 transition-all"
//               />
//             </div>
//             <motion.button 
//               className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-8 rounded-lg hover:shadow-lg transition-shadow"
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//             >
//               Notify Me
//             </motion.button>
//           </motion.div>
          
//           <div className="border-t border-gray-200 pt-8">
//             <p className="text-gray-600 text-sm">© {new Date().getFullYear()} Vibe Write. All rights reserved.</p>
//           </div>
//         </motion.footer>
//       </div>
//     </div>
//   );
// };

// export default App;

import React from 'react'
import LandingPage from '../Pages/LandingPage'

const App = () => {
  return (
    <div>
      <LandingPage />
    </div>
  )
}

export default App