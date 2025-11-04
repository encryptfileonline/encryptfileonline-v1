import { Hono } from "hono";
import { Env } from './core-utils';
import { adminRoutes } from './adminRoutes';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // Add more routes like this. **DO NOT MODIFY CORS OR OVERRIDE ERROR HANDLERS**
    app.get('/api/test', (c) => c.json({ success: true, data: { name: 'this works' }}));
    // Register admin routes
    app.route('/', adminRoutes);
}