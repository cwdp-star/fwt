import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { HelmetProvider } from 'react-helmet-async';
import { lazy, Suspense } from 'react';

// Pages
import Index from '@/pages/Index';
import ProjectDetails from '@/pages/ProjectDetails';
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
import { ScrollToTop } from '@/components/ScrollToTop';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load admin components
const AdminDashboard = lazy(() => import('@/components/admin/AdminDashboard'));

function App() {

  return (
    <HelmetProvider>
      <SecurityProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/projects/:id" element={<ProjectDetails />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/admin-login" element={<AuthPage />} />
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin>
                    <Suspense fallback={
                      <div className="container mx-auto px-4 py-8">
                        <Skeleton className="h-12 w-64 mb-8" />
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                          <Skeleton className="h-32" />
                          <Skeleton className="h-32" />
                          <Skeleton className="h-32" />
                          <Skeleton className="h-32" />
                        </div>
                        <Skeleton className="h-96" />
                      </div>
                    }>
                      <AdminDashboard />
                    </Suspense>
                  </ProtectedRoute>
                } />
                <Route path="/admin/security" element={
                  <ProtectedRoute requireAdmin>
                    <SecurityAuditPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/database-health" element={
                  <ProtectedRoute requireAdmin>
                    <DatabaseHealthPage />
                  </ProtectedRoute>
                } />
                <Route path="/health" element={
                  <ProtectedRoute requireAdmin>
                    <DatabaseHealthPage />
                  </ProtectedRoute>
                } />
                <Route path="/security" element={
                  <ProtectedRoute requireAdmin>
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