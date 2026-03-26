"use client";

import { useState } from "react";
import { Card, Button, Tabs, TabsList, TabsTrigger } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Sparkles, Loader2, Copy, Check, Download, RefreshCw } from "lucide-react";

interface CoverLetterGeneratorProps {
  jobTitle: string;
  companyName: string;
  onGenerate: (tone: "professional" | "creative" | "technical") => Promise<string>;
  initialContent?: string;
}

export function CoverLetterGenerator({
  jobTitle,
  companyName,
  onGenerate,
  initialContent = "",
}: CoverLetterGeneratorProps) {
  const [tone, setTone] = useState<"professional" | "creative" | "technical">("professional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await onGenerate(tone);
      setContent(result);
    } catch (error) {
      console.error("Failed to generate cover letter:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Cover_Letter_${companyName.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-accent-violet" />
          <h3 className="font-semibold text-text-primary">Cover Letter Generator</h3>
        </div>

        <div className="space-y-4">
          <div className="p-3 bg-bg-tertiary rounded-lg">
            <p className="text-sm text-text-muted">Applying for</p>
            <p className="font-medium text-text-primary">{jobTitle}</p>
            <p className="text-sm text-text-secondary">at {companyName}</p>
          </div>

          <Tabs value={tone} onChange={(v) => setTone(v as typeof tone)}>
            <TabsList className="w-full">
              <TabsTrigger value="professional" className="flex-1">Professional</TabsTrigger>
              <TabsTrigger value="creative" className="flex-1">Creative</TabsTrigger>
              <TabsTrigger value="technical" className="flex-1">Technical</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            variant="primary"
            className="w-full"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Cover Letter
              </>
            )}
          </Button>
        </div>
      </Card>

      {content && (
        <Card className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-text-primary">Generated Cover Letter</h4>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon-sm" onClick={handleCopy}>
                {copied ? (
                  <Check className="h-4 w-4 text-accent-emerald" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={handleGenerate}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="prose prose-invert prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-text-secondary text-sm leading-relaxed">
              {content}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
