"use client";

import { Button } from "@/components/ui/button";
import { HiHome, HiMiniRectangleStack } from "react-icons/hi2";
import { RiApps2AddFill } from "react-icons/ri";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CreateMemoryDialog } from "@/app/memories/components/CreateMemoryDialog";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, Menu, X, Settings2, Book, Network, Star, User, Info, Heart, BookHeart, LogOut, Sun, Moon, PanelLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icons } from "@/components/icons";
import { UserNav } from "./UserNav";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "next-themes";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { useToast } from '@/components/ui/use-toast';

interface NavigationItem {
  href: string;
  icon: React.ComponentType<any>;
  label: string;
  badge?: number;
  description?: string;
}

const navigationItems: NavigationItem[] = [
  {
    href: '/dashboard',
    icon: HiHome,
    label: 'Dashboard',
    description: 'Your memory overview'
  },
  {
    href: '/memories',
    icon: HiMiniRectangleStack,
    label: 'Memories',
    description: 'Browse your stored memories'
  },
  {
    href: '/my-life',
    icon: BookHeart,
    label: 'My Life',
    description: 'Personal knowledge graph'
  },
  {
    href: '/apps',
    icon: RiApps2AddFill,
    label: 'Apps',
    description: 'Connected applications'
  },
  {
    href: '/how-to-use-tools',
    icon: Info,
    label: 'How to Use',
    description: 'Learn how to use Cortex'
  }
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { toggleSidebar } = useSidebar();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
      router.push('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Don't show sidebar on landing page or auth page
  if (pathname === "/" || pathname === "/auth") {
    return null;
  }

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="px-3 py-2 group-data-[collapsible=icon]:px-2">
        <div className="flex items-center gap-3 mt-[11px] group-data-[collapsible=icon]:mt-0">
          <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 group-data-[collapsible=icon]:ml-0.5 group-data-[collapsible=icon]:mt-[13px]">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <h1 className="font-bold text-lg">Cortex Memory</h1>
            <p className="text-xs text-muted-foreground">Personal Memory Layer</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup className="mt-[30px] group-data-[collapsible=icon]:mt-[30px]">
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="group-data-[collapsible=icon]:space-y-4">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActiveItem = isActive(item.href);
                
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActiveItem}
                      tooltip={item.description}
                      className="w-full"
                    >
                      <Link href={item.href}>
                        <Icon className="w-5 h-5 group-data-[collapsible=icon]:w-6 group-data-[collapsible=icon]:h-6" />
                        <span>{item.label}</span>
                        {item.badge && (
                          <SidebarMenuBadge className="bg-red-500 text-white">
                            {item.badge}
                          </SidebarMenuBadge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu className="space-y-[7px]">
          <SidebarMenuItem>
            <SidebarMenuButton 
              tooltip={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 group-data-[collapsible=icon]:w-6 group-data-[collapsible=icon]:h-6" />
              ) : (
                <Moon className="w-5 h-5 group-data-[collapsible=icon]:w-6 group-data-[collapsible=icon]:h-6" />
              )}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/api-docs">
                <Star className="w-5 h-5 group-data-[collapsible=icon]:w-6 group-data-[collapsible=icon]:h-6" />
                <span>API Docs</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/pro">
                <Star className="w-5 h-5 group-data-[collapsible=icon]:w-6 group-data-[collapsible=icon]:h-6 text-purple-500" />
                <span className="text-purple-500">Pro</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {user && (
            <SidebarMenuItem>
              <SidebarMenuButton 
                tooltip="Sign Out"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <LogOut className="w-5 h-5 group-data-[collapsible=icon]:w-6 group-data-[collapsible=icon]:h-6" />
                <span>Sign Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
        
        <div className="p-4 text-xs text-muted-foreground">
          <div className="h-[48px] flex items-center justify-between group-data-[collapsible=icon]:justify-center">
            <div className="group-data-[collapsible=icon]:hidden">
              <p>Welcome, {user?.email?.split('@')[0] || 'there'}</p>
              <p className="text-muted-foreground/70">{new Date().toLocaleDateString()}</p>
            </div>
            <button
              onClick={toggleSidebar}
              className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:w-12"
              title="Toggle Sidebar"
            >
              <PanelLeft className="h-5 w-5 group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6" />
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
