"use strict";
/**
 * Cost Monitor Instance (Disabled)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.costMonitor = void 0;
// Placeholder cost monitor to avoid module errors
exports.costMonitor = {
    initialize: async () => {
        console.log('Cost monitor disabled');
        return Promise.resolve();
    },
    cleanup: async () => {
        console.log('Cost monitor cleanup');
        return Promise.resolve();
    },
    recordApiCall: () => { },
    recordVideoGeneration: () => { },
    getUsageStats: async () => ({
        total: 0,
        api: 0,
        video: 0,
        details: []
    }),
    getCosts: async () => ({
        total: 0,
        breakdown: {}
    })
};
