"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Card, Button, Tabs, TabsList, TabsTrigger, TabsContent, Badge } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { useAppStore } from "@/store";
import { calculateMatchScore } from "@/lib/storage";
import {
  FileText,
  Upload,
  Download,
  CheckCircle,
  Sparkles,
  User,
} from "lucide-react";

export default function DocumentsPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { user, updateUser } = useAppStore();

  const [activeTab, setActiveTab] = useState("resume");
  const [resumeText, setResumeText] = useState(user?.resumeText || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveResume = () => {
    if (!resumeText.trim()) {
      addToast({ type: "warning", title: "Empty resume", message: "Please enter your resume text" });
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      updateUser({ resumeText: resumeText.trim() });
      setIsSaving(false);
      addToast({ type: "success", title: "Resume saved", message: "Your resume is now ready for job matching" });
    }, 500);
  };

  const sampleResume = `John Smith
Senior Software Engineer
john.smith@email.com | San Francisco, CA

EXPERIENCE

Senior Software Engineer | TechCorp Inc. | 2020 - Present
- Led development of microservices architecture serving 2M+ users
- Reduced API latency by 40% through optimization and caching strategies
- Mentored 5 junior developers and conducted 100+ code reviews
- Implemented CI/CD pipelines reducing deployment time by 60%

Software Engineer | StartupXYZ | 2017 - 2020
- Built React frontend for e-commerce platform handling $10M+ in annual transactions
- Developed Node.js APIs processing 50K requests per day
- Collaborated with cross-functional teams to launch 3 major features

SKILLS
Languages: JavaScript, TypeScript, Python, Go, SQL
Frontend: React, Next.js, Vue, HTML, CSS, Tailwind
Backend: Node.js, Express, Django, PostgreSQL, MongoDB
Cloud: AWS (EC2, S3, Lambda, RDS), Docker, Kubernetes
Tools: Git, GitHub, JIRA, Figma, Datadog

EDUCATION
B.S. Computer Science | Stanford University | 2017`;

  return (
    <div className="min-h-screen">
      <Header title="Documents" subtitle="Manage your resume for AI-powered job matching" />

      <div className="p-6 max-w-4xl mx-auto">
        {!user?.resumeText && (
          <Card className="mb-6 border-accent-amber/30 bg-accent-amber/5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-accent-amber/10">
                <Sparkles className="h-5 w-5 text-accent-amber" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Set up your resume</h3>
                <p className="text-sm text-text-secondary mt-1">
                  Add your resume below to enable AI-powered job matching, gap analysis, and cover letter generation.
                </p>
              </div>
            </div>
          </Card>
        )}

        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="resume">
              <FileText className="h-4 w-4 mr-2" />
              Resume
            </TabsTrigger>
            <TabsTrigger value="optimize">
              <Sparkles className="h-4 w-4 mr-2" />
              Test Matching
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resume">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">Your Resume</h2>
                  <p className="text-sm text-text-secondary">
                    Paste your resume text below for AI-powered features
                  </p>
                </div>
                {user?.resumeText && (
                  <Badge variant="success">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Configured
                  </Badge>
                )}
              </div>

              <textarea
                className="w-full h-96 bg-bg-tertiary border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus resize-none font-mono text-sm"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume here...

Example format:
John Smith
Senior Software Engineer
john@email.com

EXPERIENCE
Senior Software Engineer | Company | 2020 - Present
- Led development of...
- Reduced latency by...

SKILLS
JavaScript, TypeScript, React, Node.js, AWS..."
              />

              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setResumeText(sampleResume)}
                >
                  Load Sample Resume
                </Button>
                <Button onClick={handleSaveResume} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Resume"}
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="optimize">
            <Card>
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-5 w-5 text-accent-violet" />
                <h2 className="text-lg font-semibold text-text-primary">Test Job Matching</h2>
              </div>

              <p className="text-text-secondary mb-4">
                Test how the matching algorithm works by pasting a job description below.
              </p>

              <textarea
                id="test-job-description"
                className="w-full h-48 bg-bg-tertiary border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus resize-none text-sm"
                placeholder="Paste a job description here to test the matching..."
              />

              <Button
                className="w-full mt-4"
                onClick={() => {
                  const input = document.getElementById("test-job-description") as HTMLTextAreaElement;
                  if (input?.value && user?.resumeText) {
                    const result = calculateMatchScore(user.resumeText, input.value);
                    addToast({
                      type: "info",
                      title: `Match Score: ${result.score}%`,
                      message: `${result.gapAnalysis.matchedSkills.length} skills matched, ${result.gapAnalysis.missingKeywords.length} missing`,
                    });
                  } else if (!user?.resumeText) {
                    addToast({ type: "warning", title: "No resume", message: "Please save your resume first" });
                  } else {
                    addToast({ type: "warning", title: "Empty input", message: "Please paste a job description" });
                  }
                }}
              >
                Test Match
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
