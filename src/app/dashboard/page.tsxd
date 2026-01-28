import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Users, Ticket, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
      {/* Navigation */}
      <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              T
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white">Ticketing System</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400">
              Privacy Policy
            </Link>
            <Link href="/login">
              <Button variant="outline">Log in</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-white dark:bg-slate-900">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
              Centralized IT & Asset Management
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Efficiently manage support tickets, user identities, and corporate assets in one secure workflow.
              Designed for modern IT teams.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="ghost" className="h-12 px-8 text-base">
                  How it Works ↓
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Functionality Section */}
        <section id="features" className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Streamlining Organization Management</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Ticketing System connects your organization's infrastructure with your workforce.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Ticket className="w-6 h-6 text-blue-600" />}
                title="Track Requests"
                description="Centralized effective ticketing dashboard to manage support lifecycle from open to resolution."
              />
              <FeatureCard
                icon={<ShieldCheck className="w-6 h-6 text-emerald-600" />}
                title="Manage Assets"
                description="Keep strict inventory of hardware, software, and secure credentials in our vault."
              />
              <FeatureCard
                icon={<Users className="w-6 h-6 text-purple-600" />}
                title="Sync Users"
                description="Seamlessly import and authenticate users via Google Workspace integration."
              />
            </div>
          </div>
        </section>

        {/* Google OAuth Transparency Section */}
        <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm">G</span>
                Our integration with Google Workspace
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
                To provide a seamless onboarding experience, Ticketing System integrates with Google authentication.
                Here is exactly how we use your data:
              </p>

              <div className="space-y-6">
                <ScopeItem
                  title="User Profiling (profile, email)"
                  description="Used to create your account, identify your organization tenant based on your email domain, and display your name/avatar in the ticketing dashboard."
                />
                <ScopeItem
                  title="Google Drive (Optional)"
                  description="Allows technicians to directly attach screenshots or logs from Google Drive to support tickets."
                />
                <ScopeItem
                  title="Gmail Integration (Optional)"
                  description="Used to send automated status updates directly to your inbox so you never miss a ticket change."
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 bg-slate-900 text-slate-400 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center text-white font-bold text-xs">T</div>
            <span className="font-semibold text-slate-200">Ticketing System</span>
          </div>
          <div className="flex gap-8 text-sm">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
          <div className="text-sm">
            © 2024 Your Company Name. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function ScopeItem({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex gap-4 items-start">
      <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
      <div>
        <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide mb-1">{title}</h4>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}
