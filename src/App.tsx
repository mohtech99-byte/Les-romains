/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { PortfolioGrid } from './components/PortfolioGrid';
import { ProductCatalog } from './components/ProductCatalog';
import { QuoteForm } from './components/QuoteForm';
import { Dashboard } from './components/Dashboard';
import { BeforeAfter } from './components/BeforeAfter';
import { PublicWorkshopEstimator } from './components/PublicWorkshopEstimator';
import { TrackOrder } from './components/TrackOrder';
import { 
  Home, Store, Cpu, Flame, Layers, Coffee, Compass, ShieldCheck, 
  Award, Phone, Mail, MapPin, Clock, ArrowRight, Lock, Star, Sliders, CheckCircle2,
  Gem, PanelsTopLeft, Grid3x3, Sparkles, PenTool, Landmark, Briefcase, UtensilsCrossed, Wand2
} from 'lucide-react';
import { motion, AnimatePresence, useInView, animate } from 'motion/react';
interface CounterProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

const AnimatedCounter = ({ value, decimals = 0, prefix = '', suffix = '' }: CounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 2,
        ease: [0.16, 1, 0.3, 1],
        onUpdate(latest) {
          setDisplayValue(latest);
        },
      });
      return () => controls.stop();
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
};
const MainAppContent: React.FC = () => {
  const { 
    language, currentView, setCurrentView, 
    services, projects, products, testimonials, settings,
    selectedServiceId, setSelectedServiceId,
    user, userRole, isLoadingAuth, authError, login, logout
  } = useApp();

  const isRtl = language === 'ar';

  // Deep-link support: /?track=LR-2026-00125 jumps straight to the tracking
  // page with the ID prefilled (used by the QR code on the official PDF).
  const [trackInitialId, setTrackInitialId] = useState<string | undefined>(undefined);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const trackParam = params.get('track');
    if (trackParam) {
      setTrackInitialId(trackParam);
      setCurrentView('track');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Admin login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [loginFormError, setLoginFormError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginFormError(null);
    setIsSubmittingLogin(true);
    try {
      await login(loginEmail, loginPassword);
    } catch (error) {
      setLoginFormError(
        isRtl
          ? 'فشل تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور.'
          : 'Sign in failed. Please check your email and password and try again.'
      );
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  // Helper mapping string icon names to Lucide elements
  const renderServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home': return <Home className="w-6 h-6 text-accent" />;
      case 'Store': return <Store className="w-6 h-6 text-accent" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-accent" />;
      case 'Flame': return <Flame className="w-6 h-6 text-accent" />;
      case 'Layers': return <Layers className="w-6 h-6 text-accent" />;
      case 'Coffee': return <Coffee className="w-6 h-6 text-accent" />;
      case 'Gem': return <Gem className="w-6 h-6 text-accent" />;
      case 'PanelsTopLeft': return <PanelsTopLeft className="w-6 h-6 text-accent" />;
      case 'Grid3x3': return <Grid3x3 className="w-6 h-6 text-accent" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-accent" />;
      case 'PenTool': return <PenTool className="w-6 h-6 text-accent" />;
      case 'Landmark': return <Landmark className="w-6 h-6 text-accent" />;
      case 'Briefcase': return <Briefcase className="w-6 h-6 text-accent" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-6 h-6 text-accent" />;
      case 'Wand2': return <Wand2 className="w-6 h-6 text-accent" />;
      default: return <Compass className="w-6 h-6 text-accent" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col font-sans overflow-x-hidden">
      
      {/* 1. Navbar Navigation */}
      <Navigation />

      {/* 2. Main Page Router / Wrapper */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          
          {/* VIEW: HOME */}
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-24 pb-20"
            >
              {/* Luxury Fullscreen Hero */}
              <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-black text-white border-b border-[#1A1A1A]">
                {/* Slow zoom background */}
                <div className="absolute inset-0 z-0">
                  <motion.img 
                    initial={{ scale: 1.15 }}
                    animate={{ scale: 1.0 }}
                    transition={{ duration: 15, ease: 'easeOut' }}
                    src={settings.heroBgImage || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600"}
                    alt="Luxury architectural panels"
                    className="w-full h-full object-cover opacity-50"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/45 to-black" />
                </div>

                {/* Golden Architectural Line Grid Overlay */}
                <div className="absolute inset-0 z-1 pointer-events-none editorial-grid opacity-30" />

                <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center pt-20 pb-32 sm:pb-40">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                  >
                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.45em] text-accent font-semibold font-mono block">
                      {isRtl 
                        ? (settings.heroBadgeAr || 'تصنيع ديكوري بدقة CNC') 
                        : (settings.heroBadge || 'DECORATIVE MANUFACTURING, CNC-ENGINEERED')}
                    </span>
                    
                    <h1 className="font-serif text-3xl sm:text-5xl md:text-[4.25rem] xl:text-[4.75rem] font-normal leading-[1.15] tracking-tight max-w-4xl mx-auto text-white">
                      {isRtl ? (
                        <span>{settings.heroTitleAr || 'دقة الديكور، مصنّعة بتقنية CNC'}</span>
                      ) : (
                        <span>{settings.heroTitle || 'Decorative Precision, Engineered by CNC'}</span>
                      )}
                    </h1>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-sm sm:text-base text-[#D6D3D1] max-w-xl sm:max-w-2xl mx-auto font-sans leading-relaxed mt-6"
                  >
                    {isRtl 
                      ? (settings.heroSubtitleAr || 'ليز رومان استوديو تصنيع ديكوري حديث، متخصص في تصميم وتصنيع الألواح الجدارية المخصصة، وأسطح PMMA وPVC، وحلول MDF، والديكور المعماري للمساحات السكنية والتجارية والفندقية.') 
                      : (settings.heroSubtitle || 'LES ROMAINS is a modern decorative manufacturing studio, engineering custom wall panels, PMMA and PVC surfaces, MDF solutions, and architectural decoration for residential, commercial and hospitality spaces.')}
                  </motion.p>

                  {/* Material readout — a quiet "spec sheet" moment that reinforces
                      precision manufacturing right under the headline */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap items-center justify-center gap-2 mt-6"
                  >
                    {['PMMA', 'PVC', 'MDF', isRtl ? 'معدن' : 'METAL'].map((mat) => (
                      <span key={mat} className="material-tag">{mat}</span>
                    ))}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center justify-center font-mono mt-10 w-full max-w-md sm:max-w-xl mx-auto"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentView('quote')}
                      className="w-full sm:w-auto h-14 px-10 bg-accent hover:bg-white text-black hover:text-black font-semibold uppercase text-xs tracking-widest rounded-none border border-accent hover:border-white transition-all duration-300 shadow-xl cursor-pointer flex items-center justify-center"
                    >
                      {isRtl ? 'احصل على عرض أسعار' : 'Request Estimation'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentView('portfolio')}
                      className="w-full sm:w-auto h-14 px-10 border border-white/25 hover:border-accent text-white hover:text-accent font-semibold uppercase text-xs tracking-widest rounded-none transition-all duration-300 bg-transparent hover:bg-accent/5 cursor-pointer flex items-center justify-center"
                    >
                      {isRtl ? 'معرض المشاريع الفاخرة' : 'Explore Portfolio'}
                    </motion.button>
                  </motion.div>
                </div>

                {/* Floating Stats Bar */}
                <div className="absolute bottom-0 left-0 right-0 border-t border-[#1A1A1A] bg-black/90 backdrop-blur-md py-8 hidden lg:block z-20">
                  <div className="mx-auto max-w-5xl px-8 flex justify-between items-center text-center text-xs font-mono tracking-widest uppercase gap-12">
                    <div className="flex-1">
                      <span className="text-accent text-xl sm:text-2xl font-bold block mb-1"><AnimatedCounter value={150} suffix="+" /></span>
                      <span className="text-[10px] text-[#D6D3D1] tracking-[0.22em] font-medium block">
                        {isRtl ? (settings.homeStat1LabelAr || 'مشروع ديكوري منجز') : (settings.homeStat1Label || 'DECORATIVE PROJECTS DELIVERED')}
                      </span>
                    </div>
                    <div className="border-l border-[#1A1A1A] h-10" />
                    <div className="flex-1">
                      <span className="text-accent text-xl sm:text-2xl font-bold block mb-1"><AnimatedCounter value={0.2} decimals={1} prefix="< " suffix="mm" /></span>
                      <span className="text-[10px] text-[#D6D3D1] tracking-[0.22em] font-medium block">
                        {isRtl ? (settings.homeStat2LabelAr || 'نسبة انحراف ميكنة الـ CNC') : (settings.homeStat2Label || 'CNC TOLERANCE THRESHOLD')}
                      </span>
                    </div>
                    <div className="border-l border-[#1A1A1A] h-10" />
                    <div className="flex-1">
                      <span className="text-accent text-xl sm:text-2xl font-bold block mb-1"><AnimatedCounter value={4} /></span>
                      <span className="text-[10px] text-[#D6D3D1] tracking-[0.22em] font-medium block">
                        {isRtl ? (settings.homeStat3LabelAr || 'مواد أساسية: PMMA / PVC / MDF / معدن') : (settings.homeStat3Label || 'CORE MATERIALS: PMMA / PVC / MDF / METAL')}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Statistics for Mobile */}
              <section className="mx-auto max-w-7xl px-4 lg:hidden">
                <div className="grid grid-cols-3 gap-6 text-center bg-black text-white p-8 rounded-none border border-[#1A1A1A] font-mono uppercase tracking-wider text-[10px] divide-x divide-[#1A1A1A] rtl:divide-x-reverse">
                  <div className="px-2">
                    <span className="text-accent text-xl font-bold block mb-1"><AnimatedCounter value={150} suffix="+" /></span>
                    <span className="text-[#D6D3D1] text-[9px] tracking-widest block">
                      {isRtl ? 'مشاريع' : 'Projects'}
                    </span>
                  </div>
                  <div className="px-2">
                    <span className="text-accent text-xl font-bold block mb-1"><AnimatedCounter value={0.2} decimals={1} prefix="< " suffix="mm" /></span>
                    <span className="text-[#D6D3D1] text-[9px] tracking-widest block">
                      {isRtl ? 'دقة CNC' : 'CNC Spec'}
                    </span>
                  </div>
                  <div className="px-2">
                    <span className="text-accent text-xl font-bold block mb-1"><AnimatedCounter value={4} /></span>
                    <span className="text-[#D6D3D1] text-[9px] tracking-widest block">
                      {isRtl ? 'مواد' : 'Materials'}
                    </span>
                  </div>
                </div>
              </section>

              {/* Breathtaking Services Presentation */}
              <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center space-y-3">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-semibold">
                    {isRtl ? 'ما نتقنه من تفاصيل معمارية' : 'ARCHITECTURAL CAPABILITIES'}
                  </span>
                  <h2 className="font-serif text-3xl md:text-5xl text-gray-950 dark:text-white font-medium">
                    {isRtl ? 'الخدمات والتصنيع الفاخر' : 'Services & Custom Fabrication'}
                  </h2>
                  <div className="h-[2px] bg-accent/20 w-16 mx-auto" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {services.slice(0, 6).map((service) => (
                    <div
                      key={service.id}
                      className="precision-frame group relative bg-white dark:bg-gray-900/50 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-900 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                    >
                      <div className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-gray-950">
                        <img 
                          src={service.image} 
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                      <div className="p-6 flex flex-col flex-grow space-y-4 text-left rtl:text-right">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-accent/10 rounded">
                            {renderServiceIcon(service.icon)}
                          </div>
                          <h4 className="font-serif text-xl font-medium text-gray-950 dark:text-white group-hover:text-accent transition-colors">
                            {isRtl ? service.titleAr : service.title}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex-grow">
                          {isRtl ? service.descriptionAr : service.description}
                        </p>
                        <ul className="space-y-1.5 text-[10px] font-mono uppercase text-gray-400">
                          {(isRtl ? service.featuresAr : service.features).slice(0, 3).map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setCurrentView('services')}
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-accent hover:text-white transition-colors group"
                  >
                    {isRtl ? `عرض كل الخدمات (${services.length})` : `View All ${services.length} Services`}
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                  </button>
                </div>
              </section>

              {/* Masterclass Highlight: Interactive Before & After */}
              <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Left: Interactive comparison */}
                  <div className="lg:col-span-7">
                    {projects[0]?.beforeAfterImage?.before && projects[0]?.beforeAfterImage?.after ? (
                      <BeforeAfter 
                        before={projects[0].beforeAfterImage.before} 
                        after={projects[0].beforeAfterImage.after}
                        labelBefore={isRtl ? 'طوب البناء والخرسانة' : '01. RAW SITE WALL'}
                        labelAfter={isRtl ? 'تركيب البلاط البارامتري الفاخر لـ "ليز رومان"' : '02. LES ROMAINS DETAILED FINISH'}
                      />
                    ) : (
                      <div className="w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center text-gray-500 font-mono text-xs">
                        {isRtl ? 'جاري تحميل الصورة التفاعلية...' : 'Loading interactive comparison...'}
                      </div>
                    )}
                  </div>

                  {/* Right: Text description */}
                  <div className="lg:col-span-5 text-left rtl:text-right space-y-6">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-semibold block">
                      {isRtl ? 'دقة التحول والتركيب' : 'ATELIER TRANSFORMATION'}
                    </span>
                    <h3 className="font-serif text-3xl md:text-4xl text-gray-950 dark:text-white font-medium leading-tight">
                      {isRtl ? 'القدرة على إعادة صياغة الفراغات المعمارية' : 'Redefining Spatial Dimensions'}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {isRtl 
                        ? 'شاهد كيف نحول جدران البناء البسيطة والمساحات التجارية الفارغة إلى تحف فنية مذهلة عبر دمج ألواح الـ MDF المزخرفة بالـ CNC والطلاء الناري الخالي من الفواصل.' 
                        : 'Drag the interactive slider to view the transformation of our residential parametric MDF wall panel. We bridge the gap between architectural layouts and high-speed multi-axis computer numerical control (CNC) manufacturing.'}
                    </p>
                    <div className="border-t border-gray-150 dark:border-gray-850 pt-5 space-y-3 font-mono text-[10px] uppercase text-gray-400">
                      <div className="flex justify-between">
                        <span>{isRtl ? 'المشروع' : 'PROJECT'}</span>
                        <span className="text-gray-900 dark:text-white font-semibold">The Parametric Villa</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{isRtl ? 'العميل الفاخر' : 'PRESTIGIOUS CLIENT'}</span>
                        <span className="text-gray-900 dark:text-white font-semibold">Al-Thani Residence, Dubai</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedServiceId('decorative-wall-panels');
                        setCurrentView('services');
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-accent hover:text-accent-dark transition-colors"
                    >
                      {isRtl ? 'المواصفات والتشطيبات' : 'Inspect Specifications'}
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </button>
                  </div>

                </div>
              </section>

              {/* Curated Product Collections preview */}
              <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center space-y-3">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-semibold">
                    {isRtl ? 'كتالوج المنتجات الديكورية' : 'DECORATIVE PRODUCT CATALOGUE'}
                  </span>
                  <h2 className="font-serif text-3xl md:text-5xl text-gray-950 dark:text-white font-medium">
                    {isRtl ? 'ألواح وأنظمة ديكورية جاهزة للطلب' : 'Ready-to-Order Decorative Systems'}
                  </h2>
                  <div className="h-[2px] bg-accent/20 w-16 mx-auto" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  {products.slice(0, 3).map((product, idx) => (
                    <div 
                      key={product.id}
                      onClick={() => {
                        setCurrentView('products');
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      className="precision-frame group cursor-pointer bg-white dark:bg-gray-900/40 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-900/80 shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <div className="aspect-square relative overflow-hidden bg-gray-50 dark:bg-gray-950">
                        <img 
                          src={product.images[0]} 
                          alt={product.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-5 text-left rtl:text-right space-y-2">
                        <span className="text-[9px] uppercase tracking-wider font-mono text-gray-400 block">{product.category}</span>
                        <h4 className="font-serif text-lg font-medium text-gray-900 dark:text-white group-hover:text-accent transition-colors">
                          {isRtl ? product.titleAr : product.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Partners section */}
              <section className="bg-gray-50 dark:bg-gray-950 border-y border-gray-150 dark:border-gray-900 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
                  <span className="text-[9px] uppercase font-mono tracking-[0.2em] text-gray-400 block font-semibold">
                    {isRtl ? 'شركاء النجاح من شركات المقاولات والتطوير العقاري' : 'TRUSTED BY LUXURY DEVELOPERS & ARCHITECTURE ATELIERS'}
                  </span>
                  <div className="flex flex-wrap items-center justify-around gap-8 opacity-45 dark:opacity-60 grayscale hover:grayscale-0 transition-all">
                    {['Studio Rossi Milano', 'Emaar Properties', 'Aurelia Hotels', 'Bensalah Interior', 'Riyadh Villas Co.'].map((partner, idx) => (
                      <span key={idx} className="font-serif text-sm tracking-widest uppercase font-medium dark:text-white">
                        {partner}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* Client Endorsements / Testimonials */}
              <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center space-y-3">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-semibold">
                    {isRtl ? 'ما يقوله عملاؤنا' : 'CLIENT ENDORSEMENTS'}
                  </span>
                  <h2 className="font-serif text-3xl md:text-5xl text-gray-950 dark:text-white font-medium">
                    {isRtl ? 'شهادات فخر واعتزاز' : 'Atelier Reviews'}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {testimonials.map((test) => (
                    <div 
                      key={test.id}
                      className="bg-white dark:bg-gray-900/40 p-8 rounded-xl border border-gray-100 dark:border-gray-900 shadow-lg text-left rtl:text-right space-y-6 relative"
                    >
                      <div className="flex items-center gap-1 text-accent">
                        {[...Array(test.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>

                      <p className="text-xs text-gray-600 dark:text-gray-300 italic leading-relaxed">
                        "{isRtl ? test.contentAr : test.content}"
                      </p>

                      <div className="flex items-center gap-3">
                        <img 
                          src={test.avatar} 
                          alt={test.name}
                          className="w-10 h-10 rounded-full object-cover border border-accent/20"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h5 className="text-xs font-bold text-gray-900 dark:text-white">
                            {isRtl ? test.nameAr : test.name}
                          </h5>
                          <span className="text-[9px] uppercase tracking-wider font-mono text-gray-400">
                            {isRtl ? test.roleAr : test.role}, {isRtl ? test.companyAr : test.company}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Bottom luxury CTA block */}
              <section className="mx-auto max-w-5xl px-4 sm:px-6">
                <div className="relative rounded-2xl overflow-hidden bg-gray-950 text-white p-8 md:p-16 text-center border border-gray-900 space-y-8">
                  {/* Subtle background image */}
                  <img 
                    src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800" 
                    alt="" 
                    className="absolute inset-0 w-full h-full object-cover opacity-10"
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold">
                      {isRtl ? 'ابدأ صياغة رؤيتك الإبداعية اليوم' : 'COMMISSION DESIGN SPECIFICATIONS'}
                    </span>
                    <h3 className="font-serif text-3xl md:text-5xl font-medium tracking-tight">
                      {isRtl ? 'دعنا نصنع لك عملاً استثنائياً يدوم طويلاً' : 'Let’s construct something exceptional together.'}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {isRtl 
                        ? 'يرحب فريقنا الفني والمصممين المعماريين بدراسة مخططاتك الهندسية لتقديم تجربة صياغة مخصصة وفائقة الروعة.' 
                        : 'Our architectural design studio handles projects globally. Reach out to coordinate drawings, CAD layouts, material selections, and direct estimations.'}
                    </p>
                  </div>

                  <div className="relative z-10 pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center font-mono">
                    <button
                      onClick={() => setCurrentView('quote')}
                      className="px-8 py-3.5 bg-accent hover:bg-accent-dark text-black hover:text-white font-semibold uppercase text-xs tracking-widest rounded transition-all shadow-lg"
                    >
                      {isRtl ? 'طلب تسعيرة متكاملة' : 'Begin Quote Builder'}
                    </button>
                    <a
                      href={`https://wa.me/${(settings?.whatsappNumber || '').replace(/\+/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-8 py-3.5 border border-white/25 hover:border-accent text-white hover:text-accent font-semibold uppercase text-xs tracking-widest rounded transition-colors"
                    >
                      {isRtl ? 'محادثة سريعة عبر واتساب' : 'WhatsApp Atelier Chat'}
                    </a>
                  </div>
                </div>
              </section>

            </motion.div>
          )}

          {/* VIEW: ABOUT */}
          {currentView === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 space-y-16 text-left rtl:text-right"
            >
              <div className="text-center space-y-4">
                <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-semibold block">
                  {isRtl ? 'رحلة الفخامة والإتقان الهندسي' : 'THE ATELIER HERITAGE'}
                </span>
                <h2 className="font-serif text-3xl md:text-5xl text-gray-950 dark:text-white font-medium">
                  {isRtl ? 'من نحن وقيمنا الحرفية' : 'Heritage & Craftsmanship'}
                </h2>
                <div className="h-[2px] bg-accent/20 w-16 mx-auto" />
              </div>

              {/* Main philosophy and image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h3 className="font-serif text-2xl md:text-3xl text-gray-900 dark:text-white font-medium leading-tight">
                    {isRtl ? 'مصنّعون متخصصون في الديكور، وليس النجارة' : 'A Decoration Manufacturer, Engineered Like a Machine Shop'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {isRtl 
                      ? 'ليز رومان استوديو تصنيع حديث متخصص حصراً في الديكور: ألواح جدارية، أسطح PMMA وPVC، حلول MDF، وقطع معمارية مخصصة. نستخدم آليات CNC عالية السرعة متعددة المحاور وتقنيات ليزر متطورة لتحويل أي ملف تصميم إلى قطعة نهائية بدقة متناهية.' 
                      : 'LES ROMAINS is a modern manufacturing studio focused exclusively on decoration: wall panels, PMMA and PVC surfaces, MDF solutions, and custom architectural pieces. We run high-speed multi-axis CNC routers and CO2 laser systems that turn a CAD file into a finished, installed piece with repeatable, sub-millimeter accuracy.'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {isRtl 
                      ? 'فريقنا يتكون من مهندسين معماريين، رسامي كاد، وفنيي تشغيل آلات CNC متخصصين في المواد المركبة والبلاستيكية، يركزون على إتقان التفاصيل دون تنازل.' 
                      : 'Our team comprises architectural draftspeople, CAD engineers, and CNC machine operators specialized in composite and polymer substrates, focused on sub-millimeter detailing and clean edge quality on every run.'}
                  </p>
                </div>
                <div className="aspect-4/3 rounded-xl overflow-hidden shadow-xl border border-gray-150 dark:border-gray-850">
                  <img 
                    src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800" 
                    alt="CNC decorative panel manufacturing" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Our materials palette */}
              <div className="space-y-6 bg-gray-50 dark:bg-gray-950 p-6 md:p-10 rounded-xl border border-gray-150 dark:border-gray-900">
                <h4 className="font-serif text-xl md:text-2xl text-gray-950 dark:text-white font-medium">
                  {isRtl ? 'المواد الأساسية ومعايير التشطيب' : 'Core Materials & Finish Standard'}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {isRtl 
                    ? 'نعمل بأربع فئات أساسية من المواد لتغطية كل احتياجات الديكور السكني والتجاري:' 
                    : 'We work across four core substrate families to cover every residential and commercial decoration need:'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-xs">
                  {[
                    { title: 'PMMA / Acrylic', titleAr: 'PMMA / الأكريليك', desc: 'Cast & extruded acrylic, flame-polished edges, backlit and layered assemblies.', descAr: 'أكريليك مصبوب ومبثوق، حواف مصقولة باللهب، تجميعات مضيئة ومتعددة الطبقات.' },
                    { title: 'PVC Panelling', titleAr: 'ألواح PVC', desc: 'Moisture-stable, wipeable panels for humid and high-traffic environments.', descAr: 'ألواح مستقرة أمام الرطوبة وسهلة التنظيف للبيئات الرطبة وعالية الحركة.' },
                    { title: 'MDF Substrates', titleAr: 'قواعد MDF', desc: 'E0 low-formaldehyde boards machined to fine relief and internal-corner detail.', descAr: 'ألواح E0 منخفضة الانبعاثات مفرزة إلى تفاصيل مجسمة وزوايا داخلية دقيقة.' },
                    { title: 'Metal & Composite', titleAr: 'المعادن والمواد المركبة', desc: 'CNC-milled aluminum, brass and composite cladding for accents and facades.', descAr: 'ألومنيوم ونحاس ومواد مركبة مفرزة بـ CNC للتفاصيل والواجهات الخارجية.' }
                  ].map((mat, idx) => (
                    <div key={idx} className="precision-frame bg-white dark:bg-gray-900 p-5 rounded border border-gray-150 dark:border-gray-850 space-y-2">
                      <h5 className="font-bold text-accent">{isRtl ? mat.titleAr : mat.title}</h5>
                      <p className="text-[11px] text-gray-500 leading-relaxed">{isRtl ? mat.descAr : mat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW: SERVICES */}
          {currentView === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 space-y-16 text-left rtl:text-right"
            >
              <div className="text-center space-y-4">
                <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-semibold block">
                  {isRtl ? 'خدماتنا المتخصصة بالتفصيل' : 'DETAILED CAPABILITIES'}
                </span>
                <h2 className="font-serif text-3xl md:text-5xl text-gray-950 dark:text-white font-medium">
                  {isRtl ? 'الأشغال والحلول المعمارية' : 'Engineering Services & Systems'}
                </h2>
                <div className="h-[2px] bg-accent/20 w-16 mx-auto" />
              </div>

              {/* Main Services detailed stack */}
              <div className="space-y-12">
                {services.map((service, idx) => {
                  const isEven = idx % 2 === 0;
                  return (
                    <div 
                      key={service.id}
                      className={`grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center py-8 border-b border-gray-150 dark:border-gray-850 last:border-0 ${
                        isEven ? '' : 'md:flex-row-reverse'
                      }`}
                    >
                      {/* Text details (7 cols) */}
                      <div className={`md:col-span-7 space-y-4 ${isEven ? 'order-2 md:order-1' : 'order-2'}`}>
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-accent/10 rounded">
                            {renderServiceIcon(service.icon)}
                          </div>
                          <h3 className="font-serif text-2xl md:text-3xl text-gray-950 dark:text-white font-medium">
                            {isRtl ? service.titleAr : service.title}
                          </h3>
                        </div>

                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                          {isRtl ? service.fullDescriptionAr : service.fullDescription}
                        </p>

                        <div className="space-y-2">
                          <h5 className="text-[10px] uppercase font-mono tracking-wider text-accent font-semibold">
                            {isRtl ? 'تتضمن الخدمة:' : 'Standard service specifications include:'}
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {(isRtl ? service.featuresAr : service.features).map((feat, fIdx) => (
                              <div key={fIdx} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            onClick={() => setCurrentView('quote')}
                            className="px-5 py-2.5 bg-accent/10 hover:bg-accent text-accent hover:text-black text-[10px] tracking-widest font-mono font-bold uppercase rounded transition-colors"
                          >
                            {isRtl ? 'اطلب تسعير هذه الخدمة' : 'Request Estimations for this Scope'}
                          </button>
                        </div>
                      </div>

                      {/* Image panel (5 cols) */}
                      <div className={`md:col-span-5 ${isEven ? 'order-1 md:order-2' : 'order-1'}`}>
                        <div className="aspect-video sm:aspect-4/3 rounded-xl overflow-hidden shadow-lg border border-gray-150 dark:border-gray-850">
                          <img 
                            src={service.image} 
                            alt={service.title} 
                            className="w-full h-full object-cover hover:scale-103 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* VIEW: PORTFOLIO */}
          {currentView === 'portfolio' && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-12"
            >
              <div className="text-center space-y-4">
                <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-semibold block">
                  {isRtl ? 'معرض أعمالنا الحائز على الجوائز' : 'ARCHITECTURAL PORTFOLIO'}
                </span>
                <h2 className="font-serif text-3xl md:text-5xl text-gray-950 dark:text-white font-medium">
                  {isRtl ? 'دراسات الحالة والمشاريع المعمارية' : 'Case Studies & Architectural Projects'}
                </h2>
                <div className="h-[2px] bg-accent/20 w-16 mx-auto" />
              </div>

              <PortfolioGrid />
            </motion.div>
          )}

          {/* VIEW: PRODUCTS */}
          {currentView === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-12"
            >
              <div className="text-center space-y-4">
                <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-semibold block">
                  {isRtl ? 'الكتالوج الديكوري الدقيق' : 'CNC-MANUFACTURED CATALOGUE'}
                </span>
                <h2 className="font-serif text-3xl md:text-5xl text-gray-950 dark:text-white font-medium">
                  {isRtl ? 'ألواح ديكورية وأنظمة مخصصة' : 'Decorative Panels & Custom Systems'}
                </h2>
                <div className="h-[2px] bg-accent/20 w-16 mx-auto" />
              </div>

              <ProductCatalog />
            </motion.div>
          )}

          {/* VIEW: WORKSHOP ESTIMATOR (public, customer-facing) */}
          {currentView === 'workshop' && (
            <motion.div
              key="workshop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PublicWorkshopEstimator />
            </motion.div>
          )}

          {/* VIEW: TRACK ORDER (public) */}
          {currentView === 'track' && (
            <motion.div
              key="track"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TrackOrder initialId={trackInitialId} />
            </motion.div>
          )}

          {/* VIEW: QUOTE */}
          {currentView === 'quote' && (
            <motion.div
              key="quote"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-12"
            >
              <div className="text-center space-y-4">
                <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-semibold block">
                  {isRtl ? 'نظام التسعير الاحترافي للورشة' : 'ATELIER ESTIMATIONS'}
                </span>
                <h2 className="font-serif text-3xl md:text-5xl text-gray-950 dark:text-white font-medium">
                  {isRtl ? 'بناء عرض فني ومالي لمشروعك' : 'Request A Project Proposal'}
                </h2>
                <div className="h-[2px] bg-accent/20 w-16 mx-auto" />
              </div>

              <QuoteForm />
            </motion.div>
          )}

          {/* VIEW: CONTACT */}
          {currentView === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 space-y-20 text-left rtl:text-right"
            >
              <div className="text-center space-y-4">
                <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-semibold block">
                  {isRtl ? 'تواصل معنا مباشرة' : 'GET IN TOUCH'}
                </span>
                <h2 className="font-serif text-3xl md:text-5xl text-gray-950 dark:text-white font-normal tracking-tight">
                  {isRtl ? 'طلب استشارة وموقع المشغل' : 'Atelier Coordinates & Inquiry'}
                </h2>
                <div className="h-[1px] bg-accent/30 w-24 mx-auto" />
              </div>

              {/* Grid block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                
                {/* Contact detail lists */}
                <div className="space-y-10 font-sans">
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl md:text-3xl text-gray-900 dark:text-white font-normal tracking-tight">
                      {isRtl ? 'المشغل الرئيسي والمقر' : 'Headquarters & Primary Contact'}
                    </h3>
                    <p className="text-xs text-gray-400 font-mono tracking-wide uppercase">
                      {isRtl ? 'تحت إدارة ساجد شيباكي' : 'Managed by Sadjed Chebaki'}
                    </p>
                  </div>

                  <div className="space-y-8 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-150 dark:border-gray-800 rounded">
                        <MapPin className="w-5 h-5 text-accent shrink-0" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-950 dark:text-white block uppercase font-mono text-[10px] tracking-widest mb-1">
                          {isRtl ? 'العنوان والموقع' : 'ATELIER LOCATION'}
                        </span>
                        <p className="text-sm text-gray-800 dark:text-gray-300">
                          {isRtl ? 'باتنة، الجزائر' : 'Batna, Algeria'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-150 dark:border-gray-800 rounded">
                        <Phone className="w-5 h-5 text-accent shrink-0" />
                      </div>
                      <div className="space-y-1">
                        <span className="font-semibold text-gray-950 dark:text-white block uppercase font-mono text-[10px] tracking-widest mb-1">
                          {isRtl ? 'جهة الاتصال الرئيسية (ساجد شيباكي)' : 'PRIMARY CONTACT (SADJED CHEBAKI)'}
                        </span>
                        <div className="flex flex-col gap-1 font-mono text-sm font-semibold text-gray-900 dark:text-white">
                          <a href="tel:+213675858793" className="hover:text-accent transition-colors">+213 (0) 675 858 793</a>
                          <a href="tel:+213552851836" className="hover:text-accent transition-colors">+213 (0) 552 851 836</a>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-150 dark:border-gray-800 rounded">
                        <Phone className="w-5 h-5 text-accent shrink-0" />
                      </div>
                      <div className="space-y-1">
                        <span className="font-semibold text-gray-950 dark:text-white block uppercase font-mono text-[10px] tracking-widest mb-1">
                          {isRtl ? 'جهة الاتصال الثانوية (عبد النور)' : 'SECONDARY CONTACT (ABDENOUR)'}
                        </span>
                        <a href="tel:+213656229615" className="hover:text-accent transition-colors font-mono text-sm font-semibold text-gray-900 dark:text-white block">
                          +213 (0) 656 229 615
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-150 dark:border-gray-800 rounded">
                        <Mail className="w-5 h-5 text-accent shrink-0" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-950 dark:text-white block uppercase font-mono text-[10px] tracking-widest mb-1">
                          {isRtl ? 'البريد الإلكتروني المباشر' : 'ELECTRONIC MAIL'}
                        </span>
                        <a href="mailto:sadeco005@gmail.com" className="hover:text-accent transition-colors font-mono text-sm font-semibold text-gray-900 dark:text-white">
                          sadeco005@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-150 dark:border-gray-800 rounded">
                        <Clock className="w-5 h-5 text-accent shrink-0" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-950 dark:text-white block uppercase font-mono text-[10px] tracking-widest mb-1">
                          {isRtl ? 'ساعات العمل الرسمية' : 'OFFICE HOURS'}
                        </span>
                        <p className="text-sm text-gray-800 dark:text-gray-300">
                          {isRtl ? 'السبت - الخميس: ٠٨:٠٠ - ١٨:٠٠' : 'Saturday - Thursday: 08:00 - 18:00'}
                        </p>
                      </div>
                    </div>

                    {/* Dynamic Social Media Connections */}
                    {(() => {
                      const socialMediaItems = [
                        {
                          key: 'facebookUrl' as const,
                          icon: (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                            </svg>
                          ),
                          label: 'Facebook'
                        },
                        {
                          key: 'instagramUrl' as const,
                          icon: (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01" />
                            </svg>
                          ),
                          label: 'Instagram'
                        },
                        {
                          key: 'tiktokUrl' as const,
                          icon: (
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.97 1.14 2.37 1.86 3.84 2.05v3.83c-1.63-.07-3.2-.67-4.43-1.74-.18-.15-.36-.31-.53-.48v6.78c-.06 2.01-.69 4.02-1.92 5.56-1.57 1.95-4.04 3.06-6.53 2.94-2.52-.12-4.93-1.42-6.26-3.56-1.47-2.35-1.56-5.46-.22-7.89 1.25-2.28 3.64-3.79 6.24-3.9v3.81c-1.12.06-2.26.54-3.02 1.38-.85.95-1.09 2.33-.64 3.51.41 1.09 1.48 1.86 2.64 1.91 1.22.06 2.45-.63 2.94-1.74.2-.44.28-.93.27-1.42V.02z" />
                            </svg>
                          ),
                          label: 'TikTok'
                        },
                        {
                          key: 'youtubeUrl' as const,
                          icon: (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                              <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
                              <polygon points="10 15 15 12 10 9" />
                            </svg>
                          ),
                          label: 'YouTube'
                        },
                        {
                          key: 'linkedinUrl' as const,
                          icon: (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                              <rect width="4" height="12" x="2" y="9" />
                              <circle cx="4" cy="4" r="2" />
                            </svg>
                          ),
                          label: 'LinkedIn'
                        }
                      ];

                      return socialMediaItems.some(item => settings[item.key]) && (
                        <div className="pt-6 border-t border-gray-150 dark:border-gray-800 space-y-3">
                          <span className="font-semibold text-gray-950 dark:text-white block uppercase font-mono text-[10px] tracking-widest">
                            {isRtl ? 'قنواتنا الرقمية ومواقع التواصل' : 'DIGITAL CHANNELS & SOCIAL MEDIA'}
                          </span>
                          <div className="flex gap-3">
                            {socialMediaItems.map((item) => {
                              const url = settings[item.key];
                              if (!url) return null;
                              return (
                                <a
                                  key={item.key}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-11 h-11 rounded border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-accent hover:text-accent hover:bg-accent/5 transition-all duration-300"
                                  title={item.label}
                                >
                                  {item.icon}
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* BREATHTAKING EDITORIAL MAP VECTOR GRAPHIC */}
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-900 bg-gray-950 flex flex-col items-center justify-center p-8 text-center space-y-6">
                  {/* Custom radial graphic */}
                  <div className="absolute inset-0 z-0 opacity-15 editorial-grid" />
                  
                  <div className="relative z-10 space-y-6">
                    <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/40 flex items-center justify-center mx-auto text-accent animate-pulse">
                      <MapPin className="w-8 h-8" />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-serif text-2xl text-white font-normal">
                        {isRtl ? 'مشغل ليز رومان الرئيسي' : 'LES ROMAINS Batna Workshop'}
                      </h4>
                      <p className="text-xs uppercase font-mono tracking-widest text-accent font-semibold">
                        {isRtl ? 'الجزائر' : 'BATNA, ALGERIA'}
                      </p>
                    </div>
                    
                    <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                      {isRtl 
                        ? 'مقرنا الرئيسي وورشة التصنيع المتكاملة لقص الأخشاب والمرايا الديكورية بـ CNC والليزر مجهزة بأعلى مواصفات الدقة.' 
                        : 'Our centralized workshop and design hub is fully equipped with computer numerical control router stations, dynamic laser cut processing, and bespoke finishing cabins.'}
                    </p>

                    <div className="pt-4 flex flex-wrap gap-4 justify-center">
                      <a 
                        href="https://wa.me/213675858793"
                        target="_blank" 
                        rel="noreferrer"
                        className="px-6 py-3 bg-accent text-black font-semibold text-[10px] tracking-widest font-mono uppercase rounded-sm hover:bg-white hover:text-black transition-colors"
                      >
                        {isRtl ? 'راسلنا مباشرة عبر واتساب' : 'Direct WhatsApp Chat'}
                      </a>
                      <a 
                        href="tel:+213675858793"
                        className="px-6 py-3 border border-white/20 text-white font-semibold text-[10px] tracking-widest font-mono uppercase rounded-sm hover:border-accent hover:text-accent transition-colors"
                      >
                        {isRtl ? 'اتصل بنا الآن' : 'Call Primary'}
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* VIEW: SECURE ATELIER ADMIN PORTAL */}
          {currentView === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
            >
              {isLoadingAuth ? (
                <div className="max-w-md mx-auto bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-12 rounded-2xl shadow-xl text-center flex flex-col items-center justify-center space-y-6">
                  <div className="w-12 h-12 rounded-full border-4 border-accent border-t-transparent animate-spin" />
                  <p className="text-xs uppercase font-mono tracking-widest text-accent font-semibold animate-pulse">
                    {isRtl ? 'جاري التحقق من الهوية...' : 'Authenticating Atelier...'}
                  </p>
                </div>
              ) : !user ? (
                <div className="max-w-md mx-auto bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-2xl shadow-2xl space-y-6 text-center font-sans">
                  <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent flex items-center justify-center mx-auto text-accent">
                    <Lock className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-serif text-2xl font-medium text-gray-900 dark:text-white">
                      {isRtl ? 'منطقة المسؤولين المحمية' : 'Atelier Administration'}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {isRtl ? 'يرجى تسجيل الدخول ببيانات اعتماد معتمدة للوصول إلى لوحة التحكم بمستندات التسعير وعناصر الكتالوج' : 'Sign in with your authorized email and password to access the CMS and CRM Console.'}
                    </p>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-4 text-left rtl:text-right">
                    <div className="space-y-1.5">
                      <label htmlFor="admin-email" className="text-[10px] uppercase font-mono tracking-widest text-gray-400 font-semibold block">
                        {isRtl ? 'البريد الإلكتروني' : 'Email Address'}
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="admin-email"
                          type="email"
                          required
                          autoComplete="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder={isRtl ? 'admin@example.com' : 'admin@example.com'}
                          className="w-full pl-10 rtl:pl-3 rtl:pr-10 pr-3 py-3 text-sm bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="admin-password" className="text-[10px] uppercase font-mono tracking-widest text-gray-400 font-semibold block">
                        {isRtl ? 'كلمة المرور' : 'Password'}
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-gray-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="admin-password"
                          type="password"
                          required
                          autoComplete="current-password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 rtl:pl-3 rtl:pr-10 pr-3 py-3 text-sm bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
                        />
                      </div>
                    </div>

                    {(loginFormError || authError) && (
                      <p className="text-xs text-red-500 font-mono">
                        {loginFormError || authError}
                      </p>
                    )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmittingLogin}
                        className="w-full py-3.5 bg-accent hover:bg-accent-dark text-black font-semibold text-xs uppercase tracking-widest rounded-sm transition-colors font-mono flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSubmittingLogin
                          ? (isRtl ? 'جاري التحقق...' : 'Signing In...')
                          : (isRtl ? 'تسجيل الدخول' : 'Sign In')}
                      </button>
                    </div>
                  </form>
                </div>
              ) : !userRole ? (
                <div className="max-w-md mx-auto bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-2xl shadow-2xl space-y-6 text-center font-sans">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500 flex items-center justify-center mx-auto text-red-500">
                    <ShieldCheck className="w-5 h-5" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-xl font-medium text-gray-900 dark:text-white">
                      {isRtl ? 'بانتظار تفعيل الصلاحيات' : 'Awaiting Authorization'}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {isRtl 
                        ? `لقد قمت بتسجيل الدخول كـ ${user.email} بنجاح، ولكن ليس لديك دور إداري معتمد بعد.` 
                        : `You have signed in successfully as ${user.email}, but your account has not been assigned a management role in our system yet.`}
                    </p>
                    <p className="text-xs text-gray-400">
                      {isRtl 
                        ? 'يرجى مراجعة المالك ساجد شيباكي لتفعيل حسابك.' 
                        : 'Please contact Sadjed Chebaki or Abdenour to request access permissions.'}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={logout}
                      className="w-full py-2.5 border border-gray-200 dark:border-gray-800 text-[10px] uppercase font-mono tracking-widest text-gray-500 hover:text-red-500 transition-colors"
                    >
                      {isRtl ? 'تسجيل الخروج' : 'Sign Out / Change Account'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Admin Dashboard component once unlocked */
                <div className="space-y-8">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-b border-gray-200 dark:border-gray-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold">Atelier workspace</span>
                        <span className="px-2 py-0.5 bg-accent/10 border border-accent/30 rounded-full text-[9px] uppercase font-mono text-accent font-bold tracking-wider">
                          Role: {userRole}
                        </span>
                      </div>
                      <h3 className="font-serif text-2xl md:text-3xl text-gray-950 dark:text-white font-medium">
                        {isRtl ? 'لوحة المسؤول الشاملة' : 'LES ROMAINS Console'}
                      </h3>
                      <span className="text-xs text-gray-400 font-mono">{user.email}</span>
                    </div>
                    <button
                      onClick={logout}
                      className="px-4 py-2 border border-gray-200 dark:border-gray-800 text-[10px] uppercase tracking-widest font-mono rounded-sm text-gray-500 hover:text-red-500 hover:border-red-500 transition-colors"
                    >
                      {isRtl ? 'تسجيل الخروج' : 'Lock & Sign Out'}
                    </button>
                  </div>

                  <Dashboard />
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* floating Action System: Apple-style Compact Glass FAB */}
<div className={`fixed bottom-5 ${isRtl ? 'left-5' : 'right-5'} z-50`}>
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
   transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className="flex items-center gap-2 p-1.5 bg-[#0A0A0A]/60 backdrop-blur-md rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10 hover:border-accent/40 transition-colors duration-300"
  >
    {/* WhatsApp Button */}
    <motion.a
      href="https://wa.me/213675858793"
      target="_blank"
      rel="noreferrer"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-dark text-black shadow-md"
      title={isRtl ? 'واتساب' : 'WhatsApp'}
    >
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.975 14.069.953 11.5.953c-5.438 0-9.863 4.371-9.867 9.8.001 2.03.543 4.004 1.571 5.75l-.943 3.442 3.53-.916c1.652.88 3.328 1.34 4.866 1.34zm8.356-6.425c-.244-.12-1.441-.702-1.664-.781-.223-.08-.386-.12-.549.12-.162.24-.629.781-.771.94-.143.162-.285.18-.53.06-.243-.12-1.028-.375-1.957-1.192-.723-.637-1.21-1.425-1.352-1.664-.142-.24-.015-.369.106-.489.11-.108.244-.28.366-.42.12-.14.162-.24.244-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.302-.752-1.787-.197-.474-.397-.41-.549-.418-.142-.007-.305-.007-.468-.007-.163 0-.427.06-.65.3-.224.24-.854.82-.854 2.01 0 1.19.874 2.339.995 2.5.12.162 1.72 2.585 4.167 3.62.582.247 1.036.395 1.39.505.585.183 1.118.157 1.539.095.47-.07 1.441-.58 1.644-1.14.204-.56.204-1.04.142-1.14-.061-.1-.223-.16-.467-.28z"/>
      </svg>
      {/* Small notification indicator */}
      <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
      </span>
    </motion.a>

    {/* Small Separator Line */}
    <div className="w-[1px] h-4 bg-white/10" />

    {/* Phone Call Button */}
    <motion.a
      href="tel:+213675858793"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-accent hover:bg-accent/20 transition-colors"
      title={isRtl ? 'اتصال هاتفي' : 'Phone Call'}
    >
      <Phone className="w-4 h-4" />
    </motion.a>
  </motion.div>
</div>

      {/* 3. Global Footer */}
      <Footer />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
