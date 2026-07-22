/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Service {
  id: string;
  title: string;
  titleAr: string;
  category: 'residential' | 'commercial' | 'manufacturing';
  description: string;
  descriptionAr: string;
  fullDescription: string;
  fullDescriptionAr: string;
  icon: string; // Lucide icon name
  image: string; // Premium photo URL
  features: string[];
  featuresAr: string[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  titleAr: string;
  category: 'residential' | 'commercial' | 'manufacturing' | 'decor';
  description: string;
  descriptionAr: string;
  client: string;
  location: string;
  locationAr: string;
  completionDate: string;
  materials: string[];
  materialsAr: string[];
  challenge: string;
  challengeAr: string;
  solution: string;
  solutionAr: string;
  images: string[]; // List of photos
  beforeAfterImage?: {
    before: string;
    after: string;
  };
}

export interface CNCProduct {
  id: string;
  title: string;
  titleAr: string;
  category: string; // 'decor-panels' | 'mirrors' | 'wall-art' | 'serving-trays' | 'store-signs' | 'custom'
  description: string;
  descriptionAr: string;
  materials: string[];
  materialsAr: string[];
  sizes: string[];
  customizationOptions: string[];
  customizationOptionsAr: string[];
  images: string[];
  specifications: Record<string, string>;
  specificationsAr: Record<string, string>;
}

export interface Testimonial {
  id: string;
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
  company: string;
  companyAr: string;
  content: string;
  contentAr: string;
  rating: number;
  avatar: string;
  isFeatured: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  titleAr: string;
  excerpt: string;
  excerptAr: string;
  content: string;
  contentAr: string;
  category: string;
  categoryAr: string;
  author: string;
  authorAr: string;
  date: string;
  readTime: string;
  readTimeAr: string;
  image: string;
  tags: string[];
}

// Order pipeline — admin sees all 6 stages with dates; the public tracking
// page collapses 'reviewed'+'approved' into a single "Under Review" step.
export type QuoteStatus = 'created' | 'reviewed' | 'approved' | 'production' | 'installation' | 'completed';

export interface QuoteStatusEvent {
  status: QuoteStatus;
  date: string;
}

export interface QuoteLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface QuoteRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  projectType: string;
  budget?: string;
  description: string;
  dimensions?: string;
  preferredContact: 'email' | 'phone' | 'whatsapp';
  referenceImages: string[];
  status: QuoteStatus;
  statusHistory?: QuoteStatusEvent[];
  quoteItems?: QuoteLineItem[];
  date: string;

  responseMessage?: string;
}

// Public-safe subset returned by the tracking endpoint — no contact info,
// no description, no budget, no line-item pricing.
export interface TrackedQuote {
  id: string;
  projectType: string;
  status: QuoteStatus;
  statusHistory: QuoteStatusEvent[];
  date: string;
}

export interface AppSettings {
  seoTitle: string;
  seoDescription: string;
  whatsappNumber: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  addressAr: string;
  businessHours: string;
  businessHoursAr: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
  
  // Dynamic Logo & Homepage settings
  logoText?: string;
  logoTextAr?: string;
  heroTitle?: string;
  heroTitleAr?: string;
  heroSubtitle?: string;
  heroSubtitleAr?: string;
  heroBadge?: string;
  heroBadgeAr?: string;
  heroBgImage?: string;
  homeStat1Value?: string;
  homeStat1Label?: string;
  homeStat1LabelAr?: string;
  homeStat2Value?: string;
  homeStat2Label?: string;
  homeStat2LabelAr?: string;
  homeStat3Value?: string;
  homeStat3Label?: string;
  homeStat3LabelAr?: string;
  
  // Advanced SEO, sitemaps and redirects
  seoKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  robotsTxt?: string;
  sitemapXml?: string;
  redirectRules?: string;
  googleMapsUrl?: string;
  footerText?: string;
  footerTextAr?: string;

  // Official quotation PDF
  quoteValidityDays?: number;
  termsAndConditions?: string;
  termsAndConditionsAr?: string;
}

// Pricing Estimator: materials, project-type multipliers, complexity
// multipliers, and per-wilaya (province) travel/installation fees.
// A single flexible table so the admin can manage all four factor types
// from one "Pricing & Materials" screen.
export type PricingFactorType = 'material' | 'projectType' | 'complexity' | 'wilaya';

export interface PricingFactor {
  id: string;
  type: PricingFactorType;
  name: string;
  nameAr: string;
  // material: price per m² (DZD). projectType/complexity: multiplier (e.g. 1.2).
  // wilaya: flat transport/installation fee (DZD).
  value: number;
  unit: string; // e.g. 'دج/م²', '×', 'دج'
  isActive: boolean;
  sortOrder: number;
}

// -----------------------------------------------------------------------------
// Workshop Estimator (internal-only module — NOT the public Quote Estimator)
// -----------------------------------------------------------------------------
// A completely separate pricing store powering 7 internal manufacturing-cost
// calculators. Admin manages every rate from the "Workshop Pricing" screen;
// nothing here is hardcoded in the calculators.
export type WorkshopPricingGroup =
  | 'material' | 'paint' | 'edgeband' | 'laser' | 'routing'
  | 'labor' | 'installation' | 'transport' | 'margin' | 'waste';

export interface WorkshopPricingItem {
  id: string;
  group: WorkshopPricingGroup;
  key: string; // machine-readable lookup key, e.g. 'PMMA_3MM', 'PU_GLOSS'
  label: string;
  labelAr: string;
  value: number; // DZD per unit, or a plain percentage number (e.g. 20 = 20%)
  unit: string; // 'دج/م²', 'دج/ساعة', 'دج/م.ط', 'دج/كم', '%'
  meta?: string; // optional extra descriptor, e.g. thickness "3mm"
  isActive: boolean;
  sortOrder: number;
}

export type WorkshopModule =
  | 'sheet' | 'letters' | 'alucobond' | 'painting' | 'laser' | 'routing' | 'installation';

export type EstimationStatus = 'draft' | 'sent' | 'approved' | 'completed';

export interface WorkshopEstimation {
  id: string;
  module: WorkshopModule;
  client: string;
  projectName: string;
  notes: string;
  inputs: Record<string, any>;
  manufacturingCost: number;
  sellingPrice: number;
  profit: number;
  status: EstimationStatus;
  date: string;
}

// Public-safe subset of WorkshopPricingItem: names only, never a price,
// rate, or cost figure. This is what the anonymous Workshop page's
// dropdowns are built from.
export interface WorkshopOptionItem {
  group: WorkshopPricingGroup;
  key: string;
  label: string;
  labelAr: string;
  meta?: string;
  sortOrder: number;
}

// Response shape of POST /api/workshop-estimator/calculate — deliberately
// minimal, no cost breakdown, no rates.
export interface WorkshopEstimateResult {
  estimatedPrice: number;
  currency: string;
  estimatedDeliveryDays?: { min: number; max: number };
}

// Activity log entry — records staff sign-ins. Visible to admins only.
export interface ActivityLog {
  id: number;
  userId: string;
  email: string;
  role: string;
  action: string;
  ipAddress?: string;
  userAgent?: string;
  date: string;
}

// -----------------------------------------------------------------------------
// Customer Quotation Management — admin-authored quotations for walk-in /
// phone / WhatsApp customers. Entirely separate from the public quote-request
// pipeline (QuoteRequest) and the internal Workshop Estimator (WorkshopEstimation).
// -----------------------------------------------------------------------------
export type CustomerQuotationStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';

export interface CustomerQuotationItem {
  id?: number;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface CustomerQuotation {
  id: number;
  quotationNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  issueDate: string;
  validUntil: string;
  subtotal: number;
  discount: number;
  total: number;
  notes: string;
  status: CustomerQuotationStatus;
  items: CustomerQuotationItem[];
  createdAt: string;
  updatedAt: string;
}

// Payload shape for create/update — server generates id/quotationNumber/
// createdAt/updatedAt, and computes totals are trusted from the client but
// re-derivable for validation.
export type CustomerQuotationInput = Omit<CustomerQuotation, 'id' | 'quotationNumber' | 'createdAt' | 'updatedAt'>;
