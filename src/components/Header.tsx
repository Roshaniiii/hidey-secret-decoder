import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Lock, Home, Mail, Download } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  const location = useLocation();
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstall(false);
      setInstallPrompt(null);
    }
  };

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/contact", label: "Contact", icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b-2 border-border">
      <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Hidey"
            className="h-12 w-12 rounded-2xl object-contain"
            width={48}
            height={48}
            loading="eager"
            style={{ imageRendering: "auto" }}
          />
          <span className="text-2xl font-bold text-foreground tracking-tight">Hidey</span>
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-normal transition-all ${
                location.pathname === path
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
          {showInstall && (
            <button
              onClick={handleInstall}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-normal bg-primary/20 text-primary hover:bg-primary/30 transition-all border border-primary/30"
              aria-label="Install Hidey app"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Install App</span>
            </button>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
