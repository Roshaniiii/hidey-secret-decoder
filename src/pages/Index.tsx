import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { EncodeSection } from "@/components/EncodeSection";
import { DecodeSection } from "@/components/DecodeSection";
import { ImageEncodeSection } from "@/components/ImageEncodeSection";
import { ImageDecodeSection } from "@/components/ImageDecodeSection";
import { PatternExamples } from "@/components/PatternExamples";
import { ImageScrambleExamples } from "@/components/ImageScrambleExamples";
import { Lock, Unlock, MessageSquare, Image, ArrowLeft } from "lucide-react";

const Index = () => {
  const [showImageMode, setShowImageMode] = useState(false);

  if (showImageMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/20">
        <div className="container max-w-6xl mx-auto px-4 py-12">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowImageMode(false)}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Messages
          </Button>

          <div className="text-center mb-12 space-y-3">
            <div className="inline-block p-3 bg-secondary/20 rounded-2xl mb-4">
              <Image className="h-12 w-12 text-secondary" />
            </div>
            <h1 className="text-6xl font-bold text-foreground mb-3 tracking-tight">
              Image Scrambler
            </h1>
            <p className="text-xl text-muted-foreground font-medium">
              Hide images with visual effects - perfectly reversible!
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
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
            </div>

            <div className="lg:col-span-1">
              <ImageScrambleExamples />
            </div>
          </div>

          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>Made with 💖 by Hidey • Keep your images playfully private</p>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Image Mode Button */}
        <div className="flex justify-center mb-8">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowImageMode(true)}
            className="gap-2 border-2 border-border hover:bg-secondary/20"
          >
            <Image className="h-5 w-5" />
            Try Image Scrambler
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
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
