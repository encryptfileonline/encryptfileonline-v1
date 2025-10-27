import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminStore } from '@/hooks/useAdminStore';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import { useTheme } from '@/hooks/use-theme';
export function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const login = useAdminStore((state) => state.login);
  const { isDark } = useTheme();
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      toast.success('Login successful!');
      navigate('/eiahtaadmin');
    } else {
      toast.error('Access Denied', { description: 'Invalid username or password.' });
    }
  };
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen w-full bg-background p-4">
      <ThemeToggle className="absolute top-4 right-4 z-30" />
      <form onSubmit={handleLogin}>
        <Card className="w-full max-w-sm shadow-lg animate-scale-in">
          <CardHeader>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access the admin panel.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="eiahta"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Sign in</Button>
          </CardFooter>
        </Card>
      </form>
      <Toaster richColors closeButton theme={isDark ? 'dark' : 'light'} />
    </main>
  );
}