import { Hono } from "hono";
import { Env } from './core-utils';
import { adminRoutes } from './adminRoutes';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // Add more routes like this. **DO NOT MODIFY CORS OR OVERRIDE ERROR HANDLERS**
    app.get('/api/test', (c) => c.json({ success: true, data: { name: 'this works' }}));
    // Register admin routes
    app.route('/', adminRoutes);
    // Add new route for logging events
    app.post('/api/log', async (c) => {
      const id = c.env.ANALYTICS_DO.idFromName("v1-analytics");
      const analyticsDO = c.env.ANALYTICS_DO.get(id);
      const resp = await analyticsDO.fetch(new Request(c.req.url, c.req.raw));
      return resp;
    });
}