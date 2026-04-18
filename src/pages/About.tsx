import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Mail, CheckCircle } from "lucide-react";

const promises = [
  "100% client-side — everything runs in your browser",
  "No accounts or sign-ups required",
  "We never store, read, or transmit your messages",
  "No third-party data sharing",
  "Free to use, forever",
];

const About = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "About — Hidey | Free Secret Message Encoder";

    const metaName = "description";
    const content =
      "Learn about Hidey — the free, private, browser-based tool for encoding secret messages, creating secret quizzes, and locking content behind questions.";

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
      <div className="container max-w-3xl mx-auto px-4 py-12 space-y-10">
        <header className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">About Hidey</h1>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            A free, private, browser-based tool for hiding messages, creating secret quizzes, and locking content
            behind questions.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">What is Hidey?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Hidey is a free, browser-based tool that lets you hide messages, create secret quizzes, and lock content
            behind questions — all without any account, login, or server. Everything happens entirely on your device.
            We never see your data. Nobody does.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Whether you're sending a playful secret to a friend, creating a quiz for your classroom, or just having
            fun with encoded text — Hidey makes it simple, private, and instant.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">What You Can Do</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Hidey offers three core tools — a <strong className="text-foreground">Message Encoder & Decoder</strong>{" "}
            for sharing encoded text with optional passphrase protection, a{" "}
            <strong className="text-foreground">Secret Quiz Maker</strong> for creating shareable multiple-choice
            quizzes with score reveals, and <strong className="text-foreground">Question-Locked Messages</strong> that
            unlock only when the recipient answers a question correctly.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">Why We Built Hidey</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We wanted a simple, fun way to share secrets online — without worrying about who's reading them on the
            other end. Most messaging apps store your data on servers. Hidey doesn't. There are no databases, no user
            accounts, and no data collection of any kind. Hidey was built for curiosity, creativity, and
            privacy-conscious fun.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">Our Privacy Promise</h2>
          <ul className="space-y-2">
            {promises.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <Card className="rounded-2xl border-2 border-border shadow-sm p-6 bg-accent/30 space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">A Note on Security</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Hidey uses obfuscation and Base62 encoding — it is designed to be fun and private, not military-grade
              encryption. Please do not use Hidey for genuinely sensitive information such as passwords or financial
              data.
            </p>
          </Card>
        </section>

        <section className="text-center space-y-3 py-4">
          <p className="text-sm text-muted-foreground">Have questions or feedback?</p>
          <Button asChild size="sm">
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
