/**
 * Cost Monitor Instance
 */

import { CostMonitor } from '@infographai/cost-monitor';

// Create a single instance of CostMonitor
const globalForCostMonitor = globalThis as unknown as {
  costMonitor: CostMonitor | undefined;
};

export const costMonitor = globalForCostMonitor.costMonitor ?? new CostMonitor();

if (process.env.NODE_ENV !== 'production') {
  globalForCostMonitor.costMonitor = costMonitor;
}

// Initialize the cost monitor if not already initialized
(async () => {
  try {
    await costMonitor.initialize();
  } catch (error) {
    console.error('Failed to initialize cost monitor:', error);
  }
})();