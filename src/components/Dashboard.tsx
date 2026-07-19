import React, { useState, useEffect, useRef } from 'react';
import { useApp, ContactMessage, MediaAsset } from '../store/AppContext.tsx';
import { Service, PortfolioProject, CNCProduct, Testimonial, BlogPost, QuoteRequest, AppSettings, PricingFactor } from '../types';
import { 
  FileText, Briefcase, ShoppingBag, Settings, Trash2, Plus, Check, CheckCircle, 
  RefreshCw, Save, TrendingUp, Users, DollarSign, Lock, Unlock, Mail, Image, 
  Layout, Heart, Upload, Folder, Shield, Activity, Database, Search, ArrowUp, 
  ArrowDown, Edit, Eye, Download, Star, Copy, ExternalLink, Archive, Calculator, ToggleLeft, ToggleRight, Wrench,
  CheckCircle2, Circle, FileDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { WorkshopEstimator } from './workshop/WorkshopEstimator.tsx';

const ORDER_STAGES: { key: string; label: string; labelAr: string }[] = [
  { key: 'created', label: 'Created', labelAr: 'تم الإنشاء' },
  { key: 'reviewed', label: 'Reviewed', labelAr: 'تمت المراجعة' },
  { key: 'approved', label: 'Approved', labelAr: 'معتمد' },
  { key: 'production', label: 'Production', labelAr: 'قيد الإنتاج' },
  { key: 'installation', label: 'Installation', labelAr: 'التركيب' },
  { key: 'completed', label: 'Completed', labelAr: 'مكتمل' },
];

export const Dashboard: React.FC = () => {
  const {
    language,
    services,
    projects,
    products,
    testimonials,
    blogPosts,
    quotes,
    settings,
    mediaFiles,
    contactMessages,
    pricingFactors,
    workshopPricing,
    activityLogs,
    
    saveSettings,
    saveService,
    deleteService,
    saveProject,
    deleteProject,
    saveProduct,
    deleteProduct,
    saveBlogPost,
    deleteBlogPost,
    saveTestimonial,
    deleteTestimonial,
    updateQuoteStatusAndReply,
    saveQuoteLineItems,
    updateMessageStatus,
    deleteMessage,
    uploadMedia,
    savePricingFactor,
    deletePricingFactor,
    saveWorkshopPricing,
    deleteWorkshopPricing,
    refetchAllAdminData,
    userRole,
    user
  } = useApp();

  const isRtl = language === 'ar';
  
  // 9 Unified Workspace Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'portfolio' | 'products' | 'pricing' | 'workshop' | 'workshop-pricing' | 'quotes' | 'system'>('overview');

  // Pricing & Materials tab local state (public Quote Estimator — unchanged)
  const [activePricingSub, setActivePricingSub] = useState<'material' | 'projectType' | 'complexity' | 'wilaya'>('material');
  const [editingFactorId, setEditingFactorId] = useState<string | null>(null);

  // Workshop Pricing tab local state (internal Workshop Estimator — separate system)
  const [activeWorkshopSub, setActiveWorkshopSub] = useState<'material' | 'paint' | 'edgeband' | 'laser' | 'routing' | 'labor' | 'installation' | 'transport' | 'margin' | 'waste'>('material');
  const [editingWorkshopId, setEditingWorkshopId] = useState<string | null>(null);
  
  // Local Audit Logs (simulated from session activities to avoid excessive writes, but connected to active user details)
  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; time: string; user: string; action: string; actionAr: string }>>([
    { id: '1', time: '17:05:12', user: 'Sadjed (Admin)', action: 'Logged into Administration Console', actionAr: 'تم تسجيل الدخول إلى لوحة التحكم' },
    { id: '2', time: '16:42:01', user: 'Abdenour (Manager)', action: 'Reviewed Quotation Request', actionAr: 'تمت مراجعة طلب تسعيرة' }
  ]);

  const addAuditLog = (action: string, actionAr: string) => {
    const userLabel = user?.email || 'Operator';
    setAuditLogs(prev => [
      { id: Date.now().toString(), time: new Date().toTimeString().split(' ')[0], user: userLabel, action, actionAr },
      ...prev.slice(0, 15)
    ]);
  };

  // Media Library filter and search
  const [activeMediaFolder, setActiveMediaFolder] = useState<'all' | 'portfolio' | 'products'>('all');
  const [mediaSearch, setMediaSearch] = useState('');
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Forms states
  const [settingsForm, setSettingsForm] = useState<AppSettings>(settings);
  useEffect(() => { setSettingsForm(settings); }, [settings]);

  // Project Add/Edit state
  const [projectEditId, setProjectEditId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<Omit<PortfolioProject, 'id'>>({
    title: '', titleAr: '', category: 'residential', description: '', descriptionAr: '',
    client: '', location: '', locationAr: '', completionDate: '',
    materials: ['Solid Oak'], materialsAr: ['بلوط صلب'], challenge: '', challengeAr: '', solution: '', solutionAr: '',
    images: ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800']
  });

  // Product Add/Edit state
  const [productEditId, setProductEditId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Omit<CNCProduct, 'id'>>({
    title: '', titleAr: '', category: 'decor-panels', description: '', descriptionAr: '',
    materials: ['MDF'], materialsAr: ['MDF ممتاز'], sizes: ['120x240 cm'],
    customizationOptions: ['Paint'], customizationOptionsAr: ['دهان مخصص'],
    images: ['https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800'],
    specifications: { 'Thickness': '18mm' }, specificationsAr: { 'السماكة': '١٨ ملم' }
  });

  // Services, Blog, Testimonial selected sub-types
  const [activeContentSub, setActiveContentSub] = useState<'homepage' | 'services' | 'blog' | 'testimonials' | 'quotation'>('homepage');
  const [blogForm, setBlogForm] = useState<Omit<BlogPost, 'id'>>({
    title: '', titleAr: '', excerpt: '', excerptAr: '', content: '', contentAr: '',
    category: 'CNC Tips', categoryAr: 'إرشادات', author: 'Sadjed Chebaki', authorAr: 'ساجد شيباكي',
    date: new Date().toISOString().split('T')[0], readTime: '5 min read', readTimeAr: '٥ دقائق',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800', tags: ['CNC']
  });
  const [testimonialForm, setTestimonialForm] = useState<Omit<Testimonial, 'id'>>({
    name: '', nameAr: '', role: 'Designer', roleAr: 'مصمم', company: 'Atelier', companyAr: 'ورشة',
    content: '', contentAr: '', rating: 5, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400', isFeatured: true
  });

  // Quotes Interaction State
  const [activeQuoteId, setActiveQuoteId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isReplySent, setIsReplySent] = useState(false);
  const [quoteLineItems, setQuoteLineItems] = useState<{ description: string; quantity: number; unitPrice: number }[]>([]);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [advancingStage, setAdvancingStage] = useState(false);

  // File uploading trigger
  const handleFileUploadTrigger = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setIsUploadingFile(true);
        const uploaded = await uploadMedia(e.target.files[0]);
        addAuditLog(`Uploaded file: ${uploaded.name}`, `تم رفع ملف جديد: ${uploaded.name}`);
        alert(isRtl ? 'تم رفع الملف بنجاح وحفظه!' : 'File uploaded successfully!');
        if (activeTab === 'portfolio') {
          setProjectForm(prev => ({ ...prev, images: [...prev.images, uploaded.url] }));
        } else if (activeTab === 'products') {
          setProductForm(prev => ({ ...prev, images: [...prev.images, uploaded.url] }));
        }
      } catch (err) {
        alert(isRtl ? 'خطأ أثناء رفع الملف' : 'Error uploading file');
      } finally {
        setIsUploadingFile(false);
      }
    }
  };

  // CSV Export helper
  const handleExportData = (dataType: 'quotes' | 'projects' | 'audit') => {
    let dataToExport = [];
    if (dataType === 'quotes') dataToExport = quotes;
    else if (dataType === 'projects') dataToExport = projects;
    else dataToExport = auditLogs;
    
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", jsonStr);
    dlAnchor.setAttribute("download", `les_romains_${dataType}_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    addAuditLog(`Exported ${dataType} database backup`, `تم تصدير نسخة احتياطية لـ ${dataType}`);
  };

  // Project Actions
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = projectEditId || `P-${Date.now().toString().slice(-4)}`;
      const payload: PortfolioProject = { ...projectForm, id };
      await saveProject(payload);
      addAuditLog(
        projectEditId ? `Updated project ${projectForm.title}` : `Created project ${projectForm.title}`,
        projectEditId ? `تم تحديث مشروع ${projectForm.titleAr}` : `تم إضافة مشروع جديد ${projectForm.titleAr}`
      );
      setProjectEditId(null);
      setProjectForm({
        title: '', titleAr: '', category: 'residential', description: '', descriptionAr: '',
        client: '', location: '', locationAr: '', completionDate: '',
        materials: ['Solid Oak'], materialsAr: ['بلوط صلب'], challenge: '', challengeAr: '', solution: '', solutionAr: '',
        images: ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800']
      });
      alert(isRtl ? 'تم الحفظ بنجاح!' : 'Saved successfully!');
    } catch (err) {
      alert(isRtl ? 'خطأ في عملية الحفظ في قاعدة البيانات' : 'Failed to save project data');
    }
  };

  const handleEditProject = (p: PortfolioProject) => {
    setProjectEditId(p.id);
    setProjectForm({
      title: p.title,
      titleAr: p.titleAr,
      category: p.category,
      description: p.description,
      descriptionAr: p.descriptionAr,
      client: p.client,
      location: p.location,
      locationAr: p.locationAr,
      completionDate: p.completionDate,
      materials: p.materials,
      materialsAr: p.materialsAr,
      challenge: p.challenge,
      challengeAr: p.challengeAr,
      solution: p.solution,
      solutionAr: p.solutionAr,
      images: p.images
    });
  };

  const handleDeleteProject = async (id: string, name: string, nameAr: string) => {
    if (confirm(isRtl ? 'هل أنت متأكد من حذف هذا المشروع نهائياً؟' : 'Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        addAuditLog(`Deleted project ${name}`, `تم حذف مشروع ${nameAr}`);
        alert(isRtl ? 'تم الحذف بنجاح' : 'Deleted successfully');
      } catch (err) {
        alert('Failed to delete project');
      }
    }
  };

  // Product Actions
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = productEditId || `PRD-${Date.now().toString().slice(-4)}`;
      const payload: CNCProduct = { ...productForm, id };
      await saveProduct(payload);
      addAuditLog(
        productEditId ? `Updated product ${productForm.title}` : `Created product ${productForm.title}`,
        productEditId ? `تم تحديث منتج ${productForm.titleAr}` : `تم إضافة منتج جديد ${productForm.titleAr}`
      );
      setProductEditId(null);
      setProductForm({
        title: '', titleAr: '', category: 'decor-panels', description: '', descriptionAr: '',
        materials: ['MDF'], materialsAr: ['MDF ممتاز'], sizes: ['120x240 cm'],
        customizationOptions: ['Paint'], customizationOptionsAr: ['دهان مخصص'],
        images: ['https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800'],
        specifications: { 'Thickness': '18mm' }, specificationsAr: { 'السماكة': '١٨ ملم' }
      });
      alert(isRtl ? 'تم حفظ المنتج بنجاح!' : 'Product saved successfully!');
    } catch (err) {
      alert(isRtl ? 'خطأ في عملية الحفظ' : 'Failed to save product details');
    }
  };

  const handleEditProduct = (prd: CNCProduct) => {
    setProductEditId(prd.id);
    setProductForm({
      title: prd.title,
      titleAr: prd.titleAr,
      category: prd.category,
      description: prd.description,
      descriptionAr: prd.descriptionAr,
      materials: prd.materials,
      materialsAr: prd.materialsAr,
      sizes: prd.sizes,
      customizationOptions: prd.customizationOptions,
      customizationOptionsAr: prd.customizationOptionsAr,
      images: prd.images,
      specifications: prd.specifications,
      specificationsAr: prd.specificationsAr
    });
  };

  const handleDeleteProduct = async (id: string, name: string, nameAr: string) => {
    if (confirm(isRtl ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        addAuditLog(`Deleted product ${name}`, `تم حذف منتج ${nameAr}`);
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  // Core Global Settings Apply
  const handleApplySettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveSettings(settingsForm);
      addAuditLog('Saved system settings & SEO configuration', 'تم حفظ إعدادات النظام وتهيئة السيو');
      alert(isRtl ? 'تم حفظ الإعدادات بنجاح!' : 'Settings applied successfully!');
    } catch (err) {
      alert(isRtl ? 'خطأ أثناء تطبيق الإعدادات' : 'Error applying settings');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Dynamic Responsive Admin Sidebar */}
      <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2 border-b lg:border-b-0 lg:border-r border-gray-150 dark:border-gray-800 pb-6 lg:pb-0 lg:pr-6 rtl:lg:border-r-0 rtl:lg:border-l rtl:lg:pr-0 rtl:lg:pl-6 text-left">
        <div className="p-3 bg-gray-50 dark:bg-gray-950 rounded-none border border-gray-150 dark:border-gray-900 mb-4 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-mono tracking-wider text-gray-400 uppercase">{isRtl ? 'الدور المعتمد' : 'Assigned Role'}</p>
            <p className="text-xs font-bold text-gray-900 dark:text-white capitalize">{userRole}</p>
          </div>
          <span className="w-2.5 h-2.5 rounded-none bg-[#B08D57] animate-pulse" />
        </div>

        {[
          { id: 'overview', label: 'Console Dashboard', labelAr: 'لوحة التحكم والتحليل', icon: Activity },
          { id: 'content', label: 'Home CMS & Settings', labelAr: 'إعدادات الموقع والرئيسية', icon: Layout },
          { id: 'portfolio', label: 'Portfolio (Projects)', labelAr: 'مشاريع المعرض الراقية', icon: Briefcase },
          { id: 'products', label: 'CNC Catalog CRUD', labelAr: 'منتجات ومكننة CNC', icon: ShoppingBag },
          { id: 'pricing', label: 'Pricing & Materials', labelAr: 'الأسعار والمواد', icon: Calculator },
          { id: 'workshop', label: 'Workshop Estimator', labelAr: 'حاسبة الورشة', icon: Wrench },
          { id: 'workshop-pricing', label: 'Workshop Pricing', labelAr: 'أسعار الورشة', icon: Settings },
          { id: 'quotes', label: 'CRM & Inbox Enquiries', labelAr: 'صندوق طلبات التسعير', icon: Mail, badge: quotes.filter(q => q.status === 'created').length },
          { id: 'system', label: 'System, Media & Security', labelAr: 'أمان، وسائط والملفات', icon: Shield }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`w-full flex items-center justify-between px-4 py-3 text-xs uppercase tracking-wider font-mono font-bold rounded-none transition-all text-left rtl:text-right border ${
              activeTab === tab.id 
                ? 'bg-accent text-black border-accent' 
                : 'text-gray-400 hover:text-gray-950 dark:hover:text-white border-transparent hover:bg-gray-100/10'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <tab.icon className="w-4 h-4" />
              <span>{isRtl ? tab.labelAr : tab.label}</span>
            </div>
            {tab.badge && tab.badge > 0 ? (
              <span className="w-5 h-5 rounded-none bg-accent text-black font-sans text-[10px] font-bold flex items-center justify-center animate-bounce">
                {tab.badge}
              </span>
            ) : null}
          </button>
        ))}

        <div className="mt-auto pt-6 border-t border-gray-150 dark:border-gray-800 hidden lg:block text-center space-y-2">
          <p className="text-[10px] text-accent font-semibold font-mono">LES ROMAINS ATELIER</p>
          <p className="text-[9px] text-gray-400 font-mono">Full-Stack Cloud SQL Engine</p>
        </div>
      </div>

      {/* Main Active Panel Area */}
      <div className="flex-1 bg-white dark:bg-gray-900/40 rounded-none border border-gray-150 dark:border-gray-900 p-6 sm:p-8 shadow-xl min-h-[70vh]">
        
        {/* TAB 1: CONSOLE OVERVIEW & LIVE ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8 text-left">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h3 className="font-serif text-2xl font-medium text-gray-950 dark:text-white">{isRtl ? 'مؤشرات الأداء والمعاملات' : 'Workshop Command Console'}</h3>
                <p className="text-xs text-gray-400 mt-1">{isRtl ? 'إحصائيات فورية لعمليات الورشة الرقمية والاتصالات.' : 'Real-time operational indicators and visitor pipelines.'}</p>
              </div>
              <div className="flex gap-2 font-mono text-[10px]">
                <button onClick={() => handleExportData('audit')} className="px-3 py-1.5 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white hover:border-accent hover:text-accent rounded-none transition-colors flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" />
                  {isRtl ? 'تصدير السجل' : 'Export Logs'}
                </button>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Potential pipeline', titleAr: 'مبيعات تقديرية', value: `$${(quotes.length * 14800).toLocaleString()}`, icon: DollarSign, trend: '+14.5%', color: 'text-accent border-accent/20 bg-accent/5' },
                { title: 'Pending quotations', titleAr: 'عروض معلقة مالي', value: quotes.filter(q => q.status === 'created').length, icon: FileText, trend: 'Awaiting reply', color: 'border-accent/30 bg-accent/5 text-accent' },
                { title: 'Active projects', titleAr: 'المشاريع المنشورة', value: projects.length, icon: Briefcase, trend: '100% Quality spec', color: 'border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/10 text-gray-800 dark:text-gray-200' },
                { title: 'Media Assets', titleAr: 'ملفات الوسائط', value: mediaFiles.length, icon: Image, trend: 'Cloud Storage', color: 'border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/10 text-gray-800 dark:text-gray-200' }
              ].map((m, i) => (
                <div key={i} className={`p-5 rounded-none border flex items-center justify-between ${m.color}`}>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-wider uppercase text-gray-400 block">{isRtl ? m.titleAr : m.title}</span>
                    <span className="text-xl font-bold font-mono block">{m.value}</span>
                    <span className="text-[9px] text-gray-500 font-mono block">{m.trend}</span>
                  </div>
                  <div className="p-2.5 bg-gray-950/25 rounded-none">
                    <m.icon className="w-4.5 h-4.5" />
                  </div>
                </div>
              ))}
            </div>

            {/* Live Chart */}
            <div className="p-6 bg-gray-50 dark:bg-gray-950/50 rounded-none border border-gray-150 dark:border-gray-900 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs uppercase font-mono tracking-widest font-bold text-accent">{isRtl ? 'مخطط الزيارات وتقديم عروض الأسعار (٦ أشهر الماضية)' : 'LIVE VISITOR & CONVERSION CHART'}</h4>
                <div className="flex gap-4 text-[9px] font-mono">
                  <span className="flex items-center gap-1 text-accent"><span className="w-2.5 h-2.5 rounded-none bg-accent inline-block"></span> {isRtl ? 'الزيارات الكلية' : 'Total Visitors'}</span>
                  <span className="flex items-center gap-1 text-white"><span className="w-2.5 h-2.5 rounded-none bg-white inline-block"></span> {isRtl ? 'تقديمات التسعير' : 'Quotes Sent'}</span>
                </div>
              </div>

              <div className="relative h-48 w-full">
                <svg className="w-full h-full" viewBox="0 0 600 180" preserveAspectRatio="none">
                  <line x1="0" y1="30" x2="600" y2="30" stroke="#333" strokeDasharray="3,3" strokeWidth="0.5" />
                  <line x1="0" y1="90" x2="600" y2="90" stroke="#333" strokeDasharray="3,3" strokeWidth="0.5" />
                  <line x1="0" y1="150" x2="600" y2="150" stroke="#333" strokeDasharray="3,3" strokeWidth="0.5" />
                  <path d="M 0 160 L 100 130 L 200 90 L 300 110 L 400 40 L 500 70 L 600 20 L 600 180 L 0 180 Z" className="fill-accent/10" />
                  <path d="M 0 160 L 100 130 L 200 90 L 300 110 L 400 40 L 500 70 L 600 20" fill="none" stroke="var(--color-accent, #cfb078)" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 0 175 L 100 165 L 200 150 L 300 140 L 400 110 L 500 120 L 600 90" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="5,3" strokeLinecap="round" />
                  <circle cx="400" cy="40" r="5" className="fill-accent" />
                  <circle cx="600" cy="20" r="5" className="fill-accent" />
                </svg>
                <div className="flex justify-between text-[9px] font-mono text-gray-500 pt-2 px-1">
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul (Current)</span>
                </div>
              </div>
            </div>

            {/* Audit Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">{isRtl ? 'سجل العمليات والتدقيق الأمني' : 'REAL-TIME WORKSPACE AUDIT LOG'}</span>
                <div className="bg-gray-50 dark:bg-gray-950/60 border border-gray-150 dark:border-gray-900 rounded-none p-4 font-mono text-[10px] space-y-3 h-64 overflow-y-auto">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-2 border-b border-gray-200/50 dark:border-gray-900/50 pb-2">
                      <span className="text-gray-500 shrink-0">[{log.time}]</span>
                      <span className="text-accent shrink-0">{log.user}:</span>
                      <span className="text-gray-800 dark:text-gray-300">{isRtl ? log.actionAr : log.action}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-none border border-gray-150 dark:border-gray-900 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">{isRtl ? 'إجراءات تشغيلية سريعة' : 'QUICK OPERATIONS ACTIONS'}</span>
                  <p className="text-xs text-gray-400">{isRtl ? 'الوصول السريع إلى تحديث البيانات، وإدارة المحتوى والنسخ.' : 'One-click shortcuts to execute administrative content overrides.'}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { setActiveTab('portfolio'); setProjectEditId(null); }} className="p-3 bg-gray-50 hover:bg-accent hover:text-black dark:bg-[#0A0A0A] border border-gray-150 dark:border-gray-850 rounded-none font-mono text-[10px] font-bold text-center transition-colors">
                    + {isRtl ? 'مشروع جديد' : 'New Project'}
                  </button>
                  <button onClick={() => { setActiveTab('products'); setProductEditId(null); }} className="p-3 bg-gray-50 hover:bg-accent hover:text-black dark:bg-[#0A0A0A] border border-gray-150 dark:border-gray-850 rounded-none font-mono text-[10px] font-bold text-center transition-colors">
                    + {isRtl ? 'منتج CNC جديد' : 'New CNC Product'}
                  </button>
                  <button onClick={() => handleExportData('quotes')} className="p-3 bg-gray-50 hover:bg-accent hover:text-black dark:bg-[#0A0A0A] border border-gray-150 dark:border-gray-850 rounded-none font-mono text-[10px] font-bold text-center transition-colors">
                    ↓ {isRtl ? 'تصدير الطلبات' : 'Backup Quotes'}
                  </button>
                  <button onClick={() => { setAuditLogs([]); }} className="p-3 bg-red-950/10 hover:bg-red-900 border border-red-900/30 rounded-none font-mono text-[10px] font-bold text-center transition-all text-red-400 hover:text-white">
                    × {isRtl ? 'مسح السجل' : 'Clear Audits'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WEBSITE SETTINGS & HOME CMS */}
        {activeTab === 'content' && (
          <div className="space-y-8 text-left">
            <div className="flex border-b border-gray-200 dark:border-gray-800 pb-2 gap-4">
              {[
                { id: 'homepage', label: 'Homepage Hero & Stats', labelAr: 'الواجهة الأمامية والإحصائيات' },
                { id: 'services', label: 'Services CMS', labelAr: 'إدارة الخدمات المعمارية' },
                { id: 'blog', label: 'Blog & Articles', labelAr: 'المقالات والأفكار' },
                { id: 'testimonials', label: 'Testimonials CRUD', labelAr: 'آراء العملاء' },
                { id: 'quotation', label: 'Quotation PDF Settings', labelAr: 'إعدادات عرض السعر PDF' }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setActiveContentSub(sub.id as any)}
                  className={`pb-2 text-xs uppercase tracking-wider font-mono font-bold border-b-2 -mb-2.5 transition-all ${
                    activeContentSub === sub.id 
                      ? 'border-accent text-accent' 
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  {isRtl ? sub.labelAr : sub.label}
                </button>
              ))}
            </div>

            {/* Homepage Hero */}
            {activeContentSub === 'homepage' && (
              <form onSubmit={handleApplySettings} className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-950 p-5 rounded-none border border-gray-150 dark:border-gray-900 space-y-4">
                  <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider block">01. HERO LANDING TEXTS (DYNAMIC)</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-mono mb-1">Hero Heading (EN)</label>
                      <input type="text" value={settingsForm.heroTitle || ''} onChange={e=>setSettingsForm({...settingsForm, heroTitle: e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-none px-3 py-2 text-xs text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-mono mb-1">عنوان الواجهة (العربية)</label>
                      <input type="text" value={settingsForm.heroTitleAr || ''} onChange={e=>setSettingsForm({...settingsForm, heroTitleAr: e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-none px-3 py-2 text-xs text-gray-900 dark:text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-mono mb-1">Hero Subtitle Description (EN)</label>
                      <textarea rows={2} value={settingsForm.heroSubtitle || ''} onChange={e=>setSettingsForm({...settingsForm, heroSubtitle: e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded px-3 py-2 text-xs text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-mono mb-1">الوصف الفرعي (العربية)</label>
                      <textarea rows={2} value={settingsForm.heroSubtitleAr || ''} onChange={e=>setSettingsForm({...settingsForm, heroSubtitleAr: e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded px-3 py-2 text-xs text-gray-900 dark:text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-mono mb-1">Hero Badge Text (EN)</label>
                      <input type="text" value={settingsForm.heroBadge || ''} onChange={e=>setSettingsForm({...settingsForm, heroBadge: e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded px-3 py-2 text-xs text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-mono mb-1">شعار الواجهة الصغير (العربية)</label>
                      <input type="text" value={settingsForm.heroBadgeAr || ''} onChange={e=>setSettingsForm({...settingsForm, heroBadgeAr: e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded px-3 py-2 text-xs text-gray-900 dark:text-white" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] text-gray-400 uppercase font-mono mb-1">Hero Background Image URL</label>
                      <div className="flex gap-2">
                        <input type="text" value={settingsForm.heroBgImage || ''} onChange={e=>setSettingsForm({...settingsForm, heroBgImage: e.target.value})} className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded px-3 py-2 text-xs text-gray-900 dark:text-white" />
                        <button type="button" onClick={() => {
                          const triggerUpload = async () => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = async (ev) => {
                              const f = (ev.target as HTMLInputElement).files?.[0];
                              if (f) {
                                try {
                                  setIsUploadingFile(true);
                                  const uploaded = await uploadMedia(f);
                                  setSettingsForm(prev => ({ ...prev, heroBgImage: uploaded.url }));
                                  alert(isRtl ? 'تم رفع الصورة!' : 'Image uploaded successfully!');
                                } catch (e) {
                                  alert('Upload failed');
                                } finally {
                                  setIsUploadingFile(false);
                                }
                              }
                            };
                            input.click();
                          };
                          triggerUpload();
                        }} className="px-3 bg-gray-950 text-accent font-mono text-[10px] uppercase font-bold border border-accent/20 rounded">Upload</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-950 p-5 rounded border border-gray-150 dark:border-gray-900 space-y-4">
                  <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider block">02. FLOATING STATISTICS COUNTERS</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded">
                      <label className="block text-[9px] text-gray-400 uppercase font-mono">Stat 1 Value & Labels</label>
                      <input type="text" value={settingsForm.homeStat1Value || ''} onChange={e=>setSettingsForm({...settingsForm, homeStat1Value: e.target.value})} className="w-full bg-transparent border-b border-gray-200 dark:border-gray-800 py-1 text-xs text-accent font-bold" />
                      <input type="text" value={settingsForm.homeStat1Label || ''} onChange={e=>setSettingsForm({...settingsForm, homeStat1Label: e.target.value})} className="w-full bg-transparent text-[10px] py-1 text-gray-400" placeholder="English label" />
                      <input type="text" value={settingsForm.homeStat1LabelAr || ''} onChange={e=>setSettingsForm({...settingsForm, homeStat1LabelAr: e.target.value})} className="w-full bg-transparent text-[10px] py-1 text-gray-400" placeholder="الملصق بالعربية" />
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded">
                      <label className="block text-[9px] text-gray-400 uppercase font-mono">Stat 2 Value & Labels</label>
                      <input type="text" value={settingsForm.homeStat2Value || ''} onChange={e=>setSettingsForm({...settingsForm, homeStat2Value: e.target.value})} className="w-full bg-transparent border-b border-gray-200 dark:border-gray-800 py-1 text-xs text-accent font-bold" />
                      <input type="text" value={settingsForm.homeStat2Label || ''} onChange={e=>setSettingsForm({...settingsForm, homeStat2Label: e.target.value})} className="w-full bg-transparent text-[10px] py-1 text-gray-400" placeholder="English label" />
                      <input type="text" value={settingsForm.homeStat2LabelAr || ''} onChange={e=>setSettingsForm({...settingsForm, homeStat2LabelAr: e.target.value})} className="w-full bg-transparent text-[10px] py-1 text-gray-400" placeholder="الملصق بالعربية" />
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded">
                      <label className="block text-[9px] text-gray-400 uppercase font-mono">Stat 3 Value & Labels</label>
                      <input type="text" value={settingsForm.homeStat3Value || ''} onChange={e=>setSettingsForm({...settingsForm, homeStat3Value: e.target.value})} className="w-full bg-transparent border-b border-gray-200 dark:border-gray-800 py-1 text-xs text-accent font-bold" />
                      <input type="text" value={settingsForm.homeStat3Label || ''} onChange={e=>setSettingsForm({...settingsForm, homeStat3Label: e.target.value})} className="w-full bg-transparent text-[10px] py-1 text-gray-400" placeholder="English label" />
                      <input type="text" value={settingsForm.homeStat3LabelAr || ''} onChange={e=>setSettingsForm({...settingsForm, homeStat3LabelAr: e.target.value})} className="w-full bg-transparent text-[10px] py-1 text-gray-400" placeholder="الملصق بالعربية" />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-950 p-5 rounded border border-gray-150 dark:border-gray-900 space-y-4">
                  <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider block">03. METADATA & GENERAL COMPANY INFO</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-mono mb-1">Atelier SEO Meta Title Tag</label>
                      <input type="text" value={settingsForm.seoTitle || ''} onChange={e=>setSettingsForm({...settingsForm, seoTitle: e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded px-3 py-2 text-xs text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-mono mb-1">Company Support Email</label>
                      <input type="email" value={settingsForm.contactEmail || ''} onChange={e=>setSettingsForm({...settingsForm, contactEmail: e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded px-3 py-2 text-xs text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-mono mb-1">SEO Description</label>
                      <textarea rows={2} value={settingsForm.seoDescription || ''} onChange={e=>setSettingsForm({...settingsForm, seoDescription: e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded px-3 py-2 text-xs text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-mono mb-1">SEO Keywords (Comma Separated)</label>
                      <textarea rows={2} value={settingsForm.seoKeywords || ''} onChange={e=>setSettingsForm({...settingsForm, seoKeywords: e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded px-3 py-2 text-xs text-gray-900 dark:text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-950 p-5 rounded border border-gray-150 dark:border-gray-900 space-y-4">
                  <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider block">04. SOCIAL MEDIA LINKS (DYNAMIC)</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-mono mb-1">Facebook URL</label>
                      <input type="url" value={settingsForm.facebookUrl || ''} onChange={e=>setSettingsForm({...settingsForm, facebookUrl: e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded px-3 py-2 text-xs text-gray-900 dark:text-white" placeholder="https://facebook.com/..." />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-mono mb-1">Instagram URL</label>
                      <input type="url" value={settingsForm.instagramUrl || ''} onChange={e=>setSettingsForm({...settingsForm, instagramUrl: e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded px-3 py-2 text-xs text-gray-900 dark:text-white" placeholder="https://instagram.com/..." />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-mono mb-1">TikTok URL</label>
                      <input type="url" value={settingsForm.tiktokUrl || ''} onChange={e=>setSettingsForm({...settingsForm, tiktokUrl: e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded px-3 py-2 text-xs text-gray-900 dark:text-white" placeholder="https://tiktok.com/@..." />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-mono mb-1">YouTube URL</label>
                      <input type="url" value={settingsForm.youtubeUrl || ''} onChange={e=>setSettingsForm({...settingsForm, youtubeUrl: e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded px-3 py-2 text-xs text-gray-900 dark:text-white" placeholder="https://youtube.com/..." />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-mono mb-1">LinkedIn URL</label>
                      <input type="url" value={settingsForm.linkedinUrl || ''} onChange={e=>setSettingsForm({...settingsForm, linkedinUrl: e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded px-3 py-2 text-xs text-gray-900 dark:text-white" placeholder="https://linkedin.com/in/..." />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="submit" className="px-6 py-3 bg-accent text-black font-semibold text-xs uppercase tracking-widest rounded transition-all flex items-center gap-1">
                    <Save className="w-4 h-4" />
                    {isRtl ? 'حفظ وتحديث المحتوى' : 'Save & Propagate Changes'}
                  </button>
                </div>
              </form>
            )}

            {/* Services CMS */}
            {activeContentSub === 'services' && (
              <div className="space-y-6">
                <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">{isRtl ? 'الخدمات الحالية المنشورة' : 'PUBLISHED SERVICES RECORDS'}</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {services.map(ser => (
                    <div key={ser.id} className="bg-gray-50 dark:bg-gray-950 p-4 rounded border border-gray-150 dark:border-gray-900 flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-950 dark:text-white text-xs">{isRtl ? ser.titleAr : ser.title}</p>
                        <p className="text-[10px] text-gray-500 capitalize mt-1 font-mono">{ser.category} • {ser.id}</p>
                      </div>
                      <button onClick={async () => {
                        if (confirm('Delete service?')) {
                          try {
                            await deleteService(ser.id);
                            addAuditLog(`Deleted service ${ser.title}`, `تم حذف خدمة ${ser.titleAr}`);
                          } catch (e) { alert('Delete failed'); }
                        }
                      }} className="p-1.5 hover:text-red-500 rounded hover:bg-red-500/15 text-gray-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Create New Service */}
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const formEl = e.currentTarget;
                  const fd = new FormData(formEl);
                  const title = fd.get('title') as string;
                  const titleAr = fd.get('titleAr') as string;
                  const category = fd.get('category') as any;
                  if(title && titleAr) {
                    try {
                      const added: Service = {
                        id: `SRV-${Date.now().toString().slice(-3)}`,
                        title, titleAr, category,
                        description: 'Premium craft fabrication.', descriptionAr: 'تصنيع عالي الجودة والاتقان بورشة ليز رومان.',
                        fullDescription: 'Detailed specifications.', fullDescriptionAr: 'تفاصيل دقيقة وفنية للخدمة.',
                        icon: 'Sliders', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800',
                        features: ['Custom Size'], featuresAr: ['مقاسات مخصصة']
                      };
                      await saveService(added);
                      addAuditLog(`Added Service ${title}`, `تم إضافة الخدمة المعمارية ${titleAr}`);
                      formEl.reset();
                    } catch (err) {
                      alert('Failed to save service');
                    }
                  }
                }} className="bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-900 p-5 rounded space-y-4">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">+ {isRtl ? 'نشر خدمة معمارية جديدة بالورشة' : 'ADD NEW CUSTOM SERVICE RECORD'}</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input required name="title" placeholder="Service Name (EN)" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs rounded p-2.5 text-gray-900 dark:text-white" />
                    <input required name="titleAr" placeholder="اسم الخدمة بالكامل (العربية)" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs rounded p-2.5 text-gray-900 dark:text-white" />
                    <select name="category" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs rounded p-2.5 text-gray-900 dark:text-white">
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="manufacturing">Manufacturing</option>
                    </select>
                  </div>
                  <button type="submit" className="px-4 py-2 bg-accent text-black font-bold text-[10px] tracking-wider uppercase font-mono rounded hover:bg-accent-dark transition-all">
                    {isRtl ? 'حفظ ونشر الخدمة' : 'Save & Publish Service'}
                  </button>
                </form>
              </div>
            )}

            {/* Blog CMS */}
            {activeContentSub === 'blog' && (
              <div className="space-y-6">
                <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">{isRtl ? 'المقالات والتدوينات المنشورة' : 'PUBLISHED ARTICLES & BLOG POSTS'}</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {blogPosts.map(post => (
                    <div key={post.id} className="bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-900 rounded p-4 flex gap-3 items-center justify-between">
                      <div className="flex gap-3 items-center">
                        <img src={post.image} className="w-10 h-10 object-cover rounded" />
                        <div>
                          <p className="font-bold text-xs text-gray-900 dark:text-white line-clamp-1">{isRtl ? post.titleAr : post.title}</p>
                          <p className="text-[9px] text-gray-500 font-mono">{post.date} • {post.author}</p>
                        </div>
                      </div>
                      <button onClick={async () => {
                        if (confirm('Delete article?')) {
                          try {
                            await deleteBlogPost(post.id);
                            addAuditLog(`Deleted blog ${post.title}`, `تم حذف مقال ${post.titleAr}`);
                          } catch (e) { alert('Failed to delete'); }
                        }
                      }} className="p-1.5 hover:text-red-500 rounded text-gray-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Create Blog Form */}
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if(blogForm.title && blogForm.titleAr) {
                    try {
                      const id = `post-${Date.now().toString().slice(-3)}`;
                      await saveBlogPost({ ...blogForm, id } as any);
                      addAuditLog(`Created blog article ${blogForm.title}`, `تم نشر المقال ${blogForm.titleAr}`);
                      setBlogForm({ ...blogForm, title: '', titleAr: '', excerpt: '', excerptAr: '', content: '', contentAr: '' });
                    } catch (err) {
                      alert('Failed to save post');
                    }
                  }
                }} className="bg-gray-50 dark:bg-gray-950 p-5 rounded border border-gray-150 dark:border-gray-900 space-y-4">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">+ {isRtl ? 'كتابة ونشر مقال تقني ومعماري' : 'WRITE & COMPOSE NEW CMS ARTICLE'}</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input required value={blogForm.title} onChange={e=>setBlogForm({...blogForm, title: e.target.value})} placeholder="Article Heading (EN)" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs rounded p-2.5 text-gray-900 dark:text-white" />
                    <input required value={blogForm.titleAr} onChange={e=>setBlogForm({...blogForm, titleAr: e.target.value})} placeholder="عنوان المقالة بالكامل (العربية)" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs rounded p-2.5 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-mono text-gray-400 mb-1">Visual Markdown Live Preview Editor</label>
                    <textarea rows={4} value={blogForm.content} onChange={e=>setBlogForm({...blogForm, content: e.target.value})} placeholder="Type Markdown / HTML body content here..." className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs font-mono rounded p-2.5 text-gray-900 dark:text-white focus:outline-none" />
                  </div>
                  <button type="submit" className="px-4 py-2 bg-accent text-black font-bold text-[10px] tracking-wider uppercase font-mono rounded hover:bg-accent-dark transition-all">
                    {isRtl ? 'حفظ ونشر المقالة فوراً' : 'Publish Article Live'}
                  </button>
                </form>
              </div>
            )}

            {/* Testimonials CMS */}
            {activeContentSub === 'testimonials' && (
              <div className="space-y-6">
                <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">{isRtl ? 'آراء العملاء المنشورة بالموقع' : 'PUBLISHED TESTIMONIAL REVIEWS'}</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testimonials.map(t => (
                    <div key={t.id} className="bg-gray-50 dark:bg-gray-950 rounded border border-gray-150 dark:border-gray-900 p-4 flex justify-between items-center">
                      <div className="flex gap-3 items-center">
                        <img src={t.avatar} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-xs text-gray-900 dark:text-white">{isRtl ? t.nameAr : t.name}</p>
                          <p className="text-[9px] text-accent font-mono">{isRtl ? t.companyAr : t.company} • {t.rating} Stars</p>
                        </div>
                      </div>
                      <button onClick={async () => {
                        if (confirm('Delete testimonial?')) {
                          try {
                            await deleteTestimonial(t.id);
                            addAuditLog(`Deleted review from ${t.name}`, `تم حذف تقييم العميل ${t.nameAr}`);
                          } catch (e) { alert('Delete failed'); }
                        }
                      }} className="p-1.5 hover:text-red-500 rounded text-gray-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Create Testimonial */}
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if(testimonialForm.name && testimonialForm.content) {
                    try {
                      const id = `t-${Date.now().toString().slice(-3)}`;
                      await saveTestimonial({ ...testimonialForm, id, nameAr: testimonialForm.name, contentAr: testimonialForm.content } as any);
                      addAuditLog(`Created testimonial from ${testimonialForm.name}`, `تم إضافة رأي العميل ${testimonialForm.name}`);
                      setTestimonialForm({ ...testimonialForm, name: '', content: '', company: '' });
                    } catch (err) { alert('Failed to save testimonial'); }
                  }
                }} className="bg-gray-50 dark:bg-gray-950 p-5 rounded border border-gray-150 dark:border-gray-900 space-y-4">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">+ {isRtl ? 'إضافة رأي أو مراجعة لعميل' : 'ADD NEW CUSTOMER TESTIMONIAL'}</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input required value={testimonialForm.name} onChange={e=>setTestimonialForm({...testimonialForm, name: e.target.value})} placeholder="Customer Full Name" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs rounded p-2.5 text-gray-900 dark:text-white" />
                    <input required value={testimonialForm.company} onChange={e=>setTestimonialForm({...testimonialForm, company: e.target.value})} placeholder="Company/Business/City" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs rounded p-2.5 text-gray-900 dark:text-white" />
                    <select value={testimonialForm.rating} onChange={e=>setTestimonialForm({...testimonialForm, rating: parseInt(e.target.value)})} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs rounded p-2.5 text-gray-900 dark:text-white">
                      <option value="5">⭐⭐⭐⭐⭐ (5 Star Rating)</option>
                      <option value="4">⭐⭐⭐⭐ (4 Star Rating)</option>
                    </select>
                  </div>
                  <div>
                    <textarea rows={2} required value={testimonialForm.content} onChange={e=>setTestimonialForm({...testimonialForm, content: e.target.value})} placeholder="Write the actual customer feedback text..." className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs rounded p-2.5 text-gray-900 dark:text-white" />
                  </div>
                  <button type="submit" className="px-4 py-2 bg-accent text-black font-bold text-[10px] tracking-wider uppercase font-mono rounded hover:bg-accent-dark transition-all">
                    {isRtl ? 'حفظ ونشر التقييم' : 'Save Testimonial Feedback'}
                  </button>
                </form>
              </div>
            )}

            {/* Quotation PDF Settings */}
            {activeContentSub === 'quotation' && (
              <form onSubmit={handleApplySettings} className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-950 p-5 rounded-none border border-gray-150 dark:border-gray-900 space-y-4">
                  <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider block">
                    {isRtl ? 'إعدادات عرض السعر الرسمي (PDF)' : 'OFFICIAL QUOTATION PDF SETTINGS'}
                  </span>
                  <p className="text-[11px] text-gray-500">
                    {isRtl
                      ? 'هذه القيم تظهر في كل ملف PDF يتم إنشاؤه من نافذة إدارة طلبات التسعير.'
                      : 'These values appear on every PDF generated from the Quotes CRM panel.'}
                  </p>

                  <div>
                    <label className="text-[10px] uppercase text-gray-400 font-mono block mb-1">
                      {isRtl ? 'مدة صلاحية العرض (بالأيام)' : 'Quote Validity Period (days)'}
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={settingsForm.quoteValidityDays ?? 15}
                      onChange={e => setSettingsForm({ ...settingsForm, quoteValidityDays: parseInt(e.target.value) || 15 })}
                      className="w-full sm:w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-none px-3 py-2 text-xs text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase text-gray-400 font-mono block mb-1">
                      {isRtl ? 'الشروط والأحكام (تُطبع في PDF بالإنجليزية فقط)' : 'Terms & Conditions (printed on the PDF, English only)'}
                    </label>
                    <textarea
                      rows={7}
                      value={settingsForm.termsAndConditions || ''}
                      onChange={e => setSettingsForm({ ...settingsForm, termsAndConditions: e.target.value })}
                      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-none px-3 py-2 text-xs text-gray-900 dark:text-white font-mono leading-relaxed"
                    />
                    <p className="text-[10px] text-gray-400 mt-1.5">
                      {isRtl
                        ? 'ملاحظة: النصوص العربية لا تُعرض بشكل صحيح في مكتبة PDF المستخدمة حالياً (الحروف تنفصل ولا تترابط)، لذلك يُطبع عرض السعر بالإنجليزية فقط مهما كانت لغة الموقع.'
                        : 'Note: the PDF library currently used cannot shape Arabic script correctly (letters render disconnected), so the quotation always prints in English regardless of site language.'}
                    </p>
                  </div>

                  <div className="opacity-50 pointer-events-none">
                    <label className="text-[10px] uppercase text-gray-400 font-mono block mb-1">
                      {isRtl ? 'الشروط بالعربية (محفوظة، غير مستخدمة في PDF حالياً)' : 'Terms & Conditions — Arabic (stored, not yet used in the PDF)'}
                    </label>
                    <textarea
                      rows={5}
                      value={settingsForm.termsAndConditionsAr || ''}
                      onChange={e => setSettingsForm({ ...settingsForm, termsAndConditionsAr: e.target.value })}
                      dir="rtl"
                      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-none px-3 py-2 text-xs text-gray-900 dark:text-white"
                    />
                  </div>

                  <button type="submit" className="px-4 py-2 bg-accent text-black font-bold text-[10px] tracking-wider uppercase font-mono rounded hover:bg-accent-dark transition-all">
                    {isRtl ? 'حفظ الإعدادات' : 'Save Quotation Settings'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: PORTFOLIO CRUD */}
        {activeTab === 'portfolio' && (
          <div className="space-y-8 text-left">
            <div className="flex justify-between items-center pb-4 border-b border-gray-150 dark:border-gray-800">
              <h3 className="font-serif text-2xl font-medium text-gray-950 dark:text-white">
                {projectEditId ? (isRtl ? `تعديل مشروع: ${projectForm.titleAr}` : `Edit Project: ${projectForm.title}`) : (isRtl ? 'المشروعات ومستندات الإنجاز' : 'Commission Portfolio Workspace')}
              </h3>
              {projectEditId && (
                <button onClick={() => setProjectEditId(null)} className="px-2.5 py-1.5 border border-red-500/20 text-red-500 text-[10px] uppercase tracking-wider font-mono rounded hover:bg-red-500 hover:text-white transition-all">
                  {isRtl ? 'إلغاء التعديل' : 'Cancel Edit'}
                </button>
              )}
            </div>

            {/* Core Commission Form */}
            <form onSubmit={handleSaveProject} className="bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-900 rounded-lg p-5 sm:p-6 space-y-4">
              <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">
                {projectEditId ? (isRtl ? 'تعديل حقول المعطيات الفنية' : 'OVERWRITE PROJECT DATA PARAMETERS') : (isRtl ? 'تسجيل ونشر ملف مشروع معتمد' : '01. INPUT PORTFOLIO SCHEMATIC DATA RECORD')}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[9px] uppercase font-mono text-gray-400 mb-1">Title (EN)</label>
                  <input required type="text" value={projectForm.title} onChange={e=>setProjectForm({...projectForm, title:e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded px-2.5 py-2 text-xs text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-mono text-gray-400 mb-1">العنوان بالعربية</label>
                  <input required type="text" value={projectForm.titleAr} onChange={e=>setProjectForm({...projectForm, titleAr:e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded px-2.5 py-2 text-xs text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-mono text-gray-400 mb-1">Architect Category</label>
                  <select value={projectForm.category} onChange={e=>setProjectForm({...projectForm, category: e.target.value as any})} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded px-2.5 py-2 text-xs text-gray-900 dark:text-white">
                    <option value="residential">Residential Villa Decor</option>
                    <option value="commercial">Commercial Shopfront / Office</option>
                    <option value="manufacturing">Industrial CNC Millwork</option>
                    <option value="decor">Bespoke Architectural Mirrors</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] uppercase font-mono text-gray-400 mb-1">Project Short Description (EN)</label>
                  <textarea rows={2} required value={projectForm.description} onChange={e=>setProjectForm({...projectForm, description:e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded px-2.5 py-2 text-xs text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-mono text-gray-400 mb-1">الوصف الفرعي للمشروع (العربية)</label>
                  <textarea rows={2} required value={projectForm.descriptionAr} onChange={e=>setProjectForm({...projectForm, descriptionAr:e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded px-2.5 py-2 text-xs text-gray-900 dark:text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block text-[9px] uppercase font-mono text-gray-400 mb-1">Client</label>
                  <input type="text" value={projectForm.client} onChange={e=>setProjectForm({...projectForm, client: e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded p-2 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-mono text-gray-400 mb-1">Location (EN)</label>
                  <input type="text" value={projectForm.location} onChange={e=>setProjectForm({...projectForm, location: e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded p-2 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-mono text-gray-400 mb-1">الموقع (العربية)</label>
                  <input type="text" value={projectForm.locationAr} onChange={e=>setProjectForm({...projectForm, locationAr: e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded p-2 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-mono text-gray-400 mb-1">Completion Date</label>
                  <input type="text" placeholder="e.g. June 2026" value={projectForm.completionDate} onChange={e=>setProjectForm({...projectForm, completionDate: e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded p-2 text-gray-900 dark:text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[9px] uppercase font-mono text-gray-400">Attached Project Photos (Cover and Gallery)</label>
                <div className="flex gap-2 flex-wrap">
                  {projectForm.images.map((imgUrl, idx) => (
                    <div key={idx} className="relative w-16 h-16 border rounded overflow-hidden">
                      <img src={imgUrl} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setProjectForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))} className="absolute inset-0 bg-red-600/75 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[9px] font-bold">Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={handleFileUploadTrigger} className="w-16 h-16 border-2 border-dashed border-gray-300 dark:border-gray-800 rounded hover:border-accent hover:text-accent transition-colors flex flex-col items-center justify-center text-gray-400">
                    <Plus className="w-4 h-4" />
                    <span className="text-[8px] uppercase font-mono font-bold mt-1">Add</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button type="submit" className="px-6 py-3 bg-accent text-black font-semibold text-xs uppercase tracking-widest rounded transition-all flex items-center gap-1">
                  <Save className="w-4 h-4" />
                  {projectEditId ? (isRtl ? 'حفظ تعديلات المشروع' : 'Save Changes') : (isRtl ? 'نشر المشروع فوراً' : 'Publish Project Record')}
                </button>
              </div>
            </form>

            {/* Project List */}
            <div className="space-y-4">
              <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">{isRtl ? 'مشاريع الأتيليه الحالية المنشورة' : '02. PORTFOLIO REGISTRY RECORDS'}</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map(p => (
                  <div key={p.id} className="p-5 bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-900 rounded-lg flex justify-between items-start">
                    <div className="flex gap-4">
                      <img src={p.images[0] || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=200'} className="w-16 h-16 object-cover rounded" />
                      <div className="space-y-1">
                        <p className="font-bold text-sm text-gray-950 dark:text-white">{isRtl ? p.titleAr : p.title}</p>
                        <p className="text-xs text-gray-500 capitalize">{p.category} • Client: {p.client || 'N/A'}</p>
                        <p className="text-[10px] text-accent font-mono">{p.location} • {p.completionDate}</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => handleEditProject(p)} className="p-2 bg-gray-100 dark:bg-gray-900 hover:text-accent rounded transition-colors text-gray-400">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteProject(p.id, p.title, p.titleAr)} className="p-2 bg-gray-100 dark:bg-gray-900 hover:text-red-500 rounded transition-colors text-gray-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PRODUCTS CRUD */}
        {activeTab === 'products' && (
          <div className="space-y-8 text-left">
            <div className="flex justify-between items-center pb-4 border-b border-gray-150 dark:border-gray-800">
              <h3 className="font-serif text-2xl font-medium text-gray-950 dark:text-white">
                {productEditId ? (isRtl ? `تعديل منتج CNC: ${productForm.titleAr}` : `Edit CNC Product: ${productForm.title}`) : (isRtl ? 'إدارة كتالوج مكننة CNC' : 'CNC Wood & Acrylic Catalog')}
              </h3>
              {productEditId && (
                <button onClick={() => setProductEditId(null)} className="px-2.5 py-1.5 border border-red-500/20 text-red-500 text-[10px] uppercase tracking-wider font-mono rounded hover:bg-red-500 hover:text-white transition-all">
                  {isRtl ? 'إلغاء التعديل' : 'Cancel Edit'}
                </button>
              )}
            </div>

            {/* Product Form */}
            <form onSubmit={handleSaveProduct} className="bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-900 rounded-lg p-5 sm:p-6 space-y-4">
              <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">
                {productEditId ? (isRtl ? 'تعديل مواصفات المنتج' : 'OVERWRITE CNC CATALOG PARAMETERS') : (isRtl ? 'إدخال مواصفات منتج CNC جديد' : '01. INPUT CNC DECOR CATALOG SPECIFICATIONS')}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[9px] uppercase font-mono text-gray-400 mb-1">Product Title (EN)</label>
                  <input required type="text" value={productForm.title} onChange={e=>setProductForm({...productForm, title: e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded px-2.5 py-2 text-xs text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-mono text-gray-400 mb-1">اسم المنتج الفني (العربية)</label>
                  <input required type="text" value={productForm.titleAr} onChange={e=>setProductForm({...productForm, titleAr: e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded px-2.5 py-2 text-xs text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-mono text-gray-400 mb-1">Category type</label>
                  <select value={productForm.category} onChange={e=>setProductForm({...productForm, category: e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded px-2.5 py-2 text-xs text-gray-900 dark:text-white">
                    <option value="decor-panels">Custom Decorative Screens</option>
                    <option value="mirrors">Geometric Beveled Mirrors</option>
                    <option value="wall-art">Laser Calligraphy & Art</option>
                    <option value="serving-trays">Exclusive Serving Accessories</option>
                    <option value="store-signs">Industrial Storefront Signs</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] uppercase font-mono text-gray-400 mb-1">Description (EN)</label>
                  <textarea rows={2} required value={productForm.description} onChange={e=>setProductForm({...productForm, description: e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded px-2.5 py-2 text-xs text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-mono text-gray-400 mb-1">الوصف الفني للمنتج (العربية)</label>
                  <textarea rows={2} required value={productForm.descriptionAr} onChange={e=>setProductForm({...productForm, descriptionAr: e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded px-2.5 py-2 text-xs text-gray-900 dark:text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[9px] uppercase font-mono text-gray-400">Attached Product Photos</label>
                <div className="flex gap-2 flex-wrap">
                  {productForm.images.map((imgUrl, idx) => (
                    <div key={idx} className="relative w-16 h-16 border rounded overflow-hidden">
                      <img src={imgUrl} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setProductForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))} className="absolute inset-0 bg-red-600/75 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[9px] font-bold">Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={handleFileUploadTrigger} className="w-16 h-16 border-2 border-dashed border-gray-300 dark:border-gray-800 rounded hover:border-accent hover:text-accent transition-colors flex flex-col items-center justify-center text-gray-400">
                    <Plus className="w-4 h-4" />
                    <span className="text-[8px] uppercase font-mono font-bold mt-1">Add</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button type="submit" className="px-6 py-3 bg-accent text-black font-semibold text-xs uppercase tracking-widest rounded transition-all flex items-center gap-1">
                  <Save className="w-4 h-4" />
                  {productEditId ? (isRtl ? 'حفظ تعديلات المنتج' : 'Save Changes') : (isRtl ? 'إدراج بالكتالوج فوراً' : 'Add Product to Catalog')}
                </button>
              </div>
            </form>

            {/* Catalog List */}
            <div className="space-y-4">
              <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">{isRtl ? 'المنتجات المسجلة بقاعدة البيانات' : '02. CNC CATALOG ENTRIES'}</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map(prd => (
                  <div key={prd.id} className="p-5 bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-900 rounded-lg flex justify-between items-start">
                    <div className="flex gap-4">
                      <img src={prd.images[0] || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=200'} className="w-16 h-16 object-cover rounded" />
                      <div className="space-y-1">
                        <p className="font-bold text-sm text-gray-950 dark:text-white">{isRtl ? prd.titleAr : prd.title}</p>
                        <p className="text-xs text-gray-500 capitalize">{prd.category}</p>
                        <p className="text-[10px] text-accent font-mono">{prd.materials.join(', ')}</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => handleEditProduct(prd)} className="p-2 bg-gray-100 dark:bg-gray-900 hover:text-accent rounded transition-colors text-gray-400">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteProduct(prd.id, prd.title, prd.titleAr)} className="p-2 bg-gray-100 dark:bg-gray-900 hover:text-red-500 rounded transition-colors text-gray-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: PRICING & MATERIALS (Quote Estimator config) */}
        {activeTab === 'pricing' && (
          <div className="space-y-8 text-left">
            <div>
              <h2 className="font-serif text-2xl text-gray-950 dark:text-white font-medium">{isRtl ? 'الأسعار والمواد' : 'Pricing & Materials'}</h2>
              <p className="text-xs text-gray-500 mt-1">{isRtl ? 'إدارة القيم التي تغذي حاسبة السعر التقديري في الموقع العام.' : 'Manage the values that power the public Quote Estimator.'}</p>
            </div>

            {/* Sub-tab pills */}
            <div className="flex flex-wrap gap-2 border-b border-gray-150 dark:border-gray-900 pb-4">
              {([
                { id: 'material', label: 'Materials', labelAr: 'المواد', hint: 'دج / م²' },
                { id: 'projectType', label: 'Project Types', labelAr: 'أنواع المشاريع', hint: '×' },
                { id: 'complexity', label: 'Complexity', labelAr: 'درجة التعقيد', hint: '×' },
                { id: 'wilaya', label: 'Wilayas (Fees)', labelAr: 'الولايات (الرسوم)', hint: 'دج' }
              ] as const).map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setActivePricingSub(sub.id)}
                  className={`px-4 py-2 text-[10px] uppercase font-mono tracking-widest font-bold rounded-none border transition-all ${
                    activePricingSub === sub.id
                      ? 'bg-accent text-black border-accent'
                      : 'text-gray-400 border-gray-200 dark:border-gray-800 hover:text-accent'
                  }`}
                >
                  {isRtl ? sub.labelAr : sub.label}
                  <span className="opacity-60 ml-1.5">({pricingFactors.filter(f => f.type === sub.id).length})</span>
                </button>
              ))}
            </div>

            {/* Records list */}
            <div className="space-y-2">
              {pricingFactors
                .filter(f => f.type === activePricingSub)
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map(factor => (
                  <div key={factor.id} className="bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-900 rounded p-4">
                    {editingFactorId === factor.id ? (
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const fd = new FormData(e.currentTarget);
                          try {
                            await savePricingFactor({
                              ...factor,
                              value: parseFloat(fd.get('value') as string) || 0,
                              unit: (fd.get('unit') as string) || factor.unit,
                            });
                            addAuditLog(`Updated pricing factor ${factor.name}`, `تم تحديث ${factor.nameAr}`);
                            setEditingFactorId(null);
                          } catch { alert('Failed to update'); }
                        }}
                        className="flex flex-wrap items-center gap-3"
                      >
                        <div className="flex-1 min-w-[140px]">
                          <p className="font-bold text-xs text-gray-950 dark:text-white">{isRtl ? factor.nameAr : factor.name}</p>
                        </div>
                        <input
                          name="value"
                          type="number"
                          step="0.01"
                          defaultValue={factor.value}
                          required
                          className="w-28 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs rounded p-2 text-gray-900 dark:text-white"
                        />
                        <input
                          name="unit"
                          type="text"
                          defaultValue={factor.unit}
                          className="w-24 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs rounded p-2 text-gray-900 dark:text-white"
                        />
                        <button type="submit" className="px-3 py-2 bg-accent text-black text-[10px] font-bold uppercase tracking-wider rounded">
                          {isRtl ? 'حفظ' : 'Save'}
                        </button>
                        <button type="button" onClick={() => setEditingFactorId(null)} className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-gray-700">
                          {isRtl ? 'إلغاء' : 'Cancel'}
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className={`font-bold text-xs truncate ${factor.isActive ? 'text-gray-950 dark:text-white' : 'text-gray-400 line-through'}`}>
                            {isRtl ? factor.nameAr : factor.name}
                          </p>
                          <p className="text-[10px] text-gray-500 font-mono mt-0.5">{factor.id}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-accent font-bold text-sm font-mono">
                            {factor.value.toLocaleString(isRtl ? 'ar-DZ' : 'en-US')} <span className="text-[10px] text-gray-400">{factor.unit}</span>
                          </span>
                          <button
                            onClick={async () => {
                              try {
                                await savePricingFactor({ ...factor, isActive: !factor.isActive });
                              } catch { alert('Failed to toggle'); }
                            }}
                            title={factor.isActive ? (isRtl ? 'إيقاف' : 'Deactivate') : (isRtl ? 'تفعيل' : 'Activate')}
                            className={`p-1.5 rounded transition-colors ${factor.isActive ? 'text-accent' : 'text-gray-400'}`}
                          >
                            {factor.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                          </button>
                          <button onClick={() => setEditingFactorId(factor.id)} className="p-1.5 hover:text-accent rounded text-gray-400 transition-colors">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm('Delete this pricing factor?')) {
                                try {
                                  await deletePricingFactor(factor.id);
                                  addAuditLog(`Deleted pricing factor ${factor.name}`, `تم حذف ${factor.nameAr}`);
                                } catch { alert('Delete failed'); }
                              }
                            }}
                            className="p-1.5 hover:text-red-500 rounded hover:bg-red-500/15 text-gray-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              {pricingFactors.filter(f => f.type === activePricingSub).length === 0 && (
                <p className="text-xs text-gray-400 py-6 text-center">{isRtl ? 'لا توجد عناصر بعد.' : 'No records yet.'}</p>
              )}
            </div>

            {/* Add New */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formEl = e.currentTarget;
                const fd = new FormData(formEl);
                const name = fd.get('name') as string;
                const nameAr = fd.get('nameAr') as string;
                const value = parseFloat(fd.get('value') as string);
                const unit = (fd.get('unit') as string) || '';
                if (name && nameAr && !Number.isNaN(value)) {
                  try {
                    const prefix = activePricingSub === 'material' ? 'MAT' : activePricingSub === 'projectType' ? 'PT' : activePricingSub === 'complexity' ? 'CX' : 'WIL';
                    const currentCount = pricingFactors.filter(f => f.type === activePricingSub).length;
                    await savePricingFactor({
                      id: `${prefix}-NEW-${Date.now().toString().slice(-5)}`,
                      type: activePricingSub,
                      name, nameAr, value, unit,
                      isActive: true,
                      sortOrder: currentCount + 1
                    });
                    addAuditLog(`Added pricing factor ${name}`, `تمت إضافة ${nameAr}`);
                    formEl.reset();
                  } catch {
                    alert('Failed to save pricing factor');
                  }
                }
              }}
              className="bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-900 p-5 rounded space-y-4"
            >
              <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">
                + {isRtl ? 'إضافة عنصر جديد' : 'ADD NEW RECORD'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <input required name="name" placeholder="Name (EN)" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs rounded p-2.5 text-gray-900 dark:text-white" />
                <input required name="nameAr" placeholder="الاسم (عربي)" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs rounded p-2.5 text-gray-900 dark:text-white" />
                <input required name="value" type="number" step="0.01" placeholder="Value" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs rounded p-2.5 text-gray-900 dark:text-white" />
                <input name="unit" placeholder="Unit (e.g. دج/م²)" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs rounded p-2.5 text-gray-900 dark:text-white" />
              </div>
              <button type="submit" className="px-4 py-2 bg-accent text-black font-bold text-[10px] tracking-wider uppercase font-mono rounded hover:bg-accent-dark transition-all">
                {isRtl ? 'حفظ العنصر' : 'Save Record'}
              </button>
            </form>
          </div>
        )}

        {/* TAB: WORKSHOP ESTIMATOR (internal tool) */}
        {activeTab === 'workshop' && <WorkshopEstimator />}

        {/* TAB: WORKSHOP PRICING (rates powering the Workshop Estimator above) */}
        {activeTab === 'workshop-pricing' && (
          <div className="space-y-8 text-left">
            <div>
              <h2 className="font-serif text-2xl text-gray-950 dark:text-white font-medium">Workshop Pricing</h2>
              <p className="text-xs text-gray-500 mt-1">Manage every rate used by the internal Workshop Estimator calculators. Separate from the public Quote Estimator's Pricing &amp; Materials.</p>
            </div>

            <div className="flex flex-wrap gap-2 border-b border-gray-150 dark:border-gray-900 pb-4">
              {([
                { id: 'material', label: 'Materials' },
                { id: 'paint', label: 'Paints' },
                { id: 'edgeband', label: 'Edge Band' },
                { id: 'laser', label: 'Laser' },
                { id: 'routing', label: 'Routing' },
                { id: 'labor', label: 'Labor' },
                { id: 'installation', label: 'Installation' },
                { id: 'transport', label: 'Transport' },
                { id: 'margin', label: 'Profit Margin' },
                { id: 'waste', label: 'Waste %' }
              ] as const).map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setActiveWorkshopSub(sub.id)}
                  className={`px-4 py-2 text-[10px] uppercase font-mono tracking-widest font-bold rounded-none border transition-all ${
                    activeWorkshopSub === sub.id
                      ? 'bg-accent text-black border-accent'
                      : 'text-gray-400 border-gray-200 dark:border-gray-800 hover:text-accent'
                  }`}
                >
                  {sub.label}
                  <span className="opacity-60 ml-1.5">({workshopPricing.filter(f => f.group === sub.id).length})</span>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {workshopPricing
                .filter(f => f.group === activeWorkshopSub)
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map(item => (
                  <div key={item.id} className="bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-900 rounded p-4">
                    {editingWorkshopId === item.id ? (
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const fd = new FormData(e.currentTarget);
                          try {
                            await saveWorkshopPricing({
                              ...item,
                              value: parseFloat(fd.get('value') as string) || 0,
                              unit: (fd.get('unit') as string) || item.unit,
                            });
                            setEditingWorkshopId(null);
                          } catch { alert('Failed to update'); }
                        }}
                        className="flex flex-wrap items-center gap-3"
                      >
                        <div className="flex-1 min-w-[160px]">
                          <p className="font-bold text-xs text-gray-950 dark:text-white">{item.label}</p>
                          {item.meta && <p className="text-[10px] text-gray-400 font-mono">{item.meta}</p>}
                        </div>
                        <input
                          name="value"
                          type="number"
                          step="0.01"
                          defaultValue={item.value}
                          required
                          className="w-28 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs rounded p-2 text-gray-900 dark:text-white"
                        />
                        <input
                          name="unit"
                          type="text"
                          defaultValue={item.unit}
                          className="w-28 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs rounded p-2 text-gray-900 dark:text-white"
                        />
                        <button type="submit" className="px-3 py-2 bg-accent text-black text-[10px] font-bold uppercase tracking-wider rounded">
                          Save
                        </button>
                        <button type="button" onClick={() => setEditingWorkshopId(null)} className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-gray-700">
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className={`font-bold text-xs truncate ${item.isActive ? 'text-gray-950 dark:text-white' : 'text-gray-400 line-through'}`}>
                            {item.label} {item.meta && <span className="text-gray-400 font-normal">({item.meta})</span>}
                          </p>
                          <p className="text-[10px] text-gray-500 font-mono mt-0.5">{item.key}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-accent font-bold text-sm font-mono">
                            {item.value.toLocaleString()} <span className="text-[10px] text-gray-400">{item.unit}</span>
                          </span>
                          <button
                            onClick={async () => {
                              try { await saveWorkshopPricing({ ...item, isActive: !item.isActive }); } catch { alert('Failed to toggle'); }
                            }}
                            className={`p-1.5 rounded transition-colors ${item.isActive ? 'text-accent' : 'text-gray-400'}`}
                          >
                            {item.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                          </button>
                          <button onClick={() => setEditingWorkshopId(item.id)} className="p-1.5 hover:text-accent rounded text-gray-400 transition-colors">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm('Delete this pricing item?')) {
                                try { await deleteWorkshopPricing(item.id); } catch { alert('Delete failed'); }
                              }
                            }}
                            className="p-1.5 hover:text-red-500 rounded hover:bg-red-500/15 text-gray-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              {workshopPricing.filter(f => f.group === activeWorkshopSub).length === 0 && (
                <p className="text-xs text-gray-400 py-6 text-center">No records yet.</p>
              )}
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formEl = e.currentTarget;
                const fd = new FormData(formEl);
                const label = fd.get('label') as string;
                const labelAr = (fd.get('labelAr') as string) || label;
                const key = (fd.get('key') as string) || label.toUpperCase().replace(/\s+/g, '_');
                const value = parseFloat(fd.get('value') as string);
                const unit = (fd.get('unit') as string) || '';
                const meta = (fd.get('meta') as string) || '';
                if (label && !Number.isNaN(value)) {
                  try {
                    const currentCount = workshopPricing.filter(f => f.group === activeWorkshopSub).length;
                    await saveWorkshopPricing({
                      id: `WP-NEW-${Date.now().toString().slice(-6)}`,
                      group: activeWorkshopSub,
                      key, label, labelAr, value, unit, meta,
                      isActive: true,
                      sortOrder: currentCount + 1
                    });
                    formEl.reset();
                  } catch {
                    alert('Failed to save pricing item');
                  }
                }
              }}
              className="bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-900 p-5 rounded space-y-4"
            >
              <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">+ ADD NEW RECORD</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <input required name="label" placeholder="Label (EN)" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs rounded p-2.5 text-gray-900 dark:text-white" />
                <input name="labelAr" placeholder="التسمية (عربي)" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs rounded p-2.5 text-gray-900 dark:text-white" />
                <input name="key" placeholder="Key (e.g. PMMA_4MM)" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs rounded p-2.5 text-gray-900 dark:text-white" />
                <input required name="value" type="number" step="0.01" placeholder="Value" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs rounded p-2.5 text-gray-900 dark:text-white" />
                <input name="unit" placeholder="Unit (e.g. دج/م²)" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs rounded p-2.5 text-gray-900 dark:text-white" />
                <input name="meta" placeholder="Meta (e.g. 4mm)" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs rounded p-2.5 text-gray-900 dark:text-white" />
              </div>
              <button type="submit" className="px-4 py-2 bg-accent text-black font-bold text-[10px] tracking-wider uppercase font-mono rounded hover:bg-accent-dark transition-all">
                Save Record
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: CRM & QUOTATIONS QUEUE */}
        {activeTab === 'quotes' && (
          <div className="space-y-8 text-left">
            <div>
              <h3 className="font-serif text-2xl font-medium text-gray-950 dark:text-white">{isRtl ? 'صندوق الوارد والطلبات الفنية' : 'Atelier Inbound CRM Broker'}</h3>
              <p className="text-xs text-gray-400 mt-1">{isRtl ? 'راجع تفاصيل طلبات التسعير، المواصفات والعملاء وقدم الردود.' : 'Assess incoming quotation parameters, client files and draft responses.'}</p>
            </div>

            {/* Quotations List */}
            <div className="bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-900 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs font-sans text-gray-700 dark:text-gray-300">
                <thead className="bg-gray-100 dark:bg-gray-900 text-gray-400 uppercase font-mono text-[9px] border-b border-gray-150 dark:border-gray-800">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Project Scope</th>
                    <th className="p-4">Budget Range</th>
                    <th className="p-4">Date Recv</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 dark:divide-gray-800">
                  {quotes.map((q) => (
                    <tr key={q.id} className="hover:bg-gray-100/5 transition-colors">
                      <td className="p-4 font-mono font-bold text-accent">{q.id}</td>
                      <td className="p-4">
                        <div className="font-bold text-gray-900 dark:text-white">{q.name}</div>
                        <div className="text-[10px] text-gray-500">{q.email} • {q.phone}</div>
                      </td>
                      <td className="p-4 text-gray-900 dark:text-white capitalize">{q.projectType}</td>
                      <td className="p-4 font-mono text-accent font-bold">{q.budget || 'Open Spec'}</td>
                      <td className="p-4 text-gray-400">{q.date}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold border ${
                          q.status === 'created' ? 'bg-accent/10 text-accent border-accent/25 animate-pulse' :
                          q.status === 'reviewed' || q.status === 'approved' ? 'bg-stone-500/10 text-stone-400 border-stone-500/20' :
                          q.status === 'production' || q.status === 'installation' ? 'bg-blue-500/10 text-blue-400 border-blue-500/25' :
                          'bg-emerald-500/10 text-emerald-500 border-emerald-500/25'
                        }`}>
                          {q.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => {
                          setActiveQuoteId(q.id);
                          setReplyText(q.responseMessage || '');
                          setIsReplySent(false);
                          setQuoteLineItems(q.quoteItems && q.quoteItems.length > 0 ? q.quoteItems : [{ description: q.projectType, quantity: 1, unitPrice: 0 }]);
                        }} className="px-3 py-1 bg-accent/15 border border-accent/30 text-accent hover:bg-accent hover:text-black font-mono text-[10px] uppercase font-bold rounded transition-all">
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Response CRM Modal */}
            <AnimatePresence>
              {activeQuoteId && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-900 rounded-lg space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono tracking-widest text-accent font-bold uppercase">ORDER FILE — {activeQuoteId}</span>
                    <button onClick={() => setActiveQuoteId(null)} className="text-gray-400 hover:text-white font-bold text-xs uppercase tracking-wider">Close Panel [X]</button>
                  </div>

                  <div className="p-4 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-800 text-xs text-left space-y-2">
                    <p className="text-gray-400 uppercase font-mono text-[9px]">Client Inbound parameters:</p>
                    <p className="text-gray-900 dark:text-white"><strong>Sender:</strong> {quotes.find(q=>q.id===activeQuoteId)?.name} • {quotes.find(q=>q.id===activeQuoteId)?.email}</p>
                    <p className="text-gray-900 dark:text-white"><strong>Project Scope target:</strong> {quotes.find(q=>q.id===activeQuoteId)?.projectType}</p>
                    <p className="text-gray-900 dark:text-white"><strong>Budget Scope:</strong> {quotes.find(q=>q.id===activeQuoteId)?.budget}</p>
                    {quotes.find(q=>q.id===activeQuoteId)?.dimensions && (
                      <p className="text-gray-900 dark:text-white"><strong>Estimated Dimensions:</strong> {quotes.find(q=>q.id===activeQuoteId)?.dimensions}</p>
                    )}
                    <p className="text-gray-800 dark:text-gray-300 italic p-2 bg-gray-50 dark:bg-gray-950 rounded border">"{quotes.find(q=>q.id===activeQuoteId)?.description}"</p>
                  </div>

                  {/* Order Timeline */}
                  <div className="space-y-3">
                    <span className="text-[9px] uppercase font-mono text-gray-400 block">{isRtl ? 'مسار الطلب' : 'Order Timeline'}</span>
                    <div className="flex flex-wrap gap-2">
                      {(() => {
                        const activeQuote = quotes.find(q => q.id === activeQuoteId);
                        const currentIdx = ORDER_STAGES.findIndex(s => s.key === activeQuote?.status);
                        return ORDER_STAGES.map((stage, idx) => {
                          const historyEntry = activeQuote?.statusHistory?.find(h => h.status === stage.key);
                          const reached = idx <= currentIdx;
                          return (
                            <button
                              key={stage.key}
                              disabled={advancingStage}
                              onClick={async () => {
                                if (idx === currentIdx) return;
                                setAdvancingStage(true);
                                try {
                                  await updateQuoteStatusAndReply(activeQuoteId, stage.key as any, replyText);
                                  addAuditLog(`Moved quote ${activeQuoteId} to stage ${stage.key}`, `تم نقل الطلب ${activeQuoteId} إلى مرحلة ${stage.labelAr}`);
                                } catch { alert('Failed to advance stage'); }
                                finally { setAdvancingStage(false); }
                              }}
                              className={`flex items-center gap-1.5 px-3 py-2 rounded border text-[10px] font-mono uppercase tracking-wider transition-all disabled:opacity-50 ${
                                reached ? 'bg-accent/10 border-accent/40 text-accent' : 'border-gray-200 dark:border-gray-800 text-gray-400 hover:border-accent/40 hover:text-accent'
                              }`}
                            >
                              {reached ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                              <span>
                                {isRtl ? stage.labelAr : stage.label}
                                {historyEntry && <span className="block text-[8px] opacity-70 normal-case">{new Date(historyEntry.date).toLocaleDateString()}</span>}
                              </span>
                            </button>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[9px] uppercase font-mono text-gray-400">Response Email / WhatsApp Proposal Body</label>
                    <textarea rows={4} value={replyText} onChange={e=>setReplyText(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded p-3 text-xs font-mono text-gray-900 dark:text-white focus:outline-none" />
                  </div>

                  {/* Line items editor for the official PDF */}
                  <div className="space-y-3">
                    <span className="text-[9px] uppercase font-mono text-gray-400 block">{isRtl ? 'بنود السعر (لملف PDF)' : 'Pricing Line Items (for PDF)'}</span>
                    <div className="space-y-2">
                      {quoteLineItems.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                          <input
                            value={item.description}
                            onChange={e => setQuoteLineItems(prev => prev.map((it, i) => i === idx ? { ...it, description: e.target.value } : it))}
                            placeholder="Description"
                            className="col-span-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs rounded p-2 text-gray-900 dark:text-white"
                          />
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={e => setQuoteLineItems(prev => prev.map((it, i) => i === idx ? { ...it, quantity: parseFloat(e.target.value) || 0 } : it))}
                            placeholder="Qty"
                            className="col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs rounded p-2 text-gray-900 dark:text-white"
                          />
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={e => setQuoteLineItems(prev => prev.map((it, i) => i === idx ? { ...it, unitPrice: parseFloat(e.target.value) || 0 } : it))}
                            placeholder="Unit Price (DZD)"
                            className="col-span-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs rounded p-2 text-gray-900 dark:text-white"
                          />
                          <button
                            onClick={() => setQuoteLineItems(prev => prev.filter((_, i) => i !== idx))}
                            className="col-span-1 p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuoteLineItems(prev => [...prev, { description: '', quantity: 1, unitPrice: 0 }])}
                        className="inline-flex items-center gap-1 text-[10px] font-mono uppercase text-accent hover:text-accent-dark"
                      >
                        <Plus className="w-3.5 h-3.5" /> {isRtl ? 'إضافة بند' : 'Add Line'}
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            await saveQuoteLineItems(activeQuoteId, quoteLineItems);
                            addAuditLog(`Updated pricing line items for ${activeQuoteId}`, `تم تحديث بنود السعر لـ ${activeQuoteId}`);
                          } catch { alert('Failed to save line items'); }
                        }}
                        className="text-[10px] font-mono uppercase text-gray-400 hover:text-accent"
                      >
                        {isRtl ? 'حفظ البنود' : 'Save Line Items'}
                      </button>
                    </div>
                  </div>

                  {isReplySent ? (
                    <div className="p-4 bg-accent/10 border border-accent/20 text-accent rounded text-xs font-bold text-center flex items-center justify-center gap-1.5 animate-pulse">
                      <CheckCircle className="w-4 h-4" />
                      {isRtl ? 'تم إرسال المقترح الفني والمالي بنجاح إلى البريد والواتساب!' : 'Atelier response dispatched and quote updated to reviewed status successfully!'}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <button onClick={async () => {
                        try {
                          await updateQuoteStatusAndReply(activeQuoteId, 'reviewed', replyText);
                          setIsReplySent(true);
                          addAuditLog(`Sent pricing proposal and reviewed quote ${activeQuoteId}`, `تم إرسال عرض مالي ومراجعة طلب التسعير ${activeQuoteId}`);
                        } catch (e) { alert('Failed to update quote status'); }
                      }} className="px-5 py-2.5 bg-accent hover:bg-accent-dark text-black font-semibold text-xs uppercase tracking-widest rounded transition-all">
                        {isRtl ? 'إرسال العرض وحفظ الحالة كمقروء' : 'Dispatch Proposal & Mark In-Review'}
                      </button>
                      <button onClick={async () => {
                        try {
                          await updateQuoteStatusAndReply(activeQuoteId, 'completed', replyText);
                          setIsReplySent(true);
                          addAuditLog(`Approved and closed quote pipeline ${activeQuoteId}`, `تم إقفال وتثبيت طلب التسعير ${activeQuoteId}`);
                        } catch (e) { alert('Failed to complete quote'); }
                      }} className="px-5 py-2.5 bg-white text-black font-semibold text-xs uppercase tracking-widest border border-gray-300 rounded hover:bg-gray-100 transition-all">
                        {isRtl ? 'اعتماد وإغلاق كصفقة مكتملة' : 'Close and Mark Completed'}
                      </button>
                      <button
                        disabled={generatingPdf}
                        onClick={async () => {
                          const activeQuote = quotes.find(q => q.id === activeQuoteId);
                          if (!activeQuote) return;
                          setGeneratingPdf(true);
                          try {
                            const { generateQuotePdf } = await import('../lib/generateQuotePdf.ts');
                            await generateQuotePdf({ ...activeQuote, quoteItems: quoteLineItems }, settings);
                            addAuditLog(`Generated official PDF for ${activeQuoteId}`, `تم إنشاء عرض PDF رسمي لـ ${activeQuoteId}`);
                          } catch { alert('Failed to generate PDF'); }
                          finally { setGeneratingPdf(false); }
                        }}
                        className="px-5 py-2.5 bg-gray-900 hover:bg-black text-accent border border-accent/40 font-semibold text-xs uppercase tracking-widest rounded transition-all inline-flex items-center gap-2 disabled:opacity-60"
                      >
                        <FileDown className="w-4 h-4" />
                        {generatingPdf ? (isRtl ? 'جارٍ الإنشاء...' : 'Generating...') : (isRtl ? 'إنشاء عرض PDF رسمي' : 'Generate Official PDF')}
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* General Contact Inbox */}
            <div className="space-y-4 pt-4 border-t border-gray-150 dark:border-gray-800 text-left">
              <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">{isRtl ? 'صندوق الوارد والرسائل المباشرة' : 'GENERAL CUSTOMER INBOX MESSAGES'}</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contactMessages.map(msg => (
                  <div key={msg.id} className={`p-4 rounded border flex justify-between items-start transition-colors ${msg.status === 'unread' ? 'bg-accent/5 border-accent/25' : 'bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-900'}`}>
                    <div className="space-y-1">
                      <div className="flex gap-2 items-center">
                        <p className="font-bold text-xs text-gray-950 dark:text-white">{msg.name}</p>
                        <span className="text-[8px] font-mono uppercase bg-gray-950 text-accent px-1 border border-accent/20 rounded">{msg.status}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 font-mono">{msg.email} • {msg.date}</p>
                      <p className="text-xs text-gray-800 dark:text-gray-300 leading-relaxed">"{msg.message}"</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={async () => {
                        try {
                          await updateMessageStatus(msg.id, 'read');
                          addAuditLog(`Read customer message ${msg.id}`, `تم قراءة رسالة العميل ${msg.name}`);
                        } catch (e) { alert('Failed'); }
                      }} className="p-1 hover:text-accent text-gray-400 rounded hover:bg-gray-900" title="Mark Read"><Check className="w-3.5 h-3.5" /></button>
                      <button onClick={async () => {
                        if (confirm('Delete message?')) {
                          try {
                            await deleteMessage(msg.id);
                            addAuditLog(`Deleted contact message ${msg.id}`, `تم حذف رسالة العميل ${msg.name}`);
                          } catch (e) { alert('Failed'); }
                        }
                      }} className="p-1 hover:text-red-500 text-gray-400 rounded hover:bg-red-500/15" title="Delete msg"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SECURITY, MEDIA LIBRARY, BACKUP & ACCESS */}
        {activeTab === 'system' && (
          <div className="space-y-8 text-left">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Media Library */}
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">{isRtl ? 'مستودع ملفات الوسائط والصور' : 'PROFESSIONAL MEDIA LIBRARY MANAGER'}</span>
                <div className="bg-gray-50 dark:bg-gray-950 p-5 rounded-lg border border-gray-150 dark:border-gray-900 space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <div className="flex gap-2">
                      <button onClick={() => setActiveMediaFolder('all')} className={`px-2 py-0.5 rounded ${activeMediaFolder === 'all' ? 'bg-accent text-black' : 'text-gray-400'}`}>All</button>
                    </div>
                    <button onClick={handleFileUploadTrigger} className="text-accent hover:underline flex items-center gap-1">
                      {isUploadingFile ? 'Uploading...' : `+ ${isRtl ? 'رفع ملف' : 'Upload Image'}`}
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                    {mediaFiles.map((m) => (
                      <div key={m.id} className="relative aspect-square border border-gray-200 dark:border-gray-800 rounded overflow-hidden group">
                        <img src={m.url} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-1">
                          <button onClick={() => {
                            navigator.clipboard.writeText(m.url);
                            alert('Copied asset URL to clipboard!');
                          }} className="text-[8px] font-mono text-accent bg-gray-900 rounded p-1 text-center font-bold">Copy Link</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-900 border rounded flex justify-between items-center text-[9px] font-mono">
                    <span className="text-gray-500">STORAGE TYPE:</span>
                    <span className="text-accent font-bold">SUPABASE BUCKET / HYBRID</span>
                  </div>
                </div>
              </div>

              {/* Data backups export/import */}
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">{isRtl ? 'إدارة تصدير واستيراد البيانات' : 'BACKUP, PORTABILITY & INTEGRATION'}</span>
                <div className="bg-gray-50 dark:bg-gray-950 p-5 rounded-lg border border-gray-150 dark:border-gray-900 flex flex-col justify-between h-[190px]">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-700 dark:text-gray-300">{isRtl ? 'يمكنك حفظ نسخة احتياطية لجميع البيانات وتنزيلها كملف JSON.' : 'Export complete structured JSON snapshots of catalog, projects, messages, and settings for offsite preservation.'}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button onClick={() => handleExportData('quotes')} className="flex-1 py-3 border border-gray-200 dark:border-gray-800 text-gray-950 dark:text-white hover:border-accent hover:text-accent font-mono text-[10px] uppercase font-bold rounded text-center transition-colors">
                      ↓ {isRtl ? 'تنزيل نسخة احتياطية' : 'Download Backup'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Logs — admin only */}
            {userRole === 'admin' && (
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">
                  {isRtl ? 'سجل الدخول والنشاط (للمدير فقط)' : 'LOGIN & ACTIVITY LOG (ADMIN ONLY)'}
                </span>
                <div className="bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-900 rounded-lg overflow-hidden">
                  <div className="max-h-96 overflow-y-auto divide-y divide-gray-150 dark:divide-gray-900">
                    {activityLogs.length === 0 && (
                      <p className="text-xs text-gray-400 p-5 text-center">
                        {isRtl ? 'لا يوجد نشاط مسجل بعد.' : 'No activity recorded yet.'}
                      </p>
                    )}
                    {activityLogs.map(log => (
                      <div key={log.id} className="flex flex-wrap items-center justify-between gap-3 p-3.5 text-xs">
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 dark:text-white truncate">{log.email}</p>
                          <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                            {log.role} · {log.action} {log.ipAddress ? `· ${log.ipAddress}` : ''}
                          </p>
                        </div>
                        <span className="text-[10px] font-mono text-gray-400 shrink-0">
                          {new Date(log.date).toLocaleString(isRtl ? 'ar-DZ' : 'en-US')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
