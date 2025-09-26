import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { HelmetProvider } from 'react-helmet-async';

// Pages
import Index from '@/pages/Index';
import AuthPage from '@/pages/AuthPage';
import DatabaseHealthPage from '@/pages/DatabaseHealthPage';
import SecurityAuditPage from '@/pages/SecurityAuditPage';
import TestRoute from '@/pages/TestRoute';
import NotFound from '@/pages/NotFound';

// Components
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import { SecurityProvider } from '@/components/SecurityProvider';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminDashboard from '@/components/admin/AdminDashboard';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <SecurityProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Header user={user} />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/admin-login" element={<AuthPage />} />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/security" element={
                  <ProtectedRoute>
                    <SecurityAuditPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/database-health" element={
                  <ProtectedRoute>
                    <DatabaseHealthPage />
                  </ProtectedRoute>
                } />
                <Route path="/health" element={
                  <ProtectedRoute>
                    <DatabaseHealthPage />
                  </ProtectedRoute>
                } />
                <Route path="/security" element={
                  <ProtectedRoute>
                    <SecurityAuditPage />
                  </ProtectedRoute>
                } />
                <Route path="/test" element={<TestRoute />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <CookieConsent />
            <Toaster />
          </div>
        </Router>
      </SecurityProvider>
    </HelmetProvider>
  );
}

export default App;