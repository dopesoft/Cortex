"use client";

import { useEffect, useState } from "react";
import { MemoriesSection } from "@/app/memories/components/MemoriesSection";
import { MemoryFilters } from "@/app/memories/components/MemoryFilters";
import { useRouter, useSearchParams } from "next/navigation";
import UpdateMemory from "@/components/shared/update-memory";
import { useUI } from "@/hooks/useUI";
import { DeepQueryDialog } from "./components/DeepQueryDialog";
import { useMemoriesApi } from "@/hooks/useMemoriesApi";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { STMToggle } from "@/components/memory-v3/STMToggle";
import { CreateMemoryDialog } from "./components/CreateMemoryDialog";
import { motion } from "framer-motion";

export default function MemoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateMemoryDialog, handleCloseUpdateMemoryDialog } = useUI();
  const { fetchMemories } = useMemoriesApi();
  const [memories, setMemories] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const filters = useSelector((state: RootState) => state.filters.apps);

  useEffect(() => {
    loadMemories();
  }, [searchParams, filters]);

  const loadMemories = async () => {
    setIsLoading(true);
    try {
      const searchQuery = searchParams.get("search") || "";
      const result = await fetchMemories(
        searchQuery,
        {
          apps: filters.selectedApps,
          categories: filters.selectedCategories,
          sortColumn: filters.sortColumn,
          sortDirection: filters.sortDirection,
          showArchived: filters.showArchived,
          groupThreads: true, // Enable threading for memories page
        }
      );
      setMemories(result.memories);
      setTotalItems(result.total);
    } catch (error) {
      console.error("Failed to fetch memories:", error);
    }
    setIsLoading(false);
  };

  const handleClearFilters = () => {
    // This will be handled by the FilterComponent's Redux action
  };

  return (
    <ProtectedRoute>
      <div className="flex h-full w-full bg-background">
        <UpdateMemory
          memoryId={updateMemoryDialog.memoryId || ""}
          memoryContent={updateMemoryDialog.memoryContent || ""}
          open={updateMemoryDialog.isOpen}
          onOpenChange={handleCloseUpdateMemoryDialog}
        />
        
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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex flex-col">
                    <h1 className="text-2xl font-bold tracking-tight">Memories</h1>
                    <p className="text-muted-foreground">Browse and manage your stored memories</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <DeepQueryDialog />
                    <CreateMemoryDialog />
                  </div>
                </div>
                
                {/* Filters */}
                <div className="mt-4">
                  <MemoryFilters onFilterChange={loadMemories} />
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
                  <MemoriesSection
                    memories={memories}
                    totalItems={totalItems}
                    isLoading={isLoading}
                    onClearFilters={handleClearFilters}
                    hasActiveFilters={
                      filters.selectedApps.length > 0 ||
                      filters.selectedCategories.length > 0 ||
                      filters.showArchived
                    }
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
