import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, MessageSquare, Target, BarChart3, Settings, Shield } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar = ({ activeView, onViewChange }: SidebarProps) => {
  const menuItems = [
    { id: 'admin', label: 'Admin', icon: Shield },
    { id: 'daily-brain', label: 'Daily Brain', icon: Brain },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'opportunities', label: 'Opportunities', icon: Target },
    { id: 'strategy', label: 'Strategy', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-purple-400">🚀 DopeSoft Cortex</h1>
        <p className="text-sm text-gray-400">Admin Dashboard</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeView === item.id ? "secondary" : "ghost"}
              className={`w-full justify-start ${
                activeView === item.id 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>
      
      <div className="absolute bottom-4 left-4 right-4">
        <div className="text-xs text-gray-500 text-center">
          <p>✨ DopeSoft Cortex: ELIMINATED</p>
          <p>🚀 DopeSoft Engineering</p>
        </div>
      </div>
    </div>
  );
};