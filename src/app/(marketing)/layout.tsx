import "@/app/globals.css";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background/80 py-4 backdrop-blur-sm mx-auto flex justify-between items-center px-4">
        <h1 className="text-xl font-bold tracking-tight text-primary">SmartForm</h1>
        <nav>
          <a href="/login" className="text-sm font-medium hover:underline">Login</a>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
