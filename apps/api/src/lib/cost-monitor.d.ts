/**
 * Cost Monitor Instance (Disabled)
 */
export declare const costMonitor: {
    initialize: () => Promise<void>;
    cleanup: () => Promise<void>;
    recordApiCall: () => void;
    recordVideoGeneration: () => void;
    getUsageStats: () => Promise<{
        total: number;
        api: number;
        video: number;
        details: any[];
    }>;
    getCosts: () => Promise<{
        total: number;
        breakdown: {};
    }>;
};
//# sourceMappingURL=cost-monitor.d.ts.map