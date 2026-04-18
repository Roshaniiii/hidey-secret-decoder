import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, ListChecks, HelpCircle, CheckCircle, Shield, Mail } from "lucide-react";

const features = [
  {
    icon: Lock,
    title: "Message Encoder & Decoder",
    description:
      "Type any message, pick an encoding pattern, and optionally protect it with a passphrase. Share the encoded text anywhere — chat, email, or a sticky note.",
  },
  {
    icon: ListChecks,
    title: "Secret Quiz Maker",
    description:
      "Create a multiple-choice quiz, generate a shareable HIDEYQ code, and send it to friends. They answer, send back a score code, and you reveal their result.",
  },
  {
    icon: HelpCircle,
    title: "Question-Locked Messages",
    description:
      "Lock a secret message behind a question only the right person can answer. The recipient must type the correct answer to unlock and read your content.",
  },
];

const promises = [
  "100% client-side — everything runs in your browser",
  "No accounts or sign-ups required",
  "We never store, read, or transmit your messages",
  "No third-party data sharing",
  "Free to use, forever",
];

const audiences = [
  { emoji: "🧑‍🤝‍🧑", label: "Friends sharing fun secrets" },
  { emoji: "👩‍🏫", label: "Teachers creating engaging quizzes" },
  { emoji: "🧩", label: "Puzzle and riddle lovers" },
  { emoji: "🔐", label: "Privacy-conscious users" },
  { emoji: "🎓", label: "Students exploring cryptography" },
  { emoji: "💌", label: "Anyone who loves surprises" },
];

const techBadges = ["React", "TypeScript", "Tailwind CSS", "shadcn/ui"];

const About = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "About — Hidey | Free Secret Message Encoder";

    const metaName = "description";
    const content =
      "Learn about Hidey — the free, private, browser-based tool for encoding secret messages, creating secret quizzes, and locking content behind questions. No servers. No storage. Just fun.";

    let tag = document.querySelector(`meta[name="${metaName}"]`) as HTMLMetaElement | null;
    const created = !tag;
    if (!tag) {
      tag = document.createElement("meta");
      tag.name = metaName;
      document.head.appendChild(tag);
    }
    const previousContent = tag.content;
    tag.content = content;

    return () => {
      document.title = previousTitle;
      if (created) tag?.remove();
      else if (tag) tag.content = previousContent;
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/20 animate-in fade-in duration-500">
      <div className="container max-w-5xl mx-auto px-4 py-12 space-y-16">
        <section className="text-center space-y-4">
          <div className="inline-flex items-center justify-center gap-3">
            <Lock className="h-8 w-8 text-primary" />
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">About Hidey</h1>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
            A free, private, browser-based tool for hiding messages, creating secret quizzes, and locking content
            behind questions.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground">What is Hidey?</h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Hidey is a free, browser-based tool that lets you hide messages, create secret quizzes, and lock content
            behind questions — all without any account, login, or server. Everything happens entirely on your device.
            We never see your data. Nobody does.
          </p>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Whether you're sending a playful secret to a friend, creating a quiz for your classroom, or just having
            fun with encoded text — Hidey makes it simple, private, and instant.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="rounded-2xl border-2 border-border shadow-lg p-6 space-y-3 hover:shadow-xl transition-shadow"
            >
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </Card>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground">Why We Built Hidey</h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            We wanted a simple, fun way to share secrets online — without worrying about who's reading them on the
            other end. Most messaging apps store your data on servers. Hidey doesn't. There are no databases, no user
            accounts, and no data collection of any kind.
          </p>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Hidey was built for curiosity, creativity, and privacy-conscious fun.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground">Our Privacy Promise</h2>
          <Card className="rounded-2xl border-2 border-border shadow-lg p-6">
            <ul className="space-y-3">
              {promises.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground">Who Is Hidey For?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {audiences.map(({ emoji, label }) => (
              <Card
                key={label}
                className="rounded-2xl border-2 border-border shadow-lg p-5 flex items-center gap-4 hover:shadow-xl transition-shadow"
              >
                <span className="text-3xl" aria-hidden>
                  {emoji}
                </span>
                <span className="text-sm sm:text-base text-foreground font-medium">{label}</span>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <Card className="rounded-2xl border-2 border-border shadow-lg p-6 sm:p-8 bg-accent/30 space-y-3">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">A Note on Security</h2>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Hidey uses obfuscation and Base62 encoding — it is designed to be fun and private, not military-grade
              encryption. Please do not use Hidey for genuinely sensitive information such as passwords or financial
              data. Hidey is built for fun, creativity, and casual privacy.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground">Built With</h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Hidey is an independent project built with React, TypeScript, and Tailwind CSS. It runs entirely in your
            browser on a secure HTTPS connection. Your data never leaves your device.
          </p>
          <div className="flex flex-wrap gap-2">
            {techBadges.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-sm px-3 py-1">
                {tech}
              </Badge>
            ))}
          </div>
        </section>

        <section className="text-center space-y-4 py-8">
          <p className="text-lg font-medium text-foreground">Have questions or feedback?</p>
          <Button asChild size="lg">
            <Link to="/contact">
              <Mail className="h-4 w-4" />
              Get in Touch
            </Link>
          </Button>
        </section>
      </div>
    </main>
  );
};

export default About;
