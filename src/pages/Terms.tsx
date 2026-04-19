import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Mail } from "lucide-react";

const Terms = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Terms of Service — Hidey";

    const metaName = "description";
    const content =
      "Read the Terms of Service for Hidey — the free browser-based secret message encoder, quiz maker, and question-lock tool.";

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
    <main className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/20 animate-in fade-in duration-500 scroll-smooth">
      <div className="container max-w-4xl mx-auto px-4 py-12 space-y-10">
        <header className="text-center space-y-2">
          <div className="inline-flex items-center justify-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">Terms of Service</h1>
          </div>
          <p className="text-sm text-muted-foreground">Please read these terms carefully before using Hidey.</p>
        </header>

        <article>
          <Card className="rounded-2xl border-2 border-border shadow-lg p-6 sm:p-10 max-w-[800px] mx-auto">
            <div className="space-y-8">
              <section className="space-y-2">
                <h2 className="font-semibold text-foreground text-lg">1. Acceptance of Terms</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  By accessing or using Hidey (the "Service"), you confirm that you are at least 13 years of age and
                  that you agree to be bound by these Terms of Service. If you do not agree with any part of these
                  terms, please do not use the Service.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-semibold text-foreground text-lg">2. Description of Service</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Hidey is a free, browser-based tool that allows users to encode and decode messages, create
                  shareable quizzes, and lock content behind questions. All processing occurs locally in your browser.
                  Hidey does not operate any servers for storing, transmitting, or processing user-generated content.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-semibold text-foreground text-lg">3. Permitted Use</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You agree to use Hidey only for lawful purposes. You must not use Hidey to:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground leading-relaxed">
                  <li>Encode or share content that is illegal, harmful, threatening, abusive, defamatory, or obscene</li>
                  <li>Harass, stalk, bully, or intimidate any individual</li>
                  <li>Distribute malware, spam, or any harmful code</li>
                  <li>Attempt to reverse-engineer, disrupt, or interfere with the Service</li>
                  <li>Violate any applicable local, national, or international law or regulation</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="font-semibold text-foreground text-lg">4. No Account Required</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Hidey does not require you to create an account. No personal data is collected, stored, or processed
                  by our servers during your use of the encoding, decoding, quiz, or question-locking features of the
                  Service.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-semibold text-foreground text-lg">5. Privacy</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your use of Hidey is also governed by our Privacy Policy, which is incorporated into these Terms by
                  reference. By using the Service, you agree to the collection and use of information as described in
                  our Privacy Policy.
                </p>
                <Link
                  to="/privacy-policy"
                  className="inline-block text-sm text-primary hover:underline"
                >
                  Read our Privacy Policy →
                </Link>
              </section>

              <section className="space-y-2">
                <h2 className="font-semibold text-foreground text-lg">6. Intellectual Property</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  All content, design, source code, branding, and user interface elements associated with Hidey —
                  including the name, logo, and visual design — are the intellectual property of Hidey and its
                  creators. You may not reproduce, distribute, modify, or create derivative works from any part of the
                  Service without prior written permission.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-semibold text-foreground text-lg">7. Third-Party Services</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Hidey may display advertisements served by Google AdSense and may use third-party analytics services
                  such as Google Analytics. These third parties operate under their own privacy policies and terms of
                  service, which we encourage you to review. We are not responsible for the data practices of any
                  third-party services.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-semibold text-foreground text-lg">8. Disclaimer of Warranties</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Hidey is provided on an "as is" and "as available" basis, without warranties of any kind — either
                  express or implied. We do not guarantee that the Service will be uninterrupted, error-free, or
                  completely secure. Hidey is designed for casual and recreational use and is not a substitute for
                  professional-grade encryption or security tools.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-semibold text-foreground text-lg">9. Limitation of Liability</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  To the fullest extent permitted by applicable law, Hidey and its creators shall not be liable for any
                  indirect, incidental, special, consequential, or punitive damages arising from your use of or
                  inability to use the Service. This includes but is not limited to loss of data, unauthorised access
                  to encoded content, or any reliance placed on the Service for sensitive communications.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-semibold text-foreground text-lg">10. Changes to These Terms</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We reserve the right to update or modify these Terms of Service at any time. Changes will be posted
                  on this page with a revised "Last updated" date. Your continued use of the Service after any changes
                  are posted constitutes your acceptance of the updated Terms.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-semibold text-foreground text-lg">11. Governing Law</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of India, without regard
                  to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the
                  exclusive jurisdiction of the courts of India.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-semibold text-foreground text-lg">12. Contact Us</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  If you have any questions, concerns, or feedback about these Terms of Service, we would love to hear
                  from you.
                </p>
                <Button asChild size="sm">
                  <Link to="/contact">
                    <Mail className="h-4 w-4" />
                    Contact Us
                  </Link>
                </Button>
              </section>
            </div>
          </Card>
        </article>

        <p className="text-center text-xs text-muted-foreground">
          © 2026 Hidey. All rights reserved. | Terms of Service |{" "}
          <Link to="/privacy-policy" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>{" "}
          |{" "}
          <Link to="/contact" className="hover:text-primary transition-colors">
            Contact
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Terms;
