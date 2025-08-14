import type React from "react";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Providers } from "./providers";
import { AuthProvider } from "../contexts/AuthContext";
import type { Metadata } from 'next';
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Script from "next/script";
import { SidebarProvider } from "@/components/ui/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://cortex-ui-production.up.railway.app'),
  title: {
    default: 'Cortex Memory - Advanced Memory Management',
    template: '%s | Cortex Memory',
  },
  description: 'Advanced memory management system for AI applications and customer intelligence.',
  openGraph: {
    title: 'Cortex Memory - Advanced Memory Management',
    description: 'Advanced memory management system for AI applications and customer intelligence.',
    url: 'https://cortex-ui-production.up.railway.app',
    siteName: 'Cortex Memory',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Cortex Memory Banner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cortex Memory - Advanced Memory Management',
    description: 'Advanced memory management system for AI applications and customer intelligence.',
    images: ['/og-image.png'],
  },
  icons: [{ rel: 'icon', url: '/logo.svg' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.svg" sizes="any" />
      </head>
      <body className={cn(
        "min-h-screen font-sans antialiased bg-background text-foreground",
        inter.className
      )}>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17027341721"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17027341721');
          `}
        </Script>
        
        <Providers>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <SidebarProvider>
                <TooltipProvider>
                  <div className="flex h-screen w-full">
                    <Navbar />
                    <main className="flex-1 overflow-hidden">
                      {children}
                    </main>
                  </div>
                  <Toaster />
                  <SonnerToaster />
                </TooltipProvider>
              </SidebarProvider>
            </ThemeProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
