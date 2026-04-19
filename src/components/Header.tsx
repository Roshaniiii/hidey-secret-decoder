import { Link, useLocation } from "react-router-dom";
import { Lock, Home, Info, Mail } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/about", label: "About", icon: Info },
    { path: "/contact", label: "Contact", icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b-2 border-border">
      <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/20 rounded-xl">
            <Lock className="h-6 w-6 text-primary" />
          </div>
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
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
