"use client";

import { CircularProgress, Card, Button } from "@/components/ui";
import { GapAnalysis } from "@/types";
import { Check, AlertTriangle, X, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MatchAnalysisProps {
  matchScore: number;
  gapAnalysis: GapAnalysis | null;
  isLoading?: boolean;
  onGenerateCoverLetter?: () => void;
  onOptimizeResume?: () => void;
}

export function MatchAnalysis({
  matchScore,
  gapAnalysis,
  isLoading = false,
  onGenerateCoverLetter,
  onOptimizeResume,
}: MatchAnalysisProps) {
  if (isLoading) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent-cyan mx-auto mb-3" />
          <p className="text-text-secondary">Analyzing job match...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="text-center">
        <div className="flex justify-center mb-4">
          <CircularProgress value={matchScore} size={140} strokeWidth={10} />
        </div>
        <p className="text-text-secondary text-sm">
          {matchScore >= 80
            ? "Excellent match! Your profile strongly aligns with this role."
            : matchScore >= 60
            ? "Good match. Consider highlighting the missing skills."
            : "Consider if this role aligns with your career goals."}
        </p>
      </Card>

      {gapAnalysis && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-accent-violet" />
            <h3 className="font-semibold text-text-primary">Gap Analysis</h3>
          </div>

          <div className="space-y-4">
            {gapAnalysis.matchedSkills.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Check className="h-4 w-4 text-accent-emerald" />
                  <span className="text-sm font-medium text-text-primary">Matched Skills</span>
                </div>
                <div className="flex flex-wrap gap-2 ml-6">
                  {gapAnalysis.matchedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 bg-accent-emerald/10 text-accent-emerald text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {gapAnalysis.toHighlight.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-accent-amber" />
                  <span className="text-sm font-medium text-text-primary">Skills to Highlight</span>
                </div>
                <div className="flex flex-wrap gap-2 ml-6">
                  {gapAnalysis.toHighlight.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 bg-accent-amber/10 text-accent-amber text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {gapAnalysis.missingKeywords.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <X className="h-4 w-4 text-accent-rose" />
                  <span className="text-sm font-medium text-text-primary">Missing Keywords</span>
                </div>
                <div className="flex flex-wrap gap-2 ml-6">
                  {gapAnalysis.missingKeywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="px-2.5 py-1 bg-accent-rose/10 text-accent-rose text-xs rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      <div className="space-y-2">
        {onGenerateCoverLetter && (
          <Button variant="primary" className="w-full" onClick={onGenerateCoverLetter}>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Cover Letter
          </Button>
        )}
        {onOptimizeResume && (
          <Button variant="secondary" className="w-full" onClick={onOptimizeResume}>
            Optimize Resume for This Job
          </Button>
        )}
      </div>
    </div>
  );
}
