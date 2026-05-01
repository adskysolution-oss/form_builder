export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
        The Ultimate <span className="text-blue-600">Form Builder</span>
      </h1>
      <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-8">
        Create forms, build landing pages, collect payments, and manage leads all in one place. A powerful alternative to Google Forms.
      </p>
      <div className="flex gap-4">
        <a href="/register" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
          Get Started
        </a>
        <a href="/login" className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
          Login
        </a>
      </div>
    </div>
  );
}
