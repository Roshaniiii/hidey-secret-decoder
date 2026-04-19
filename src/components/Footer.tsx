import { Link } from "react-router-dom";
import { Lock, Twitter, Facebook, Linkedin, Instagram, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 mt-16">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/?tab=message" className="text-sm text-muted-foreground hover:text-primary transition-colors">Message Mode</Link></li>
              <li><Link to="/?tab=quiz" className="text-sm text-muted-foreground hover:text-primary transition-colors">Quiz Mode</Link></li>
              <li><Link to="/?tab=question" className="text-sm text-muted-foreground hover:text-primary transition-colors">Question Lock</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Help & Support</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Feedback</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cookies</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About us</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact us</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/20 rounded-xl">
              <Lock className="h-4 w-4 text-primary" />
            </div>
            <span className="text-base font-semibold text-foreground">Hidey</span>
          </Link>

          <div className="flex items-center gap-4 text-muted-foreground">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-primary transition-colors">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-primary transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-primary transition-colors">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-primary transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="mailto:support@hidey.app" aria-label="Email" className="hover:text-primary transition-colors">
              <Mail className="h-4 w-4" />
            </a>
          </div>

          <p className="text-xs text-muted-foreground">© 2026 Hidey • Keep it fun, keep it safe.</p>
        </div>
      </div>
    </footer>
  );
}
