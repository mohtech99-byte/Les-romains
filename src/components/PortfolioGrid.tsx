/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { PortfolioProject } from '../types';
import { BeforeAfter } from './BeforeAfter';
import { Calendar, MapPin, User, ChevronRight, X, Layers, AlertCircle, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PortfolioGrid: React.FC = () => {
  const { 
    language, projects, 
    selectedProjectId, setSelectedProjectId,
    setCurrentView
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'residential' | 'commercial' | 'manufacturing'>('all');
  const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null);

  const isRtl = language === 'ar';

  const filters = [
    { id: 'all', label: 'All Projects', labelAr: 'جميع المشاريع' },
    { id: 'residential', label: 'Residential', labelAr: 'سكني فاخر' },
    { id: 'commercial', label: 'Commercial', labelAr: 'تجاري' },
    { id: 'manufacturing', label: 'CNC Fabrication', labelAr: 'تصنيع الـ CNC' }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!selectedProjectId ? (
          /* Portfolio Grid View */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-12"
          >
            {/* Filter Pills */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 border-b border-gray-200/50 dark:border-gray-800/50 pb-6">
              {filters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id as any)}
                  className={`text-xs uppercase font-mono tracking-[0.2em] relative py-2 transition-all ${
                    activeFilter === filter.id 
                      ? 'text-accent font-semibold' 
                      : 'text-gray-400 hover:text-accent'
                  }`}
                >
                  {isRtl ? filter.labelAr : filter.label}
                  {activeFilter === filter.id && (
                    <motion.div 
                      layoutId="activeFilterUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-accent"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  className="precision-frame group bg-white dark:bg-[#0C0C0C]/50 rounded-none overflow-hidden border border-gray-150 dark:border-gray-900/60 transition-all duration-500 flex flex-col h-full hover:border-accent/40"
                >
                  {/* Photo container */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 dark:bg-gray-950">
                    <img 
                      src={project.images[0]} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity" />
                    
                    {/* Category tag */}
                    <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white text-[9px] font-mono tracking-widest uppercase py-1 px-2.5 rounded-none border border-white/10">
                      {project.category}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col flex-grow space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-accent font-mono">
                        {isRtl ? project.locationAr : project.location}
                      </span>
                      <h4 className="font-serif text-xl font-medium text-gray-950 dark:text-white group-hover:text-accent transition-colors">
                        {isRtl ? project.titleAr : project.title}
                      </h4>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                      {isRtl ? project.descriptionAr : project.description}
                    </p>

                    <div className="pt-4 mt-auto border-t border-gray-100 dark:border-gray-900/50 flex justify-between items-center text-[10px] tracking-wider uppercase font-mono">
                      <span className="text-gray-400">{project.completionDate}</span>
                      <button 
                        onClick={() => {
                          setSelectedProjectId(project.id);
                          window.scrollTo({ top: 300, behavior: 'smooth' });
                        }}
                        className="text-accent font-semibold flex items-center gap-1 group/btn"
                      >
                        {isRtl ? 'تفاصيل المشروع' : 'View Atelier Study'}
                        <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* Project Detail View */
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-12 max-w-5xl mx-auto"
          >
            {/* Header Controls */}
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-5">
              <button 
                onClick={() => setSelectedProjectId(null)}
                className="text-xs uppercase font-mono tracking-widest font-semibold text-gray-500 hover:text-accent transition-colors"
              >
                ← {isRtl ? 'العودة للمعرض' : 'Back to Gallery'}
              </button>
              <span className="text-xs font-mono text-accent tracking-[0.15em]">
                {isRtl ? 'دراسة حالة فنية' : 'CASE STUDY'} • {selectedProject?.id}
              </span>
            </div>

            {/* Title Section */}
            <div className="text-center md:text-left rtl:md:text-right space-y-4">
              <span className="px-3 py-1 text-[9px] uppercase font-mono tracking-widest text-accent bg-accent/5 rounded-none border border-accent/20">
                {selectedProject?.category}
              </span>
              <h3 className="font-serif text-3xl md:text-5xl text-gray-950 dark:text-white font-normal tracking-tight">
                {isRtl ? selectedProject?.titleAr : selectedProject?.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-3xl leading-relaxed">
                {isRtl ? selectedProject?.descriptionAr : selectedProject?.description}
              </p>
            </div>

            {/* Key Parameters Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-gray-50 dark:bg-gray-950/20 p-6 rounded-none border border-gray-150 dark:border-gray-900 font-sans">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-none bg-accent/5 flex items-center justify-center text-accent border border-accent/10">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-mono text-gray-400 block">{isRtl ? 'العميل' : 'CLIENT'}</span>
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">{selectedProject?.client}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-none bg-accent/5 flex items-center justify-center text-accent border border-accent/10">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-mono text-gray-400 block">{isRtl ? 'الموقع' : 'LOCATION'}</span>
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">
                    {isRtl ? selectedProject?.locationAr : selectedProject?.location}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-none bg-accent/5 flex items-center justify-center text-accent border border-accent/10">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-mono text-gray-400 block">{isRtl ? 'تاريخ الإنجاز' : 'COMPLETED'}</span>
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">{selectedProject?.completionDate}</span>
                </div>
              </div>
            </div>

            {/* Interactive Before & After comparison if present */}
            {selectedProject?.beforeAfterImage && (
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-widest font-mono text-accent font-semibold">
                  {isRtl ? 'مقارنة قبل وبعد التحول' : 'Geometric Transformation Comparison'}
                </h4>
                <BeforeAfter 
                  before={selectedProject.beforeAfterImage.before} 
                  after={selectedProject.beforeAfterImage.after} 
                  labelBefore={isRtl ? 'موقع البناء المبدئي' : 'RAW CONSTRUCTION SITE'}
                  labelAfter={isRtl ? 'التشطيب المعماري النهائي' : 'FINISHED CNC INSTALLATION'}
                />
              </div>
            )}

            {/* Cinematic Galleries */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-widest font-mono text-accent font-semibold">
                {isRtl ? 'المعرض الفوتوغرافي التفصيلي' : 'Cinematic Asset Capture'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {selectedProject?.images.map((img, index) => (
                  <div 
                    key={index} 
                    onClick={() => setActiveLightboxImage(img)}
                    className="precision-frame relative aspect-[3/2] rounded-none overflow-hidden border border-gray-150 dark:border-gray-800 cursor-zoom-in group bg-gray-50 dark:bg-gray-950"
                  >
                    <img 
                      src={img} 
                      alt={`Gallery detail ${index}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs uppercase font-mono tracking-[0.2em] font-semibold">
                      {isRtl ? 'تكبير الصورة' : 'Inspect Detail'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenge & Solution Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-150 dark:border-gray-850">
              <div className="space-y-3 bg-red-500/[0.02] dark:bg-red-500/[0.01] p-6 rounded-none border border-red-500/10 text-left rtl:text-right">
                <h4 className="text-xs uppercase tracking-widest font-mono text-red-500 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {isRtl ? 'التحدي الإنشائي' : 'Structural Challenge'}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {isRtl ? selectedProject?.challengeAr : selectedProject?.challenge}
                </p>
              </div>

              <div className="space-y-3 bg-[#B08D57]/[0.02] dark:bg-[#B08D57]/[0.01] p-6 rounded-none border border-[#B08D57]/20 text-left rtl:text-right">
                <h4 className="text-xs uppercase tracking-widest font-mono text-accent font-semibold flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  {isRtl ? 'الحل الهندسي والتقني' : 'Craft & Engineering Solution'}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {isRtl ? selectedProject?.solutionAr : selectedProject?.solution}
                </p>
              </div>
            </div>

            {/* Materials List */}
            <div className="space-y-4 bg-gray-50 dark:bg-gray-950/10 p-6 rounded-none border border-gray-150 dark:border-gray-900 text-left rtl:text-right">
              <h4 className="text-xs uppercase tracking-widest font-mono text-accent font-semibold flex items-center gap-2">
                <Layers className="w-4 h-4" />
                {isRtl ? 'لوحة المواد والتجهيز' : 'Specified Material Palette'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {(isRtl ? selectedProject?.materialsAr : selectedProject?.materials)?.map((mat, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 bg-white dark:bg-[#080808] border border-gray-200 dark:border-gray-800 rounded-none text-xs text-gray-700 dark:text-gray-300 font-mono uppercase tracking-wider text-[10px]"
                  >
                    {mat}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <button 
                onClick={() => setSelectedProjectId(null)}
                className="px-6 py-3 border border-gray-200 dark:border-gray-800 hover:border-accent text-xs font-mono uppercase tracking-widest text-gray-600 dark:text-gray-300 rounded-none transition-colors"
              >
                ← {isRtl ? 'العودة للمعرض' : 'Return to Gallery Grid'}
              </button>

              <button 
                onClick={() => setCurrentView('quote')}
                className="px-8 py-3.5 bg-accent hover:bg-[#977443] text-black hover:text-white font-semibold text-xs font-mono uppercase tracking-[0.15em] rounded-none transition-all"
              >
                {isRtl ? 'احجز مشروعاً مشابهاً' : 'Commission a Similar Scope'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeLightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveLightboxImage(null)}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button className="absolute top-6 right-6 text-white hover:text-accent">
              <X className="w-8 h-8" />
            </button>
            <motion.img 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              src={activeLightboxImage} 
              alt="Lightbox display" 
              className="max-w-full max-h-[90vh] object-contain rounded"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
