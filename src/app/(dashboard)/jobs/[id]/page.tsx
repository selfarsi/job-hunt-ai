"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Card, Button, Badge, JobDetailSkeleton, Select } from "@/components/ui";
import { MatchAnalysis } from "@/components/ai/match-analysis";
import { CoverLetterGenerator } from "@/components/ai/cover-letter-generator";
import { useToast } from "@/components/ui/toast";
import { useAppStore } from "@/store";
import { Job, JobStatus } from "@/types";
import {
  formatDate,
  formatSalary,
  getStatusColor,
} from "@/lib/utils";
import {
  ArrowLeft,
  ExternalLink,
  MapPin,
  DollarSign,
  Clock,
  Building2,
  Briefcase,
  Loader2,
  Sparkles,
  Trash2,
} from "lucide-react";
import Link from "next/link";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const { jobs, updateJob, removeJob, analyzeJob, generateCoverLetter, user } = useAppStore();

  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [coverLetter, setCoverLetter] = useState<string>("");

  useEffect(() => {
    const jobId = params.id as string;
    const foundJob = jobs.find((j) => j._id.toString() === jobId);
    if (foundJob) {
      setJob(foundJob);
    }
    setIsLoading(false);
  }, [params.id, jobs]);

  useEffect(() => {
    if (job && !job.matchScore && user?.resumeText) {
      const result = analyzeJob(job._id.toString());
      setJob((prev) => prev ? { ...prev, matchScore: result.score, gapAnalysis: result.gapAnalysis } : null);
    }
  }, [job?._id, user?.resumeText]);

  const handleAnalyze = () => {
    if (!job) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = analyzeJob(job._id.toString());
      setJob((prev) => prev ? { ...prev, matchScore: result.score, gapAnalysis: result.gapAnalysis } : null);
      setIsAnalyzing(false);
      addToast({ type: "success", title: "Analysis complete", message: `Match score: ${result.score}%` });
    }, 1500);
  };

  const handleStatusChange = (newStatus: JobStatus) => {
    if (!job) return;
    updateJob(job._id.toString(), { status: newStatus });
    setJob((prev) => prev ? { ...prev, status: newStatus } : null);
    addToast({ type: "success", title: "Status updated" });
  };

  const handleGenerateCoverLetter = async (tone: "professional" | "creative" | "technical") => {
    if (!job) return "";
    const letter = generateCoverLetter(job._id.toString());
    setCoverLetter(letter);
    return letter;
  };

  const handleDelete = () => {
    if (!job) return;
    removeJob(job._id.toString());
    addToast({ type: "success", title: "Job deleted" });
    router.push("/jobs");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="p-6">
          <JobDetailSkeleton />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen">
        <Header title="Job Not Found" />
        <div className="p-6 flex justify-center">
          <Card className="text-center py-12 max-w-md">
            <h2 className="text-lg font-semibold text-text-primary mb-2">Job Not Found</h2>
            <p className="text-text-secondary mb-4">This job may have been deleted.</p>
            <Link href="/jobs">
              <Button>Back to Jobs</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title={
          <Link href="/jobs" className="flex items-center gap-2 hover:text-accent-cyan transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>
        }
      />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Card>
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-xl bg-bg-tertiary flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {job.companyLogo ? (
                    <img src={job.companyLogo} alt={job.company} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-text-muted">
                      {job.company.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-bold text-text-primary">{job.title}</h1>
                  <p className="text-text-secondary">{job.company}</p>
                  <Badge status={job.status} dot className="mt-2">
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </Badge>
                </div>
                <Button variant="ghost" size="icon-sm" onClick={handleDelete} className="text-text-muted hover:text-accent-rose">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-2 text-text-secondary">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{job.location}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center gap-2 text-text-secondary">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm">{formatSalary(job.salary)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-text-secondary">
                  <Briefcase className="h-4 w-4" />
                  <span className="text-sm capitalize">{job.type}</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{formatDate(job.postedDate)}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => job.url !== "#" && window.open(job.url, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Original
                </Button>
                {job.status === "saved" && (
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => handleStatusChange("applied")}
                  >
                    Mark as Applied
                  </Button>
                )}
              </div>

              <div className="mt-6">
                <Select
                  label="Update Status"
                  value={job.status}
                  onChange={(e) => handleStatusChange(e.target.value as JobStatus)}
                  options={[
                    { value: "saved", label: "Saved" },
                    { value: "applied", label: "Applied" },
                    { value: "pending", label: "Pending Confirmation" },
                    { value: "interview", label: "Interview" },
                    { value: "rejected", label: "Rejected" },
                  ]}
                />
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-text-primary mb-4">Job Description</h3>
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-text-secondary">
                  {job.description}
                </div>
              </div>

              {job.requirements.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-text-primary mb-3">Requirements</h4>
                  <ul className="space-y-2">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-text-secondary text-sm">
                        <span className="text-accent-cyan mt-1">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-4">
            <MatchAnalysis
              matchScore={job.matchScore ?? 0}
              gapAnalysis={job.gapAnalysis ?? null}
              isLoading={isAnalyzing}
            />

            <CoverLetterGenerator
              jobTitle={job.title}
              companyName={job.company}
              onGenerate={handleGenerateCoverLetter}
              initialContent={coverLetter}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
