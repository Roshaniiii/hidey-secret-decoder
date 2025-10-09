import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Mode = "message" | "quiz" | "question";

export function HelpSidebar({ mode }: { mode: Mode }) {
  const isQuiz = mode === "quiz";
  const isQuestion = mode === "question";

  if (!isQuiz && !isQuestion) {
    return null;
  }

  return (
    <div className="sticky top-4">
      <Card className="bg-gradient-to-br from-accent/50 to-card border-2 border-border rounded-2xl shadow-lg h-fit max-h-[calc(100vh-2rem)] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-foreground font-bold">
            {isQuiz ? "How to Use Quiz Mode" : "How to Use Question Mode"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-foreground/80">
        {isQuiz ? (
          <ol className="list-decimal ml-5 space-y-2">
            <li>Create Quiz – Add MCQs with 4 options each, choose one correct answer.</li>
            <li>Optional Passphrase – Add a passphrase for quiz access protection.</li>
            <li>Optional Score Key – Add a score key to protect score visibility.</li>
            <li>Generate Code – Click "Generate Quiz Code" and share it.</li>
            <li>Attempt Quiz – Recipient pastes Quiz Code, enters passphrase if needed, answers questions.</li>
            <li>Submit Answers – Get Score Code to send back to quiz creator.</li>
            <li>Reveal Score – Quiz creator pastes Score Code, enters score key if needed, sees the score.</li>
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
    </div>
  );
}
