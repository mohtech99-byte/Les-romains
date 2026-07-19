/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Send } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, settings, setCurrentView } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const isRtl = language === 'ar';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer id="main-footer" className="bg-[#0F0F0F] text-gray-300 border-t border-[#1A1A1A] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-[#1A1A1A] pb-12">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex items-center justify-center rounded-none border border-accent/25 bg-zinc-950/50 overflow-hidden shrink-0">
                <svg
                  viewBox="0 0 100 100"
                  className="w-7 h-7 text-accent fill-none stroke-accent"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M 32 25 L 32 75 L 68 75" strokeWidth="6" />
                  <path d="M 46 25 L 68 25 C 78 25, 78 50, 68 50 L 46 50 M 60 50 L 72 75" strokeWidth="6" />
                  <line x1="50" y1="15" x2="50" y2="85" strokeWidth="1" strokeDasharray="3,3" className="stroke-accent/40" />
                </svg>
              </div>
              <span className="font-serif text-xl font-bold tracking-[0.25em] text-white">
                LES ROMAINS
              </span>
            </div>
            <p className="text-xs text-gray-400 font-sans leading-relaxed">
              {isRtl 
                ? 'استوديو تصنيع متخصص في الديكورات الجدارية، أسطح PMMA وPVC، حلول MDF، والقطع المعمارية المخصصة بدقة CNC.' 
                : 'A decorative manufacturing studio specializing in custom wall panels, PMMA and PVC surfaces, MDF solutions, and architectural decoration — engineered with CNC precision.'}
            </p>
            {/* Social icons */}
            {(() => {
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

              return socialMediaItems.some(item => settings[item.key]) && (
                <div className="flex gap-2 pt-2">
                  {socialMediaItems.map((item) => {
                    const url = settings[item.key];
                    if (!url) return null;
                    return (
                      <a 
                        key={item.key}
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-9 h-9 rounded-none border border-[#1A1A1A] flex items-center justify-center text-gray-400 hover:border-accent hover:text-accent hover:bg-accent/5 transition-all duration-300"
                        title={item.label}
                      >
                        {item.icon}
                      </a>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          {/* Column 2: Studio Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-white font-mono text-accent">
              {isRtl ? 'الملاحة' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button onClick={() => { setCurrentView('home'); window.scrollTo({top:0, behavior:'smooth'}); }} className="hover:text-accent transition-colors">
                  {isRtl ? 'الصفحة الرئيسية' : 'Home'}
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentView('about'); window.scrollTo({top:0, behavior:'smooth'}); }} className="hover:text-accent transition-colors">
                  {isRtl ? 'من نحن وقصتنا' : 'About Atelier'}
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentView('services'); window.scrollTo({top:0, behavior:'smooth'}); }} className="hover:text-accent transition-colors">
                  {isRtl ? 'خدماتنا الهندسية' : 'Engineering Services'}
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentView('portfolio'); window.scrollTo({top:0, behavior:'smooth'}); }} className="hover:text-accent transition-colors">
                  {isRtl ? 'معرض المشاريع الفاخرة' : 'Luxury Portfolio'}
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentView('products'); window.scrollTo({top:0, behavior:'smooth'}); }} className="hover:text-accent transition-colors">
                  {isRtl ? 'كتالوج المنتجات' : 'Product Catalog'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact details */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-white font-mono text-accent">
              {isRtl ? 'إحداثيات الاتصال' : 'Atelier Contact'}
            </h4>
            <ul className="space-y-3 text-xs text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-semibold text-white block text-[10px] uppercase font-mono tracking-wider">{isRtl ? 'الموقع' : 'LOCATION'}</span>
                  <span>{isRtl ? settings.addressAr : settings.address}</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold text-white block text-[10px] uppercase font-mono tracking-wider">{isRtl ? 'جهة الاتصال الرئيسية (ساجد شباكي)' : 'PRIMARY (SADJED CHEBAKI)'}</span>
                  <div className="flex flex-col font-mono text-[11px] space-y-0.5">
                    <a href="tel:+213675858793" className="hover:text-accent transition-colors">+213 (0) 675 858 793</a>
                    <a href="tel:+213552851836" className="hover:text-accent transition-colors">+213 (0) 552 851 836</a>
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-semibold text-white block text-[10px] uppercase font-mono tracking-wider">{isRtl ? 'جهة الاتصال الثانوية (عبد النور)' : 'SECONDARY (ABDENOUR)'}</span>
                  <a href="tel:+213656229615" className="hover:text-accent/80 transition-colors font-mono text-[11px]">+213 (0) 656 229 615</a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-semibold text-white block text-[10px] uppercase font-mono tracking-wider">{isRtl ? 'البريد الإلكتروني' : 'EMAIL'}</span>
                  <a href={`mailto:${settings.contactEmail}`} className="hover:text-accent transition-colors font-mono">
                    {settings.contactEmail}
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-white font-mono text-accent">
              {isRtl ? 'النشرة البريدية' : 'Newsletter'}
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              {isRtl 
                ? 'اشترك للحصول على التحديثات الحصرية وتصاميم الألواح الديكورية والقطع المعمارية الجديدة.' 
                : 'Subscribe to receive new decorative panel releases, technical CNC specification guides, and portfolio catalog editions.'}
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isRtl ? 'البريد الإلكتروني' : 'your@email.com'}
                  required
                  className="w-full bg-[#141414] border border-[#1A1A1A] rounded-none px-3 py-2.5 text-xs focus:outline-none focus:border-accent text-white"
                />
                <button 
                  type="submit" 
                  className="absolute right-1 top-1 bottom-1 px-3 bg-accent hover:bg-accent-dark text-black rounded-none flex items-center justify-center transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              {subscribed && (
                <span className="text-[10px] text-accent font-medium font-mono">
                  {isRtl ? 'تم الاشتراك بنجاح!' : 'Successfully subscribed!'}
                </span>
              )}
            </form>
          </div>

        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 text-[11px] text-gray-500 font-mono">
          <span>
            © {currentYear} LES ROMAINS. {isRtl ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </span>
          <span className="mt-2 md:mt-0 tracking-wider">
            {isRtl ? 'تصميم هندسي فاخر وصناعة رقمية متناهية الدقة' : 'Luxury Engineering & High-Precision Digital Craftsmanship'}
          </span>
        </div>

      </div>
    </footer>
  );
};
