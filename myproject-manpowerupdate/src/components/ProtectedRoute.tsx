import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '@/lib/auth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'allowed' | 'denied'>('loading');

  useEffect(() => {
    isLoggedIn().then((loggedIn) => setStatus(loggedIn ? 'allowed' : 'denied'));
  }, []);

  if (status === 'loading') return <div className="min-h-screen bg-slate-100" />;
  if (status === 'denied') return <Navigate to="/admin" replace />;
  return <>{children}</>;
}
