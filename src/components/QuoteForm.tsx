/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Check, FileText, FileUp, Sparkles, User, Phone, Mail, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export const QuoteForm: React.FC = () => {
  const { language, addQuote, settings, pricingFactors } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    projectType: 'Decorative Wall Panels',
    description: '',
    dimensions: '',
    preferredContact: 'email' as 'email' | 'phone' | 'whatsapp',
  });

  const [files, setFiles] = useState<{ name: string; size: string; preview: string }[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quoteId, setQuoteId] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const isRtl = language === 'ar';

  // --- Quote Estimator state -------------------------------------------------
  const materialOptions = pricingFactors.filter(f => f.type === 'material' && f.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const projectTypeOptions = pricingFactors.filter(f => f.type === 'projectType' && f.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const complexityOptions = pricingFactors.filter(f => f.type === 'complexity' && f.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const wilayaOptions = pricingFactors.filter(f => f.type === 'wilaya' && f.isActive).sort((a, b) => a.sortOrder - b.sortOrder);

  const [estArea, setEstArea] = useState('');
  const [estMaterialId, setEstMaterialId] = useState('');
  const [estProjectTypeId, setEstProjectTypeId] = useState('');
  const [estComplexityId, setEstComplexityId] = useState('');
  const [estWilayaId, setEstWilayaId] = useState('');
  const [estResult, setEstResult] = useState<{ low: number; high: number } | null>(null);
  const [estError, setEstError] = useState('');

  const formatDzd = (n: number) => Math.round(n).toLocaleString(isRtl ? 'ar-DZ' : 'en-US') + (isRtl ? ' دج' : ' DZD');

  const handleEstimate = () => {
    const area = parseFloat(estArea);
    const material = materialOptions.find(m => m.id === estMaterialId);
    const projectType = projectTypeOptions.find(p => p.id === estProjectTypeId);
    const complexity = complexityOptions.find(c => c.id === estComplexityId);
    const wilaya = wilayaOptions.find(w => w.id === estWilayaId);

    if (!area || area <= 0 || !material || !projectType || !complexity || !wilaya) {
      setEstError(isRtl ? 'يرجى تعبئة كل الحقول للحصول على تقدير.' : 'Please fill in every field to get an estimate.');
      setEstResult(null);
      return;
    }
    setEstError('');

    const base = area * material.value * projectType.value * complexity.value + wilaya.value;
    setEstResult({ low: base * 0.9, high: base * 1.15 });
  };

  const handleUseEstimate = () => {
    if (!estResult) return;
    const material = materialOptions.find(m => m.id === estMaterialId);
    const projectType = projectTypeOptions.find(p => p.id === estProjectTypeId);
    const complexity = complexityOptions.find(c => c.id === estComplexityId);
    const wilaya = wilayaOptions.find(w => w.id === estWilayaId);

    setFormData(prev => ({
      ...prev,
      city: wilaya ? (isRtl ? wilaya.nameAr : wilaya.name) : prev.city,
      projectType: projectType ? projectType.name : prev.projectType,
      dimensions: `${estArea} m² — ${material ? material.name : ''}`,
      description: prev.description || (isRtl
        ? `تقدير أولي: ${formatDzd(estResult.low)} - ${formatDzd(estResult.high)} (${estArea} م²، ${material ? material.nameAr : ''}، تعقيد: ${complexity ? complexity.nameAr : ''}).`
        : `Preliminary estimate: ${formatDzd(estResult.low)} - ${formatDzd(estResult.high)} (${estArea} m², ${material ? material.name : ''}, complexity: ${complexity ? complexity.name : ''}).`)
    }));
    document.getElementById('quote-form-fields')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const projectTypes = [
    { en: 'Decorative Wall Panels', ar: 'ألواح جدارية ديكورية' },
    { en: 'PMMA / Acrylic Products', ar: 'منتجات PMMA / أكريليك' },
    { en: 'PVC Decorative Panels', ar: 'ألواح PVC ديكورية' },
    { en: 'MDF Decorative Solutions', ar: 'حلول MDF ديكورية' },
    { en: 'Commercial or Office Decoration', ar: 'ديكور تجاري أو مكتبي' },
    { en: 'Restaurant & Hotel Decoration', ar: 'ديكور مطاعم وفنادق' },
    { en: 'Architectural Decorative Pieces', ar: 'قطع ديكورية معمارية' },
    { en: 'Custom-Made Decorative Design', ar: 'تصميم ديكوري مخصص بالكامل' }
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const addedFiles = Array.from(e.dataTransfer.files).map((file: File) => ({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        preview: URL.createObjectURL(file)
      }));
      setFiles(prev => [...prev, ...addedFiles]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const addedFiles = Array.from(e.target.files).map((file: File) => ({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        preview: URL.createObjectURL(file)
      }));
      setFiles(prev => [...prev, ...addedFiles]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;

    // Simulate database write
    const referenceImages = files.map(f => f.preview || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=400');
    
    addQuote({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      projectType: formData.projectType,
      description: formData.description,
      dimensions: formData.dimensions,
      preferredContact: formData.preferredContact,
      referenceImages: referenceImages.length > 0 ? referenceImages : []
    });

    const generatedId = `Q-${Math.floor(1000 + Math.random() * 9000)}`;
    setQuoteId(generatedId);
    setIsSubmitted(true);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      {!isSubmitted ? (
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Quote Estimator */}
          <div className="precision-frame bg-white dark:bg-[#0C0C0C]/50 rounded-none border border-gray-150 dark:border-gray-900 p-6 md:p-10 text-left rtl:text-right">
            <div className="text-center md:text-left rtl:md:text-right mb-6">
              <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-semibold block mb-2">
                {isRtl ? 'حاسبة السعر التقديري' : 'INSTANT QUOTE ESTIMATOR'}
              </span>
              <h3 className="font-serif text-2xl md:text-3xl text-gray-900 dark:text-white font-normal">
                {isRtl ? 'احصل على فكرة سريعة عن السعر' : 'Get a Quick Price Range'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed max-w-xl mx-auto md:mx-0">
                {isRtl
                  ? 'أدخل مساحة مشروعك ونوع المادة ودرجة التعقيد وولايتك للحصول على نطاق سعري تقديري غير ملزم، قبل تعبئة طلب العرض الرسمي.'
                  : 'Enter your project area, material, complexity and wilaya to get a non-binding preliminary price range before submitting an official request.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-1">
                <label className="block text-[10px] text-gray-400 uppercase font-mono mb-1.5">
                  {isRtl ? 'المساحة (م²)' : 'Area (m²)'}
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={estArea}
                  onChange={e => setEstArea(e.target.value)}
                  placeholder={isRtl ? 'مثال: 12' : 'e.g. 12'}
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-none px-3 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-mono mb-1.5">
                  {isRtl ? 'المادة' : 'Material'}
                </label>
                <select
                  value={estMaterialId}
                  onChange={e => setEstMaterialId(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-none px-3 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-accent"
                >
                  <option value="">{isRtl ? 'اختر' : 'Select'}</option>
                  {materialOptions.map(m => (
                    <option key={m.id} value={m.id}>{isRtl ? m.nameAr : m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-mono mb-1.5">
                  {isRtl ? 'نوع المشروع' : 'Project Type'}
                </label>
                <select
                  value={estProjectTypeId}
                  onChange={e => setEstProjectTypeId(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-none px-3 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-accent"
                >
                  <option value="">{isRtl ? 'اختر' : 'Select'}</option>
                  {projectTypeOptions.map(p => (
                    <option key={p.id} value={p.id}>{isRtl ? p.nameAr : p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-mono mb-1.5">
                  {isRtl ? 'درجة التعقيد' : 'Complexity'}
                </label>
                <select
                  value={estComplexityId}
                  onChange={e => setEstComplexityId(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-none px-3 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-accent"
                >
                  <option value="">{isRtl ? 'اختر' : 'Select'}</option>
                  {complexityOptions.map(c => (
                    <option key={c.id} value={c.id}>{isRtl ? c.nameAr : c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-mono mb-1.5">
                  {isRtl ? 'الولاية' : 'Wilaya'}
                </label>
                <select
                  value={estWilayaId}
                  onChange={e => setEstWilayaId(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-none px-3 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-accent"
                >
                  <option value="">{isRtl ? 'اختر' : 'Select'}</option>
                  {wilayaOptions.map(w => (
                    <option key={w.id} value={w.id}>{isRtl ? w.nameAr : w.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {estError && (
              <p className="text-[11px] text-red-500 mt-4">{estError}</p>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-6">
              <button
                type="button"
                onClick={handleEstimate}
                className="px-6 py-3 bg-accent hover:bg-accent-dark text-black font-semibold text-xs font-mono uppercase tracking-[0.15em] rounded-none transition-all"
              >
                {isRtl ? 'احسب السعر التقديري' : 'Calculate Estimate'}
              </button>

              {estResult && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50 dark:bg-gray-950 border border-accent/25 rounded-none px-5 py-3.5"
                >
                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-widest text-gray-400 block">
                      {isRtl ? 'النطاق السعري التقديري' : 'ESTIMATED PRICE RANGE'}
                    </span>
                    <span className="text-lg font-bold text-accent font-mono">
                      {formatDzd(estResult.low)} — {formatDzd(estResult.high)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleUseEstimate}
                    className="whitespace-nowrap px-5 py-2.5 border border-accent text-accent hover:bg-accent hover:text-black font-semibold text-[10px] font-mono uppercase tracking-widest rounded-none transition-all"
                  >
                    {isRtl ? 'استخدم هذا التقدير وتابع' : 'Use This Estimate →'}
                  </button>
                </motion.div>
              )}
            </div>

            <p className="text-[10px] text-gray-400 mt-4 leading-relaxed">
              {isRtl
                ? '* هذا تقدير أولي غير ملزم لأغراض التخطيط فقط. السعر النهائي يُحدد بعد دراسة تفصيلية لمواصفات مشروعك.'
                : '* This is a non-binding preliminary estimate for planning purposes only. The final price is confirmed after a detailed review of your project specifications.'}
            </p>
          </div>

          <form id="quote-form-fields" onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-[#0C0C0C]/50 rounded-none border border-gray-150 dark:border-gray-900 p-6 md:p-10 text-left rtl:text-right">
          
          <div className="border-b border-gray-100 dark:border-gray-900 pb-6 text-center md:text-left rtl:md:text-right">
            <h3 className="font-serif text-2xl md:text-3xl text-gray-900 dark:text-white font-normal flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              {isRtl ? 'صمم مشروعك المخصص معنا' : 'Begin Your Custom Project'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
              {isRtl 
                ? 'املأ الاستمارة التفصيلية أدناه وسيقوم فريقنا المعماري بدراسة طلبك وتقديم مقترح فني ومالي دقيق ومناسب لميزانيتك.' 
                : 'Complete the form below. Our design & manufacturing workshop will analyze your requirements and draft a premium tailored proposal.'}
            </p>

            {/* Direct Instant Contact Banner */}
            <div className="mt-5 p-4 rounded-none bg-gray-50 dark:bg-gray-950/20 border border-gray-150 dark:border-gray-900 text-left rtl:text-right flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-mono font-bold uppercase text-accent tracking-[0.15em]">
                  {isRtl ? 'للاستفسارات والطلبات العاجلة المباشرة' : 'FOR IMMEDIATE DIRECT ASSISTANCE'}
                </p>
                <p className="text-xs text-gray-700 dark:text-gray-400">
                  {isRtl 
                    ? 'تواصل مباشرة مع المالك ساجد شباكي أو عبد النور عبر الهاتف أو الواتساب:' 
                    : 'Get in touch directly with Sadjed Chebaki (Owner) or Abdenour via call/WhatsApp:'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                <a 
                  href="tel:+213675858793" 
                  className="px-3 py-1.5 rounded-none border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:border-accent hover:text-accent transition-colors"
                >
                  {isRtl ? 'اتصل بساجد' : 'Call Sadjed'}
                </a>
                <a 
                  href="tel:+213656229615" 
                  className="px-3 py-1.5 rounded-none border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:border-accent hover:text-accent transition-colors"
                >
                  {isRtl ? 'اتصل بعبد النور' : 'Call Abdenour'}
                </a>
                <a 
                  href="https://wa.me/213675858793" 
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-none bg-accent text-black font-bold hover:bg-[#977443] hover:text-white transition-colors"
                >
                  {isRtl ? 'واتساب مباشر' : 'WhatsApp'}
                </a>
              </div>
            </div>
          </div>

          {/* Section 1: Client Information */}
          <div className="space-y-5">
            <h4 className="text-xs font-mono uppercase tracking-widest text-accent font-semibold border-l-2 border-accent pl-2 rtl:border-l-0 rtl:border-r-2 rtl:pr-2">
              {isRtl ? '١. معلومات الاتصال' : '01. Client Credentials'}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 font-medium">
                  {isRtl ? 'الاسم الكامل *' : 'Full Name *'}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 rtl:left-auto rtl:right-3 flex items-center text-gray-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-gray-950/20 border border-gray-200 dark:border-gray-800 rounded-none px-3 py-3 pl-10 rtl:pl-3 rtl:pr-10 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-accent"
                    placeholder={isRtl ? 'أحمد الشمراني' : 'Alexander Sterling'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 font-medium">
                  {isRtl ? 'رقم الجوال *' : 'Phone Number *'}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 rtl:left-auto rtl:right-3 flex items-center text-gray-400">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-gray-950/20 border border-gray-200 dark:border-gray-800 rounded-none px-3 py-3 pl-10 rtl:pl-3 rtl:pr-10 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-accent"
                    placeholder="+39 333 1234567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 font-medium">
                  {isRtl ? 'البريد الإلكتروني *' : 'Email Address *'}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 rtl:left-auto rtl:right-3 flex items-center text-gray-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-gray-950/20 border border-gray-200 dark:border-gray-800 rounded-none px-3 py-3 pl-10 rtl:pl-3 rtl:pr-10 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-accent"
                    placeholder="alex@sterlingdesign.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 font-medium">
                  {isRtl ? 'المدينة والبلد' : 'City & Country'}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 rtl:left-auto rtl:right-3 flex items-center text-gray-400">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-gray-950/20 border border-gray-200 dark:border-gray-800 rounded-none px-3 py-3 pl-10 rtl:pl-3 rtl:pr-10 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-accent"
                    placeholder={isRtl ? 'الرياض، السعودية' : 'Rome, Italy'}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Project Blueprint */}
          <div className="space-y-5">
            <h4 className="text-xs font-mono uppercase tracking-widest text-accent font-semibold border-l-2 border-accent pl-2 rtl:border-l-0 rtl:border-r-2 rtl:pr-2">
              {isRtl ? '٢. مواصفات المشروع المعماري' : '02. Architectural Project Scope'}
            </h4>

            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 font-medium">
                  {isRtl ? 'نوع المشروع' : 'Project Category'}
                </label>
                <select
                  value={formData.projectType}
                  onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-gray-950/20 border border-gray-200 dark:border-gray-800 rounded-none px-3 py-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-accent"
                >
                  {projectTypes.map((type, idx) => (
                    <option key={idx} value={type.en}>
                      {isRtl ? type.ar : type.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 font-medium">
                {isRtl ? 'وصف المشروع والمواد المطلوبة (مثال: خشب بلوط مفرز، مرايا ذهبية، سماكة معينة)' : 'Project Details & Material Preferences'}
              </label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                className="w-full bg-gray-50 dark:bg-gray-950/20 border border-gray-200 dark:border-gray-800 rounded-none px-3 py-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-accent leading-relaxed"
                placeholder={isRtl 
                  ? 'يرجى تقديم تفاصيل المساحة والمقاسات التقديرية ونوع الخشب المفضل أو الزجاج والإنهاءات المطلوبة...' 
                  : 'Specify measurements, thickness, paint lacquer codes, CNC cutting patterns, and any specific installation challenges...'}
              />
            </div>
          </div>

          {/* Section 3: Vector & Reference Upload */}
          <div className="space-y-5">
            <h4 className="text-xs font-mono uppercase tracking-widest text-accent font-semibold border-l-2 border-accent pl-2 rtl:border-l-0 rtl:border-r-2 rtl:pr-2">
              {isRtl ? '٣. ملفات الرسومات والنماذج ثنائية الأبعاد (DXF, DWG, PDF, JPG)' : '03. Architectural Vectors & Inspiration Files'}
            </h4>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border border-dashed rounded-none p-8 flex flex-col items-center justify-center transition-all ${
                isDragging 
                  ? 'border-accent bg-accent/5' 
                  : 'border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/20'
              }`}
            >
              <FileUp className="w-8 h-8 text-accent mb-3 animate-bounce" />
              <p className="text-xs font-semibold text-gray-900 dark:text-white text-center">
                {isRtl ? 'اسحب وأفلت المخططات الفنية هنا' : 'Drag & drop architectural CAD files here'}
              </p>
              <p className="text-[10px] text-gray-400 mt-1 text-center font-mono">
                {isRtl ? 'أو انقر لتصفح الملفات من جهازك (بحد أقصى ١٠ ميجابايت)' : 'or click to browse from device (up to 10 MB per file)'}
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-selector"
                accept=".dxf,.dwg,.pdf,.jpg,.jpeg,.png"
              />
              <label
                htmlFor="file-selector"
                className="mt-4 px-5 py-2 bg-gray-900 dark:bg-gray-800 hover:bg-accent hover:text-black text-white text-[10px] tracking-widest uppercase font-semibold rounded-none cursor-pointer transition-colors duration-300 border border-transparent hover:border-accent"
              >
                {isRtl ? 'اختر الملفات' : 'Select Files'}
              </label>
            </div>

            {/* Uploaded File List */}
            {files.length > 0 && (
              <div className="space-y-2 bg-gray-50 dark:bg-gray-950 p-4 rounded-none border border-gray-150 dark:border-gray-900">
                <span className="text-[10px] uppercase font-mono tracking-wider text-accent font-semibold">
                  {isRtl ? 'الملفات المرفقة بنجاح:' : 'Successfully attached files:'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white dark:bg-[#0C0C0C]/40 p-2.5 rounded-none border border-gray-150 dark:border-gray-850">
                      <FileText className="w-5 h-5 text-accent shrink-0" />
                      <div className="overflow-hidden">
                        <p className="text-[11px] font-medium text-gray-800 dark:text-gray-200 truncate">{file.name}</p>
                        <p className="text-[9px] text-gray-400 font-mono">{file.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Contact Preference */}
          <div className="space-y-5">
            <h4 className="text-xs font-mono uppercase tracking-widest text-accent font-semibold border-l-2 border-accent pl-2 rtl:border-l-0 rtl:border-r-2 rtl:pr-2">
              {isRtl ? '٤. طريقة التواصل المفضلة' : '04. Callback Preference'}
            </h4>

            <div className="flex flex-wrap gap-5">
              {[
                { id: 'email', label: 'Email', labelAr: 'البريد الإلكتروني' },
                { id: 'phone', label: 'Direct Phone Call', labelAr: 'اتصال هاتفي مباشر' },
                { id: 'whatsapp', label: 'WhatsApp Chat', labelAr: 'محادثة واتساب سريعة' }
              ].map(option => (
                <label key={option.id} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700 dark:text-gray-300">
                  <input
                    type="radio"
                    name="preferredContact"
                    value={option.id}
                    checked={formData.preferredContact === option.id}
                    onChange={() => setFormData({ ...formData, preferredContact: option.id as any })}
                    className="accent-accent w-4 h-4"
                  />
                  <span>{isRtl ? option.labelAr : option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 text-center md:text-right rtl:md:text-left">
            <button
              type="submit"
              className="px-8 py-4 bg-accent hover:bg-[#977443] text-black hover:text-white font-semibold uppercase text-xs tracking-widest rounded-none transition-all duration-300"
            >
              {isRtl ? 'إرسال طلب التسعير إلى ورشتنا' : 'Submit Specifications for Drafting'}
            </button>
          </div>

        </form>
        </div>
      ) : (
        /* luxury Receipt Layout */
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-[#0C0C0C]/60 border border-accent/30 rounded-none max-w-2xl mx-auto p-8 md:p-12 text-center font-sans space-y-8"
        >
          <div className="w-16 h-16 bg-accent/5 border border-accent rounded-none flex items-center justify-center mx-auto text-accent">
            <Check className="w-8 h-8" strokeWidth={3} />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-accent font-bold">
              {isRtl ? 'تم استقبال طلبك بنجاح' : 'SPECS SECURELY SUBMITTED'}
            </span>
            <h3 className="font-serif text-3xl text-gray-950 dark:text-white font-normal">
              {isRtl ? 'طلب تسعيرة مبدئية' : 'Quotation Proposal Queue'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
              {isRtl 
                ? 'لقد تم إرسال معطيات مشروعك ومرفقاتك بنجاح إلى مكتب الدراسات المعمارية الخاص بنا. لقد أنشأنا سجلاً رسمياً لك.' 
                : 'Your vector drawings, contact parameters, and custom dimensions have been uploaded. A formal estimation docket has been generated.'}
            </p>
          </div>

          {/* Golden Ticket Specs Card */}
          <div className="bg-gray-50 dark:bg-gray-950/40 rounded-none p-6 border border-gray-150 dark:border-gray-850 text-left rtl:text-right space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-3">
              <div>
                <span className="text-[9px] uppercase font-mono text-gray-400 block">{isRtl ? 'رقم السجل' : 'DOCKET NO.'}</span>
                <span className="text-xs font-mono font-bold text-accent">{quoteId}</span>
              </div>
              <div className="text-right rtl:text-left">
                <span className="text-[9px] uppercase font-mono text-gray-400 block">{isRtl ? 'التاريخ' : 'DATE'}</span>
                <span className="text-xs font-mono text-gray-500 dark:text-gray-300">
                  {new Date().toISOString().split('T')[0]}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-sans">
              <div>
                <span className="text-[9px] text-gray-400 block uppercase font-mono">{isRtl ? 'العميل' : 'Client Name'}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{formData.name}</span>
              </div>
              <div>
                <span className="text-[9px] text-gray-400 block uppercase font-mono">{isRtl ? 'الفئة' : 'Category'}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{formData.projectType}</span>
              </div>
              <div>
                <span className="text-[9px] text-gray-400 block uppercase font-mono">{isRtl ? 'السعر التقديري' : 'Estimated Price'}</span>
                <span className="font-semibold text-accent">
                  {estResult ? `${formatDzd(estResult.low)} - ${formatDzd(estResult.high)}` : (isRtl ? 'حسب الطلب' : 'Custom Quote')}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-gray-400 block uppercase font-mono">{isRtl ? 'الملفات المرفقة' : 'Files Enclosed'}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {files.length > 0 ? `${files.length} CAD attachments` : 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* Processing checklist */}
          <div className="text-left rtl:text-right space-y-3 font-sans">
            <h5 className="text-[10px] uppercase font-mono tracking-widest text-accent font-semibold">{isRtl ? 'خطوات المعالجة التالية:' : 'Prototyping & Review Roadmap:'}</h5>
            <div className="space-y-2.5 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-none border border-accent/30 text-accent text-[9px] font-bold flex items-center justify-center font-mono shrink-0 bg-accent/5">01</span>
                <span>{isRtl ? 'توزيع ملفات التصميم الهندسي على مهندس الـ CNC للمراجعة' : 'Vector integrity checks for CAD/DXF clean coordinates.'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-none border border-accent/30 text-accent text-[9px] font-bold flex items-center justify-center font-mono shrink-0 bg-accent/5">02</span>
                <span>{isRtl ? 'حساب ساعات التشغيل للميكنة وتكلفة طلاء اللاكيه الفاخر' : 'Machine routing run-time estimations and lacquer volume audit.'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-none border border-accent/30 text-accent text-[9px] font-bold flex items-center justify-center font-mono shrink-0 bg-accent/5">03</span>
                <span>{isRtl ? 'تزويدك بملف عرض مالي مفصل ومخطط ثنائي الأبعاد مجاني' : 'Direct draft pricing proposal delivery via your preferred callback.'}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center justify-center">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setFiles([]);
                setFormData({
                  name: '',
                  phone: '',
                  email: '',
                  city: '',
                  projectType: 'Decorative Wall Panels',
                  description: '',
                  dimensions: '',
                  preferredContact: 'email',
                });
              }}
              className="text-xs uppercase tracking-widest font-semibold font-mono text-gray-500 hover:text-accent transition-colors py-2"
            >
              {isRtl ? 'تقديم مواصفات أخرى' : 'Submit Another Scope'}
            </button>
            
            <a
              href={`https://wa.me/${(settings?.whatsappNumber || '').replace(/\+/g, '')}?text=Hi%20Atelier%20Les%20Romains%2C%20I%20have%20submitted%20project%20specs%20ID%20${quoteId}.%20Could%20we%20have%20a%20brief%20call%3F`}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 bg-[#B08D57] hover:bg-[#977443] text-black hover:text-white text-xs font-semibold uppercase tracking-widest rounded-none flex items-center justify-center gap-2 transition-colors font-mono"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.66.986 3.292 1.493 4.9.155 1.579-.908 3.237-1.854 4.885-2.8 1.648-.946 2.203-2.062 1.58-3.41l-2.223-4.526c-.623-1.267-1.745-1.221-2.617-.4l-1.488 1.399c-.66.621-1.32.55-2.091-.183-.772-.733-1.89-1.815-2.73-2.795-.84-.98-1.391-2.03-.842-2.82l1.196-1.721c.55-.79.376-1.826-.247-3.093l-1.848-3.79c-.624-1.267-1.522-1.314-2.298-.444l-1.41 1.59c-.777.872-1.05 1.954-.64 3.16.41 1.206 1.838 3.57 3.738 5.75l2.09 2.4c1.9 2.18 4.09 3.99 6.2 5.09z" />
              </svg>
              {isRtl ? 'متابعة عبر واتساب' : 'Instantly Chat on WhatsApp'}
            </a>
          </div>

        </motion.div>
      )}
    </div>
  );
};
