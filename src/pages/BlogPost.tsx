import { useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { blogPosts } from "./Blog";

type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string };

const posts: Record<string, { meta: typeof blogPosts[number]; blocks: Block[] }> = {
  "how-to-send-a-secret-message-using-hidey": {
    meta: blogPosts[0],
    blocks: [
      { type: "p", text: "Have you ever searched for a secret message website where you could hide text and send it to someone without anyone else being able to read it? Maybe a birthday surprise, an inside joke, or just something personal you wanted to keep between the two of you." },
      { type: "p", text: "Hidey is exactly that — a free secret message generator online that lets you encode any text into a scrambled, unreadable string and share it with anyone. No signup. No account. No data stored on any server. Everything happens right in your browser." },
      { type: "p", text: "Here is a complete step-by-step guide to sending your first secret message." },
      { type: "h2", text: "Step 1 — Open Hidey and go to Message Mode" },
      { type: "p", text: "Visit Hidey and you will land directly on the Message tab. This is your hidden message tool — the place where ordinary text becomes something only the right person can read." },
      { type: "h2", text: "Step 2 — Type your secret message" },
      { type: "p", text: "Click into the message box and type whatever you want to hide. You can write anything — a sentence, a paragraph, emoji, or even a message in Hindi, Arabic, Chinese, Spanish, or any other language. Hidey supports all scripts and languages because it uses UTF-8 byte encoding underneath." },
      { type: "h2", text: "Step 3 — Pick an encoding pattern" },
      { type: "p", text: "You will see a dropdown called Pick a Pattern. There are four options — Alnum Blocks, Symbol Stream, Caps Blast, and Hex Weave. Each one transforms your message into a completely different looking output." },
      { type: "p", text: "Quick guide: Alnum Blocks produces groups of letters and numbers. Symbol Stream uses special characters and symbols. Caps Blast creates uppercase letter clusters. Hex Weave generates hexadecimal-style blocks." },
      { type: "p", text: "Pick whichever one you like — just remember to tell your friend which pattern you used so they can decode it on their end." },
      { type: "h2", text: "Step 4 — Add a passphrase (optional but recommended)" },
      { type: "p", text: "Toggle the Private Pattern switch and enter a passphrase. This shuffles the encoding alphabet using your passphrase as a seed — making the message unreadable even to someone who knows the pattern. Share the passphrase with your friend separately, never in the same message as the encoded text." },
      { type: "h2", text: "Step 5 — Click Encode and Copy" },
      { type: "p", text: "Hit the Encode button. Your message instantly transforms into scrambled, unreadable text. Click Copy Text and paste it anywhere — WhatsApp, Instagram DM, email, Twitter, or even a physical note." },
      { type: "h2", text: "Step 6 — Your friend decodes it" },
      { type: "p", text: "Tell your friend to open Hidey, go to the Decode tab, paste the encoded text, select the same pattern, enter the passphrase if you set one, and click Decode. Their screen reveals your original message instantly." },
      { type: "p", text: "That is it. No app to download. No account to create. No link that expires. Just a fast, private secret message tool that works on any device." },
      { type: "p", text: "Pro tip: For extra fun, use Question Mode — your friend has to answer a question correctly before they can even see your message. It turns a simple text into a mini puzzle game for friends." },
    ],
  },
  "5-creative-ways-to-use-hidey-for-birthdays": {
    meta: blogPosts[1],
    blocks: [
      { type: "p", text: "Most people who find a secret message website use it once to send a quick encoded text and then forget about it. But if you dig a little deeper, tools like Hidey open up a whole world of creative possibilities — especially for birthdays, surprises, and fun moments with the people you care about." },
      { type: "p", text: "Here are five genuinely creative ways to use Hidey that go way beyond a simple encoded message." },
      { type: "h2", text: "1. The Birthday Treasure Hunt" },
      { type: "p", text: "Create a series of Question Mode challenges where each decoded message contains a clue to the next location. For example, hide a message that says \"Check under your pillow\" behind the question \"What is our favourite song?\" Each solved clue leads to the next, and the final one reveals the surprise." },
      { type: "p", text: "This is one of the most popular uses of hidden message tools among Hidey users — and it works brilliantly for kids and adults alike. You can make it as simple or as elaborate as you like." },
      { type: "h2", text: "2. The Secret Birthday Wish" },
      { type: "p", text: "Instead of a plain birthday message on WhatsApp, send your friend a Hidey-encoded version using the Hex Weave pattern. The extra few seconds of decoding makes the message feel personal and intentional — like it was crafted just for them. Because it was." },
      { type: "p", text: "This works especially well on social media where posts are public. Posting an encoded message on someone's timeline means only they can read it if they know the pattern." },
      { type: "h2", text: "3. The Mystery Quiz" },
      { type: "p", text: "Create a Quiz Mode challenge with questions only a true close friend would know — shared memories, inside jokes, movies you watched together, places you have been. Send the HIDEYQ code and challenge them to score 100 percent." },
      { type: "p", text: "Unlike other puzzle game for friends apps, Hidey requires no download, no account, and generates a compact shareable code that works forever. It does not expire. You can challenge the same friend again months later with the same code." },
      { type: "h2", text: "4. The Surprise Announcement" },
      { type: "p", text: "Planning to share big news — a promotion, a trip, an engagement? Encode the announcement in Hidey and send the code to your inner circle with just one instruction: decode this." },
      { type: "p", text: "The process of decoding transforms even ordinary news into a small event. People remember experiences, not just information." },
      { type: "h2", text: "5. The Family Secret Recipe" },
      { type: "p", text: "Have a recipe or a family secret you only want to share with certain people? Encode it with a passphrase only family members know. Send the encoded text to everyone. Only the right people can decode it." },
      { type: "p", text: "This is one of the most unique uses of create secret messages online functionality — turning something ordinary into something that feels exclusive and meaningful." },
      { type: "p", text: "All five of these ideas work on any device, require no signup, and take under two minutes to set up. That is the whole point of Hidey." },
    ],
  },
  "is-hidey-safe-how-your-messages-are-protected": {
    meta: blogPosts[2],
    blocks: [
      { type: "p", text: "Before trusting any secret message website with your private communications, you should understand exactly how it handles your data. Most tools in this space are vague about this. We are not going to be." },
      { type: "p", text: "Here is a completely honest, plain-English breakdown of how Hidey protects your content — and where its limits are." },
      { type: "h2", text: "How Hidey Works — The Simple Version" },
      { type: "p", text: "Hidey runs entirely in your browser. When you type a message and click Encode, the encoding happens on your device using JavaScript. The message never travels to any server. We do not have a server. There is no database. There is no backend of any kind." },
      { type: "p", text: "This is what 100 percent client-side means. Your data stays on your machine. We cannot see it because it never reaches us. Compare this to most secret message websites that store your messages on their servers — even temporarily — before delivering them." },
      { type: "h2", text: "What Hidey Does Well" },
      { type: "p", text: "No data collection — Hidey collects no personal information. No name, no email, no location, no usage data. Nothing at all." },
      { type: "p", text: "No accounts — Without accounts there is nothing to hack. No password database to breach, no user profiles to steal." },
      { type: "p", text: "SHA-256 answer hashing — In Question Mode, your answer is run through SHA-256 hashing using your browser's native Web Crypto API before being embedded in the challenge code. The original answer cannot be mathematically recovered from this hash. This is the same technology used in professional security systems." },
      { type: "p", text: "Passphrase protection — When you add a passphrase it shuffles the encoding alphabet in a way unique to your passphrase. Without the exact passphrase the message cannot be decoded even if someone knows the pattern." },
      { type: "h2", text: "Where Hidey Has Limits" },
      { type: "p", text: "Hidey uses obfuscation, not encryption. There is a critical difference." },
      { type: "p", text: "Encryption like AES-256 is mathematically impossible to reverse without the key — even the most powerful computers in the world would take billions of years. Obfuscation makes content hard to read but is not designed to withstand a determined technical attack." },
      { type: "p", text: "In practice this means: someone with technical knowledge could try all four patterns in about 30 seconds. The passphrase layer makes this much harder but the underlying system is not cryptographically unbreakable." },
      { type: "h2", text: "How Hidey Compares to Other Tools" },
      { type: "p", text: "Some competitors in the hidden message tool space offer self-destructing messages — links that expire after being read once. That is a different use case. Self-destructing links require a server to store and delete the message, which means someone is handling your data even briefly." },
      { type: "p", text: "Hidey takes the opposite approach — because nothing is stored anywhere, there is nothing to breach, nothing to expire, and nothing to lose. The tradeoff is that your encoded message can theoretically be decoded by anyone who tries all patterns. The passphrase eliminates this risk for practical purposes." },
      { type: "h2", text: "Our Honest Recommendation" },
      { type: "p", text: "Use Hidey for fun, surprises, birthday messages, quiz games, and casual privacy between people who trust each other. Do not use Hidey for passwords, financial information, medical details, or anything genuinely sensitive. For that, use properly encrypted tools like Signal." },
      { type: "p", text: "Being honest about this makes Hidey more trustworthy, not less." },
    ],
  },
  "how-to-create-the-perfect-secret-quiz": {
    meta: blogPosts[3],
    blocks: [
      { type: "p", text: "If you have been looking for a puzzle game for friends that requires no app download, no account, and works instantly on any phone — Hidey's Quiz Mode is exactly that." },
      { type: "p", text: "Unlike other quiz platforms that require both creator and taker to sign up, Hidey generates a compact shareable code. Your friend pastes it anywhere, answers the questions, and sends back a score code. No friction. No barrier. Just the quiz." },
      { type: "p", text: "Here is how to make a great one." },
      { type: "h2", text: "Step 1 — Go to Quiz Mode and select Create Quiz" },
      { type: "p", text: "Open Hidey, click the Quiz tab, and you will see the Create Quiz section. This is where you build your questions." },
      { type: "h2", text: "Step 2 — Write questions that only real friends would know" },
      { type: "p", text: "Each question needs exactly 4 options and one correct answer marked in green. The best quiz questions are personal — things only someone who actually knows you would get right." },
      { type: "p", text: "Some ideas to get started:" },
      { type: "p", text: "Friendship questions: What is my middle name? Where did we first meet? What is my biggest fear? What do I always order at our favourite restaurant?" },
      { type: "p", text: "Pop culture: Which artist has the most Grammy wins? What year did the first iPhone launch? Which film won the most Oscars this year?" },
      { type: "p", text: "General knowledge: What is the capital of Australia? Who painted the Mona Lisa? What is the fastest land animal?" },
      { type: "h2", text: "Step 3 — Add a passphrase if needed" },
      { type: "p", text: "If you want to keep your quiz private — for a specific group of friends or a classroom — add a passphrase. Only people who know it can attempt the quiz." },
      { type: "h2", text: "Step 4 — Add a Score Key" },
      { type: "p", text: "This is one of the cleverest features on any secret message website in this space. The Score Key means only you — the quiz creator — can reveal the score. Even if someone intercepts the HIDEYS score code, they cannot see the result without your Score Key. Perfect for competitive friend groups where you want to be the official scorekeeper." },
      { type: "h2", text: "Step 5 — Generate, Share, Reveal" },
      { type: "p", text: "Click Generate Quiz Code. You will get a HIDEYQ-XXXX code. Share it via any messaging app. Your friend pastes it into Attempt Quiz, answers all questions, and gets a HIDEYS-XXXX score code. They send it back. You reveal their score in the Reveal Score section." },
      { type: "p", text: "Tips for a great quiz: Keep it to 5-10 questions for best engagement. Mix easy and hard questions. Start easy to build confidence. Challenge multiple friends with the same code and compare scores." },
    ],
  },
  "what-is-message-obfuscation-simple-guide": {
    meta: blogPosts[4],
    blocks: [
      { type: "p", text: "If you have ever searched for a secret message generator online or a website to hide message content, you have probably seen tools that describe themselves as using obfuscation. But what does that actually mean? How is it different from encryption? And when should you use one versus the other?" },
      { type: "p", text: "This guide answers all of that in plain English — no technical background required." },
      { type: "h2", text: "What is Obfuscation?" },
      { type: "p", text: "The word comes from Latin meaning to darken or confuse. In computing, obfuscation means transforming information into something that looks meaningless to an observer — while still being perfectly recoverable by someone who knows the method." },
      { type: "p", text: "Think of it like a secret language you invented with a friend as a kid — where A becomes 1, B becomes 2, and so on. That is a substitution cipher, one of the oldest forms of obfuscation in human history. Julius Caesar used one to communicate with his generals. Mary Queen of Scots used complex symbol substitution in the 16th century. During World War II entire teams of mathematicians worked on cracking obfuscated enemy messages." },
      { type: "p", text: "Today you can create secret messages online using tools like Hidey in seconds. The underlying logic is the same. The execution is faster." },
      { type: "h2", text: "How is Obfuscation Different from Encryption?" },
      { type: "p", text: "This is the most important distinction in the entire hidden message tool space and most sites do not explain it clearly." },
      { type: "p", text: "Encryption uses complex mathematical algorithms — AES-256, RSA, ChaCha20 — that make data mathematically impossible to reverse without the key. Even the most powerful supercomputers would take billions of years to crack properly implemented modern encryption." },
      { type: "p", text: "Obfuscation makes data hard to read — confusing enough that a casual observer cannot make sense of it — but it is not designed to resist a determined technical attack. Someone with technical knowledge and motivation could potentially decode an obfuscated message if they tried hard enough." },
      { type: "p", text: "The practical difference: encryption protects against sophisticated attackers. Obfuscation protects against casual observers and automated systems scanning for readable text." },
      { type: "h2", text: "How Hidey's Obfuscation Works" },
      { type: "p", text: "Hidey converts your message into UTF-8 bytes — the universal standard for representing text in computers. It converts those bytes into a large number using Base62 math, then maps that number onto a custom alphabet based on whichever pattern you chose." },
      { type: "p", text: "If you add a passphrase, Hidey shuffles that alphabet using your passphrase as a seed — so the same message with a different passphrase produces completely different output every time. Without both the pattern and the passphrase, the result looks like complete random noise." },
      { type: "p", text: "This is what makes Hidey stand out among secret message websites — four distinct encoding patterns plus optional passphrase protection, all running client-side with no server involvement." },
      { type: "h2", text: "Comparing Hidey to Self-Destructing Message Tools" },
      { type: "p", text: "Some popular tools in the create secret messages online category focus on self-destructing links — messages that disappear after being read once. These tools require a server to store and then delete the message. There is a window — however brief — where your message exists on someone else's infrastructure." },
      { type: "p", text: "Hidey takes a fundamentally different approach. Because no message is ever stored anywhere, there is nothing to self-destruct and nothing to breach. The encoded text travels in the message itself — not in a database link." },
      { type: "p", text: "The right choice depends on your use case. If you need a message to be permanently unrecoverable after reading, a self-destruct tool is better. If you want to share something fun and private that can be decoded by the right person at any time, Hidey is the better fit." },
      { type: "h2", text: "When Should You Use Obfuscation?" },
      { type: "p", text: "Obfuscation is the right choice when you want to share something personal without it being immediately readable by anyone who glances at the screen, when you are creating a puzzle game for friends or a treasure hunt, when you want basic privacy without complexity, or when the message is fun and personal rather than genuinely sensitive." },
      { type: "p", text: "Obfuscation is NOT the right choice for passwords, financial information, medical details, or anything where a determined attacker might be motivated." },
      { type: "p", text: "For sensitive communications, use Signal, WhatsApp's encrypted backup, or a proper password manager." },
      { type: "h2", text: "The Bottom Line" },
      { type: "p", text: "Obfuscation has been used for thousands of years and is still perfectly relevant today — just not for the same things as cryptographic encryption. Understanding the difference makes you a smarter user of every tool in this space, including Hidey." },
    ],
  },
  "secret-message-ideas-for-couples": {
    meta: blogPosts[5],
    blocks: [
      { type: "p", text: "Romance is not always about grand gestures. Sometimes the most meaningful moments come from small, intentional surprises — like a private message only your partner can decode. Hidey makes that easy, turning an ordinary text into something playful, mysterious, and personal." },
      { type: "p", text: "Here are six romantic secret message ideas for couples that work on any phone, require no signup, and take less than a minute to create." },
      { type: "h2", text: "1. The Good Morning Encoded Note" },
      { type: "p", text: "Instead of sending a plain 'good morning' text, encode it with the Symbol Stream pattern and add a passphrase you both know — maybe the date you first met or your favourite song lyric. Your partner wakes up to a puzzle that turns into a sweet message once decoded." },
      { type: "p", text: "It is a small ritual that makes the everyday feel special." },
      { type: "h2", text: "2. The Anniversary Love Letter" },
      { type: "p", text: "Write a short love note, encode it, and send it on your anniversary before you even see each other. The act of decoding becomes part of the gift. You can even hide the passphrase inside a real-world clue, like the page number of the book you both love." },
      { type: "p", text: "This works beautifully for birthdays, Valentine's Day, or 'just because' moments too." },
      { type: "h2", text: "3. The Apology That Feels Thoughtful" },
      { type: "p", text: "Saying sorry over text can feel flat. Encoding your apology adds effort and thoughtfulness without being dramatic. It tells your partner you took an extra step to make the message personal — because they are worth that extra step." },
      { type: "p", text: "Keep it genuine. The format should support the message, not replace it." },
      { type: "h2", text: "4. Long-Distance Relationship Check-Ins" },
      { type: "p", text: "Distance is hard, but small rituals help. Send encoded check-in messages once a week with a rotating passphrase based on something you both experienced — the last movie you watched together online, the name of the restaurant you want to try, or a private joke." },
      { type: "p", text: "It gives long-distance couples a shared activity that feels intimate, even across time zones." },
      { type: "h2", text: "5. The Bedroom Scavenger Hunt" },
      { type: "p", text: "Use Question Mode to create a mini scavenger hunt around your home. Each solved question reveals a clue to the next location. The final message might reveal a surprise date night, a handwritten letter, or simply 'I love you' waiting somewhere unexpected." },
      { type: "p", text: "This turns a simple message into an experience — and experiences are what people remember." },
      { type: "h2", text: "6. The 'I Miss You' Code" },
      { type: "p", text: "When you miss your partner during the day, send an encoded 'I miss you' with no explanation. The mystery will make them smile before they even decode it. It is a quiet way to say you are thinking about them without using the same words everyone else uses." },
      { type: "h2", text: "Make It Yours" },
      { type: "p", text: "The best secret messages are not about complexity — they are about meaning. Use a pattern and passphrase that belong to your relationship. Inside jokes, shared memories, and private references make the message feel like it was built just for them. Because it was." },
      { type: "p", text: "Hidey keeps it simple so you can focus on the message, not the tool." },
    ],
  },
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? posts[slug] : undefined;

  useEffect(() => {
    if (!post) return;
    document.title = `${post.meta.title} — Hidey Blog`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", post.meta.description);
  }, [post]);

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/20">
      <div className="container max-w-3xl mx-auto px-4 py-16">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        <article>
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground flex-wrap">
              <Badge variant="secondary" className="rounded-full">{post.meta.category}</Badge>
              <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{post.meta.date}</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{post.meta.readTime}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-3">
              {post.meta.title}
            </h1>
            <p className="text-base text-muted-foreground">{post.meta.description}</p>
          </header>

          <Card className="rounded-2xl border-border shadow-sm">
            <CardContent className="p-6 md:p-8">
              <div className="space-y-4">
                {post.blocks.map((block, i) =>
                  block.type === "h2" ? (
                    <h2 key={i} className="text-xl font-semibold text-foreground pt-4">{block.text}</h2>
                  ) : (
                    <p key={i} className="text-[15px] leading-relaxed text-muted-foreground">{block.text}</p>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </article>
      </div>
    </main>
  );
};

export default BlogPost;
