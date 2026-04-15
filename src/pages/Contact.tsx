import { Card } from "@/components/ui/card";
import { Linkedin, Mail } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/20">
      <div className="container max-w-4xl mx-auto px-4 py-12 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Contact</h1>
          <p className="text-sm text-muted-foreground">
            Have a question, suggestion, or feedback? Feel free to reach out.
          </p>
        </div>

        <div className="flex items-center justify-center gap-6">
          <a
            href="https://www.linkedin.com/in/roshani-gusain/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Linkedin className="h-5 w-5" />
            Connect on LinkedIn
          </a>
          <a
            href="mailto:gusainroshani583@gmail.com"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            title="Send Email"
          >
            <Mail className="h-5 w-5" />
            Send an Email
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
