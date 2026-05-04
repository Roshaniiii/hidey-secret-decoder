import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Copy, Lock, Eye, EyeOff, X } from 'lucide-react';
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
  const [showAnswer, setShowAnswer] = useState(false);
  const [showPassphrase, setShowPassphrase] = useState(false);
  const { toast } = useToast();


  const handleClear = () => {
    setMessage('');
    setQuestion('');
    setAnswer('');
    setPassphrase('');
    setUsePassphrase(false);
    setEncoded('');
    toast({ title: 'Cleared', description: 'Form has been reset.' });
  };

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


  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-foreground font-semibold">Create Challenge</Label>
          {(message || question || answer || passphrase || encoded) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="mr-1 h-3 w-3" />
              Clear all
            </Button>
          )}
        </div>
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
          <div className="relative mt-2">
            <Input
              id="answer"
              type={showAnswer ? 'text' : 'password'}
              placeholder="Enter the correct answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowAnswer((v) => !v)}
              aria-label={showAnswer ? 'Hide answer' : 'Show answer'}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showAnswer ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
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
            Passphrase Protection (extra security)
          </Label>
        </div>

        {usePassphrase && (
          <div>
            <Label htmlFor="passphrase">Passphrase</Label>
            <div className="relative mt-2">
              <Input
                id="passphrase"
                type={showPassphrase ? 'text' : 'password'}
                placeholder="Enter your private key"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassphrase((v) => !v)}
                aria-label={showPassphrase ? 'Hide passphrase' : 'Show passphrase'}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassphrase ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
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
        <div className="space-y-3 animate-fade-in">
          <Label className="text-foreground font-semibold">Challenge Code</Label>
          <div className="p-4 bg-muted rounded-xl break-all font-mono text-sm border-2 border-border">
            {encoded}
          </div>
          <Button onClick={handleCopy} variant="outline" className="w-full rounded-xl border-2">
            <Copy className="mr-2 h-4 w-4" />
            Copy Code
          </Button>
        </div>
      )}
    </div>
  );
}
