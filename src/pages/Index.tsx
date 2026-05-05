import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EncodeSection } from "@/components/EncodeSection";
import { DecodeSection } from "@/components/DecodeSection";
import { QuizCreateSection } from "@/components/QuizCreateSection";
import { QuizAttemptSection } from "@/components/QuizAttemptSection";
import { QuizRevealSection } from "@/components/QuizRevealSection";
import { QuestionEncodeSection } from "@/components/QuestionEncodeSection";
import { QuestionDecodeSection } from "@/components/QuestionDecodeSection";
import { PatternExamples } from "@/components/PatternExamples";
import { HelpSidebar } from "@/components/HelpSidebar";
import { useSharedContent } from "@/hooks/useSharedContent";
import { Lock, Unlock, MessageSquare, HelpCircle, ListChecks } from "lucide-react";

const Index = () => {
  const shared = useSharedContent();
  const [mode, setMode] = useState<"message" | "quiz" | "question">(shared.initialMode ?? "message");
  const [messageSubTab, setMessageSubTab] = useState<string>(shared.message ? "decode" : "encode");
  const [quizSubTab, setQuizSubTab] = useState<string>(shared.quizCode ? "attempt" : "create");

  useEffect(() => {
    if (shared.initialMode) setMode(shared.initialMode);
    if (shared.message) setMessageSubTab("decode");
    if (shared.quizCode) setQuizSubTab("attempt");
  }, [shared.initialMode, shared.message, shared.quizCode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/20 pb-8">
      <div className="container max-w-6xl mx-auto px-4 py-6 sm:py-12">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 space-y-1">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
            Hidey
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground font-medium">
            Hide it. Share it. Reveal it.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={mode} onValueChange={(value) => setMode(value as "message" | "quiz" | "question")} defaultValue="message" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-card border-2 border-border rounded-2xl p-1 h-14 mb-6">
                <TabsTrigger 
                  value="message" 
                  className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold"
                >
                  <MessageSquare className="mr-2 h-4 w-4 hidden sm:block" />
                  Message
                </TabsTrigger>
                <TabsTrigger 
                  value="quiz"
                  className="rounded-xl data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground font-semibold"
                >
                  <ListChecks className="mr-2 h-4 w-4 hidden sm:block" />
                  Quiz
                </TabsTrigger>
                <TabsTrigger 
                  value="question"
                  className="rounded-xl data-[state=active]:bg-accent data-[state=active]:text-accent-foreground font-semibold"
                >
                  <HelpCircle className="mr-2 h-4 w-4 hidden sm:block" />
                  Question
                </TabsTrigger>
              </TabsList>
              
              {/* Message Mode */}
              <TabsContent value="message" className="space-y-0">
                <Tabs value={messageSubTab} onValueChange={setMessageSubTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-card border-2 border-border rounded-2xl p-1 h-14">
                    <TabsTrigger 
                      value="encode" 
                      className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold"
                    >
                      <Lock className="mr-2 h-4 w-4 hidden sm:block" />
                      Encode
                    </TabsTrigger>
                    <TabsTrigger 
                      value="decode"
                      className="rounded-xl data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground font-semibold"
                    >
                      <Unlock className="mr-2 h-4 w-4 hidden sm:block" />
                      Decode
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="encode" className="mt-6">
                    <div className="bg-card border-2 border-border rounded-2xl p-4 sm:p-6 shadow-lg w-full">
                      <EncodeSection />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="decode" className="mt-6">
                    <div className="bg-card border-2 border-border rounded-2xl p-4 sm:p-6 shadow-lg w-full">
                      <DecodeSection
                        initialMessage={shared.message}
                        initialPattern={shared.pattern}
                        sharedHasPassphrase={shared.hasPassphrase}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </TabsContent>

              {/* Quiz Mode */}
              <TabsContent value="quiz" className="space-y-0">
                <Tabs value={quizSubTab} onValueChange={setQuizSubTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-card border-2 border-border rounded-2xl p-1 h-14">
                    <TabsTrigger 
                      value="create" 
                      className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold text-xs sm:text-sm px-1 sm:px-3"
                    >
                      <Lock className="mr-1 sm:mr-2 h-4 w-4 shrink-0 hidden sm:block" />
                      <span className="truncate">Create Quiz</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="attempt"
                      className="rounded-xl data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground font-semibold text-xs sm:text-sm px-1 sm:px-3"
                    >
                      <HelpCircle className="mr-1 sm:mr-2 h-4 w-4 shrink-0 hidden sm:block" />
                      <span className="truncate">Attempt Quiz</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="reveal"
                      className="rounded-xl data-[state=active]:bg-accent data-[state=active]:text-accent-foreground font-semibold text-xs sm:text-sm px-1 sm:px-3"
                    >
                      <Unlock className="mr-1 sm:mr-2 h-4 w-4 shrink-0 hidden sm:block" />
                      <span className="truncate">Reveal Score</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="create" className="mt-6">
                    <div className="bg-card border-2 border-border rounded-2xl p-4 sm:p-6 shadow-lg w-full">
                      <QuizCreateSection />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="attempt" className="mt-6">
                    <div className="bg-card border-2 border-border rounded-2xl p-4 sm:p-6 shadow-lg w-full">
                      <QuizAttemptSection initialQuizCode={shared.quizCode} />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="reveal" className="mt-6">
                    <div className="bg-card border-2 border-border rounded-2xl p-4 sm:p-6 shadow-lg w-full">
                      <QuizRevealSection />
                    </div>
                  </TabsContent>
                </Tabs>
              </TabsContent>

              {/* Question Mode */}
              <TabsContent value="question" className="space-y-0">
                <Tabs defaultValue="create" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-card border-2 border-border rounded-2xl p-1 h-14">
                    <TabsTrigger 
                      value="create" 
                      className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold"
                    >
                      <Lock className="mr-2 h-4 w-4 hidden sm:block" />
                      Create Challenge
                    </TabsTrigger>
                    <TabsTrigger 
                      value="unlock"
                      className="rounded-xl data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground font-semibold"
                    >
                      <Unlock className="mr-2 h-4 w-4 hidden sm:block" />
                      Unlock
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="create" className="mt-6">
                    <div className="bg-card border-2 border-border rounded-2xl p-4 sm:p-6 shadow-lg w-full">
                      <QuestionEncodeSection />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="unlock" className="mt-6">
                    <div className="bg-card border-2 border-border rounded-2xl p-4 sm:p-6 shadow-lg w-full">
                      <QuestionDecodeSection />
                    </div>
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 h-fit">
            {mode === "quiz" || mode === "question" ? (
              <HelpSidebar mode={mode} />
            ) : (
              <PatternExamples />
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Index;
