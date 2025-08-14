import React from "react";
import { Network } from "lucide-react";

export default function MyLifePage() {
  return React.createElement("div", { className: "flex h-full w-full bg-background" },
    React.createElement("main", { className: "flex-1 overflow-hidden" },
      React.createElement("div", { className: "h-full flex flex-col" },
        React.createElement("div", { 
          className: "flex-shrink-0 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        },
          React.createElement("div", { className: "container mx-auto px-6 py-4" },
            React.createElement("div", { className: "flex flex-col" },
              React.createElement("h1", { className: "text-2xl font-bold tracking-tight flex items-center gap-2" },
                React.createElement(Network, { className: "w-6 h-6" }),
                "My Life"
              ),
              React.createElement("p", { className: "text-muted-foreground" }, "Explore your personal knowledge graph")
            )
          )
        ),
        React.createElement("div", { className: "flex-1 overflow-hidden" },
          React.createElement("div", { className: "p-8" },
            React.createElement("p", null, "Knowledge graph will be implemented here")
          )
        )
      )
    )
  );
} 