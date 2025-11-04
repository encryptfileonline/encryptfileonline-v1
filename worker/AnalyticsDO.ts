import { Hono } from 'hono';
interface Log {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
}
interface Stats {
  totalOperations: number;
  encryptions: number;
  decryptions: number;
  totalBytesProcessed: number;
}
export class AnalyticsDO {
  state: DurableObjectState;
  env: unknown;
  app: Hono;
  startTime: number;
  constructor(state: DurableObjectState, env: unknown) {
    this.state = state;
    this.env = env;
    this.startTime = Date.now();
    this.app = new Hono();
    // Define routes for the DO to handle
    this.app.post('/api/log', async (c) => {
      const { type, fileSize } = await c.req.json<{ type: 'encrypt' | 'decrypt', fileSize: number }>();
      await this.logEvent(type, fileSize);
      return c.json({ success: true });
    });
    this.app.get('/api/admin/stats', async (c) => {
      const stats = await this.getStats();
      return c.json({ success: true, data: stats });
    });
    this.app.get('/api/admin/logs', async (c) => {
      const logs = await this.getLogs();
      return c.json({ success: true, data: logs });
    });
    this.app.get('/api/admin/health', async (c) => {
      const health = await this.getHealth();
      return c.json({ success: true, data: health });
    });
  }
  async fetch(request: Request) {
    // The ExecutionContext for a DO's fetch is implicitly handled by the runtime.
    // Hono's fetch can accept a context object that implements `waitUntil`.
    // `this.state` provides `waitUntil`, so we can pass it as the context.
    return this.app.fetch(request, this.env, this.state);
  }
  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  async logEvent(type: 'encrypt' | 'decrypt', fileSize: number) {
    const stats: Stats = (await this.state.storage.get('stats')) || {
      totalOperations: 0,
      encryptions: 0,
      decryptions: 0,
      totalBytesProcessed: 0,
    };
    const logs: Log[] = (await this.state.storage.get('logs')) || [];
    stats.totalOperations++;
    stats.totalBytesProcessed += fileSize;
    if (type === 'encrypt') {
      stats.encryptions++;
    } else {
      stats.decryptions++;
    }
    const newLog: Log = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message: `User ${type}ed a file (${this.formatBytes(fileSize)}).`,
    };
    // Keep logs to a reasonable size, e.g., last 100 entries
    const updatedLogs = [newLog, ...logs].slice(0, 100);
    await this.state.storage.put('stats', stats);
    await this.state.storage.put('logs', updatedLogs);
  }
  async getStats() {
    const stats: Stats = (await this.state.storage.get('stats')) || {
      totalOperations: 0,
      encryptions: 0,
      decryptions: 0,
      totalBytesProcessed: 0,
    };
    const avgFileSize = stats.totalOperations > 0
      ? (stats.totalBytesProcessed / stats.totalOperations)
      : 0;
    return {
      totalOperations: stats.totalOperations,
      encryptions: stats.encryptions,
      decryptions: stats.decryptions,
      avgFileSize: this.formatBytes(avgFileSize),
    };
  }
  async getLogs() {
    const logs: Log[] = (await this.state.storage.get('logs')) || [];
    return logs;
  }
  async getHealth() {
    const uptimeMilliseconds = Date.now() - this.startTime;
    const uptimeSeconds = Math.floor(uptimeMilliseconds / 1000);
    const uptimeMinutes = Math.floor(uptimeSeconds / 60);
    const uptimeHours = Math.floor(uptimeMinutes / 60);
    const uptimeDays = Math.floor(uptimeHours / 24);
    return {
      workerStatus: 'Operational',
      uptime: `${uptimeDays}d ${uptimeHours % 24}h ${uptimeMinutes % 60}m`,
      lastDeployment: 'N/A', // This would require build-time info
      avgApiLatency: 'N/A', // This would require more complex instrumentation
    };
  }
}