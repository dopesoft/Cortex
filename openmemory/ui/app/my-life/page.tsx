"use client";

import { useState } from "react";
import KnowledgeGraph from "./components/KnowledgeGraph";
import AdvancedKnowledgeGraph from "./components/AdvancedKnowledgeGraph";
// import ChatInterface from "./components/ChatInterface";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageSquare, Network, Map, RotateCcw, Sparkles } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
/*
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
*/

export default function MyLifePage() {
  const [selectedMemory, setSelectedMemory] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"graph" | "chat">("graph");
  const [isChatOpen, setIsChatOpen] = useState(true);

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
                    <Network className="w-6 h-6" />
                    My Life
                  </h1>
                  <p className="text-muted-foreground">Explore your personal knowledge graph</p>
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
              <AdvancedKnowledgeGraph onMemorySelect={setSelectedMemory} />
            </motion.div>
          </div>
        </main>
      </div>

      {/* Chat Interface Section */}
      {/*
      <div className={`
        ${mobileView === "chat" ? "flex" : "hidden"}
        lg:flex
      `}>
        <Collapsible
          open={isChatOpen}
          onOpenChange={setIsChatOpen}
          className="h-full"
        >
          <CollapsibleContent className="h-full">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`
                flex flex-col bg-card
                w-full lg:w-[400px] xl:w-[500px]
                h-[calc(100vh-7rem)] lg:h-full
              `}
            >
              <ChatInterface selectedMemory={selectedMemory} />
            </motion.div>
          </CollapsibleContent>
          <div className="hidden lg:flex items-center justify-center p-2 h-full border-l border-border bg-background">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MessageSquare className={`h-4 w-4 transition-transform duration-300 ${isChatOpen ? 'rotate-90' : ''}`} />
                </Button>
              </CollapsibleTrigger>
          </div>
        </Collapsible>
      </div>
      */}
      </div>
    </ProtectedRoute>
  );
} 