"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import ParticleNetwork from "@/components/landing/ParticleNetwork";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Brain, Shield, Database, Zap } from "lucide-react";

export default function LandingPage() {
  const { user, isLoading, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("memory");
  const router = useRouter();

  // Check for admin email and redirect to dashboard immediately
  useEffect(() => {
    // Check if we're dealing with khaya@staffingreferrals.com
    const isAdminEmail = user?.email === 'khaya@staffingreferrals.com' || 
                        (!user && typeof window !== 'undefined' && 
                         window.location.href.includes('cortex-ui-production.up.railway.app'));
    
    if (isAdminEmail) {
      router.push('/dashboard');
      return;
    }

    const params = new URLSearchParams(
      window.location.search + window.location.hash.substring(1)
    );
    if (params.get("code") || params.get("access_token")) {
      return;
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-black">
        Loading...
      </div>
    );
  }

  // If this is the admin user or production URL, show loading while redirecting
  const isAdminEmail = user?.email === 'khaya@staffingreferrals.com' || 
                      (typeof window !== 'undefined' && 
                       window.location.href.includes('cortex-ui-production.up.railway.app'));
  
  if (isAdminEmail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-black">
        <div className="text-center">
          <Brain className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-pulse" />
          <p>Redirecting to Cortex Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 text-gray-900 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ParticleNetwork id="landing-particles-final" particleColor="#e5e7eb" particleCount={120} />
      </div>

      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-5 min-h-screen">
        {/* Left Column: Content */}
        <div className="flex flex-col items-center p-8 pt-24 pb-12 lg:justify-center lg:p-16 lg:col-span-3">
          <div className="max-w-2xl w-full text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <div className="mx-auto flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  Cortex Memory
                </h1>
                <p className="text-sm text-gray-500">Advanced Memory Management System</p>
              </div>
            </motion.div>
            
            <motion.p
              className="text-2xl lg:text-3xl text-gray-600 mb-8 lg:mb-12 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Intelligent Memory Infrastructure for AI
            </motion.p>
            
            <motion.div 
              className="flex bg-gray-200/70 p-1 rounded-lg mb-8 lg:mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <button onClick={() => setActiveTab("memory")} className={cn("w-1/2 p-2 rounded-md text-sm font-medium transition-colors", activeTab === 'memory' ? "bg-gray-900 text-white shadow" : "text-gray-600 hover:bg-gray-300/50")}>Memory System</button>
              <button onClick={() => setActiveTab("admin")} className={cn("w-1/2 p-2 rounded-md text-sm font-medium transition-colors", activeTab === 'admin' ? "bg-gray-900 text-white shadow" : "text-gray-600 hover:bg-gray-300/50")}>Admin Access</button>
            </motion.div>

            <motion.div
                className="flex flex-col items-center justify-center gap-4 h-28"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <AnimatePresence mode="wait">
                  {activeTab === 'memory' ? (
                      <motion.div key="user-cta" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="w-full">
                        <Link href={user ? "/dashboard" : "/auth"} passHref className="w-full">
                          <Button size="lg" variant="outline" className="w-full text-md py-6 border-purple-400 bg-white/50 hover:bg-gray-200/50">
                              {user ? (isAdmin ? "Access Cortex Admin" : "Access Restricted") : "Sign in to Cortex"}
                          </Button>
                        </Link>
                      </motion.div>
                  ) : (
                    <motion.div key="admin-cta" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="w-full space-y-4">
                      <Link href={user ? "/dashboard" : "/auth"} passHref className="w-full">
                        <Button size="lg" variant="outline" className="w-full text-md py-6 border-blue-400 bg-white/50 hover:bg-gray-200/50">
                          {user ? (isAdmin ? "Admin Dashboard" : "Admin Access Only") : "Admin Login"}
                        </Button>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Right Column / Mobile Section: Visuals */}
        <div className="flex items-center justify-center p-4 md:p-8 pt-0 lg:p-8 bg-gray-100/30 backdrop-blur-sm lg:bg-transparent lg:col-span-2">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-xl"
                >
                    {activeTab === 'memory' ? (
                        <div className="space-y-4 md:space-y-6">
                            <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl p-6">
                                <h3 className="text-lg font-semibold mb-4 text-gray-900">Core Features</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Database className="w-5 h-5 text-purple-600" />
                                        <span className="text-sm text-gray-700">Multi-tenant memory storage</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Zap className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm text-gray-700">Real-time synchronization</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Shield className="w-5 h-5 text-green-600" />
                                        <span className="text-sm text-gray-700">Enterprise-grade security</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Brain className="w-5 h-5 text-indigo-600" />
                                        <span className="text-sm text-gray-700">AI-powered insights</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-2xl font-bold text-center mb-4">
                                Administrator Control Panel
                            </h2>
                            <p className="text-md text-gray-600 text-center mb-6 max-w-lg mx-auto">
                                Complete control over memory systems, customer data, and AI orchestration.
                            </p>
                            <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl p-6 text-center">
                                <h3 className="text-lg font-semibold mb-3 text-gray-900">Admin Capabilities</h3>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li>• Full customer memory access</li>
                                    <li>• System configuration & monitoring</li>
                                    <li>• Memory orchestration controls</li>
                                    <li>• Analytics & performance metrics</li>
                                    <li>• Integration management</li>
                                </ul>
                                <div className="mt-4 p-2 bg-red-50 rounded-lg">
                                    <p className="text-xs text-red-600">
                                        Restricted to: khaya@staffingreferrals.com
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
      </main>
    </div>
  );
}