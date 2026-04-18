import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t-2 border-border bg-card/50 mt-16">
      <div className="container max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>© 2026 Hidey • Keep it fun, keep it safe.</p>
        <nav className="flex items-center gap-4">
          <Link to="/about" className="hover:text-primary transition-colors">About</Link>
          <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
          <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy</Link>
          <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
