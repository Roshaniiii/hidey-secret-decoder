import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Mode = "message" | "image" | "question";

export function HelpSidebar({ mode }: { mode: Mode }) {
  const isImage = mode === "image";
  const isQuestion = mode === "question";

  if (!isImage && !isQuestion) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-accent/50 to-card border-2 border-border rounded-2xl shadow-lg h-full">
      <CardHeader>
        <CardTitle className="text-foreground font-bold">
          {isImage ? "How to Use Image Mode" : "How to Use Question Mode"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-foreground/80 overflow-y-auto">
        {isImage ? (
          <ol className="list-decimal ml-5 space-y-2">
            <li>Upload Image – Choose the picture you want to hide.</li>
            <li>Enter Passphrase – Type a strong secret key (you’ll need it later to reveal).</li>
            <li>Click Scramble – Your image will be masked and turned into a secret code.</li>
            <li>Copy the Code – Save it or send it to someone you trust.</li>
            <li>
              To Reveal – Paste the code in the “Paste Encoded Code” box, enter the same
              passphrase, and click Reveal to see the original image again.
            </li>
          </ol>
        ) : (
          <ol className="list-decimal ml-5 space-y-2">
            <li>Enter Secret Message – Write the message that will be revealed only with the correct answer.</li>
            <li>Set a Question – Add a question the other person must answer to unlock the message.</li>
            <li>Enter the Correct Answer – Type the exact answer (in small letters).</li>
            <li>Click “Encrypt & Create Challenge” – Your message will turn into a secret challenge code.</li>
            <li>Share the Code – They must paste the code, enter the same answer, and click Load Challenge to reveal your secret message.</li>
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
