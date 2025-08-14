"use client";

import { motion } from "framer-motion";
import { RiApps2AddFill } from "react-icons/ri";
import { AppFilters } from "./components/AppFilters";
import { AppGrid } from "./components/AppGrid";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function AppsPage() {
  return (
    <ProtectedRoute>
      <div className="flex h-full w-full bg-background">
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
            >
              <div className="container mx-auto px-6 py-4">
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <RiApps2AddFill className="w-6 h-6" />
                    Apps
                  </h1>
                  <p className="text-muted-foreground">Connect and manage your AI applications</p>
                </div>
                
                {/* Filters */}
                <div className="mt-4">
                  <AppFilters />
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1 overflow-hidden"
            >
              <div className="h-full overflow-y-auto">
                <div className="container mx-auto px-6 py-6">
                  <AppGrid />
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
