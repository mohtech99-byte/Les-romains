/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Menu, X, Globe, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navigation: React.FC = () => {
  const { 
    language, setLanguage, 
    currentView, setCurrentView,
    settings,
    setSelectedProjectId, setSelectedProductId, setSelectedServiceId
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);

  const toggleLanguage = () => setLanguage(language === 'en' ? 'ar' : 'en');

  const socialMediaItems = [
    {
      key: 'facebookUrl' as const,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
      label: 'Facebook'
    },
    {
      key: 'instagramUrl' as const,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01" />
        </svg>
      ),
      label: 'Instagram'
    },
    {
      key: 'tiktokUrl' as const,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.97 1.14 2.37 1.86 3.84 2.05v3.83c-1.63-.07-3.2-.67-4.43-1.74-.18-.15-.36-.31-.53-.48v6.78c-.06 2.01-.69 4.02-1.92 5.56-1.57 1.95-4.04 3.06-6.53 2.94-2.52-.12-4.93-1.42-6.26-3.56-1.47-2.35-1.56-5.46-.22-7.89 1.25-2.28 3.64-3.79 6.24-3.9v3.81c-1.12.06-2.26.54-3.02 1.38-.85.95-1.09 2.33-.64 3.51.41 1.09 1.48 1.86 2.64 1.91 1.22.06 2.45-.63 2.94-1.74.2-.44.28-.93.27-1.42V.02z" />
        </svg>
      ),
      label: 'TikTok'
    },
    {
      key: 'youtubeUrl' as const,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
          <polygon points="10 15 15 12 10 9" />
        </svg>
      ),
      label: 'YouTube'
    },
    {
      key: 'linkedinUrl' as const,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
      label: 'LinkedIn'
    }
  ];

  const navItems = [
    { id: 'home', label: 'Home', labelAr: 'الرئيسية' },
    { id: 'about', label: 'About', labelAr: 'من نحن' },
    { id: 'services', label: 'Services', labelAr: 'خدماتنا' },
    { id: 'portfolio', label: 'Portfolio', labelAr: 'أعمالنا' },
    { id: 'products', label: 'CNC Products', labelAr: 'كتالوج المنتجات' },
    { id: 'workshop', label: 'Workshop', labelAr: 'ورشة التقدير' },
    { id: 'contact', label: 'Contact', labelAr: 'اتصل بنا' },
  ];

  const handleNavigate = (viewId: any) => {
    // Clear detail views
    setSelectedProjectId(null);
    setSelectedProductId(null);
    setSelectedServiceId(null);
    
    setCurrentView(viewId);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isRtl = language === 'ar';

  return (
    <header id="main-navigation" className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-black/95 backdrop-blur-md transition-colors duration-300 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* TIMELINESS ROMAN MONOGRAM LOGO */}
          <div 
            onClick={() => handleNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-11 h-11 flex items-center justify-center rounded-none border border-accent/25 bg-zinc-950/50 overflow-hidden group-hover:border-accent transition-colors duration-300">
              <svg 
                viewBox="0 0 100 100" 
                className="w-8 h-8 text-accent fill-none stroke-accent" 
                strokeWidth="5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                {/* L shape */}
                <path d="M 32 25 L 32 75 L 68 75" strokeWidth="6" />
                {/* R shape intertwined */}
                <path d="M 46 25 L 68 25 C 78 25, 78 50, 68 50 L 46 50 M 60 50 L 72 75" strokeWidth="6" />
                {/* Roman balance axis */}
                <line x1="50" y1="15" x2="50" y2="85" strokeWidth="1" strokeDasharray="3,3" className="stroke-accent/40" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-semibold tracking-[0.25em] text-white transition-colors duration-200">
                LES ROMAINS
              </span>
              <span className="text-[9px] tracking-[0.4em] text-accent font-medium -mt-1 uppercase">
                {isRtl ? 'مشغل هندسي راقي' : 'Creative Atelier'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-0.5 rtl:space-x-reverse">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                   key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`px-3 py-2 text-xs uppercase tracking-[0.15em] font-medium rounded-none relative transition-all duration-300 ${
                    isActive 
                      ? 'text-accent font-semibold' 
                      : 'text-gray-300 hover:text-accent'
                  }`}
                >
                  {isRtl ? item.labelAr : item.label}
                  {isActive && (
                    <motion.div 
                      layoutId="activeNavUnderline"
                      className="absolute bottom-0 left-2 right-2 h-[1px] bg-accent"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Utility buttons */}
          <div className="hidden xl:flex items-center gap-2">
            {/* Social Icons (Dynamic) */}
            {socialMediaItems.some(item => settings[item.key]) && (
              <div className="flex items-center gap-1 border-r border-[#1A1A1A] pr-2 mr-2 rtl:border-r-0 rtl:border-l rtl:pr-0 rtl:pl-2 rtl:mr-0 rtl:ml-2">
                {socialMediaItems.map((item) => {
                  const url = settings[item.key];
                  if (!url) return null;
                  return (
                    <a
                      key={item.key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-gray-400 hover:text-accent hover:bg-accent/5 rounded-none transition-all duration-300"
                      title={item.label}
                    >
                      {item.icon}
                    </a>
                  );
                })}
              </div>
            )}

            {/* Lang Switcher */}
            <button 
              onClick={toggleLanguage}
              className="p-2 text-gray-400 hover:text-accent border border-transparent hover:border-accent/15 rounded-none transition-all"
              title={isRtl ? 'English' : 'العربية'}
            >
              <Globe className="w-4 h-4" />
              <span className="sr-only">Toggle language</span>
            </button>



            {/* Admin entry point shortcut */}
            <button
              onClick={() => handleNavigate('admin')}
              className={`p-2 border rounded-none transition-all ${
                currentView === 'admin' 
                  ? 'border-accent/35 text-accent bg-accent/5' 
                  : 'border-transparent text-gray-400 hover:text-accent hover:border-accent/15'
              }`}
              title={isRtl ? 'لوحة التحكم' : 'Admin Area'}
            >
              <User className="w-4 h-4" />
            </button>

            {/* CTA Button */}
            <button
              onClick={() => handleNavigate('quote')}
              className="relative overflow-hidden px-5 py-2.5 rounded-none border border-accent text-xs font-semibold uppercase tracking-[0.15em] text-accent bg-transparent hover:text-white dark:hover:text-black transition-colors duration-500 group ml-2 rtl:ml-0 rtl:mr-2"
            >
              <span className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-[-1]" />
              {isRtl ? 'طلب تسعيرة' : 'Get A Quote'}
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex xl:hidden items-center gap-3">
            {/* Language Switch */}
            <button 
              onClick={toggleLanguage}
              className="p-1.5 text-gray-400 hover:text-accent"
            >
              <Globe className="w-4 h-4" />
            </button>



            {/* Drawer trigger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-200 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden border-b border-zinc-900 bg-black backdrop-blur-lg overflow-hidden"
          >
            <div className="px-4 py-6 space-y-3 flex flex-col items-center">
              {navItems.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`w-full py-2.5 text-xs uppercase tracking-widest font-medium text-center border-b border-zinc-900 ${
                      isActive ? 'text-accent font-bold' : 'text-gray-300'
                    }`}
                  >
                    {isRtl ? item.labelAr : item.label}
                  </button>
                );
              })}
              
              <button
                onClick={() => handleNavigate('admin')}
                className={`w-full py-2.5 text-xs uppercase tracking-widest font-medium text-center border-b border-zinc-900 ${
                  currentView === 'admin' ? 'text-accent font-bold' : 'text-gray-300'
                }`}
              >
                {isRtl ? 'لوحة التحكم للمسؤول' : 'Admin Workspace'}
              </button>

              <button
                onClick={() => handleNavigate('quote')}
                className="mt-4 w-full max-w-xs bg-accent hover:bg-accent-dark text-black font-semibold uppercase tracking-widest py-3 rounded-none text-center text-xs transition-colors"
              >
                {isRtl ? 'طلب تسعيرة فورية' : 'Request Quotation'}
              </button>

              {/* Mobile Social Media Icons */}
              {socialMediaItems.some(item => settings[item.key]) && (
                <div className="flex justify-center gap-3 pt-4 w-full border-t border-zinc-900 mt-2">
                  {socialMediaItems.map((item) => {
                    const url = settings[item.key];
                    if (!url) return null;
                    return (
                      <a
                        key={item.key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 border border-zinc-900 flex items-center justify-center text-gray-400 hover:text-accent hover:border-accent hover:bg-accent/5 transition-all duration-300"
                        title={item.label}
                      >
                        {item.icon}
                      </a>
                    );
                  })}
                </div>
              )}

              {/* Mobile Contact Quick-Access Section */}
              <div className="w-full max-w-xs pt-6 mt-4 border-t border-zinc-900 text-center space-y-3 font-sans">
                <span className="text-[9px] uppercase font-mono tracking-widest text-accent font-bold block">
                  {isRtl ? 'الاتصال المباشر بالمشغل' : 'DIRECT ATELIER CONTACT'}
                </span>
                
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">{isRtl ? 'المالك: ساجد شيباكي' : 'Owner: Sadjed Chebaki'}</p>
                    <div className="flex flex-col gap-1 mt-1 font-mono text-xs font-bold text-white">
                      <a href="tel:+213675858793" className="hover:text-accent transition-colors">+213 (0) 675 858 793</a>
                      <a href="tel:+213552851836" className="hover:text-accent transition-colors">+213 (0) 552 851 836</a>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">{isRtl ? 'مسؤول المشاريع: عبد النور' : 'Projects: Abdenour'}</p>
                    <a href="tel:+213656229615" className="font-mono text-xs font-bold text-white hover:text-accent transition-colors block mt-0.5">
                      +213 (0) 656 229 615
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
