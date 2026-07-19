import { pgTable, serial, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 1. Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Supabase Auth user ID (auth.users.id)
  email: text('email').notNull(),
  role: text('role', { enum: ['admin', 'manager', 'editor'] }).default('editor').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Settings table (Single Row CMS settings)
export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  heroTitle: text('hero_title').notNull(),
  heroTitleAr: text('hero_title_ar').notNull(),
  heroSubtitle: text('hero_subtitle').notNull(),
  heroSubtitleAr: text('hero_subtitle_ar').notNull(),
  heroBadge: text('hero_badge').notNull(),
  heroBadgeAr: text('hero_badge_ar').notNull(),
  heroBgImage: text('hero_bg_image').notNull(),
  homeStat1Value: text('home_stat_1_value').notNull(),
  homeStat1Label: text('home_stat_1_label').notNull(),
  homeStat1LabelAr: text('home_stat_1_label_ar').notNull(),
  homeStat2Value: text('home_stat_2_value').notNull(),
  homeStat2Label: text('home_stat_2_label').notNull(),
  homeStat2LabelAr: text('home_stat_2_label_ar').notNull(),
  homeStat3Value: text('home_stat_3_value').notNull(),
  homeStat3Label: text('home_stat_3_label').notNull(),
  homeStat3LabelAr: text('home_stat_3_label_ar').notNull(),
  seoTitle: text('seo_title').notNull(),
  seoDescription: text('seo_description').notNull(),
  seoKeywords: text('seo_keywords').notNull(),
  contactEmail: text('contact_email').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3. Services table
export const services = pgTable('services', {
  id: text('id').primaryKey(), // e.g. 'SRV-101'
  title: text('title').notNull(),
  titleAr: text('title_ar').notNull(),
  category: text('category').notNull(), // 'residential' | 'commercial' | 'manufacturing'
  description: text('description').notNull(),
  descriptionAr: text('description_ar').notNull(),
  fullDescription: text('full_description').notNull(),
  fullDescriptionAr: text('full_description_ar').notNull(),
  icon: text('icon').notNull(),
  image: text('image').notNull(),
  features: text('features').notNull(), // JSON string array
  featuresAr: text('features_ar').notNull(), // JSON string array
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 4. Portfolio Projects table
export const projects = pgTable('projects', {
  id: text('id').primaryKey(), // e.g. 'P-101'
  title: text('title').notNull(),
  titleAr: text('title_ar').notNull(),
  category: text('category').notNull(), // 'residential' | 'commercial' | 'manufacturing' | 'decor'
  description: text('description').notNull(),
  descriptionAr: text('description_ar').notNull(),
  client: text('client').notNull(),
  location: text('location').notNull(),
  locationAr: text('location_ar').notNull(),
  completionDate: text('completion_date').notNull(),
  materials: text('materials').notNull(), // JSON string array
  materialsAr: text('materials_ar').notNull(), // JSON string array
  challenge: text('challenge').notNull(),
  challengeAr: text('challenge_ar').notNull(),
  solution: text('solution').notNull(),
  solutionAr: text('solution_ar').notNull(),
  images: text('images').notNull(), // JSON string array of URLs
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 5. CNC Products Catalog table
export const products = pgTable('products', {
  id: text('id').primaryKey(), // e.g. 'PRD-101'
  title: text('title').notNull(),
  titleAr: text('title_ar').notNull(),
  category: text('category').notNull(), // 'decor-panels' | 'geometric-mirrors' | 'custom-cladding' | 'musharrabiya'
  description: text('description').notNull(),
  descriptionAr: text('description_ar').notNull(),
  materials: text('materials').notNull(), // JSON string array
  materialsAr: text('materials_ar').notNull(), // JSON string array
  sizes: text('sizes').notNull(), // JSON string array
  customizationOptions: text('customization_options').notNull(), // JSON string array
  customizationOptionsAr: text('customization_options_ar').notNull(), // JSON string array
  images: text('images').notNull(), // JSON string array of URLs
  specifications: text('specifications').notNull(), // JSON string map
  specificationsAr: text('specifications_ar').notNull(), // JSON string map
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 6. Blog Posts table
export const blogPosts = pgTable('blog_posts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  titleAr: text('title_ar').notNull(),
  excerpt: text('excerpt').notNull(),
  excerptAr: text('excerpt_ar').notNull(),
  content: text('content').notNull(),
  contentAr: text('content_ar').notNull(),
  category: text('category').notNull(),
  categoryAr: text('category_ar').notNull(),
  author: text('author').notNull(),
  authorAr: text('author_ar').notNull(),
  date: text('date').notNull(),
  readTime: text('read_time').notNull(),
  readTimeAr: text('read_time_ar').notNull(),
  image: text('image').notNull(),
  tags: text('tags').notNull(), // JSON string array
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 7. Testimonials table
export const testimonials = pgTable('testimonials', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  nameAr: text('name_ar').notNull(),
  role: text('role').notNull(),
  roleAr: text('role_ar').notNull(),
  company: text('company').notNull(),
  companyAr: text('company_ar').notNull(),
  content: text('content').notNull(),
  contentAr: text('content_ar').notNull(),
  rating: integer('rating').notNull(),
  avatar: text('avatar').notNull(),
  isFeatured: boolean('is_featured').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 8. Quotes (Quotation Requests CRM) table
export const quotes = pgTable('quotes', {
  id: text('id').primaryKey(), // e.g. 'Q-1001'
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  projectType: text('project_type').notNull(),
  serviceId: text('service_id'),
  dimensions: text('dimensions'),
  message: text('message').notNull(),
  status: text('status').default('pending').notNull(), // 'pending' | 'reviewed' | 'completed'
  budget: text('budget'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  responseMessage: text('response_message'), // Admin response message
});

// 9. Contact Messages table
export const messages = pgTable('messages', {
  id: text('id').primaryKey(), // e.g. 'MSG-101'
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  date: text('date').notNull(),
  status: text('status').default('unread').notNull(), // 'unread' | 'read' | 'archived'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 10. Media Assets table
export const media = pgTable('media', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  size: text('size').notNull(),
  mimeType: text('mime_type').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 11. Pricing Factors table — powers the public Quote Estimator.
// A single table holds all four factor families (material price/m²,
// project-type multiplier, complexity multiplier, wilaya flat fee) so the
// admin manages them from one "Pricing & Materials" screen.
export const pricingFactors = pgTable('pricing_factors', {
  id: text('id').primaryKey(), // e.g. 'MAT-101', 'PT-101', 'CX-101', 'WIL-101'
  type: text('type', { enum: ['material', 'projectType', 'complexity', 'wilaya'] }).notNull(),
  name: text('name').notNull(),
  nameAr: text('name_ar').notNull(),
  value: text('value').notNull(), // numeric stored as text (price/m², multiplier, or flat fee)
  unit: text('unit').default('').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 12. Workshop Estimator (internal-only module, separate from pricingFactors above)
export const workshopPricing = pgTable('workshop_pricing', {
  id: text('id').primaryKey(), // e.g. 'WP-MAT-001'
  group: text('group', { enum: ['material', 'paint', 'edgeband', 'laser', 'routing', 'labor', 'installation', 'transport', 'margin', 'waste'] }).notNull(),
  key: text('key').notNull(), // machine key, e.g. 'PMMA_3MM'
  label: text('label').notNull(),
  labelAr: text('label_ar').notNull(),
  value: text('value').notNull(),
  unit: text('unit').default('').notNull(),
  meta: text('meta').default(''),
  isActive: boolean('is_active').default(true).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const estimations = pgTable('estimations', {
  id: text('id').primaryKey(), // e.g. 'EST-000123'
  module: text('module', { enum: ['sheet', 'letters', 'alucobond', 'painting', 'laser', 'routing', 'installation'] }).notNull(),
  client: text('client').notNull(),
  projectName: text('project_name').notNull(),
  notes: text('notes').default(''),
  inputs: text('inputs').notNull(), // JSON-serialized input snapshot
  manufacturingCost: text('manufacturing_cost').notNull(),
  sellingPrice: text('selling_price').notNull(),
  profit: text('profit').notNull(),
  status: text('status', { enum: ['draft', 'sent', 'approved', 'completed'] }).default('draft').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 13. Activity Logs — records staff sign-ins (and, going forward, other
// sensitive actions). Admin-only visibility, enforced server-side.
export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  email: text('email').notNull(),
  role: text('role').notNull(),
  action: text('action').notNull().default('login'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
