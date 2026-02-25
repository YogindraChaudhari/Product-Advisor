import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle, alternativeLink, alternativeText, alternativeAction }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 font-sans leading-normal tracking-tight relative">
      {/* Decorative Orbs for Auth Page */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#DD2D4A]/20 rounded-full blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#F26A8D]/20 rounded-full blur-[120px] animate-pulse-slow delayed-1000"></div>

      <div className="w-full max-w-6xl glass-card rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row md:min-h-[750px] border border-white/10 relative z-10">
        
        {/* Left Side - Hero Section */}
        <div className="hidden md:flex md:w-5/12 relative overflow-hidden items-center justify-center p-12 border-r border-brand-primary/10 transition-colors duration-500
          dark:bg-gradient-to-br dark:from-[#2d0208] dark:to-[#0a0102] 
          bg-gradient-to-br from-[#fff8f9] to-[#ffffff]">
          
          {/* Enhanced Decorative Glows */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] left-[-20%] w-[100%] h-[100%] bg-brand-primary/5 rounded-full blur-[120px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[100%] h-[100%] bg-brand-secondary/5 rounded-full blur-[120px] animate-pulse-slow delayed-1000"></div>
          </div>

          <div className="relative z-10 text-center space-y-10">
            {/* Logo Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-14 h-14 bg-gradient-to-tr from-[#DD2D4A] to-[#F26A8D] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand-primary/20 group-hover:scale-110 transition-transform">
                <Sparkles size={28} fill="currentColor" />
              </div>
              <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#DD2D4A] to-[#F26A8D]">
                Product Advisor
              </span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-[1.1] dark:text-white text-main">
                Welcome to <br/> 
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#DD2D4A] to-[#F26A8D]">Product Advisor</span>
              </h1>
              <p className="dark:text-muted text-gray-500 text-lg max-w-xs mx-auto leading-relaxed font-medium">
                Experience the power of AI-driven product recommendations tailored just for you.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="w-full md:w-7/12 p-6 md:p-20 flex flex-col justify-center bg-app-bg/40 backdrop-blur-md">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-6 md:mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-main mb-2 tracking-tight">{title}</h2>
              <p className="text-muted font-medium text-base md:text-lg leading-snug">{subtitle}</p>
            </div>
            
            {children}
            
            <div className="mt-6 md:mt-10 pt-6 md:pt-8 border-t border-brand-primary/10 text-center">
              <p className="text-muted font-medium text-sm md:text-base">
                {alternativeText} {' '}
                <Link to={alternativeLink} className="text-[#DD2D4A] font-bold hover:text-[#F26A8D] transition-colors ml-1">
                  {alternativeAction}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
