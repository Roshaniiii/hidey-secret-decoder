import { Shield, MessageSquare, ListChecks, HelpCircle, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/20">
      <div className="container max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">About Hidey</h1>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Hidey is a fun, browser-based tool that lets you hide messages, create quizzes, and build question challenges — all without any server or account required.
          </p>
        </div>

        <Card className="p-5 bg-card border-2 border-border rounded-2xl shadow-lg space-y-2">
          <h2 className="text-lg font-bold text-foreground">What is Hidey?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Hidey is a lightweight, privacy-first encoding playground. It transforms your messages into scrambled codes using fun alphabet patterns, lets you create MCQ quizzes with shareable codes, and enables question-based challenges where a hidden message is only revealed when the correct answer is given. Everything runs entirely in your browser — no data ever leaves your device.
          </p>
        </Card>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground text-center">Features</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="p-4 bg-card border-2 border-border rounded-2xl text-center space-y-2">
              <div className="inline-block p-2 bg-primary/20 rounded-xl">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Message Mode</h3>
              <p className="text-xs text-muted-foreground">Encode and decode secret messages using customizable alphabet patterns and optional passphrases.</p>
            </Card>
            <Card className="p-4 bg-card border-2 border-border rounded-2xl text-center space-y-2">
              <div className="inline-block p-2 bg-secondary/40 rounded-xl">
                <ListChecks className="h-5 w-5 text-secondary-foreground" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Quiz Mode</h3>
              <p className="text-xs text-muted-foreground">Create MCQ quizzes, share them as compact codes, and let others attempt and reveal scores.</p>
            </Card>
            <Card className="p-4 bg-card border-2 border-border rounded-2xl text-center space-y-2">
              <div className="inline-block p-2 bg-accent rounded-xl">
                <HelpCircle className="h-5 w-5 text-accent-foreground" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Question Mode</h3>
              <p className="text-xs text-muted-foreground">Hide a message behind a question — the answer is the key to unlock it.</p>
            </Card>
          </div>
        </div>

        <Card className="p-5 bg-card border-2 border-border rounded-2xl shadow-lg space-y-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" /> Our Mission
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We believe secret-sharing should be playful, accessible, and private. Hidey was built to bring a little mystery and fun to everyday communication — whether you're sending a coded birthday wish, quizzing your friends, or creating a treasure-hunt challenge. No sign-ups, no servers, no tracking. Just pure, client-side fun.
          </p>
        </Card>

        <Card className="p-5 bg-destructive/10 border-2 border-destructive/30 rounded-2xl space-y-2">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" /> Safety Note
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Hidey is designed for fun and casual use. It uses obfuscation techniques, not military-grade encryption. <strong>Do not use or share sensitive or personal information</strong> while using this app. Always be mindful of what you encode and who you share it with.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default About;
