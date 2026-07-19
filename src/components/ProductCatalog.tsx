/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { CNCProduct } from '../types';
import { Check, ClipboardList, Layers, Sliders, ChevronRight, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductCatalog: React.FC = () => {
  const { 
    language, products, 
    selectedProductId, setSelectedProductId,
    setCurrentView
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<'all' | 'decor-panels' | 'mirrors' | 'store-signs'>('all');
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  const isRtl = language === 'ar';

  const categories = [
    { id: 'all', label: 'Full Catalogue', labelAr: 'كامل المنتجات' },
    { id: 'decor-panels', label: 'Decorative Panels', labelAr: 'الألواح الديكورية' },
    { id: 'mirrors', label: 'Mirror Systems', labelAr: 'أنظمة المرايا' },
    { id: 'store-signs', label: 'Signage Panels', labelAr: 'الألواح الإعلانية' }
  ];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleRequestQuote = (product: CNCProduct) => {
    // Populate or switch view to quote with custom search params/state
    setCurrentView('quote');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!selectedProductId ? (
          /* Catalog Grid View */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-12"
          >
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 border-b border-gray-200/50 dark:border-gray-800/50 pb-6">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`text-xs uppercase font-mono tracking-[0.2em] relative py-2 transition-all ${
                    activeCategory === cat.id 
                      ? 'text-accent font-semibold' 
                      : 'text-gray-400 hover:text-accent'
                  }`}
                >
                  {isRtl ? cat.labelAr : cat.label}
                  {activeCategory === cat.id && (
                    <motion.div 
                      layoutId="activeCatalogUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-accent"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  className="precision-frame group bg-white dark:bg-[#0C0C0C]/50 rounded-none overflow-hidden border border-gray-150 dark:border-gray-900/60 transition-all duration-500 flex flex-col h-full hover:border-accent/40"
                >
                  {/* Photo with zoom */}
                  <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-950">
                    <img 
                      src={product.images[0]} 
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Body Info */}
                  <div className="p-5 flex flex-col flex-grow space-y-4">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-widest font-mono text-accent font-semibold">
                        {product.category?.replace('-', ' ') || ''}
                      </span>
                      <h4 className="font-serif text-lg font-medium text-gray-900 dark:text-white group-hover:text-accent transition-colors">
                        {isRtl ? product.titleAr : product.title}
                      </h4>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                      {isRtl ? product.descriptionAr : product.description}
                    </p>

                    {/* Specifications badges */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {(isRtl ? product.materialsAr : product.materials).slice(0, 2).map((mat, mIdx) => (
                        <span key={mIdx} className="material-tag">
                          {mat}
                        </span>
                      ))}
                    </div>

                    {/* Bottom CTA */}
                    <div className="pt-4 mt-auto border-t border-gray-100 dark:border-gray-900/45 flex justify-between items-center text-[10px] tracking-wider uppercase font-mono">
                      <button
                        onClick={() => {
                          setSelectedProductId(product.id);
                          setSelectedImageIdx(0);
                          window.scrollTo({ top: 300, behavior: 'smooth' });
                        }}
                        className="text-gray-900 dark:text-white hover:text-accent font-semibold flex items-center gap-1 group/btn"
                      >
                        {isRtl ? 'المواصفات والطلب' : 'View Details'}
                        <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>

                      <button
                        onClick={() => handleRequestQuote(product)}
                        className="px-3.5 py-1.5 bg-accent/5 hover:bg-accent text-accent hover:text-black font-semibold rounded-none text-[9px] tracking-widest transition-all flex items-center gap-1 border border-accent/20"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        {isRtl ? 'تسعير مباشر' : 'Get Quote'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* Product Detail View */
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-12 max-w-5xl mx-auto"
          >
            {/* Header controls */}
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-5">
              <button 
                onClick={() => setSelectedProductId(null)}
                className="text-xs uppercase font-mono tracking-widest font-semibold text-gray-500 hover:text-accent transition-colors"
              >
                ← {isRtl ? 'العودة للكتالوج' : 'Back to Catalog'}
              </button>
              <span className="text-xs font-mono text-accent tracking-[0.15em]">
                {isRtl ? 'معرف المنتج' : 'PRODUCT SPEC'} • {selectedProduct?.id}
              </span>
            </div>

            {/* Split Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
              
              {/* Left Column: Images Panel (5 cols) */}
              <div className="md:col-span-5 space-y-4">
                <div className="aspect-square bg-gray-50 dark:bg-gray-950 rounded-none overflow-hidden border border-gray-150 dark:border-gray-800">
                  <img 
                    src={selectedProduct?.images[selectedImageIdx]} 
                    alt={selectedProduct?.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {/* Thumbnails */}
                {selectedProduct && selectedProduct.images.length > 1 && (
                  <div className="flex gap-3">
                    {selectedProduct.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIdx(idx)}
                        className={`w-20 aspect-square rounded-none overflow-hidden border-2 transition-all ${
                          selectedImageIdx === idx ? 'border-accent' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Spec Sheet Panel (7 cols) */}
              <div className="md:col-span-7 space-y-6">
                <div className="space-y-2 text-left rtl:text-right">
                  <span className="text-xs font-mono uppercase tracking-widest text-accent font-semibold">
                    {selectedProduct?.category?.replace('-', ' ') || ''}
                  </span>
                  <h3 className="font-serif text-2xl md:text-4xl text-gray-950 dark:text-white font-normal leading-tight">
                    {isRtl ? selectedProduct?.titleAr : selectedProduct?.title}
                  </h3>
                  <div className="h-[1px] bg-accent/30 w-16" />
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed text-left rtl:text-right">
                  {isRtl ? selectedProduct?.descriptionAr : selectedProduct?.description}
                </p>

                {/* Material Tags */}
                <div className="space-y-2 text-left rtl:text-right">
                  <h5 className="text-[10px] uppercase font-mono tracking-widest text-gray-400 font-semibold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-accent" />
                    {isRtl ? 'المواد الموصى بها للتصنيع:' : 'Primary Manufacturing Materials:'}
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {(isRtl ? selectedProduct?.materialsAr : selectedProduct?.materials)?.map((mat, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-850 text-gray-700 dark:text-gray-300 rounded-none text-xs font-mono uppercase tracking-wider text-[10px]"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Available Sizes */}
                <div className="space-y-2 text-left rtl:text-right">
                  <h5 className="text-[10px] uppercase font-mono tracking-widest text-gray-400 font-semibold flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-accent" />
                    {isRtl ? 'المقاسات المتاحة:' : 'Standard Dimensioning bands:'}
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct?.sizes.map((size, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-900 font-mono text-xs text-gray-600 dark:text-gray-400 rounded-none"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Customization Options */}
                <div className="space-y-2 text-left rtl:text-right">
                  <h5 className="text-[10px] uppercase font-mono tracking-widest text-gray-400 font-semibold flex items-center gap-1.5">
                    <ClipboardList className="w-3.5 h-3.5 text-accent" />
                    {isRtl ? 'خيارات التخصيص والتشطيب:' : 'Custom Finishes & Features:'}
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300">
                    {(isRtl ? selectedProduct?.customizationOptionsAr : selectedProduct?.customizationOptions)?.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-accent/10 rounded-none flex items-center justify-center text-accent shrink-0 border border-accent/20">
                          <Check className="w-2.5 h-2.5" strokeWidth={3} />
                        </div>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Comprehensive Technical Specifications Sheet */}
            <div className="bg-gray-50 dark:bg-[#0C0C0C]/40 p-6 md:p-8 rounded-none border border-gray-150 dark:border-gray-900 text-left rtl:text-right">
              <h4 className="text-xs font-mono uppercase tracking-widest text-accent font-semibold border-b border-gray-200 dark:border-gray-800 pb-3 mb-4">
                {isRtl ? 'المواصفات الفنية للورشة' : 'ATELIER FABRICATION SPECS'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-xs font-sans">
                {Object.entries((isRtl ? selectedProduct?.specificationsAr : selectedProduct?.specifications) || {}).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-900">
                    <span className="text-gray-400 uppercase tracking-wide text-[10px] font-mono">{key}</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <button 
                onClick={() => setSelectedProductId(null)}
                className="px-6 py-3 border border-gray-200 dark:border-gray-800 hover:border-accent text-xs font-mono uppercase tracking-widest text-gray-600 dark:text-gray-300 rounded-none transition-colors"
              >
                ← {isRtl ? 'العودة للكتالوج' : 'Back to Product Catalog'}
              </button>

              <button 
                onClick={() => handleRequestQuote(selectedProduct!)}
                className="px-8 py-4 bg-accent hover:bg-[#977443] text-black hover:text-white font-semibold text-xs font-mono uppercase tracking-[0.15em] rounded-none transition-all"
              >
                {isRtl ? 'طلب تسعيرة لهذا المنتج' : 'Get Quote On This Spec'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
