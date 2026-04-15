import { Card } from "@/components/ui/card";
import { Linkedin, Mail } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/20">
      <div className="container max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Contact</h1>
          <p className="text-sm text-muted-foreground">Get in touch with the creator of Hidey.</p>
        </div>

        <Card className="p-6 bg-card border-2 border-border rounded-2xl shadow-lg max-w-sm mx-auto text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://www.linkedin.com/in/roshani-gusain/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[hsl(210,80%,55%)] text-white text-sm rounded-xl hover:bg-[hsl(210,80%,45%)] transition-all"
            >
              <Linkedin className="h-4 w-4" />
              Connect on LinkedIn
            </a>
            <a
              href="mailto:gusainroshani583@gmail.com"
              className="inline-flex items-center justify-center p-2.5 bg-primary/20 text-primary rounded-xl hover:bg-primary/30 transition-all"
              title="Send Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
