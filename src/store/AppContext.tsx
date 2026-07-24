import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase.ts';
import { Service, PortfolioProject, CNCProduct, Testimonial, BlogPost, QuoteRequest, AppSettings, PricingFactor, WorkshopPricingItem, WorkshopEstimation, WorkshopOptionItem, ActivityLog, TrackedQuote, CustomerQuotation, CustomerQuotationInput } from '../types';
import {
  initialServices,
  initialProjects,
  initialProducts,
  initialTestimonials,
  initialBlogPosts,
  initialSettings,
  initialPricingFactors
} from '../data/initialData.ts';

export type ViewType = 'home' | 'about' | 'services' | 'portfolio' | 'products' | 'workshop' | 'quote' | 'track' | 'contact' | 'admin';

export interface MediaAsset {
  id: number;
  name: string;
  url: string;
  size: string;
  mimeType: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  status: 'unread' | 'read' | 'archived';
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: number;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

export interface EmailLog {
  id: number;
  type: 'newsletter' | 'broadcast' | 'tracking_update' | 'quotation_pdf';
  recipient: string;
  subject: string;
  status: 'sent' | 'failed';
  errorMessage?: string;
  relatedId?: string;
  date: string;
}

interface AppContextType {
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  selectedServiceId: string | null;
  setSelectedServiceId: (id: string | null) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  
  // Real database-backed states
  services: Service[];
  projects: PortfolioProject[];
  products: CNCProduct[];
  testimonials: Testimonial[];
  blogPosts: BlogPost[];
  quotes: QuoteRequest[];
  settings: AppSettings;
  mediaFiles: MediaAsset[];
  contactMessages: ContactMessage[];
  pricingFactors: PricingFactor[];
  workshopPricing: WorkshopPricingItem[];
  workshopOptions: WorkshopOptionItem[];
  estimations: WorkshopEstimation[];
  activityLogs: ActivityLog[];
  customerQuotations: CustomerQuotation[];
  newsletterSubscribers: NewsletterSubscriber[];

  // Refetches
  refetchAllPublicData: () => Promise<void>;
  refetchAllAdminData: () => Promise<void>;
  
  // Auth states
  user: User | null;
  userRole: 'admin' | 'manager' | 'editor' | null;
  isLoadingAuth: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
  
  // CRM Submission Helpers (Public)
  addQuote: (quote: Omit<QuoteRequest, 'id' | 'status' | 'date'>) => Promise<any>;
  submitContactMessage: (name: string, email: string, message: string) => Promise<any>;
  subscribeNewsletter: (email: string, name?: string) => Promise<any>;
  
  // CRUD Helpers (Protected)
  saveSettings: (newSettings: AppSettings) => Promise<any>;
  saveService: (service: Service) => Promise<any>;
  deleteService: (id: string) => Promise<any>;
  saveProject: (project: PortfolioProject) => Promise<any>;
  deleteProject: (id: string) => Promise<any>;
  saveProduct: (product: CNCProduct) => Promise<any>;
  deleteProduct: (id: string) => Promise<any>;
  saveBlogPost: (post: BlogPost) => Promise<any>;
  deleteBlogPost: (id: string) => Promise<any>;
  saveTestimonial: (testimonial: Testimonial) => Promise<any>;
  deleteTestimonial: (id: string) => Promise<any>;
  updateQuoteStatusAndReply: (id: string, status: QuoteRequest['status'], responseMessage?: string) => Promise<any>;
  saveQuoteLineItems: (id: string, quoteItems: QuoteRequest['quoteItems']) => Promise<any>;
  trackQuote: (id: string) => Promise<TrackedQuote | null>;
  updateMessageStatus: (id: string, status: ContactMessage['status']) => Promise<any>;
  deleteMessage: (id: string) => Promise<any>;
  uploadMedia: (file: File) => Promise<MediaAsset>;
  savePricingFactor: (factor: PricingFactor) => Promise<any>;
  deletePricingFactor: (id: string) => Promise<any>;
  saveWorkshopPricing: (item: WorkshopPricingItem) => Promise<any>;
  deleteWorkshopPricing: (id: string) => Promise<any>;
  saveEstimation: (est: Omit<WorkshopEstimation, 'id' | 'date'>) => Promise<any>;
  updateEstimationStatus: (id: string, status: WorkshopEstimation['status']) => Promise<any>;
  deleteEstimation: (id: string) => Promise<any>;
  createCustomerQuotation: (data: CustomerQuotationInput) => Promise<CustomerQuotation>;
  updateCustomerQuotation: (id: number, data: CustomerQuotationInput) => Promise<CustomerQuotation>;
  deleteCustomerQuotation: (id: number) => Promise<any>;
  duplicateCustomerQuotation: (id: number) => Promise<CustomerQuotation>;
  deleteNewsletterSubscriber: (id: number) => Promise<any>;
  toggleNewsletterSubscriber: (id: number, isActive: boolean) => Promise<any>;
  sendNewsletterBroadcast: (subject: string, bodyHtml: string) => Promise<{ sent: number; failed: number }>;
  notifyBlogPostSubscribers: (postId: string) => Promise<{ sent: number; failed: number }>;
  sendQuoteTrackingUpdate: (quoteId: string) => Promise<void>;
  emailQuotationPdf: (to: string, customerName: string, quotationNumber: string, pdfBase64: string) => Promise<void>;
  emailLogs: EmailLog[];

  resetToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Localization & Theme
  const [language, setLanguage] = useState<'en' | 'ar'>(() => {
    const saved = localStorage.getItem('lr_lang');
    return (saved === 'en' || saved === 'ar') ? saved : 'en';
  });

  const theme = 'dark';
  const setTheme = () => {};

  // Router
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Auth States
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'manager' | 'editor' | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Entities loaded from Real DB
  const [services, setServices] = useState<Service[]>(initialServices);
  const [projects, setProjects] = useState<PortfolioProject[]>(initialProjects);
  const [products, setProducts] = useState<CNCProduct[]>(initialProducts);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [mediaFiles, setMediaFiles] = useState<MediaAsset[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [pricingFactors, setPricingFactors] = useState<PricingFactor[]>(initialPricingFactors);
  const [workshopPricing, setWorkshopPricing] = useState<WorkshopPricingItem[]>([]);
  const [workshopOptions, setWorkshopOptions] = useState<WorkshopOptionItem[]>([]);
  const [estimations, setEstimations] = useState<WorkshopEstimation[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [customerQuotations, setCustomerQuotations] = useState<CustomerQuotation[]>([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);

  // Helper
  const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const { data: { session } } = await supabase.auth.getSession();
    const currentToken = session?.access_token || null;
    const headers = new Headers(options.headers || {});
    
    if (currentToken) {
      headers.set('Authorization', `Bearer ${currentToken}`);
    }
    
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    return fetch(url, {
      ...options,
      headers,
    });
  };

  // Loaders
  const refetchAllPublicData = async () => {
    try {
      const [settingsRes, servicesRes, projectsRes, productsRes, testimonialsRes, blogRes, pricingRes, workshopOptionsRes] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/services'),
        fetch('/api/projects'),
        fetch('/api/products'),
        fetch('/api/testimonials'),
        fetch('/api/blog'),
        fetch('/api/pricing-factors'),
        fetch('/api/workshop-estimator/options'),
      ]);

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        if (settingsData && settingsData.seoTitle) setSettings(settingsData);
      }
      if (servicesRes.ok) setServices(await servicesRes.json());
      if (projectsRes.ok) setProjects(await projectsRes.json());
      if (productsRes.ok) setProducts(await productsRes.json());
      if (testimonialsRes.ok) setTestimonials(await testimonialsRes.json());
      if (blogRes.ok) setBlogPosts(await blogRes.json());
      if (pricingRes.ok) setPricingFactors(await pricingRes.json());
      if (workshopOptionsRes.ok) setWorkshopOptions(await workshopOptionsRes.json());
    } catch (error) {
      console.error('Failed to fetch public data from Express backend:', error);
    }
  };

  const refetchAllAdminData = async () => {
    if (!user) return;
    try {
      const [quotesRes, msgRes, mediaRes, workshopPricingRes, estimationsRes, activityLogsRes, customerQuotationsRes, newsletterSubscribersRes, emailLogsRes] = await Promise.all([
        fetchWithAuth('/api/quotes'),
        fetchWithAuth('/api/messages'),
        fetchWithAuth('/api/media'),
        fetchWithAuth('/api/workshop-pricing'),
        fetchWithAuth('/api/estimations'),
        fetchWithAuth('/api/activity-logs'),
        fetchWithAuth('/api/customer-quotations'),
        fetchWithAuth('/api/newsletter/subscribers'),
        fetchWithAuth('/api/email-logs'),
      ]);

      if (quotesRes.ok) setQuotes(await quotesRes.json());
      if (msgRes.ok) setContactMessages(await msgRes.json());
      if (mediaRes.ok) setMediaFiles(await mediaRes.json());
      if (workshopPricingRes.ok) setWorkshopPricing(await workshopPricingRes.json());
      if (estimationsRes.ok) setEstimations(await estimationsRes.json());
      if (activityLogsRes.ok) setActivityLogs(await activityLogsRes.json());
      if (customerQuotationsRes.ok) setCustomerQuotations(await customerQuotationsRes.json());
      if (newsletterSubscribersRes.ok) setNewsletterSubscribers(await newsletterSubscribersRes.json());
      if (emailLogsRes.ok) setEmailLogs(await emailLogsRes.json());
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    }
  };

  const syncUserRole = async (accessToken: string) => {
    try {
      const meRes = await fetch('/api/me', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (meRes.ok) {
        const meData = await meRes.json();
        setUserRole(meData.role);
      } else {
        setUserRole(null);
      }
    } catch (error) {
      console.error('Error synchronizing auth state:', error);
      setUserRole(null);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initSession = async () => {
      setIsLoadingAuth(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!isMounted) return;

      setUser(session?.user ?? null);
      if (session?.user && session.access_token) {
        await syncUserRole(session.access_token);
      } else {
        setUserRole(null);
      }
      setIsLoadingAuth(false);
    };

    initSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      setUser(session?.user ?? null);
      if (session?.user && session.access_token) {
        await syncUserRole(session.access_token);
      } else {
        setUserRole(null);
        setQuotes([]);
        setContactMessages([]);
        setMediaFiles([]);
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    refetchAllPublicData();
  }, []);

  useEffect(() => {
    if (user && userRole) {
      refetchAllAdminData();
    }
  }, [user, userRole]);

  useEffect(() => {
    localStorage.setItem('lr_lang', language);
    document.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const login = async (email: string, password: string) => {
    setAuthError(null);
    try {
      setIsLoadingAuth(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setAuthError(error.message);
        throw error;
      }
      fetchWithAuth('/api/activity-logs', {
        method: 'POST',
        body: JSON.stringify({ action: 'login' }),
      }).catch(() => {});
    } catch (error) {
      console.error('Failed to log in:', error);
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoadingAuth(true);
      await supabase.auth.signOut();
      setUser(null);
      setUserRole(null);
    } catch (error) {
      console.error('Failed to sign out:', error);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const addQuote = async (quoteData: Omit<QuoteRequest, 'id' | 'status' | 'date'>) => {
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteData),
      });
      if (!res.ok) throw new Error('Failed to submit quote');
      const data = await res.json();
      if (user) {
        setQuotes(prev => [data, ...prev]);
      }
      return data;
    } catch (error) {
      console.error('Error submitting quote:', error);
      throw error;
    }
  };

  const submitContactMessage = async (name: string, email: string, messageText: string) => {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message: messageText }),
      });
      if (!res.ok) throw new Error('Failed to send message');
      const data = await res.json();
      if (user) {
        setContactMessages(prev => [data, ...prev]);
      }
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const saveSettings = async (newSettings: AppSettings) => {
    try {
      const res = await fetchWithAuth('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(newSettings),
      });
      if (!res.ok) throw new Error('Failed to update settings');
      const data = await res.json();
      setSettings(data);
      return data;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  const saveService = async (service: Service) => {
    try {
      const res = await fetchWithAuth('/api/services', {
        method: 'POST',
        body: JSON.stringify(service),
      });
      if (!res.ok) throw new Error('Failed to save service');
      await refetchAllPublicData();
    } catch (error) {
      console.error('Error saving service:', error);
      throw error;
    }
  };

  const deleteService = async (id: string) => {
    try {
      const res = await fetchWithAuth(`/api/services/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete service');
      setServices(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  };

  const savePricingFactor = async (factor: PricingFactor) => {
    try {
      const res = await fetchWithAuth('/api/pricing-factors', {
        method: 'POST',
        body: JSON.stringify(factor),
      });
      if (!res.ok) throw new Error('Failed to save pricing factor');
      const saved = await res.json();
      setPricingFactors(prev => {
        const exists = prev.some(f => f.id === saved.id);
        return exists ? prev.map(f => (f.id === saved.id ? saved : f)) : [...prev, saved];
      });
      return saved;
    } catch (error) {
      console.error('Error saving pricing factor:', error);
      throw error;
    }
  };

  const deletePricingFactor = async (id: string) => {
    try {
      const res = await fetchWithAuth(`/api/pricing-factors/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete pricing factor');
      setPricingFactors(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting pricing factor:', error);
      throw error;
    }
  };

  const saveWorkshopPricing = async (item: WorkshopPricingItem) => {
    try {
      const res = await fetchWithAuth('/api/workshop-pricing', {
        method: 'POST',
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error('Failed to save workshop pricing item');
      const saved = await res.json();
      setWorkshopPricing(prev => {
        const exists = prev.some(p => p.id === saved.id);
        return exists ? prev.map(p => (p.id === saved.id ? saved : p)) : [...prev, saved];
      });
      return saved;
    } catch (error) {
      console.error('Error saving workshop pricing item:', error);
      throw error;
    }
  };

  const deleteWorkshopPricing = async (id: string) => {
    try {
      const res = await fetchWithAuth(`/api/workshop-pricing/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete workshop pricing item');
      setWorkshopPricing(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting workshop pricing item:', error);
      throw error;
    }
  };

  const saveEstimation = async (est: Omit<WorkshopEstimation, 'id' | 'date'>) => {
    try {
      const res = await fetchWithAuth('/api/estimations', {
        method: 'POST',
        body: JSON.stringify(est),
      });
      if (!res.ok) throw new Error('Failed to save estimation');
      const saved = await res.json();
      setEstimations(prev => [saved, ...prev]);
      return saved;
    } catch (error) {
      console.error('Error saving estimation:', error);
      throw error;
    }
  };

  const updateEstimationStatus = async (id: string, status: WorkshopEstimation['status']) => {
    try {
      const res = await fetchWithAuth(`/api/estimations/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update estimation status');
      const updated = await res.json();
      setEstimations(prev => prev.map(e => (e.id === id ? { ...e, status: updated.status } : e)));
    } catch (error) {
      console.error('Error updating estimation status:', error);
      throw error;
    }
  };

  const deleteEstimation = async (id: string) => {
    try {
      const res = await fetchWithAuth(`/api/estimations/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete estimation');
      setEstimations(prev => prev.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error deleting estimation:', error);
      throw error;
    }
  };

  const createCustomerQuotation = async (data: CustomerQuotationInput): Promise<CustomerQuotation> => {
    try {
      const res = await fetchWithAuth('/api/customer-quotations', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create customer quotation');
      const saved = await res.json();
      setCustomerQuotations(prev => [saved, ...prev]);
      return saved;
    } catch (error) {
      console.error('Error creating customer quotation:', error);
      throw error;
    }
  };

  const updateCustomerQuotation = async (id: number, data: CustomerQuotationInput): Promise<CustomerQuotation> => {
    try {
      const res = await fetchWithAuth(`/api/customer-quotations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update customer quotation');
      const saved = await res.json();
      setCustomerQuotations(prev => prev.map(q => (q.id === id ? saved : q)));
      return saved;
    } catch (error) {
      console.error('Error updating customer quotation:', error);
      throw error;
    }
  };

  const deleteCustomerQuotation = async (id: number) => {
    try {
      const res = await fetchWithAuth(`/api/customer-quotations/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete customer quotation');
      setCustomerQuotations(prev => prev.filter(q => q.id !== id));
    } catch (error) {
      console.error('Error deleting customer quotation:', error);
      throw error;
    }
  };

  const duplicateCustomerQuotation = async (id: number): Promise<CustomerQuotation> => {
    try {
      const res = await fetchWithAuth(`/api/customer-quotations/${id}/duplicate`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to duplicate customer quotation');
      const saved = await res.json();
      setCustomerQuotations(prev => [saved, ...prev]);
      return saved;
    } catch (error) {
      console.error('Error duplicating customer quotation:', error);
      throw error;
    }
  };

  const saveProject = async (project: PortfolioProject) => {
    try {
      const res = await fetchWithAuth('/api/projects', {
        method: 'POST',
        body: JSON.stringify(project),
      });
      if (!res.ok) throw new Error('Failed to save project');
      await refetchAllPublicData();
    } catch (error) {
      console.error('Error saving project:', error);
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const res = await fetchWithAuth(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete project');
      setProjects(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  };

  const saveProduct = async (product: CNCProduct) => {
    try {
      const res = await fetchWithAuth('/api/products', {
        method: 'POST',
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error('Failed to save product');
      await refetchAllPublicData();
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetchWithAuth(`/api/products/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete product');
      setProducts(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  const saveBlogPost = async (post: BlogPost) => {
    try {
      const res = await fetchWithAuth('/api/blog', {
        method: 'POST',
        body: JSON.stringify(post),
      });
      if (!res.ok) throw new Error('Failed to save blog post');
      await refetchAllPublicData();
    } catch (error) {
      console.error('Error saving blog post:', error);
      throw error;
    }
  };

  const deleteBlogPost = async (id: string) => {
    try {
      const res = await fetchWithAuth(`/api/blog/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete blog post');
      setBlogPosts(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  };

  const saveTestimonial = async (testimonial: Testimonial) => {
    try {
      const res = await fetchWithAuth('/api/testimonials', {
        method: 'POST',
        body: JSON.stringify(testimonial),
      });
      if (!res.ok) throw new Error('Failed to save testimonial');
      await refetchAllPublicData();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      throw error;
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      const res = await fetchWithAuth(`/api/testimonials/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete testimonial');
      setTestimonials(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      throw error;
    }
  };

  const updateQuoteStatusAndReply = async (id: string, status: QuoteRequest['status'], responseMessage?: string) => {
    try {
      const res = await fetchWithAuth(`/api/quotes/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status, responseMessage }),
      });
      if (!res.ok) throw new Error('Failed to update quote status');
      const data = await res.json();
      setQuotes(prev => prev.map(q => q.id === id ? { ...q, ...data } : q));
      return data;
    } catch (error) {
      console.error('Error updating quote status:', error);
      throw error;
    }
  };

  const saveQuoteLineItems = async (id: string, quoteItems: QuoteRequest['quoteItems']) => {
    try {
      const res = await fetchWithAuth(`/api/quotes/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ quoteItems }),
      });
      if (!res.ok) throw new Error('Failed to save quote line items');
      const data = await res.json();
      setQuotes(prev => prev.map(q => q.id === id ? { ...q, ...data } : q));
      return data;
    } catch (error) {
      console.error('Error saving quote line items:', error);
      throw error;
    }
  };

  const trackQuote = async (id: string): Promise<TrackedQuote | null> => {
    try {
      const res = await fetch(`/api/quotes/track/${encodeURIComponent(id)}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (error) {
      console.error('Error tracking quote:', error);
      return null;
    }
  };

  const updateMessageStatus = async (id: string, status: ContactMessage['status']) => {
    try {
      const res = await fetchWithAuth(`/api/messages/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update message status');
      const data = await res.json();
      setContactMessages(prev => prev.map(m => m.id === id ? { ...m, status: data.status } : m));
      return data;
    } catch (error) {
      console.error('Error updating message status:', error);
      throw error;
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const res = await fetchWithAuth(`/api/messages/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete message');
      setContactMessages(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  };

  const uploadMedia = async (file: File): Promise<MediaAsset> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetchWithAuth('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        let message = 'File upload failed';
        try {
          const body = await res.json();
          if (body?.error) message = body.error;
        } catch { /* response wasn't JSON */ }
        throw new Error(message);
      }
      const uploadedFile = await res.json();
      setMediaFiles(prev => [uploadedFile, ...prev]);
      return uploadedFile;
    } catch (error) {
      console.error('Error uploading media asset:', error);
      throw error;
    }
  };

  const subscribeNewsletter = async (email: string, name?: string) => {
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to subscribe');
      }
      const data = await res.json();
      if (user) {
        setNewsletterSubscribers(prev => [data, ...prev]);
      }
      return data;
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      throw error;
    }
  };

  const deleteNewsletterSubscriber = async (id: number) => {
    try {
      const res = await fetchWithAuth(`/api/newsletter/subscribers/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete subscriber');
      setNewsletterSubscribers(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting newsletter subscriber:', error);
      throw error;
    }
  };

  const toggleNewsletterSubscriber = async (id: number, isActive: boolean) => {
    try {
      const res = await fetchWithAuth(`/api/newsletter/subscribers/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) throw new Error('Failed to update subscriber');
      const updated = await res.json();
      setNewsletterSubscribers(prev => prev.map(s => s.id === id ? updated : s));
      return updated;
    } catch (error) {
      console.error('Error toggling newsletter subscriber:', error);
      throw error;
    }
  };

  const sendNewsletterBroadcast = async (subject: string, bodyHtml: string) => {
    try {
      const res = await fetchWithAuth('/api/newsletter/broadcast', {
        method: 'POST',
        body: JSON.stringify({ subject, bodyHtml }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to send broadcast');
      }
      return await res.json();
    } catch (error) {
      console.error('Error sending newsletter broadcast:', error);
      throw error;
    }
  };

  const notifyBlogPostSubscribers = async (postId: string) => {
    try {
      const res = await fetchWithAuth(`/api/blog/${postId}/notify`, { method: 'POST' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to notify subscribers');
      }
      return await res.json();
    } catch (error) {
      console.error('Error notifying subscribers about post:', error);
      throw error;
    }
  };

  const sendQuoteTrackingUpdate = async (quoteId: string) => {
    try {
      const res = await fetchWithAuth(`/api/quotes/${quoteId}/notify-status`, { method: 'POST' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to send tracking update');
      }
    } catch (error) {
      console.error('Error sending tracking status email:', error);
      throw error;
    }
  };

  const emailQuotationPdf = async (to: string, customerName: string, quotationNumber: string, pdfBase64: string) => {
    try {
      const res = await fetchWithAuth('/api/email/send-pdf', {
        method: 'POST',
        body: JSON.stringify({ to, customerName, quotationNumber, pdfBase64 }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to email PDF');
      }
    } catch (error) {
      console.error('Error emailing quotation PDF:', error);
      throw error;
    }
  };

  const resetToDefault = async () => {
    localStorage.removeItem('lr_services');
    localStorage.removeItem('lr_projects');
    localStorage.removeItem('lr_products');
    localStorage.removeItem('lr_testimonials');
    localStorage.removeItem('lr_blog_posts');
    localStorage.removeItem('lr_quotes');
    localStorage.removeItem('lr_settings');
    await refetchAllPublicData();
  };

  return (
    <AppContext.Provider value={{
      language, setLanguage,
      theme, setTheme,
      currentView, setCurrentView,
      selectedServiceId, setSelectedServiceId,
      selectedProjectId, setSelectedProjectId,
      selectedProductId, setSelectedProductId,
      
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
      workshopOptions,
      estimations,
      activityLogs,
      customerQuotations,
      newsletterSubscribers,
      emailLogs,
      
      refetchAllPublicData,
      refetchAllAdminData,
      
      user,
      userRole,
      isLoadingAuth,
      authError,
      login,
      logout,
      fetchWithAuth,
      
      addQuote,
      submitContactMessage,
      subscribeNewsletter,
      
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
      trackQuote,
      updateMessageStatus,
      deleteMessage,
      uploadMedia,
      savePricingFactor,
      deletePricingFactor,
      saveWorkshopPricing,
      deleteWorkshopPricing,
      saveEstimation,
      updateEstimationStatus,
      deleteEstimation,
      createCustomerQuotation,
      updateCustomerQuotation,
      deleteCustomerQuotation,
      duplicateCustomerQuotation,
      deleteNewsletterSubscriber,
      toggleNewsletterSubscriber,
      sendNewsletterBroadcast,
      notifyBlogPostSubscribers,
      sendQuoteTrackingUpdate,
      emailQuotationPdf,

      resetToDefault
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};