import { useState, FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z.string().trim().nonempty("Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  subject: z.string().trim().nonempty("Subject is required").max(150, "Subject must be less than 150 characters"),
  message: z.string().trim().nonempty("Message is required").max(2000, "Message must be less than 2000 characters"),
});

type FieldErrors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

const Contact = () => {
  useSeo({
    title: "Contact Hidey — Questions, Feedback & Support",
    description:
      "Get in touch with the Hidey team. Send questions, feedback, bug reports or feature ideas about our free secret message, quiz and question-lock tools.",
    canonicalPath: "/contact",
  });
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);


  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof FieldErrors;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("https://formspree.io/f/xeevkkdv", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(result.data),
      });

      if (res.ok) {
        toast.success("Message sent");
        setForm({ name: "", email: "", subject: "", message: "" });
        setIsSuccess(true);
      } else {
        toast.error("Something went wrong. Please try again or email us directly.");
      }
    } catch {
      toast.error("Something went wrong. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/20">
      <div className="container max-w-[600px] mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Get in Touch</h1>
          <p className="text-sm text-muted-foreground">
            Have a question, suggestion, or just want to say hello? Fill in the form below and we'll get back to you as
            soon as possible.
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          {isSuccess ? (
            <div className="flex flex-col items-center text-center space-y-4 py-6">
              <div className="p-3 bg-primary/15 rounded-full">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Message sent!</h2>
              <Button
                onClick={() => setIsSuccess(false)}
                variant="outline"
                className="mt-2"
              >
                Send another
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange("name")}
                  aria-invalid={!!errors.name}
                  maxLength={100}
                  required
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange("email")}
                  aria-invalid={!!errors.email}
                  maxLength={255}
                  required
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="What's this about?"
                  value={form.subject}
                  onChange={handleChange("subject")}
                  aria-invalid={!!errors.subject}
                  maxLength={150}
                  required
                />
                {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Write your message here..."
                  value={form.message}
                  onChange={handleChange("message")}
                  aria-invalid={!!errors.message}
                  maxLength={2000}
                  className="min-h-[150px] resize-y"
                  required
                />
                {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          )}
        </Card>

      </div>
    </div>
  );
};

export default Contact;
