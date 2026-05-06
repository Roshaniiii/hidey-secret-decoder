import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 mt-16">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/?mode=message" className="text-sm text-muted-foreground hover:text-primary transition-colors">Message Mode</Link></li>
              <li><Link to="/?mode=quiz" className="text-sm text-muted-foreground hover:text-primary transition-colors">Quiz Mode</Link></li>
              <li><Link to="/?mode=question" className="text-sm text-muted-foreground hover:text-primary transition-colors">Question Mode</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Hidey"
              className="h-9 w-9 object-contain"
              width={36}
              height={36}
              loading="lazy"
            />
            <span className="text-base font-semibold text-foreground">Hidey</span>
          </Link>

          <p className="text-xs text-muted-foreground">© 2026 Hidey • Keep it fun, keep it safe.</p>
        </div>
      </div>
    </footer>
  );
}
