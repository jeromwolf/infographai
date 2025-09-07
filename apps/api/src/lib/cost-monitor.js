"use strict";
/**
 * Cost Monitor Instance
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.costMonitor = void 0;
const cost_monitor_1 = require("@infographai/cost-monitor");
// Create a single instance of CostMonitor
const globalForCostMonitor = globalThis;
exports.costMonitor = globalForCostMonitor.costMonitor ?? new cost_monitor_1.CostMonitor();
if (process.env.NODE_ENV !== 'production') {
    globalForCostMonitor.costMonitor = exports.costMonitor;
}
// Initialize the cost monitor if not already initialized
(async () => {
    try {
        await exports.costMonitor.initialize();
    }
    catch (error) {
        console.error('Failed to initialize cost monitor:', error);
    }
})();
