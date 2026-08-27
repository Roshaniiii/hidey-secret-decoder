import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export const blogPosts = [
  {
    slug: "how-to-send-a-secret-message-using-hidey",
    title: "How to Send a Secret Message to Your Friend Using Hidey",
    description:
      "Looking for a secret message generator online? Hidey is a free tool to create and send secret messages with no signup, no account, and no data stored anywhere.",
    category: "Guides",
    date: "August 27, 2026",
    readTime: "5 min read",
  },
  {
    slug: "5-creative-ways-to-use-hidey-for-birthdays",
    title: "5 Creative Ways to Use Hidey for Birthdays and Surprises",
    description:
      "Hidey is more than a secret message website — discover 5 fun ways to use hidden message tools for birthday surprises, treasure hunts, and unforgettable moments.",
    category: "Fun Ideas",
    date: "August 27, 2026",
    readTime: "5 min read",
  },
  {
    slug: "is-hidey-safe-how-your-messages-are-protected",
    title: "Is Hidey Safe? How Your Messages Are Actually Protected",
    description:
      "Before using any secret message website or hidden message tool, understand exactly how your data is protected. Here is a completely honest breakdown of Hidey's security.",
    category: "Privacy",
    date: "August 27, 2026",
    readTime: "6 min read",
  },
  {
    slug: "how-to-create-the-perfect-secret-quiz",
    title: "How to Create the Perfect Secret Quiz for Your Friends",
    description:
      "Hidey's Quiz Mode is the best free secret quiz maker online — create shareable MCQ quizzes with codes, no account or app needed. Here is how to make a great one.",
    category: "Quiz Tips",
    date: "August 27, 2026",
    readTime: "5 min read",
  },
  {
    slug: "what-is-message-obfuscation-simple-guide",
    title: "What is Message Obfuscation? The Simple Guide Everyone Should Read",
    description:
      "What is the difference between obfuscation and encryption? This plain-English guide explains how hidden message tools and secret message generators work — and when to use them.",
    category: "Privacy",
    date: "August 27, 2026",
    readTime: "7 min read",
  },
  {
    slug: "secret-message-ideas-for-couples",
    title: "Secret Message Ideas for Couples: Romantic Ways to Use Hidey",
    description:
      "Looking for romantic secret message ideas for your partner? Discover creative ways to use Hidey to send love notes, surprises, and private messages that feel personal and fun.",
    category: "Fun Ideas",
    date: "August 27, 2026",
    readTime: "5 min read",
  },
];

const Blog = () => {
  useEffect(() => {
    document.title = "Blog — Hidey | Guides, Tips & Privacy Insights";
    const desc = "Read the Hidey blog — guides, fun ideas, privacy explainers, and tips for using secret messages, quizzes, and question locks.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/20">
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <section className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">The Hidey Blog</h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Guides, fun ideas, and honest explainers about hiding messages, building quizzes, and online privacy.
          </p>
        </section>

        <section className="space-y-5">
          {blogPosts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="block group">
              <Card className="rounded-2xl border-border shadow-sm hover:shadow-lg transition-all hover:border-primary/40">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="rounded-full">{post.category}</Badge>
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{post.date}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {post.description}
                  </p>
                  <span className="text-sm font-medium text-primary inline-flex items-center gap-1">
                    Read article <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
};

export default Blog;
