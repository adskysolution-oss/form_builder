import "@/app/globals.css";
import { LayoutDashboard, Users, FormInput, Activity, Settings, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 w-64 hidden flex-col border-r bg-background sm:flex">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
          <span className="font-bold">SmartForm Admin</span>
        </div>
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 mt-4 gap-2">
          <a href="/admin" className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </a>
          <a href="/admin/users" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
            <Users className="h-4 w-4" /> Users
          </a>
          <a href="/admin/forms" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
            <FormInput className="h-4 w-4" /> Forms & Leads
          </a>
          <a href="/admin/revenue" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
            <Activity className="h-4 w-4" /> Revenue
          </a>
          <a href="/admin/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
            <Settings className="h-4 w-4" /> Settings
          </a>
        </nav>
        <div className="mt-auto p-4">
          <a href="/logout" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
            <LogOut className="h-4 w-4" /> Logout
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64 w-full">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <h1 className="text-2xl font-semibold">Admin Panel</h1>
        </header>
        <main className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
