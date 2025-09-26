import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardStats from './DashboardStats';
import QuoteRequestsManager from './QuoteRequestsManager';
import ProjectAnalytics from './ProjectAnalytics';
import MediaManager from './MediaManager';
import QuickActions from './QuickActions';
import NotificationCenter from './NotificationCenter';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-background relative">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 relative">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Painel de Administração
          </h1>
          <p className="text-muted-foreground">
            Gerir orçamentos e conteúdo do website
          </p>

          {/* Add Notification Center to header */}
          <div className="absolute top-0 right-0">
            <NotificationCenter />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="quotes">Orçamentos</TabsTrigger>
            <TabsTrigger value="media">Mídia</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DashboardStats />
            <QuickActions />
          </TabsContent>

          <TabsContent value="quotes" className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <QuoteRequestsManager />
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <div className="bg-card rounded-xl shadow-sm border p-6">
              <MediaManager />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <ProjectAnalytics />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;