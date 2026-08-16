import { Link } from "react-router-dom";

export function SeoContent() {
  return (
    <section className="mt-14 max-w-3xl mx-auto space-y-10" aria-labelledby="about-hidey-heading">
      <div className="space-y-3">
        <h2 id="about-hidey-heading" className="text-2xl sm:text-3xl font-bold text-foreground">
          Hidey — Free Secret Message Generator, Quiz Maker & Question Lock
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Hidey is a free, browser-based tool for hiding text behind codes. Turn any message into an unreadable
          string, build a shareable multiple-choice quiz, or lock a note behind a question only the right person can
          answer. There is no sign-up, no app to install, and nothing is ever uploaded — every encode and decode runs
          entirely inside your own browser.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-foreground">Message Mode: encode and decode secret text</h3>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Type your message, pick a visual pattern (Alnum Blocks, Symbols, Caps or Hex), and Hidey converts it into a
          code you can paste into any chat, caption or card. Add an optional passphrase and the code becomes
          meaningless without it. The recipient pastes the code into the Decode tab, chooses the same pattern, enters
          the passphrase if one was used, and the original message appears instantly.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-foreground">Quiz Mode: make a shareable secret quiz</h3>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Write multiple-choice questions, set the correct answers, and Hidey packs the whole quiz into a single code.
          Share the code with friends, classmates or your team — they attempt the quiz in their browser and get a
          result code back. Paste that result into Reveal Score to see exactly how they did. No accounts, no
          leaderboards, no data collection.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-foreground">Question Mode: lock a message behind an answer</h3>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Pair a secret message with a personal question such as "Where did we first meet?". The message stays locked
          until someone types the correct answer. Answers are verified with SHA-256 hashing in the browser, so the
          plain answer never travels with the code. It is perfect for birthday surprises, proposals, treasure hunts
          and classroom challenges.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-foreground">Why people use Hidey</h3>
        <ul className="list-disc ml-5 space-y-1.5 text-sm sm:text-base text-muted-foreground">
          <li>100% client-side — your text never leaves your device</li>
          <li>No account, no email, no installation</li>
          <li>Works on phones, tablets and desktops in any modern browser</li>
          <li>Optional passphrase protection on every mode</li>
          <li>Share codes anywhere: WhatsApp, Instagram, email, notes or printed cards</li>
          <li>Completely free, with no limits on how much you encode</li>
        </ul>
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-foreground">Is Hidey secure?</h3>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Hidey is built for playful privacy. Message encoding uses Base62 pattern obfuscation, while passphrases and
          question answers are verified with SHA-256 hashing through the browser's native Web Crypto API. That is
          strong enough to keep a surprise secret from a curious friend, but it is not military-grade encryption —
          never use Hidey for passwords, financial details or genuinely confidential data. Read the full explanation
          in our <Link to="/blog/is-hidey-safe-how-your-messages-are-protected" className="text-primary hover:underline">security breakdown</Link>{" "}
          or browse the <Link to="/faq" className="text-primary hover:underline">FAQ</Link>.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-foreground">Learn more</h3>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          New here? Start with <Link to="/about" className="text-primary hover:underline">how Hidey works</Link>, then
          try the step-by-step guide on{" "}
          <Link to="/blog/how-to-send-a-secret-message-using-hidey" className="text-primary hover:underline">sending your first secret message</Link>{" "}
          or get inspired by{" "}
          <Link to="/blog/5-creative-ways-to-use-hidey-for-birthdays" className="text-primary hover:underline">creative birthday and surprise ideas</Link>.
        </p>
      </div>
    </section>
  );
}
