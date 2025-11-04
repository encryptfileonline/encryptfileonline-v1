import { Hono } from "hono";
import { Env } from './core-utils';
const adminRoutes = new Hono<{ Bindings: Env }>();
// Mock data
const mockStats = {
  totalOperations: 1345,
  avgFileSize: '2.3 MB',
  encryptions: 821,
  decryptions: 524,
};
const mockLogs = [
  { id: '1', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), level: 'INFO', message: 'User encrypted file.ext' },
  { id: '2', timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(), level: 'INFO', message: 'User decrypted file.ext.enc' },
  { id: '3', timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), level: 'WARN', message: 'Slow operation detected for large file (150MB).' },
  { id: '4', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), level: 'ERROR', message: 'Decryption failed for user: incorrect passphrase.' },
];
const mockHealth = {
  workerStatus: 'Operational',
  uptime: '99.99%',
  lastDeployment: new Date(Date.now() - 1000 * 60 * 60 * 3).toLocaleString(),
  avgApiLatency: '45ms',
};
// --- API Routes ---
// Ping for session status
adminRoutes.get('/api/admin/ping', (c) => {
  return c.json({ success: true, data: { status: 'pong' } });
});
// Get dashboard stats
adminRoutes.get('/api/admin/stats', (c) => {
  return c.json({ success: true, data: mockStats });
});
// Get logs
adminRoutes.get('/api/admin/logs', (c) => {
  return c.json({ success: true, data: mockLogs });
});
// Get system health
adminRoutes.get('/api/admin/health', (c) => {
  return c.json({ success: true, data: mockHealth });
});
export { adminRoutes };