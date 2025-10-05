import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EncodeSection } from "@/components/EncodeSection";
import { DecodeSection } from "@/components/DecodeSection";
import { ImageEncodeSection } from "@/components/ImageEncodeSection";
import { ImageDecodeSection } from "@/components/ImageDecodeSection";
import { QuestionEncodeSection } from "@/components/QuestionEncodeSection";
import { QuestionDecodeSection } from "@/components/QuestionDecodeSection";
import { PatternExamples } from "@/components/PatternExamples";
import { Lock, Unlock, MessageSquare, Image, HelpCircle } from "lucide-react";

const Index = () => {
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
            {/* Mode Selection */}
            <Tabs defaultValue="message" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-card border-2 border-border rounded-2xl p-1 h-14 mb-6">
                <TabsTrigger 
                  value="message" 
                  className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message Mode
                </TabsTrigger>
                <TabsTrigger 
                  value="image"
                  className="rounded-xl data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground font-semibold"
                >
                  <Image className="mr-2 h-4 w-4" />
                  Image Mode
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

              {/* Image Mode */}
              <TabsContent value="image" className="space-y-0">
                <Tabs defaultValue="scramble" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-card border-2 border-border rounded-2xl p-1 h-14">
                    <TabsTrigger 
                      value="scramble" 
                      className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold"
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Scramble
                    </TabsTrigger>
                    <TabsTrigger 
                      value="reveal"
                      className="rounded-xl data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground font-semibold"
                    >
                      <Unlock className="mr-2 h-4 w-4" />
                      Reveal
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="scramble" className="mt-6">
                    <div className="bg-card border-2 border-border rounded-2xl p-6 shadow-lg">
                      <ImageEncodeSection />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="reveal" className="mt-6">
                    <div className="bg-card border-2 border-border rounded-2xl p-6 shadow-lg">
                      <ImageDecodeSection />
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
          <div className="lg:col-span-1">
            <PatternExamples />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Made with 💖 by Hidey • Keep your messages playfully private</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
