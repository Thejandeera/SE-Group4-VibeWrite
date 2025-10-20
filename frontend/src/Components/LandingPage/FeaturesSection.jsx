import React from 'react';
import { useTranslation } from 'react-i18next';
import { Edit3, TrendingUp, Shield, Globe } from 'lucide-react';

export default function FeaturesSection() {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: Edit3,
      title: t('features.aiWriting.title'),
      description: t('features.aiWriting.description')
    },
    {
      icon: TrendingUp,
      title: t('features.seoOptimization.title'),
      description: t('features.seoOptimization.description')
    },
    {
      icon: Shield,
      title: t('features.grammarPlagiarism.title'),
      description: t('features.grammarPlagiarism.description')
    },
    {
      icon: Globe,
      title: t('features.multiLanguage.title'),
      description: t('features.multiLanguage.description')
    }
  ];

  return (
    <div className="bg-black text-white py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
 
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            {t('features.title')}
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {t('features.subtitle')}
          </p>
        </div>

       
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6 sm:p-8 hover:bg-gray-800/50 hover:border-gray-700/50 transition-all duration-300 hover:transform hover:scale-105"
              >
         
                <div className="mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center group-hover:from-purple-500 group-hover:to-blue-500 transition-all duration-300">
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                </div>

              
                <div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>

            
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}