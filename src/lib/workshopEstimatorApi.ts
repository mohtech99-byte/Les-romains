import { WorkshopModule, WorkshopEstimateResult } from '../types';

/**
 * Calls the secure server-side calculate endpoint. The client sends only
 * raw job inputs (material, dimensions, quantity, options...) — never any
 * rate, cost, waste %, or margin. The server computes everything against
 * the private workshop_pricing table and returns just the final price.
 */
export async function calculateWorkshopEstimate(
  module: WorkshopModule,
  inputs: Record<string, any>
): Promise<WorkshopEstimateResult> {
  const res = await fetch('/api/workshop-estimator/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ module, inputs }),
  });
  if (!res.ok) throw new Error('Failed to calculate estimate');
  return res.json();
}
