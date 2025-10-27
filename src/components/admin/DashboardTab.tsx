import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, FileText, HardDrive, BarChart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
interface Stats {
  totalOperations: number;
  avgFileSize: string;
  encryptions: number;
  decryptions: number;
}
export function DashboardTab() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [pingStatus, setPingStatus] = useState<'online' | 'offline'>('offline');
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    const pingInterval = setInterval(async () => {
      try {
        const res = await fetch('/api/admin/ping');
        if (res.ok) {
          setPingStatus('online');
        } else {
          setPingStatus('offline');
        }
      } catch (error) {
        setPingStatus('offline');
      }
    }, 5000);
    return () => clearInterval(pingInterval);
  }, []);
  const renderStatCard = (title: string, value: string | number | undefined, icon: React.ReactNode) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="text-2xl font-bold">{value ?? 'N/A'}</div>
        )}
      </CardContent>
    </Card>
  );
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Dashboard Overview</h2>
        <div className="flex items-center gap-2">
          <span className={`h-3 w-3 rounded-full ${pingStatus === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="text-sm text-muted-foreground">
            API Status: <span className="font-semibold">{pingStatus}</span>
          </span>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {renderStatCard('Total Operations', stats?.totalOperations, <Activity className="h-4 w-4 text-muted-foreground" />)}
        {renderStatCard('Encryptions', stats?.encryptions, <FileText className="h-4 w-4 text-muted-foreground" />)}
        {renderStatCard('Decryptions', stats?.decryptions, <FileText className="h-4 w-4 text-muted-foreground" />)}
        {renderStatCard('Avg. File Size', stats?.avgFileSize, <HardDrive className="h-4 w-4 text-muted-foreground" />)}
      </div>
    </div>
  );
}