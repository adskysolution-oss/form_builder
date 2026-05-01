"use client";

import "@/app/globals.css";
import { LayoutDashboard, FileText, Users, Settings, LogOut, Sparkles, Zap } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Forms', href: '/dashboard/forms', icon: FileText },
    { name: 'Leads CRM', href: '/dashboard/leads', icon: Users },
    { name: 'Gateways', href: '/dashboard/settings/gateways', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen text-white overflow-hidden">
      {/* Premium Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 w-72 hidden flex-col border-r border-white/10 bg-[#0B0F1A]/80 backdrop-blur-2xl sm:flex">
        <div className="flex h-20 items-center border-b border-white/10 px-8">
          <div className="flex items-center gap-3">
             <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
                <Sparkles className="h-6 w-6 text-white" />
             </div>
             <span className="font-black text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
               SmartForm
             </span>
          </div>
        </div>

        <nav className="flex-1 space-y-2 p-6">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                  isActive 
                    ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 border border-blue-500/30" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive && "text-blue-500")} />
                <span className="font-bold tracking-wide">{item.name}</span>
                {isActive && (
                   <div className="absolute right-0 top-0 h-full w-1.5 bg-blue-500 rounded-l-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6">
           <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-3xl p-6 border border-white/5 mb-6">
              <Zap className="h-8 w-8 text-blue-500 mb-3" />
              <h4 className="font-bold text-sm text-white mb-1">Upgrade to 100x</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Unlock advanced logic and custom domains.</p>
              <button className="mt-4 w-full py-2 bg-white text-black rounded-xl text-xs font-black hover:bg-slate-200 transition-colors">
                UPGRADE NOW
              </button>
           </div>

          <Link href="/logout" className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all">
            <LogOut className="h-5 w-5" />
            <span className="font-bold">Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col sm:pl-72 w-full relative">
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 sticky top-0 bg-[#0B0F1A]/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
             <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Network Secure</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 flex items-center justify-center font-black text-xs">
                JD
             </div>
          </div>
        </header>
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
             {children}
          </div>
        </main>
      </div>

      {/* Decorative Gradients */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
    </div>
  );
}
