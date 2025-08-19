
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TestRoute from "./pages/TestRoute";
import ProjectsPage from "./components/ProjectsPage";
import ProjectImageManagerPage from "./pages/ProjectImageManagerPage";
import ProjectManagementPage from "./pages/ProjectManagementPage";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import SecurityAuditPage from "./pages/SecurityAuditPage";
import { SecurityProvider } from "./components/SecurityProvider";
import CookieConsent from "./components/CookieConsent";

const queryClient = new QueryClient();

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <SecurityProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/projetos" element={<ProjectsPage />} />
                  <Route path="/projetos/:id" element={<ProjectsPage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/admin/projetos/:id/imagens" element={<ProjectImageManagerPage />} />
                  <Route path="/admin/projetos/:id/gestao" element={<ProjectManagementPage />} />
                  <Route path="/admin/security" element={<SecurityAuditPage />} />
                  <Route path="/test" element={<TestRoute />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <CookieConsent />
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </SecurityProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
