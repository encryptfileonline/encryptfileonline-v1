import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Server, Cpu, Clock } from 'lucide-react';
import { toast } from 'sonner';
interface HealthStatus {
  workerStatus: string;
  uptime: string;
  lastDeployment: string;
  avgApiLatency: string;
}
export function SystemHealthTab() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchHealth = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/health');
        if (!response.ok) throw new Error('Failed to fetch health status');
        const data = await response.json();
        setHealth(data.data);
      } catch (error) {
        console.error('Error fetching system health:', error);
        toast.error('Failed to fetch system health.');
      } finally {
        setLoading(false);
      }
    };
    fetchHealth();
  }, []);
  const renderHealthCard = (title: string, value: string | undefined, icon: React.ReactNode) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-lg font-medium">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-7 w-48" />
        ) : (
          <p className="text-2xl font-semibold">{value ?? 'N/A'}</p>
        )}
      </CardContent>
    </Card>
  );
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">System Health</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {renderHealthCard('Worker Status', health?.workerStatus, <Server className="h-6 w-6 text-primary" />)}
        {renderHealthCard('Uptime', health?.uptime, <Clock className="h-6 w-6 text-primary" />)}
        {renderHealthCard('Avg. API Latency', health?.avgApiLatency, <Cpu className="h-6 w-6 text-primary" />)}
        {renderHealthCard('Last Deployment', health?.lastDeployment, <Server className="h-6 w-6 text-primary" />)}
      </div>
    </div>
  );
}