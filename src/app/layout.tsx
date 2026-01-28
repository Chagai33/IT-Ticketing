import type { Metadata } from "next";
import { Inter, Heebo } from "next/font/google"; // Heebo is great for Hebrew
import { Toaster } from "@/components/ui/sonner";
import { GlobalErrorBoundary } from "@/components/error-boundary/GlobalErrorBoundary";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
});

export const metadata: Metadata = {
  title: "Ticketing System",
  description: "Enterprise Asset & Ticket Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${heebo.variable} font-sans antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50`}
      >
        <GlobalErrorBoundary>
          <AuthProvider>
            {children}
          </AuthProvider>
        </GlobalErrorBoundary>
        <Toaster />

      </body>
    </html>
  );
}


