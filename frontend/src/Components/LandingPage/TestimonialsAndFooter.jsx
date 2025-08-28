import React from 'react';
import { Star } from 'lucide-react';

export default function TestimonialsAndFooter() {
  const testimonials = [
    {
      rating: 5,
      text: "This AI writing assistant has transformed how our team creates content. The SEO suggestions are incredibly accurate.",
      name: "Sarah Chen",
      title: "Content Manager at TechCorp",
      initials: "SC"
    },
    {
      rating: 5,
      text: "The grammar checker caught issues I completely missed. It's like having a professional editor available 24/7.",
      name: "Marcus Johnson",
      title: "Freelance Writer at Independent",
      initials: "MJ"
    },
    {
      rating: 5,
      text: "Our content quality has improved dramatically. The AI suggestions help us maintain consistency across all our writing.",
      name: "Emily Rodriguez",
      title: "Marketing Director at StartupXYZ",
      initials: "ER"
    }
  ];

  const footerLinks = {
    Product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'API', href: '#api' }
    ],
    Company: [
      { label: 'About', href: '#about' },
      { label: 'Blog', href: '#blog' },
      { label: 'Careers', href: '#careers' }
    ],
    Legal: [
      { label: 'Privacy', href: '#privacy' },
      { label: 'Terms', href: '#terms' },
      { label: 'Contact', href: '#contact' }
    ]
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
        }`}
      />
    ));
  };

  return (
    <div className="bg-black text-white">
      {/* Testimonials Section */}
      <div className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Loved by Writers Everywhere
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
              See what our users have to say about their experience with WriteAI.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6 sm:p-8 hover:bg-gray-800/50 hover:border-gray-700/50 transition-all duration-300"
              >
                {/* Stars */}
                <div className="flex items-center mb-4">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Quote */}
                <blockquote className="text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {testimonial.title}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                    <path d="M14.5 2c1.38 0 2.5 1.12 2.5 2.5v15c0 1.38-1.12 2.5-2.5 2.5h-5C8.12 22 7 20.88 7 19.5v-15C7 3.12 8.12 2 9.5 2h5zm-5 2C8.67 4 8 4.67 8 5.5v13c0 .83.67 1.5 1.5 1.5h5c.83 0 1.5-.67 1.5-1.5v-13c0-.83-.67-1.5-1.5-1.5h-5zm1.5 2h3c.28 0 .5.22.5.5s-.22.5-.5.5h-3c-.28 0-.5-.22-.5-.5s.22-.5.5-.5zm0 2h3c.28 0 .5.22.5.5s-.22.5-.5.5h-3c-.28 0-.5-.22-.5-.5s.22-.5.5-.5z"/>
                  </svg>
                </div>
                <span className="font-semibold text-lg">WriteAI</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering writers with AI-powered tools for better content creation.
              </p>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="font-semibold text-white mb-4">{category}</h3>
                <ul className="space-y-3">
                  {links.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-gray-800/50 text-center">
            <p className="text-gray-400">
              © 2025 WriteAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}