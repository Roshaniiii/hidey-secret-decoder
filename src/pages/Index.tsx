import { useState } from "react";
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
import { Lock, Unlock, MessageSquare, HelpCircle, ListChecks } from "lucide-react";

const Index = () => {
  const [mode, setMode] = useState<"message" | "quiz" | "question">("message");
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/20">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <div className="inline-block p-3 bg-primary/20 rounded-2xl mb-4">
            <Lock className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-6xl font-bold text-foreground mb-3 tracking-tight">
            Hidey
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
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
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message Mode
                </TabsTrigger>
                <TabsTrigger 
                  value="quiz"
                  className="rounded-xl data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground font-semibold"
                >
                  <ListChecks className="mr-2 h-4 w-4" />
                  Quiz Mode
                </TabsTrigger>
                <TabsTrigger 
                  value="question"
                  className="rounded-xl data-[state=active]:bg-accent data-[state=active]:text-accent-foreground font-semibold"
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Question Mode
                </TabsTrigger>
              </TabsList>
              
              {/* Message Mode */}
              <TabsContent value="message" className="space-y-0">
                <Tabs defaultValue="encode" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-card border-2 border-border rounded-2xl p-1 h-14">
                    <TabsTrigger 
                      value="encode" 
                      className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold"
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Encode
                    </TabsTrigger>
                    <TabsTrigger 
                      value="decode"
                      className="rounded-xl data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground font-semibold"
                    >
                      <Unlock className="mr-2 h-4 w-4" />
                      Decode
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="encode" className="mt-6">
                    <div className="bg-card border-2 border-border rounded-2xl p-6 shadow-lg">
                      <EncodeSection />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="decode" className="mt-6">
                    <div className="bg-card border-2 border-border rounded-2xl p-6 shadow-lg">
                      <DecodeSection />
                    </div>
                  </TabsContent>
                </Tabs>
              </TabsContent>

              {/* Quiz Mode */}
              <TabsContent value="quiz" className="space-y-0">
                <Tabs defaultValue="create" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-card border-2 border-border rounded-2xl p-1 h-14">
                    <TabsTrigger 
                      value="create" 
                      className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold"
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Create Quiz
                    </TabsTrigger>
                    <TabsTrigger 
                      value="attempt"
                      className="rounded-xl data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground font-semibold"
                    >
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Attempt Quiz
                    </TabsTrigger>
                    <TabsTrigger 
                      value="reveal"
                      className="rounded-xl data-[state=active]:bg-accent data-[state=active]:text-accent-foreground font-semibold"
                    >
                      <Unlock className="mr-2 h-4 w-4" />
                      Reveal Score
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="create" className="mt-6">
                    <div className="bg-card border-2 border-border rounded-2xl p-6 shadow-lg">
                      <QuizCreateSection />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="attempt" className="mt-6">
                    <div className="bg-card border-2 border-border rounded-2xl p-6 shadow-lg">
                      <QuizAttemptSection />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="reveal" className="mt-6">
                    <div className="bg-card border-2 border-border rounded-2xl p-6 shadow-lg">
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
                      <Lock className="mr-2 h-4 w-4" />
                      Create Challenge
                    </TabsTrigger>
                    <TabsTrigger 
                      value="unlock"
                      className="rounded-xl data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground font-semibold"
                    >
                      <Unlock className="mr-2 h-4 w-4" />
                      Unlock
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="create" className="mt-6">
                    <div className="bg-card border-2 border-border rounded-2xl p-6 shadow-lg">
                      <QuestionEncodeSection />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="unlock" className="mt-6">
                    <div className="bg-card border-2 border-border rounded-2xl p-6 shadow-lg">
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

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>© 2025 Hidey • Keep it fun, keep it safe.</p>
          <p className="mt-1">Do not use or share sensitive or private information.</p>
          <a href="https://www.linkedin.com/in/roshani-gusain/" target="_blank"><b>➜ Roshani hehe!!</b></a>

        </div>
      </div>
    </div>
  );
};

export default Index;
