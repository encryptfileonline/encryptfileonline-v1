import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminStore } from '@/hooks/useAdminStore';
import { DashboardTab } from '@/components/admin/DashboardTab';
import { LogsTab } from '@/components/admin/LogsTab';
import { SystemHealthTab } from '@/components/admin/SystemHealthTab';
import { LogOut, LayoutDashboard, FileText, HeartPulse } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import { useTheme } from '@/hooks/use-theme';
export function AdminPage() {
  const navigate = useNavigate();
  const logout = useAdminStore((state) => state.logout);
  const { isDark } = useTheme();
  const handleLogout = () => {
    logout();
    navigate('/eiahtaadmin/login');
  };
  return (
    <div className="min-h-screen bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <div className="ml-auto flex items-center gap-4">
          <ThemeToggle className="relative top-0 right-0" />
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>
      <main className="p-4 sm:px-6 sm:py-0">
        <Tabs defaultValue="dashboard">
          <TabsList>
            <TabsTrigger value="dashboard"><LayoutDashboard className="h-4 w-4 mr-2" />Dashboard</TabsTrigger>
            <TabsTrigger value="logs"><FileText className="h-4 w-4 mr-2" />Logs</TabsTrigger>
            <TabsTrigger value="system-health"><HeartPulse className="h-4 w-4 mr-2" />System Health</TabsTrigger>
          </TabsList>
          <div className="py-6">
            <TabsContent value="dashboard">
              <DashboardTab />
            </TabsContent>
            <TabsContent value="logs">
              <LogsTab />
            </TabsContent>
            <TabsContent value="system-health">
              <SystemHealthTab />
            </TabsContent>
          </div>
        </Tabs>
      </main>
      <Toaster richColors closeButton theme={isDark ? 'dark' : 'light'} />
    </div>
  );
}