import { Hono } from "hono";
import { Env } from './core-utils';
const adminRoutes = new Hono<{ Bindings: Env }>();
const getDO = (c: any) => {
  const id = c.env.ANALYTICS_DO.idFromName("v1-analytics");
  return c.env.ANALYTICS_DO.get(id);
}
// --- API Routes ---
// Ping for session status
adminRoutes.get('/api/admin/ping', (c) => {
  return c.json({ success: true, data: { status: 'pong' } });
});
// Get dashboard stats
adminRoutes.get('/api/admin/stats', async (c) => {
  const analyticsDO = getDO(c);
  const resp = await analyticsDO.fetch(new Request('http://do/stats', c.req.raw));
  return resp;
});
// Get logs
adminRoutes.get('/api/admin/logs', async (c) => {
  const analyticsDO = getDO(c);
  const resp = await analyticsDO.fetch(new Request('http://do/logs', c.req.raw));
  return resp;
});
// Get system health
adminRoutes.get('/api/admin/health', async (c) => {
  const analyticsDO = getDO(c);
  const resp = await analyticsDO.fetch(new Request('http://do/health', c.req.raw));
  return resp;
});
export { adminRoutes };