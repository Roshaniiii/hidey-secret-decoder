import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const sections: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "General",
    items: [
      { q: "What is Hidey?", a: "Hidey is a free, browser-based secret message generator online that lets you encode hidden messages, create shareable quizzes, and lock content behind questions — all without any account, sign-up, or server. Everything runs entirely in your browser on your device. We never see your data. Nobody does." },
      { q: "Is Hidey completely free?", a: "Yes — Hidey is 100 percent free to use with no hidden charges, no premium plan, and no account required. All features including Message Mode, Quiz Mode, and Question Mode are available to everyone at no cost, forever." },
      { q: "Do I need to create an account?", a: "No. Hidey requires absolutely no sign-up or login. Just open the app and start using it immediately. Your messages and quiz codes are never stored on any server anywhere in the world." },
      { q: "Does Hidey work on mobile?", a: "Yes. Hidey is fully mobile responsive and works on any device — Android, iPhone, tablet, or desktop. You can also install it on your phone's home screen like an app by tapping Add to Home Screen in your browser — no app store required." },
      { q: "Which browsers does Hidey support?", a: "Hidey works on all modern browsers including Chrome, Firefox, Safari, and Edge on both desktop and mobile. We recommend using the latest version of any browser for the best experience." },
      { q: "Does Hidey work offline?", a: "Yes. Once the app has loaded in your browser, the core encoding, decoding, quiz, and question features all work without an internet connection. Note that ads and some external features require an active connection to load." },
      { q: "How is Hidey different from other secret message websites?", a: "Most secret message websites either store your messages on a server — even temporarily — or generate expiring links that disappear after being read. Hidey is different because it is 100 percent client-side. Nothing is stored anywhere. Your encoded message travels inside the text or code itself — not in a database link. There is nothing to expire, nothing to breach, and nothing for us to see." },
    ],
  },
  {
    title: "Message Mode",
    items: [
      { q: "What is Message Mode?", a: "Message Mode is Hidey's core hidden message tool. It lets you encode any text into an obfuscated string using one of four encoding patterns — Alnum Blocks, Symbol Stream, Caps Blast, or Hex Weave. The encoded message looks like random characters and can only be decoded by someone who knows which pattern was used and the passphrase if one was set." },
      { q: "What are the four encoding patterns?", a: "Alnum Blocks encodes your message into grouped lowercase letters and numbers. Symbol Stream uses a mix of special characters and symbols. Caps Blast produces uppercase letter clusters. Hex Weave creates hexadecimal-style blocks. Each pattern produces completely different looking output from the same message." },
      { q: "What is a passphrase and do I need one?", a: "A passphrase is an optional extra layer of protection. When you add a passphrase, it shuffles the encoding alphabet using your passphrase as a seed — making the encoded message unreadable even to someone who knows the pattern, unless they also know the passphrase. For casual message sharing between friends you may not need one. For anything more private, always add one." },
      { q: "How do I share an encoded message with a friend?", a: "After encoding, click Copy Text to copy the encoded string and paste it anywhere — WhatsApp, Instagram DM, email, Twitter, or even a physical note. Tell your friend to open Hidey, go to the Decode tab, paste the encoded text, select the same pattern, enter the passphrase if you used one, and click Decode." },
      { q: "Can I create secret messages online in other languages?", a: "Yes. Hidey uses UTF-8 byte encoding which supports every language and script including Hindi, Arabic, Chinese, Japanese, Spanish, French, and all emoji. Any text in any language can be encoded and decoded perfectly." },
      { q: "How long can my message be?", a: "Messages can be up to 10,000 characters long. A live character counter shows your current length as you type." },
      { q: "Is encoding the same as encryption?", a: "No. Hidey uses obfuscation — a way of making text unreadable without knowing the pattern and passphrase. It is not military-grade cryptographic encryption. Do not use Hidey to hide genuinely sensitive information like passwords or financial details. It is designed for fun, surprises, and casual privacy between people who trust each other." },
    ],
  },
  {
    title: "Quiz Mode",
    items: [
      { q: "What is Quiz Mode?", a: "Quiz Mode is Hidey's secret quiz maker — it lets you create a multiple-choice quiz with up to 100 questions, generate a compact shareable HIDEYQ-XXXX code, and send it to a friend. They answer the quiz and get a HIDEYS-XXXX score code to send back to you. You reveal their result without them seeing the answers during the attempt. No account, no app, no expiry." },
      { q: "How do I create a quiz?", a: "Go to the Quiz tab and select Create Quiz. Add your questions — each must have exactly 4 options with one correct answer highlighted in green. Optionally add a passphrase and score key for extra privacy. Click Generate Quiz Code and share the HIDEYQ code." },
      { q: "What is a Score Key?", a: "A Score Key is a separate password that protects the score reveal. Even if someone intercepts the HIDEYS score code, they cannot see the score without knowing the Score Key. This is useful for classroom use or competitive quiz scenarios where only the creator should see the results." },
      { q: "Can the quiz taker see the correct answers?", a: "No. The correct answers are embedded inside the HIDEYQ code in a protected format. The quiz taker sees only the questions and options during the attempt. They cannot access the answers without the Score Key." },
      { q: "How many questions can a quiz have?", a: "Up to 100 questions per quiz. Each question must have exactly 4 options and one correct answer." },
      { q: "Do HIDEYQ codes expire?", a: "No. HIDEYQ and HIDEYS codes do not expire. They are completely self-contained and can be used at any time, forever, as long as you have the code." },
    ],
  },
  {
    title: "Question Mode",
    items: [
      { q: "What is Question Mode?", a: "Question Mode lets you hide a secret message behind a question. The recipient must type the correct answer to unlock and read your message. It is like a personal riddle or a puzzle game for friends — only the right person who knows the answer can see what you wrote." },
      { q: "How do I create a Question Challenge?", a: "Go to the Question tab and select Create Challenge. Write your secret message, enter a question the recipient must answer, and type the correct answer in lowercase for consistency. Click Encrypt and Create Challenge to generate a QMODE code. Share this code with your recipient through any channel." },
      { q: "Is the answer stored anywhere?", a: "No. The answer is never stored anywhere. Instead a SHA-256 hash of your answer is embedded in the code. When the recipient enters their answer it is hashed and compared to the stored hash. The original answer cannot be mathematically recovered from the hash under any circumstances." },
      { q: "Is Question Mode case-sensitive?", a: "Yes, answers are case-sensitive. We recommend writing answers in lowercase when creating the challenge and letting your recipient know this to avoid frustration from capitalisation differences." },
    ],
  },
  {
    title: "Privacy and Security",
    items: [
      { q: "Does Hidey store my messages?", a: "No. Hidey has no server, no database, and no backend of any kind. All encoding, decoding, quiz creation, and question locking happens entirely in your browser on your device. Your messages never leave your machine." },
      { q: "Can Hidey see what I encode?", a: "It is technically impossible for us to see your messages because they never reach any server we operate. The entire app runs as JavaScript in your browser. We have no access to any content you create." },
      { q: "How does Hidey compare to self-destructing message services?", a: "Self-destructing message services store your message on a server and delete it after it is read once. Hidey never stores anything at all — the encoded message travels inside the text itself, not in a database. Different tools for different needs. If you need a one-time read that permanently disappears, a self-destruct service is better. If you want something shareable and reusable that lives in the code itself, Hidey is better." },
      { q: "Does Hidey use cookies?", a: "Hidey itself does not use cookies for any core features. If advertising is enabled in the future, Google AdSense may set cookies for ad personalisation. You will be informed via a cookie consent banner before any advertising cookies are set." },
      { q: "Is Hidey safe for children?", a: "Yes — Hidey contains no adult content, no social features, no chat, and no user accounts. It is designed as a fun, playful tool suitable for all ages. Parents should always supervise what their children share online regardless of the platform." },
      { q: "What cryptography does Hidey use?", a: "Hidey uses SHA-256 hashing via the browser's native Web Crypto API for answer and passphrase verification. Message encoding uses Base62 alphabet permutation which is obfuscation, not encryption. Hidey is designed for fun and casual privacy — not for protecting sensitive or confidential information." },
      { q: "Can someone decode my message without the pattern?", a: "With only four patterns, someone could try all of them manually in about 30 seconds. The passphrase layer eliminates this risk for practical purposes — without the passphrase, knowing the pattern produces only garbage output. Always use a passphrase if your message needs to stay genuinely private." },
    ],
  },
];

const FAQ = () => {
  useEffect(() => {
    document.title = "Frequently Asked Questions — Hidey";
    const desc = "Got questions about Hidey? Find answers about how secret message encoding works, quiz codes, privacy, security, and more in our complete FAQ.";
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
      <div className="container max-w-3xl mx-auto px-4 py-16">
        <section className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Frequently Asked Questions</h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about Hidey — how it works, how your data is handled, and how to get the most out of every mode.
          </p>
        </section>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-foreground mb-3">{section.title}</h2>
              <Card className="rounded-2xl border-border shadow-sm">
                <CardContent className="p-2 md:p-4">
                  <Accordion type="single" collapsible className="w-full">
                    {section.items.map((item, i) => (
                      <AccordionItem key={i} value={`${section.title}-${i}`} className="border-border">
                        <AccordionTrigger className="text-left text-[15px] font-medium text-foreground hover:no-underline">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </section>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-12">
          Still have questions?{" "}
          <a href="/contact" className="text-primary hover:underline font-medium">
            Visit the Contact page
          </a>{" "}
          and send us a message.
        </p>
      </div>
    </main>
  );
};

export default FAQ;
