/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { AuthForm } from './components/auth/AuthForm';
import { Dashboard } from './components/dashboard/Dashboard';
import { LandingPage } from './components/landing/LandingPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deep-black">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-neon-green mx-auto mb-4" />
          <p className="text-slate-400 font-medium">Iniciando CashLabs AI...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      {user ? (
        <Dashboard />
      ) : showAuth ? (
        <AuthForm />
      ) : (
        <LandingPage onGetStarted={() => setShowAuth(true)} />
      )}
      <Toaster position="top-center" richColors theme="dark" />
    </ErrorBoundary>
  );
}
