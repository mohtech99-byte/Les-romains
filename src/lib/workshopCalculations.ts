/**
 * Workshop Estimator — pricing engine.
 *
 * Pure calculation functions only. No React, no UI. Every function takes
 * plain inputs plus a `rates` lookup (built from WorkshopPricingItem[] via
 * `buildRateMap`) and returns a plain cost breakdown object. This keeps the
 * business logic testable and fully decoupled from how it's rendered.
 */
import { WorkshopPricingItem } from '../types';

export type RateMap = Record<string, number>;

/** Turns the flat WorkshopPricingItem[] list into a { KEY: value } lookup. */
export function buildRateMap(items: WorkshopPricingItem[]): RateMap {
  const map: RateMap = {};
  for (const item of items) {
    if (item.isActive) map[item.key] = item.value;
  }
  return map;
}

export function rate(rates: RateMap, key: string, fallback = 0): number {
  return typeof rates[key] === 'number' ? rates[key] : fallback;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

// ---------------------------------------------------------------------------
// Module 1 — Sheet Materials Calculator
// ---------------------------------------------------------------------------
export interface SheetInputs {
  materialKey: string;   // e.g. 'PMMA_3MM'
  lengthCm: number;
  widthCm: number;
  quantity: number;
  wastePct: number;      // overrides DEFAULT_WASTE if provided
  cuttingCost: number;   // flat DZD for this job
  edgeBand: boolean;
  edgeMeterPrice?: number; // overrides EDGE_BAND rate if provided
  marginPct: number;     // overrides DEFAULT_MARGIN if provided
}
export interface SheetResult {
  areaM2: number;
  materialCost: number;
  edgeCost: number;
  cuttingCost: number;
  manufacturingCost: number;
  sellingPrice: number;
  profit: number;
}
export function calcSheet(inputs: SheetInputs, rates: RateMap): SheetResult {
  const areaSingle = (inputs.lengthCm / 100) * (inputs.widthCm / 100);
  const areaM2 = areaSingle * Math.max(inputs.quantity, 0);
  const waste = (inputs.wastePct ?? rate(rates, 'DEFAULT_WASTE', 8)) / 100;
  const materialUnitPrice = rate(rates, inputs.materialKey);
  const materialCost = areaM2 * materialUnitPrice * (1 + waste);

  const perimeterSingle = 2 * ((inputs.lengthCm + inputs.widthCm) / 100);
  const edgePrice = inputs.edgeMeterPrice ?? rate(rates, 'EDGE_BAND');
  const edgeCost = inputs.edgeBand ? perimeterSingle * Math.max(inputs.quantity, 0) * edgePrice : 0;

  const cuttingCost = inputs.cuttingCost || 0;
  const manufacturingCost = materialCost + edgeCost + cuttingCost;
  const margin = (inputs.marginPct ?? rate(rates, 'DEFAULT_MARGIN', 25)) / 100;
  const sellingPrice = manufacturingCost * (1 + margin);
  const profit = sellingPrice - manufacturingCost;

  return {
    areaM2: round2(areaM2),
    materialCost: round2(materialCost),
    edgeCost: round2(edgeCost),
    cuttingCost: round2(cuttingCost),
    manufacturingCost: round2(manufacturingCost),
    sellingPrice: round2(sellingPrice),
    profit: round2(profit),
  };
}

// ---------------------------------------------------------------------------
// Module 2 — Acrylic Letters Calculator
// ---------------------------------------------------------------------------
export interface LettersInputs {
  letterHeightCm: number;
  materialKey: string;
  quantity: number;
  lighting: 'none' | 'front' | 'back' | 'halo';
  installationFlat: number; // flat DZD for install, 0 if not needed
  marginPct: number;
}
export interface LettersResult {
  manufacturingCost: number;
  sellingPrice: number;
  profit: number;
}
const LIGHTING_COST_PER_LETTER: Record<LettersInputs['lighting'], number> = {
  none: 0, front: 1800, back: 2200, halo: 2800,
};
export function calcLetters(inputs: LettersInputs, rates: RateMap): LettersResult {
  // Rough face-area proxy per letter, scaled by height (cm) — taller letters
  // use proportionally more material and labor.
  const faceAreaM2 = (inputs.letterHeightCm / 100) * 0.35;
  const materialUnitPrice = rate(rates, inputs.materialKey);
  const perLetterMaterial = faceAreaM2 * materialUnitPrice * 1.6; // face + return + assembly factor
  const perLetterLighting = LIGHTING_COST_PER_LETTER[inputs.lighting];
  const qty = Math.max(inputs.quantity, 0);

  const manufacturingCost = (perLetterMaterial + perLetterLighting) * qty + (inputs.installationFlat || 0);
  const margin = (inputs.marginPct ?? rate(rates, 'DEFAULT_MARGIN', 25)) / 100;
  const sellingPrice = manufacturingCost * (1 + margin);

  return {
    manufacturingCost: round2(manufacturingCost),
    sellingPrice: round2(sellingPrice),
    profit: round2(sellingPrice - manufacturingCost),
  };
}

// ---------------------------------------------------------------------------
// Module 3 — Alucobond Calculator
// ---------------------------------------------------------------------------
export interface AlucobondInputs {
  materialKey: string; // ALUCOBOND_3MM / ALUCOBOND_4MM
  lengthCm: number;
  widthCm: number;
  panelsQuantity: number;
  cutting: boolean;
  routing: boolean;
  folding: boolean;
  installation: boolean;
  installHours: number;
  marginPct: number;
}
export interface AlucobondResult {
  areaM2: number;
  materialCost: number;
  manufacturingCost: number;
  sellingPrice: number;
  profit: number;
}
const FOLDING_COST_PER_PANEL = 400;
export function calcAlucobond(inputs: AlucobondInputs, rates: RateMap): AlucobondResult {
  const areaSingle = (inputs.lengthCm / 100) * (inputs.widthCm / 100);
  const qty = Math.max(inputs.panelsQuantity, 0);
  const areaM2 = areaSingle * qty;

  const materialCost = areaM2 * rate(rates, inputs.materialKey);
  const cuttingCost = inputs.cutting ? areaM2 * rate(rates, 'LASER_METER', 0) * 2 : 0;
  const routingCost = inputs.routing ? areaM2 * rate(rates, 'ROUTING_M2') : 0;
  const foldingCost = inputs.folding ? qty * FOLDING_COST_PER_PANEL : 0;
  const installCost = inputs.installation ? inputs.installHours * rate(rates, 'INSTALL_WORKER_HOUR') : 0;

  const manufacturingCost = materialCost + cuttingCost + routingCost + foldingCost + installCost;
  const margin = (inputs.marginPct ?? rate(rates, 'DEFAULT_MARGIN', 25)) / 100;
  const sellingPrice = manufacturingCost * (1 + margin);

  return {
    areaM2: round2(areaM2),
    materialCost: round2(materialCost),
    manufacturingCost: round2(manufacturingCost),
    sellingPrice: round2(sellingPrice),
    profit: round2(sellingPrice - manufacturingCost),
  };
}

// ---------------------------------------------------------------------------
// Module 4 — Painting Calculator
// ---------------------------------------------------------------------------
export interface PaintingInputs {
  paintKey: string;
  areaM2: number;
  coats: number;
  primer: boolean;
  sanding: boolean;
  clearCoat: boolean;
  laborCost: number;
  marginPct: number;
}
export interface PaintingResult {
  paintConsumptionM2: number;
  materialCost: number;
  laborCost: number;
  totalCost: number;
  sellingPrice: number;
  profit: number;
}
const PRIMER_COST_PER_M2 = 350;
const SANDING_COST_PER_M2 = 200;
const CLEAR_COAT_COST_PER_M2 = 450;
export function calcPainting(inputs: PaintingInputs, rates: RateMap): PaintingResult {
  const area = Math.max(inputs.areaM2, 0);
  const coats = Math.max(inputs.coats, 1);
  const paintConsumptionM2 = area * coats;

  const paintUnitPrice = rate(rates, inputs.paintKey);
  let materialCost = paintConsumptionM2 * paintUnitPrice;
  if (inputs.primer) materialCost += area * PRIMER_COST_PER_M2;
  if (inputs.sanding) materialCost += area * SANDING_COST_PER_M2;
  if (inputs.clearCoat) materialCost += area * CLEAR_COAT_COST_PER_M2;

  const laborCost = inputs.laborCost || 0;
  const totalCost = materialCost + laborCost;
  const margin = (inputs.marginPct ?? rate(rates, 'DEFAULT_MARGIN', 25)) / 100;
  const sellingPrice = totalCost * (1 + margin);

  return {
    paintConsumptionM2: round2(paintConsumptionM2),
    materialCost: round2(materialCost),
    laborCost: round2(laborCost),
    totalCost: round2(totalCost),
    sellingPrice: round2(sellingPrice),
    profit: round2(sellingPrice - totalCost),
  };
}

// ---------------------------------------------------------------------------
// Module 5 — Laser Cutting Calculator
// ---------------------------------------------------------------------------
export interface LaserInputs {
  materialKey: string;
  cutLengthM: number;
  machineHours: number;
  powerSurcharge: number; // flat DZD, e.g. higher power/thicker material surcharge
  marginPct: number;
}
export interface LaserResult {
  machineCost: number;
  materialCost: number;
  manufacturingCost: number;
  sellingPrice: number;
  profit: number;
}
export function calcLaser(inputs: LaserInputs, rates: RateMap): LaserResult {
  const machineCost = inputs.machineHours * rate(rates, 'LASER_HOUR') + inputs.cutLengthM * rate(rates, 'LASER_METER');
  const materialCost = rate(rates, inputs.materialKey) * 0; // materials priced by sheet in Module 1; laser job assumed on customer-supplied or pre-costed sheet
  const manufacturingCost = machineCost + materialCost + (inputs.powerSurcharge || 0);
  const margin = (inputs.marginPct ?? rate(rates, 'DEFAULT_MARGIN', 25)) / 100;
  const sellingPrice = manufacturingCost * (1 + margin);

  return {
    machineCost: round2(machineCost),
    materialCost: round2(materialCost),
    manufacturingCost: round2(manufacturingCost),
    sellingPrice: round2(sellingPrice),
    profit: round2(sellingPrice - manufacturingCost),
  };
}

// ---------------------------------------------------------------------------
// Module 6 — CNC Routing Calculator
// ---------------------------------------------------------------------------
export interface RoutingInputs {
  materialKey: string;
  machiningAreaM2: number;
  machineHours: number;
  toolChanges: number;
  marginPct: number;
}
export interface RoutingResult {
  routingCost: number;
  materialCost: number;
  manufacturingCost: number;
  sellingPrice: number;
  profit: number;
}
export function calcRouting(inputs: RoutingInputs, rates: RateMap): RoutingResult {
  const routingCost = inputs.machineHours * rate(rates, 'ROUTING_HOUR')
    + inputs.machiningAreaM2 * rate(rates, 'ROUTING_M2')
    + inputs.toolChanges * rate(rates, 'TOOL_CHANGE');
  const materialCost = rate(rates, inputs.materialKey) * inputs.machiningAreaM2;
  const manufacturingCost = routingCost + materialCost;
  const margin = (inputs.marginPct ?? rate(rates, 'DEFAULT_MARGIN', 25)) / 100;
  const sellingPrice = manufacturingCost * (1 + margin);

  return {
    routingCost: round2(routingCost),
    materialCost: round2(materialCost),
    manufacturingCost: round2(manufacturingCost),
    sellingPrice: round2(sellingPrice),
    profit: round2(sellingPrice - manufacturingCost),
  };
}

// ---------------------------------------------------------------------------
// Module 7 — Installation Calculator
// ---------------------------------------------------------------------------
export interface InstallationInputs {
  workers: number;
  hours: number;
  travelDistanceKm: number;
  installationType: string; // free-text descriptor, cost-neutral
  scaffolding: boolean;
  scaffoldingDays: number;
  marginPct: number;
}
export interface InstallationResult {
  laborCost: number;
  transportationCost: number;
  manufacturingCost: number;
  sellingPrice: number;
  profit: number;
}
export function calcInstallation(inputs: InstallationInputs, rates: RateMap): InstallationResult {
  const laborCost = inputs.workers * inputs.hours * rate(rates, 'INSTALL_WORKER_HOUR')
    + (inputs.scaffolding ? inputs.scaffoldingDays * rate(rates, 'SCAFFOLDING') : 0);
  const transportationCost = inputs.travelDistanceKm * 2 * rate(rates, 'TRANSPORT_KM'); // round trip
  const manufacturingCost = laborCost + transportationCost;
  const margin = (inputs.marginPct ?? rate(rates, 'DEFAULT_MARGIN', 25)) / 100;
  const sellingPrice = manufacturingCost * (1 + margin);

  return {
    laborCost: round2(laborCost),
    transportationCost: round2(transportationCost),
    manufacturingCost: round2(manufacturingCost),
    sellingPrice: round2(sellingPrice),
    profit: round2(sellingPrice - manufacturingCost),
  };
}
