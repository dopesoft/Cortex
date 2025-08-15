"use client";

import React, { useState, useEffect } from 'react';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { StrategyDashboard } from '@/components/strategy/StrategyDashboard';
import { DailySalesIntelligence } from '@/components/intelligence/DailySalesIntelligence';
import { DailyBrain } from '@/components/brain/DailyBrain';
import { Settings } from '@/components/settings/Settings';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { Sidebar } from '@/components/layout/Sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

type ActiveView = 'daily-brain' | 'chat' | 'opportunities' | 'strategy' | 'admin' | 'settings';

export default function RootPage() {
  // DEPLOYMENT TEST - If you see cortex-memory, Railway is not deploying this code!
  if (typeof window !== 'undefined') {
    console.log('🚀 DOPESOFT DEPLOYMENT ACTIVE - JEAN MEMORY SHOULD BE DEAD');
    document.title = '🚀 DopeSoft Cortex - DopeSoft Cortex OBLITERATED';
  }
  // Check URL params for initial view, but also check localStorage for last view
  const getInitialView = (): ActiveView => {
    // Skip localStorage on server side
    if (typeof window === 'undefined') {
      return 'admin'; // Default to admin view
    }
    
    // First check localStorage for the last viewed page
    const savedView = localStorage.getItem('lastActiveView');
    if (savedView && ['daily-brain', 'chat', 'opportunities', 'strategy', 'admin', 'settings'].includes(savedView)) {
      return savedView as ActiveView;
    }
    
    // Otherwise check URL params
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    if (view === 'settings') return 'settings';
    if (view === 'admin') return 'admin';
    if (view === 'chat') return 'chat';
    if (view === 'opportunities') return 'opportunities';
    if (view === 'strategy') return 'strategy';
    return 'admin'; // Default to admin view
  };
  
  const [activeView, setActiveView] = useState<ActiveView>('admin');

  // Initialize view on client side
  useEffect(() => {
    setActiveView(getInitialView());
  }, []);

  // Save current view to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastActiveView', activeView);
    }
  }, [activeView]);

  // Handle URL changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handlePopState = () => {
      setActiveView(getInitialView());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderActiveView = () => {
    switch (activeView) {
      case 'daily-brain':
        return <DailyBrain />;
      case 'chat':
        return <ChatInterface />;
      case 'opportunities':
        return <DailySalesIntelligence />;
      case 'strategy':
        return <StrategyDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'settings':
        return <Settings />;
      default:
        return <AdminDashboard />; // Default to admin
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar 
          activeView={activeView} 
          onViewChange={setActiveView}
        />
        <SidebarInset>
          <div className="p-[3px] bg-muted/30 min-h-screen">
            <main className="flex-1 bg-background rounded-tl-lg overflow-hidden">
              {renderActiveView()}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}