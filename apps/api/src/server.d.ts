/**
 * Express API Server
 * InfoGraphAI Backend
 */
import { prisma } from './lib/database';
import { costMonitor } from './lib/cost-monitor';
declare const app: import("express-serve-static-core").Express;
export { app, prisma, costMonitor };
//# sourceMappingURL=server.d.ts.map