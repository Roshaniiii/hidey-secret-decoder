import { Card } from "@/components/ui/card";
import { Linkedin, Lock } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/20">
      <div className="container max-w-4xl mx-auto px-4 py-12 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-block p-3 bg-primary/20 rounded-2xl mb-2">
            <Lock className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-5xl font-bold text-foreground tracking-tight">Contact</h1>
          <p className="text-lg text-muted-foreground">Get in touch with the creator of Hidey.</p>
        </div>

        <Card className="p-8 bg-card border-2 border-border rounded-2xl shadow-lg max-w-md mx-auto text-center space-y-6">
          <div className="inline-block p-4 bg-[hsl(210,80%,55%)]/15 rounded-2xl">
            <Linkedin className="h-12 w-12 text-[hsl(210,80%,55%)]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Roshani Gusain</h2>
            <p className="text-muted-foreground">Creator of Hidey</p>
          </div>
          <a
            href="https://www.linkedin.com/in/roshani-gusain/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[hsl(210,80%,55%)] text-white font-semibold rounded-xl hover:bg-[hsl(210,80%,45%)] transition-all"
          >
            <Linkedin className="h-5 w-5" />
            Connect on LinkedIn
          </a>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
