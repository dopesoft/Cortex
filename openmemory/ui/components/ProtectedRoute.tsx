"use client";

import * as React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Admin bypass for development/testing (bypass auth if ?admin=true in URL)
  const isAdminBypass = typeof window !== 'undefined' && window.location.search.includes('admin=true');

  useEffect(() => {
    if (!isLoading && !user && !isAdminBypass) {
      router.replace("/auth");
    }
  }, [user, isLoading, router, isAdminBypass]);

  if (isLoading && !isAdminBypass) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user && !isAdminBypass) {
    return null;
  }

  return <>{children}</>;
}