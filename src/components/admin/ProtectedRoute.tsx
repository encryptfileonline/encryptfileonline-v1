import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminStore } from '@/hooks/useAdminStore';
export function ProtectedRoute() {
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/eiahtaadmin/login" replace />;
  }
  return <Outlet />;
}