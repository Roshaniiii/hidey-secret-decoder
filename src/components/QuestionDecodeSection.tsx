import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Copy, Unlock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { decodeQuestionStructure, verifyAndDecode, QuestionData } from '@/lib/questionEncoding';

export function QuestionDecodeSection() {
  const [encodedText, setEncodedText] = useState('');
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [usePassphrase, setUsePassphrase] = useState(false);
  const [decoded, setDecoded] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const { toast } = useToast();

  // Check for URL hash on mount
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#question-decode=')) {
      const code = decodeURIComponent(hash.replace('#question-decode=', ''));
      setEncodedText(code);
      handleLoadChallengeFromCode(code);
      // Clear the hash
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const handleLoadChallengeFromCode = (code: string) => {
    try {
      const data = decodeQuestionStructure(code);
      setQuestionData(data);
      setAttempts(0);
    } catch (error) {
      toast({
        title: 'Invalid Code',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleLoadChallenge = () => {
    try {
      const data = decodeQuestionStructure(encodedText);
      setQuestionData(data);
      setAttempts(0);
      toast({
        title: 'Challenge Loaded! 🧩',
        description: 'Now answer the question to unlock the message.',
      });
    } catch (error) {
      toast({
        title: 'Invalid Code',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleUnlock = async () => {
    if (!questionData) return;

    setIsLoading(true);
    try {
      const result = await verifyAndDecode(
        questionData,
        userAnswer,
        usePassphrase ? passphrase : undefined
      );

      if (result.success && result.message) {
        setDecoded(result.message);
        toast({
          title: '✨ Message Unlocked!',
          description: 'You got the answer right!',
        });
      } else {
        setAttempts(attempts + 1);
        
        // Check if error suggests private pattern was used
        if (result.error && result.error.includes('decode') && !usePassphrase) {
          toast({
            title: '🔐 Private Pattern May Be Required',
            description: 'This message might use a private pattern. Try checking the box and entering the passphrase.',
            variant: 'destructive',
          });
        } else {
          const messages = [
            '❌ Nope, try again!',
            '🤔 Close, but not quite...',
            '🔐 The message remains hidden!',
          ];
          toast({
            title: messages[Math.min(attempts, 2)],
            description: result.error || 'Incorrect answer',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(decoded);
    toast({
      title: 'Copied! 📋',
      description: 'Message copied to clipboard.',
    });
  };

  const handleReset = () => {
    setEncodedText('');
    setQuestionData(null);
    setUserAnswer('');
    setDecoded('');
    setAttempts(0);
    setPassphrase('');
    setUsePassphrase(false);
  };

  return (
    <div className="space-y-6">
      {!questionData ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="encoded">Paste Challenge Code</Label>
            <Textarea
              id="encoded"
              placeholder="Paste your QMODE:: challenge code here..."
              value={encodedText}
              onChange={(e) => setEncodedText(e.target.value)}
              className="mt-2 min-h-[100px] font-mono"
            />
          </div>

          <Button
            onClick={handleLoadChallenge}
            disabled={!encodedText}
            className="w-full"
            size="lg"
          >
            Load Challenge
          </Button>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 bg-muted rounded-lg space-y-4">
            <div>
              <Label className="text-lg font-semibold">🧩 Challenge:</Label>
              <p className="mt-2 text-lg">{questionData.question}</p>
            </div>

            <div>
              <Label htmlFor="userAnswer">Your Answer</Label>
              <Input
                id="userAnswer"
                type="text"
                placeholder="Enter your answer"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="mt-2"
                disabled={!!decoded}
              />
              <p className="text-xs text-muted-foreground mt-1">
                ⚠️ Case-sensitive. It's best to use lowercase letters.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="usePassphraseDecrypt"
                checked={usePassphrase}
                onChange={(e) => setUsePassphrase(e.target.checked)}
                className="rounded"
                disabled={!!decoded}
              />
              <Label htmlFor="usePassphraseDecrypt" className="cursor-pointer">
                Private Pattern was used
              </Label>
            </div>

            {usePassphrase && !decoded && (
              <div>
                <Label htmlFor="passphraseDecrypt">Passphrase</Label>
                <Input
                  id="passphraseDecrypt"
                  type="password"
                  placeholder="Enter the private key"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="mt-2"
                />
              </div>
            )}

            {!decoded && (
              <Button
                onClick={handleUnlock}
                disabled={isLoading || !userAnswer}
                className="w-full"
                size="lg"
              >
                <Unlock className="mr-2 h-4 w-4" />
                {isLoading ? 'Checking answer...' : 'Unlock Message'}
              </Button>
            )}
          </div>

          {decoded && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <Label className="text-lg font-semibold">✨ Unlocked Message:</Label>
                <div className="mt-2 p-4 bg-muted rounded-lg whitespace-pre-wrap">
                  {decoded}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCopy} variant="outline" className="flex-1">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Message
                </Button>
                <Button onClick={handleReset} variant="outline" className="flex-1">
                  New Challenge
                </Button>
              </div>
            </div>
          )}

          {!decoded && (
            <Button onClick={handleReset} variant="ghost" className="w-full">
              Cancel
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
