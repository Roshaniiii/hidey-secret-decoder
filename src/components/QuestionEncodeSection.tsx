import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Copy, Lock, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { encodeQuestionMessage } from '@/lib/questionEncoding';
import { PatternType } from '@/lib/encoding';

export function QuestionEncodeSection() {
  const [message, setMessage] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [patternType, setPatternType] = useState<PatternType>('alnum');
  const [passphrase, setPassphrase] = useState('');
  const [usePassphrase, setUsePassphrase] = useState(false);
  const [encoded, setEncoded] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEncode = async () => {
    if (!message || !question || !answer) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in the message, question, and answer.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await encodeQuestionMessage(
        message,
        question,
        answer,
        patternType,
        usePassphrase ? passphrase : undefined
      );
      setEncoded(result);
      toast({
        title: 'Challenge Created! 🎉',
        description: 'Your question-locked message is ready.',
      });
    } catch (error) {
      toast({
        title: 'Encoding Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(encoded);
    toast({
      title: 'Copied! 📋',
      description: 'Challenge code copied to clipboard.',
    });
  };

  // Share option removed as requested

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-3 sm:space-y-4">
        <div>
          <Label htmlFor="message">Enter your secret message</Label>
          <Textarea
            id="message"
            placeholder="Type your secret message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-2 min-h-[100px]"
          />
        </div>

        <div>
          <Label htmlFor="question">Enter your question</Label>
          <Input
            id="question"
            placeholder="e.g., What's our favorite city?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="answer">Answer (case-sensitive)</Label>
          <Input
            id="answer"
            type="password"
            placeholder="Enter the correct answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            💡 It's better to write the answer in lowercase for consistency
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="usePassphrase"
            checked={usePassphrase}
            onChange={(e) => setUsePassphrase(e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="usePassphrase" className="cursor-pointer">
            Private Pattern (extra security)
          </Label>
        </div>

        {usePassphrase && (
          <div>
            <Label htmlFor="passphrase">Passphrase</Label>
            <Input
              id="passphrase"
              type="password"
              placeholder="Enter your private key"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              className="mt-2"
            />
          </div>
        )}

        <Button
          onClick={handleEncode}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          <Lock className="mr-2 h-4 w-4" />
          {isLoading ? 'Creating Challenge...' : '🔒 Encrypt & Create Challenge'}
        </Button>
      </div>

      {encoded && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <Label>Challenge Code</Label>
            <div className="mt-2 p-4 bg-muted rounded-lg break-all font-mono text-sm">
              {encoded}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleCopy} variant="outline" className="flex-1">
              <Copy className="mr-2 h-4 w-4" />
              Copy Code
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
