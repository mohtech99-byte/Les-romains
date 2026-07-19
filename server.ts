import dotenv from 'dotenv';

dotenv.config();
console.log("SERVER ENV", {
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  db: process.env.SQL_DB_NAME,
  supabase: process.env.SUPABASE_URL,
});
import express from 'express';
import path from 'path';
import * as fs from 'fs';
import pkg from 'multer';
const multer = pkg;
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer as createViteServer } from 'vite';
import { eq, desc } from 'drizzle-orm';

import { db } from './src/db/index.ts';
import {
  users,
  settings,
  services,
  projects,
  products,
  blogPosts,
  testimonials,
  quotes,
  messages,
  media,
  pricingFactors,
  workshopPricing,
  estimations,
  activityLogs
} from './src/db/schema.ts';
import { requireAuth, requireRole, AuthRequest } from './src/middleware/auth.ts';
import {
  initialServices,
  initialProjects,
  initialProducts,
  initialTestimonials,
  initialBlogPosts,
  initialSettings,
  initialPricingFactors
} from './src/data/initialData.ts';
import { initialWorkshopPricing } from './src/data/workshopPricingSeed.ts';
import { uploadFileToStorage } from './src/lib/storage.ts';
import {
  buildRateMap, rate,
  calcSheet, calcLetters, calcAlucobond, calcPainting, calcLaser, calcRouting, calcInstallation
} from './src/lib/workshopCalculations.ts';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Security headers. `crossOriginResourcePolicy` is relaxed so that images
// under /uploads can still be embedded by the frontend.
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS: by default only allow the app's own configured URL(s). Set
// ALLOWED_ORIGINS as a comma-separated list in production (e.g.
// "https://lesromains.com,https://www.lesromains.com"). If left unset, all
// origins are allowed, which is fine for local development but should be
// tightened before going live.
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
app.use(cors({
  origin: allowedOrigins.length > 0 ? allowedOrigins : true,
  credentials: true,
}));

// Set up body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limit the public-facing write endpoints (quote requests, contact form)
// to reduce spam/abuse, since these routes require no authentication.
const publicWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20, // 20 submissions per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

// Ensure uploads folder exists and serve statically
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Only allow real image types to be uploaded. This prevents someone from
// hosting arbitrary files (e.g. .html/.svg with embedded scripts, executables)
// on the public /uploads path.
const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

// Initialize multer for in-memory uploads (to pass buffers to storage uploader)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype)) {
      cb(new Error('Only JPEG, PNG, WEBP, or GIF image files are allowed.'));
      return;
    }
    cb(null, true);
  },
});

// Database Auto-Seeding helper
async function seedDatabase() {
  try {
    console.log('Checking database state for seeding...');

    // 1. Seed global settings
    const settingsRows = await db.select().from(settings).limit(1);
    if (settingsRows.length === 0) {
      console.log('Seeding default CMS settings...');
      // initialSettings is a complete literal object (see src/data/initialData.ts),
      // but AppSettings marks these fields optional so partial DB rows can be
      // merged into it elsewhere. Assert non-null here since we know every
      // field is populated for the seed data.
      const seedSettings = initialSettings as Required<typeof initialSettings>;
      const settingsPayload: typeof settings.$inferInsert = {
        heroTitle: seedSettings.heroTitle,
        heroTitleAr: seedSettings.heroTitleAr,
        heroSubtitle: seedSettings.heroSubtitle,
        heroSubtitleAr: seedSettings.heroSubtitleAr,
        heroBadge: seedSettings.heroBadge,
        heroBadgeAr: seedSettings.heroBadgeAr,
        heroBgImage: seedSettings.heroBgImage,
        homeStat1Value: seedSettings.homeStat1Value,
        homeStat1Label: seedSettings.homeStat1Label,
        homeStat1LabelAr: seedSettings.homeStat1LabelAr,
        homeStat2Value: seedSettings.homeStat2Value,
        homeStat2Label: seedSettings.homeStat2Label,
        homeStat2LabelAr: seedSettings.homeStat2LabelAr,
        homeStat3Value: seedSettings.homeStat3Value,
        homeStat3Label: seedSettings.homeStat3Label,
        homeStat3LabelAr: seedSettings.homeStat3LabelAr,
        seoTitle: seedSettings.seoTitle,
        seoDescription: seedSettings.seoDescription,
        seoKeywords: seedSettings.seoKeywords,
        contactEmail: seedSettings.contactEmail,
      };
      await db.insert(settings).values(settingsPayload);
    }

    // 2. Seed services
    const servicesRows = await db.select().from(services).limit(1);
    if (servicesRows.length === 0) {
      console.log('Seeding default services...');
      for (const serviceItem of initialServices) {
        await db.insert(services).values({
          id: serviceItem.id,
          title: serviceItem.title,
          titleAr: serviceItem.titleAr,
          category: serviceItem.category,
          description: serviceItem.description,
          descriptionAr: serviceItem.descriptionAr,
          fullDescription: serviceItem.fullDescription,
          fullDescriptionAr: serviceItem.fullDescriptionAr,
          icon: serviceItem.icon,
          image: serviceItem.image,
          features: JSON.stringify(serviceItem.features),
          featuresAr: JSON.stringify(serviceItem.featuresAr),
        });
      }
    }

    // 3. Seed portfolio projects
    const projectsRows = await db.select().from(projects).limit(1);
    if (projectsRows.length === 0) {
      console.log('Seeding default projects...');
      for (const projectItem of initialProjects) {
        await db.insert(projects).values({
          id: projectItem.id,
          title: projectItem.title,
          titleAr: projectItem.titleAr,
          category: projectItem.category,
          description: projectItem.description,
          descriptionAr: projectItem.descriptionAr,
          client: projectItem.client,
          location: projectItem.location,
          locationAr: projectItem.locationAr,
          completionDate: projectItem.completionDate,
          materials: JSON.stringify(projectItem.materials),
          materialsAr: JSON.stringify(projectItem.materialsAr),
          challenge: projectItem.challenge,
          challengeAr: projectItem.challengeAr,
          solution: projectItem.solution,
          solutionAr: projectItem.solutionAr,
          images: JSON.stringify(projectItem.images),
        });
      }
    }

    // 4. Seed products
    const productsRows = await db.select().from(products).limit(1);
    if (productsRows.length === 0) {
      console.log('Seeding default CNC products...');
      for (const productItem of initialProducts) {
        await db.insert(products).values({
          id: productItem.id,
          title: productItem.title,
          titleAr: productItem.titleAr,
          category: productItem.category,
          description: productItem.description,
          descriptionAr: productItem.descriptionAr,
          materials: JSON.stringify(productItem.materials),
          materialsAr: JSON.stringify(productItem.materialsAr),
          sizes: JSON.stringify(productItem.sizes),
          customizationOptions: JSON.stringify(productItem.customizationOptions),
          customizationOptionsAr: JSON.stringify(productItem.customizationOptionsAr),
          images: JSON.stringify(productItem.images),
          specifications: JSON.stringify(productItem.specifications),
          specificationsAr: JSON.stringify(productItem.specificationsAr),
        });
      }
    }

    // 5. Seed blog posts
    const blogRows = await db.select().from(blogPosts).limit(1);
    if (blogRows.length === 0) {
      console.log('Seeding default blog posts...');
      for (const blogItem of initialBlogPosts) {
        await db.insert(blogPosts).values({
          id: blogItem.id,
          title: blogItem.title,
          titleAr: blogItem.titleAr,
          excerpt: blogItem.excerpt,
          excerptAr: blogItem.excerptAr,
          content: blogItem.content,
          contentAr: blogItem.contentAr,
          category: blogItem.category,
          categoryAr: blogItem.categoryAr,
          author: blogItem.author,
          authorAr: blogItem.authorAr,
          date: blogItem.date,
          readTime: blogItem.readTime,
          readTimeAr: blogItem.readTimeAr,
          image: blogItem.image,
          tags: JSON.stringify(blogItem.tags),
        });
      }
    }

    // 6. Seed testimonials
    const testimonialsRows = await db.select().from(testimonials).limit(1);
    if (testimonialsRows.length === 0) {
      console.log('Seeding default testimonials...');
      for (const testimonialItem of initialTestimonials) {
        await db.insert(testimonials).values({
          id: testimonialItem.id,
          name: testimonialItem.name,
          nameAr: testimonialItem.nameAr,
          role: testimonialItem.role,
          roleAr: testimonialItem.roleAr,
          company: testimonialItem.company,
          companyAr: testimonialItem.companyAr,
          content: testimonialItem.content,
          contentAr: testimonialItem.contentAr,
          rating: testimonialItem.rating,
          avatar: testimonialItem.avatar,
          isFeatured: testimonialItem.isFeatured,
        });
      }
    }

    // 7. Seed pricing factors (materials, project types, complexity, wilayas)
    const pricingRows = await db.select().from(pricingFactors).limit(1);
    if (pricingRows.length === 0) {
      console.log('Seeding default pricing factors...');
      for (const factor of initialPricingFactors) {
        await db.insert(pricingFactors).values({
          id: factor.id,
          type: factor.type,
          name: factor.name,
          nameAr: factor.nameAr,
          value: String(factor.value),
          unit: factor.unit,
          isActive: factor.isActive,
          sortOrder: factor.sortOrder,
        });
      }
    }

    // 8. Seed workshop pricing (internal Workshop Estimator — separate system)
    const workshopRows = await db.select().from(workshopPricing).limit(1);
    if (workshopRows.length === 0) {
      console.log('Seeding default workshop pricing...');
      for (const item of initialWorkshopPricing) {
        await db.insert(workshopPricing).values({
          id: item.id,
          group: item.group,
          key: item.key,
          label: item.label,
          labelAr: item.labelAr,
          value: String(item.value),
          unit: item.unit,
          meta: item.meta || '',
          isActive: item.isActive,
          sortOrder: item.sortOrder,
        });
      }
    }

    console.log('Database check and auto-seeding complete.');
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
}

// -----------------------------------------------------------------------------
// REST API ROUTES
// -----------------------------------------------------------------------------

// Active user session role & metadata
app.get('/api/me', requireAuth, (req: AuthRequest, res) => {
  res.json({
    uid: req.user?.uid,
    email: req.user?.email,
    role: req.user?.role || 'editor'
  });
});

// Global CMS Settings
app.get('/api/settings', async (req, res) => {
  try {
    const rows = await db.select().from(settings).limit(1);
    if (rows.length === 0) {
      return res.json({});
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.put('/api/settings', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const rows = await db.select().from(settings).limit(1);
    if (rows.length === 0) {
      const inserted = await db.insert(settings).values(req.body).returning();
      return res.json(inserted[0]);
    } else {
      const updated = await db.update(settings)
        .set(req.body)
        .where(eq(settings.id, rows[0].id))
        .returning();
      res.json(updated[0]);
    }
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Database update failed' });
  }
});

// Services CRUD
app.get('/api/services', async (req, res) => {
  try {
    const rows = await db.select().from(services);
    // Parse JSON string fields back to arrays
    const parsed = rows.map(row => ({
      ...row,
      features: JSON.parse(row.features),
      featuresAr: JSON.parse(row.featuresAr),
    }));
    res.json(parsed);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.post('/api/services', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { id, title, titleAr, category, description, descriptionAr, fullDescription, fullDescriptionAr, icon, image, features, featuresAr } = req.body;
    
    const dbPayload = {
      title,
      titleAr,
      category,
      description,
      descriptionAr,
      fullDescription,
      fullDescriptionAr,
      icon,
      image,
      features: JSON.stringify(features || []),
      featuresAr: JSON.stringify(featuresAr || []),
    };

    const existing = await db.select().from(services).where(eq(services.id, id)).limit(1);
    if (existing.length > 0) {
      const updated = await db.update(services)
        .set(dbPayload)
        .where(eq(services.id, id))
        .returning();
      res.json(updated[0]);
    } else {
      const inserted = await db.insert(services)
        .values({ id, ...dbPayload })
        .returning();
      res.json(inserted[0]);
    }
  } catch (error) {
    console.error('Error saving service:', error);
    res.status(500).json({ error: 'Failed to save service' });
  }
});

app.delete('/api/services/:id', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    await db.delete(services).where(eq(services.id, req.params.id));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// Pricing Factors CRUD — public read (needed by the Quote Estimator on the
// public site), admin/manager-only writes.
app.get('/api/pricing-factors', async (req, res) => {
  try {
    const rows = await db.select().from(pricingFactors);
    const parsed = rows
      .map(row => ({ ...row, value: parseFloat(row.value) }))
      .sort((a, b) => a.sortOrder - b.sortOrder);
    res.json(parsed);
  } catch (error) {
    console.error('Error fetching pricing factors:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.post('/api/pricing-factors', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { id, type, name, nameAr, value, unit, isActive, sortOrder } = req.body;

    const dbPayload = {
      type,
      name,
      nameAr,
      value: String(value),
      unit: unit || '',
      isActive: isActive !== false,
      sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
    };

    const existing = await db.select().from(pricingFactors).where(eq(pricingFactors.id, id)).limit(1);
    if (existing.length > 0) {
      const updated = await db.update(pricingFactors)
        .set(dbPayload)
        .where(eq(pricingFactors.id, id))
        .returning();
      res.json({ ...updated[0], value: parseFloat(updated[0].value) });
    } else {
      const inserted = await db.insert(pricingFactors)
        .values({ id, ...dbPayload })
        .returning();
      res.json({ ...inserted[0], value: parseFloat(inserted[0].value) });
    }
  } catch (error) {
    console.error('Error saving pricing factor:', error);
    res.status(500).json({ error: 'Failed to save pricing factor' });
  }
});

app.delete('/api/pricing-factors/:id', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    await db.delete(pricingFactors).where(eq(pricingFactors.id, req.params.id));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting pricing factor:', error);
    res.status(500).json({ error: 'Failed to delete pricing factor' });
  }
});

// ---------------------------------------------------------------------------
// Workshop Estimator — internal-only module, entirely separate from the
// public Quote Estimator above. Every route requires staff auth; there is
// no public read endpoint, since this tool is not for site visitors.
// ---------------------------------------------------------------------------

// Public, read-only, metadata ONLY — powers the customer-facing Workshop
// page's dropdowns (material/paint names, etc.). Deliberately strips
// `value` and `unit` so no price, rate, or cost figure ever reaches the
// browser for anonymous visitors. Contrast with the admin route below,
// which requires auth and returns the full priced records.
app.get('/api/workshop-estimator/options', async (req, res) => {
  try {
    const rows = await db.select({
      group: workshopPricing.group,
      key: workshopPricing.key,
      label: workshopPricing.label,
      labelAr: workshopPricing.labelAr,
      meta: workshopPricing.meta,
      sortOrder: workshopPricing.sortOrder,
    }).from(workshopPricing).where(eq(workshopPricing.isActive, true));
    res.json(rows.sort((a, b) => a.sortOrder - b.sortOrder));
  } catch (error) {
    console.error('Error fetching workshop estimator options:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Public calculate endpoint — the ONLY way the public Workshop page produces
// a price. The client sends raw job inputs only (material, dimensions,
// quantity, options...); every rate, waste %, margin %, and derived labor/
// machine-time assumption stays server-side and is never serialized back.
// Response is intentionally minimal: { estimatedPrice, currency, estimatedDeliveryDays? }.
app.post('/api/workshop-estimator/calculate', publicWriteLimiter, async (req, res) => {
  try {
    const { module, inputs } = req.body || {};
    if (!module || typeof inputs !== 'object' || inputs === null) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const rows = await db.select().from(workshopPricing).where(eq(workshopPricing.isActive, true));
    const rates = buildRateMap(rows.map(r => ({ ...r, value: parseFloat(r.value) })) as any);

    const DELIVERY_DAYS: Record<string, { min: number; max: number }> = {
      sheet: { min: 5, max: 8 },
      letters: { min: 7, max: 12 },
      alucobond: { min: 7, max: 14 },
      painting: { min: 3, max: 6 },
      laser: { min: 2, max: 4 },
      routing: { min: 3, max: 6 },
      installation: { min: 1, max: 3 },
    };

    let sellingPrice: number;

    switch (module) {
      case 'sheet': {
        const lengthCm = Number(inputs.lengthCm) || 0;
        const widthCm = Number(inputs.widthCm) || 0;
        const quantity = Math.max(Number(inputs.quantity) || 1, 1);
        const perimeterSingle = 2 * ((lengthCm + widthCm) / 100);
        // Cutting cost estimated server-side from perimeter; never a customer-editable field.
        const cuttingCost = perimeterSingle * quantity * rate(rates, 'LASER_METER', 0);
        const result = calcSheet({
          materialKey: String(inputs.materialKey || ''),
          lengthCm, widthCm, quantity,
          wastePct: rate(rates, 'DEFAULT_WASTE', 8),
          cuttingCost,
          edgeBand: !!inputs.edgeBand,
          marginPct: rate(rates, 'DEFAULT_MARGIN', 25),
        }, rates);
        sellingPrice = result.sellingPrice;
        break;
      }
      case 'letters': {
        const result = calcLetters({
          letterHeightCm: Number(inputs.letterHeightCm) || 0,
          materialKey: String(inputs.materialKey || ''),
          quantity: Math.max(Number(inputs.quantity) || 1, 1),
          lighting: ['none', 'front', 'back', 'halo'].includes(inputs.lighting) ? inputs.lighting : 'none',
          installationFlat: 0,
          marginPct: rate(rates, 'DEFAULT_MARGIN', 25),
        }, rates);
        sellingPrice = result.sellingPrice;
        break;
      }
      case 'alucobond': {
        const panelsQuantity = Math.max(Number(inputs.panelsQuantity) || 1, 1);
        const installation = !!inputs.installation;
        const result = calcAlucobond({
          materialKey: String(inputs.materialKey || ''),
          lengthCm: Number(inputs.lengthCm) || 0,
          widthCm: Number(inputs.widthCm) || 0,
          panelsQuantity,
          cutting: !!inputs.cutting,
          routing: !!inputs.routing,
          folding: !!inputs.folding,
          installation,
          installHours: installation ? panelsQuantity * 0.5 : 0, // internal heuristic, not client-supplied
          marginPct: rate(rates, 'DEFAULT_MARGIN', 25),
        }, rates);
        sellingPrice = result.sellingPrice;
        break;
      }
      case 'painting': {
        const areaM2 = Math.max(Number(inputs.areaM2) || 0, 0);
        const result = calcPainting({
          paintKey: String(inputs.paintKey || ''),
          areaM2,
          coats: Math.max(Number(inputs.coats) || 1, 1),
          primer: !!inputs.primer,
          sanding: !!inputs.sanding,
          clearCoat: !!inputs.clearCoat,
          laborCost: areaM2 * rate(rates, 'LABOR_HOUR', 500) * 0.3, // internal hours/m² heuristic
          marginPct: rate(rates, 'DEFAULT_MARGIN', 25),
        }, rates);
        sellingPrice = result.sellingPrice;
        break;
      }
      case 'laser': {
        const cutLengthM = Math.max(Number(inputs.cutLengthM) || 0, 0);
        const result = calcLaser({
          materialKey: String(inputs.materialKey || ''),
          cutLengthM,
          machineHours: cutLengthM / 6, // internal cutting-speed heuristic
          powerSurcharge: 0,
          marginPct: rate(rates, 'DEFAULT_MARGIN', 25),
        }, rates);
        sellingPrice = result.sellingPrice;
        break;
      }
      case 'routing': {
        const machiningAreaM2 = Math.max(Number(inputs.machiningAreaM2) || 0, 0);
        const result = calcRouting({
          materialKey: String(inputs.materialKey || ''),
          machiningAreaM2,
          machineHours: machiningAreaM2 / 2, // internal throughput heuristic
          toolChanges: 0,
          marginPct: rate(rates, 'DEFAULT_MARGIN', 25),
        }, rates);
        sellingPrice = result.sellingPrice;
        break;
      }
      case 'installation': {
        const scaffolding = !!inputs.scaffolding;
        const result = calcInstallation({
          workers: 2, // internal default crew size
          hours: 4,   // internal default job duration
          travelDistanceKm: Math.max(Number(inputs.travelDistanceKm) || 0, 0),
          installationType: String(inputs.installationType || ''),
          scaffolding,
          scaffoldingDays: scaffolding ? 1 : 0,
          marginPct: rate(rates, 'DEFAULT_MARGIN', 25),
        }, rates);
        sellingPrice = result.sellingPrice;
        break;
      }
      default:
        return res.status(400).json({ error: 'Unknown module' });
    }

    const delivery = DELIVERY_DAYS[module];
    res.json({
      estimatedPrice: Math.round(sellingPrice),
      currency: 'DZD',
      estimatedDeliveryDays: delivery,
    });
  } catch (error) {
    console.error('Error calculating workshop estimate:', error);
    res.status(500).json({ error: 'Failed to calculate estimate' });
  }
});

app.get('/api/workshop-pricing', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const rows = await db.select().from(workshopPricing);
    const parsed = rows
      .map(row => ({ ...row, value: parseFloat(row.value) }))
      .sort((a, b) => a.sortOrder - b.sortOrder);
    res.json(parsed);
  } catch (error) {
    console.error('Error fetching workshop pricing:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.post('/api/workshop-pricing', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { id, group, key, label, labelAr, value, unit, meta, isActive, sortOrder } = req.body;

    const dbPayload = {
      group, key, label, labelAr,
      value: String(value),
      unit: unit || '',
      meta: meta || '',
      isActive: isActive !== false,
      sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
    };

    const existing = await db.select().from(workshopPricing).where(eq(workshopPricing.id, id)).limit(1);
    if (existing.length > 0) {
      const updated = await db.update(workshopPricing)
        .set(dbPayload)
        .where(eq(workshopPricing.id, id))
        .returning();
      res.json({ ...updated[0], value: parseFloat(updated[0].value) });
    } else {
      const inserted = await db.insert(workshopPricing)
        .values({ id, ...dbPayload })
        .returning();
      res.json({ ...inserted[0], value: parseFloat(inserted[0].value) });
    }
  } catch (error) {
    console.error('Error saving workshop pricing item:', error);
    res.status(500).json({ error: 'Failed to save workshop pricing item' });
  }
});

app.delete('/api/workshop-pricing/:id', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    await db.delete(workshopPricing).where(eq(workshopPricing.id, req.params.id));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting workshop pricing item:', error);
    res.status(500).json({ error: 'Failed to delete workshop pricing item' });
  }
});

app.get('/api/estimations', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const rows = await db.select().from(estimations).orderBy(desc(estimations.createdAt));
    const parsed = rows.map(row => ({
      ...row,
      inputs: JSON.parse(row.inputs || '{}'),
      manufacturingCost: parseFloat(row.manufacturingCost),
      sellingPrice: parseFloat(row.sellingPrice),
      profit: parseFloat(row.profit),
      date: row.createdAt,
    }));
    res.json(parsed);
  } catch (error) {
    console.error('Error fetching estimations:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.post('/api/estimations', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { module, client, projectName, notes, inputs, manufacturingCost, sellingPrice, profit, status } = req.body;
    const id = `EST-${Date.now().toString().slice(-6)}`;

    const inserted = await db.insert(estimations)
      .values({
        id,
        module,
        client,
        projectName,
        notes: notes || '',
        inputs: JSON.stringify(inputs || {}),
        manufacturingCost: String(manufacturingCost),
        sellingPrice: String(sellingPrice),
        profit: String(profit),
        status: status || 'draft',
      })
      .returning();

    res.json({
      ...inserted[0],
      inputs: JSON.parse(inserted[0].inputs || '{}'),
      manufacturingCost: parseFloat(inserted[0].manufacturingCost),
      sellingPrice: parseFloat(inserted[0].sellingPrice),
      profit: parseFloat(inserted[0].profit),
      date: inserted[0].createdAt,
    });
  } catch (error) {
    console.error('Error saving estimation:', error);
    res.status(500).json({ error: 'Failed to save estimation' });
  }
});

app.put('/api/estimations/:id/status', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await db.update(estimations)
      .set({ status })
      .where(eq(estimations.id, req.params.id))
      .returning();
    res.json(updated[0]);
  } catch (error) {
    console.error('Error updating estimation status:', error);
    res.status(500).json({ error: 'Failed to update estimation status' });
  }
});

app.delete('/api/estimations/:id', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    await db.delete(estimations).where(eq(estimations.id, req.params.id));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting estimation:', error);
    res.status(500).json({ error: 'Failed to delete estimation' });
  }
});

// ---------------------------------------------------------------------------
// Activity Logs — records staff sign-ins. Any authenticated user may create
// a log entry, but it always uses the server-verified identity from
// requireAuth (req.user), never client-supplied email/role, so a user can
// only ever log themselves in, never impersonate someone else. Reading the
// log is restricted to admins only.
// ---------------------------------------------------------------------------

app.post('/api/activity-logs', requireAuth, async (req: AuthRequest, res) => {
  try {
    const action = typeof req.body?.action === 'string' ? req.body.action : 'login';
    const inserted = await db.insert(activityLogs)
      .values({
        userId: req.user!.uid,
        email: req.user!.email,
        role: req.user!.role,
        action,
        ipAddress: (req.headers['x-forwarded-for'] as string) || req.ip || '',
        userAgent: req.headers['user-agent'] || '',
      })
      .returning();
    res.json(inserted[0]);
  } catch (error) {
    console.error('Error recording activity log:', error);
    res.status(500).json({ error: 'Failed to record activity log' });
  }
});

app.get('/api/activity-logs', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const rows = await db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(300);
    const mapped = rows.map(row => ({ ...row, date: row.createdAt }));
    res.json(mapped);
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Projects CRUD
app.get('/api/projects', async (req, res) => {
  try {
    const rows = await db.select().from(projects);
    const parsed = rows.map(row => ({
      ...row,
      materials: JSON.parse(row.materials),
      materialsAr: JSON.parse(row.materialsAr),
      images: JSON.parse(row.images),
    }));
    res.json(parsed);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.post('/api/projects', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { id, title, titleAr, category, description, descriptionAr, client, location, locationAr, completionDate, materials, materialsAr, challenge, challengeAr, solution, solutionAr, images } = req.body;
    
    const dbPayload = {
      title,
      titleAr,
      category,
      description,
      descriptionAr,
      client,
      location,
      locationAr,
      completionDate,
      materials: JSON.stringify(materials || []),
      materialsAr: JSON.stringify(materialsAr || []),
      challenge,
      challengeAr,
      solution,
      solutionAr,
      images: JSON.stringify(images || []),
    };

    const existing = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    if (existing.length > 0) {
      const updated = await db.update(projects)
        .set(dbPayload)
        .where(eq(projects.id, id))
        .returning();
      res.json(updated[0]);
    } else {
      const inserted = await db.insert(projects)
        .values({ id, ...dbPayload })
        .returning();
      res.json(inserted[0]);
    }
  } catch (error) {
    console.error('Error saving project:', error);
    res.status(500).json({ error: 'Failed to save project' });
  }
});

app.delete('/api/projects/:id', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    await db.delete(projects).where(eq(projects.id, req.params.id));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// CNC Products CRUD
app.get('/api/products', async (req, res) => {
  try {
    const rows = await db.select().from(products);
    const parsed = rows.map(row => ({
      ...row,
      materials: JSON.parse(row.materials),
      materialsAr: JSON.parse(row.materialsAr),
      sizes: JSON.parse(row.sizes),
      customizationOptions: JSON.parse(row.customizationOptions),
      customizationOptionsAr: JSON.parse(row.customizationOptionsAr),
      images: JSON.parse(row.images),
      specifications: JSON.parse(row.specifications),
      specificationsAr: JSON.parse(row.specificationsAr),
    }));
    res.json(parsed);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.post('/api/products', requireAuth, requireRole(['admin', 'manager', 'editor']), async (req, res) => {
  try {
    const { id, title, titleAr, category, description, descriptionAr, materials, materialsAr, sizes, customizationOptions, customizationOptionsAr, images, specifications, specificationsAr } = req.body;
    
    const dbPayload = {
      title,
      titleAr,
      category,
      description,
      descriptionAr,
      materials: JSON.stringify(materials || []),
      materialsAr: JSON.stringify(materialsAr || []),
      sizes: JSON.stringify(sizes || []),
      customizationOptions: JSON.stringify(customizationOptions || []),
      customizationOptionsAr: JSON.stringify(customizationOptionsAr || []),
      images: JSON.stringify(images || []),
      specifications: JSON.stringify(specifications || {}),
      specificationsAr: JSON.stringify(specificationsAr || {}),
    };

    const existing = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (existing.length > 0) {
      const updated = await db.update(products)
        .set(dbPayload)
        .where(eq(products.id, id))
        .returning();
      res.json(updated[0]);
    } else {
      const inserted = await db.insert(products)
        .values({ id, ...dbPayload })
        .returning();
      res.json(inserted[0]);
    }
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({ error: 'Failed to save product' });
  }
});

app.delete('/api/products/:id', requireAuth, requireRole(['admin', 'manager', 'editor']), async (req, res) => {
  try {
    await db.delete(products).where(eq(products.id, req.params.id));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Blog Posts CRUD
app.get('/api/blog', async (req, res) => {
  try {
    const rows = await db.select().from(blogPosts);
    const parsed = rows.map(row => ({
      ...row,
      tags: JSON.parse(row.tags),
    }));
    res.json(parsed);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.post('/api/blog', requireAuth, requireRole(['admin', 'manager', 'editor']), async (req, res) => {
  try {
    const { id, title, titleAr, excerpt, excerptAr, content, contentAr, category, categoryAr, author, authorAr, date, readTime, readTimeAr, image, tags } = req.body;
    
    const dbPayload = {
      title,
      titleAr,
      excerpt,
      excerptAr,
      content,
      contentAr,
      category,
      categoryAr,
      author,
      authorAr,
      date,
      readTime,
      readTimeAr,
      image,
      tags: JSON.stringify(tags || []),
    };

    const existing = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    if (existing.length > 0) {
      const updated = await db.update(blogPosts)
        .set(dbPayload)
        .where(eq(blogPosts.id, id))
        .returning();
      res.json(updated[0]);
    } else {
      const inserted = await db.insert(blogPosts)
        .values({ id, ...dbPayload })
        .returning();
      res.json(inserted[0]);
    }
  } catch (error) {
    console.error('Error saving blog post:', error);
    res.status(500).json({ error: 'Failed to save blog post' });
  }
});

app.delete('/api/blog/:id', requireAuth, requireRole(['admin', 'manager', 'editor']), async (req, res) => {
  try {
    await db.delete(blogPosts).where(eq(blogPosts.id, req.params.id));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

// Testimonials CRUD
app.get('/api/testimonials', async (req, res) => {
  try {
    const rows = await db.select().from(testimonials);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.post('/api/testimonials', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { id, name, nameAr, role, roleAr, company, companyAr, content, contentAr, rating, avatar, isFeatured } = req.body;
    
    const dbPayload = {
      name,
      nameAr,
      role,
      roleAr,
      company,
      companyAr,
      content,
      contentAr,
      rating: Number(rating || 5),
      avatar,
      isFeatured: isFeatured !== false,
    };

    const existing = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1);
    if (existing.length > 0) {
      const updated = await db.update(testimonials)
        .set(dbPayload)
        .where(eq(testimonials.id, id))
        .returning();
      res.json(updated[0]);
    } else {
      const inserted = await db.insert(testimonials)
        .values({ id, ...dbPayload })
        .returning();
      res.json(inserted[0]);
    }
  } catch (error) {
    console.error('Error saving testimonial:', error);
    res.status(500).json({ error: 'Failed to save testimonial' });
  }
});

app.delete('/api/testimonials/:id', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    await db.delete(testimonials).where(eq(testimonials.id, req.params.id));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

// Quotes CRUD (CRM Quotation Requests)
app.get('/api/quotes', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const rows = await db.select().from(quotes).orderBy(desc(quotes.createdAt));
    const mapped = rows.map(row => ({
      ...row,
      description: row.message,
      date: row.createdAt,
    }));
    res.json(mapped);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.post('/api/quotes', publicWriteLimiter, async (req, res) => {
  try {
    const { name, email, phone, city, projectType, serviceId, dimensions, message, description, budget } = req.body;
    const id = `Q-${Date.now().toString().slice(-6)}`;
    const combinedMessage = [
      city ? `Location: ${city}` : null,
      description || message || ''
    ].filter(Boolean).join('\n\n');
    
    const inserted = await db.insert(quotes)
      .values({
        id,
        name,
        email,
        phone,
        projectType,
        serviceId: serviceId || null,
        dimensions: dimensions || null,
        message: combinedMessage,
        budget: budget || null,
        status: 'pending',
      })
      .returning();

    res.json(inserted[0]);
  } catch (error) {
    console.error('Error submitting quotation request:', error);
    res.status(500).json({ error: 'Failed to submit quotation request' });
  }
});

// Admin reply/update quote
app.put('/api/quotes/:id', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { status, responseMessage } = req.body;
    const updated = await db.update(quotes)
      .set({ status, responseMessage })
      .where(eq(quotes.id, req.params.id))
      .returning();
    res.json(updated[0]);
  } catch (error) {
    console.error('Error updating quote:', error);
    res.status(500).json({ error: 'Failed to update quotation' });
  }
});

// Contact Messages CRUD (CRM Inbox)
app.get('/api/messages', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const rows = await db.select().from(messages).orderBy(desc(messages.createdAt));
    res.json(rows);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.post('/api/messages', publicWriteLimiter, async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const id = `MSG-${Date.now().toString().slice(-6)}`;
    
    const inserted = await db.insert(messages)
      .values({
        id,
        name,
        email,
        message,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        status: 'unread',
      })
      .returning();

    res.json(inserted[0]);
  } catch (error) {
    console.error('Error submitting message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.put('/api/messages/:id', requireAuth, requireRole(['admin', 'manager', 'editor']), async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await db.update(messages)
      .set({ status })
      .where(eq(messages.id, req.params.id))
      .returning();
    res.json(updated[0]);
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ error: 'Failed to update message status' });
  }
});

app.delete('/api/messages/:id', requireAuth, requireRole(['admin', 'manager', 'editor']), async (req, res) => {
  try {
    await db.delete(messages).where(eq(messages.id, req.params.id));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// Media Library and Uploads
app.get('/api/media', requireAuth, requireRole(['admin', 'manager', 'editor']), async (req, res) => {
  try {
    const rows = await db.select().from(media).orderBy(desc(media.createdAt));
    res.json(rows);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.post('/api/media/upload', requireAuth, requireRole(['admin', 'manager', 'editor']), (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      // Multer errors (file too large) and our custom fileFilter errors both land here.
      return res.status(400).json({ error: err.message || 'File upload rejected' });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Process upload (either Supabase or Local Fallback)
    const uploadResult = await uploadFileToStorage(req.file);

    // Save details into 'media' table
    const inserted = await db.insert(media)
      .values({
        name: uploadResult.name,
        url: uploadResult.url,
        size: uploadResult.size,
        mimeType: uploadResult.mimeType,
      })
      .returning();

    res.json(inserted[0]);
  } catch (error) {
    console.error('File upload route error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

// -----------------------------------------------------------------------------
// VITE OR STATIC FRONTEND SERVING
// -----------------------------------------------------------------------------

async function startServer() {
  // Check and run auto-seeding
  await seedDatabase();

  if (process.env.NODE_ENV !== 'production') {
    // Development mode: integration with Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built static files
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
