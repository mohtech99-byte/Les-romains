import { WorkshopPricingItem } from '../types';

// Workshop Estimator seed data — INTERNAL ONLY.
// This file must NEVER be imported by any client-side (browser-bundled) code.
// It is imported exclusively by server.ts for one-time database seeding.
// Keeping it physically separate from initialData.ts (which AppContext.tsx
// imports) guarantees these prices/margins can never leak into the public
// JS bundle, regardless of bundler tree-shaking behavior.

// -----------------------------------------------------------------------------
// Workshop Estimator seed data (internal-only module, separate from the
// public Quote Estimator's pricingFactors above)
// -----------------------------------------------------------------------------

let wpSort = 0;
const wp = (
  group: WorkshopPricingItem['group'],
  key: string,
  label: string,
  labelAr: string,
  value: number,
  unit: string,
  meta?: string
): WorkshopPricingItem => ({
  id: `WP-${String(++wpSort).padStart(3, '0')}`,
  group, key, label, labelAr, value, unit, meta,
  isActive: true,
  sortOrder: wpSort
});

export const initialWorkshopPricing: WorkshopPricingItem[] = [
  // Materials (price per m²)
  wp('material', 'FOREX_3MM', 'Forex 3mm', 'فوركس 3مم', 1400, 'دج/م²', '3mm'),
  wp('material', 'FOREX_5MM', 'Forex 5mm', 'فوركس 5مم', 2000, 'دج/م²', '5mm'),
  wp('material', 'FOREX_10MM', 'Forex 10mm', 'فوركس 10مم', 3400, 'دج/م²', '10mm'),
  wp('material', 'PMMA_2MM', 'PMMA (Acrylic) 2mm', 'أكريليك 2مم', 2200, 'دج/م²', '2mm'),
  wp('material', 'PMMA_3MM', 'PMMA (Acrylic) 3mm', 'أكريليك 3مم', 3100, 'دج/م²', '3mm'),
  wp('material', 'PMMA_5MM', 'PMMA (Acrylic) 5mm', 'أكريليك 5مم', 4600, 'دج/م²', '5mm'),
  wp('material', 'PMMA_8MM', 'PMMA (Acrylic) 8mm', 'أكريليك 8مم', 6800, 'دج/م²', '8mm'),
  wp('material', 'PVC_3MM', 'PVC 3mm', 'PVC 3مم', 1600, 'دج/م²', '3mm'),
  wp('material', 'PVC_5MM', 'PVC 5mm', 'PVC 5مم', 2400, 'دج/م²', '5mm'),
  wp('material', 'PVC_8MM', 'PVC 8mm', 'PVC 8مم', 3600, 'دج/م²', '8mm'),
  wp('material', 'MDF_6MM', 'MDF 6mm', 'MDF 6مم', 1100, 'دج/م²', '6mm'),
  wp('material', 'MDF_9MM', 'MDF 9mm', 'MDF 9مم', 1500, 'دج/م²', '9mm'),
  wp('material', 'MDF_12MM', 'MDF 12mm', 'MDF 12مم', 1900, 'دج/م²', '12mm'),
  wp('material', 'MDF_18MM', 'MDF 18mm', 'MDF 18مم', 2600, 'دج/م²', '18mm'),
  wp('material', 'ALUCOBOND_3MM', 'Alucobond (ACP) 3mm', 'ألوكوبوند 3مم', 4200, 'دج/م²', '3mm'),
  wp('material', 'ALUCOBOND_4MM', 'Alucobond (ACP) 4mm', 'ألوكوبوند 4مم', 5100, 'دج/م²', '4mm'),

  // Paints (price per m² per coat)
  wp('paint', 'PU', 'Polyurethane', 'بولي يوريثان', 900, 'دج/م²/طبقة'),
  wp('paint', 'PU_GLOSS', 'PU Gloss', 'بولي يوريثان لامع', 1000, 'دج/م²/طبقة'),
  wp('paint', 'PU_MATTE', 'PU Matte', 'بولي يوريثان مطفي', 1000, 'دج/م²/طبقة'),
  wp('paint', 'NITRO', 'Nitro', 'نيترو', 700, 'دج/م²/طبقة'),
  wp('paint', 'ACRYLIC', 'Acrylic', 'أكريليك', 650, 'دج/م²/طبقة'),
  wp('paint', 'EPOXY', 'Epoxy', 'إيبوكسي', 1200, 'دج/م²/طبقة'),
  wp('paint', 'WOOD_STAIN', 'Wood Stain', 'صبغة خشب', 600, 'دج/م²/طبقة'),
  wp('paint', 'VARNISH', 'Varnish', 'ورنيش', 550, 'دج/م²/طبقة'),
  wp('paint', 'WATER_BASED', 'Water Based', 'أساس مائي', 500, 'دج/م²/طبقة'),

  // Edge band
  wp('edgeband', 'EDGE_BAND', 'Edge Band (Chant)', 'شريط حواف (شونط)', 120, 'دج/م.ط'),

  // Laser cutting
  wp('laser', 'LASER_HOUR', 'Laser Machine Hour', 'ساعة تشغيل الليزر', 2500, 'دج/ساعة'),
  wp('laser', 'LASER_METER', 'Laser Cut per Meter', 'قص الليزر لكل متر', 60, 'دج/م.ط'),

  // CNC routing
  wp('routing', 'ROUTING_HOUR', 'CNC Routing Hour', 'ساعة تفريز CNC', 3000, 'دج/ساعة'),
  wp('routing', 'ROUTING_M2', 'CNC Routing per m²', 'تفريز CNC لكل م²', 800, 'دج/م²'),
  wp('routing', 'TOOL_CHANGE', 'Tool Change Fee', 'رسم تغيير الأداة', 300, 'دج/تغيير'),

  // Labor
  wp('labor', 'LABOR_HOUR', 'Standard Labor Hour', 'ساعة عمل قياسية', 500, 'دج/ساعة'),

  // Installation
  wp('installation', 'INSTALL_WORKER_HOUR', 'Installer per Hour', 'عامل تركيب / ساعة', 600, 'دج/ساعة'),
  wp('installation', 'SCAFFOLDING', 'Scaffolding Fee', 'رسم السقالات', 4000, 'دج/يوم'),

  // Transport
  wp('transport', 'TRANSPORT_KM', 'Transport per KM', 'نقل لكل كم', 40, 'دج/كم'),

  // Margin & waste defaults
  wp('margin', 'DEFAULT_MARGIN', 'Default Profit Margin', 'هامش الربح الافتراضي', 25, '%'),
  wp('waste', 'DEFAULT_WASTE', 'Default Waste %', 'نسبة الهدر الافتراضية', 8, '%'),
];
