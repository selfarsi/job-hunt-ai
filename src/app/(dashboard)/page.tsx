"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { JobCardSkeleton } from "@/components/ui/skeleton";
import { Button, Card } from "@/components/ui";
import { useAppStore, getJobStats } from "@/store";
import { Job, JobStatus } from "@/types";
import { Plus, TrendingUp, Target, Briefcase, Calendar } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const { jobs, loadJobs, updateJob, user } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadJobs();
    setIsLoading(false);
  }, [loadJobs]);

  const handleJobMove = (jobId: string, newStatus: JobStatus) => {
    updateJob(jobId, { status: newStatus });
  };

  const handleJobClick = (job: Job) => {
    router.push(`/jobs/${job._id.toString()}`);
  };

  const stats = getJobStats(jobs);

  const statCards = [
    { label: "Total Jobs", value: stats.total, icon: Briefcase, color: "text-accent-cyan" },
    { label: "Applied", value: stats.applied, icon: TrendingUp, color: "text-accent-violet" },
    { label: "Interviews", value: stats.interview, icon: Target, color: "text-accent-emerald" },
    { label: "Pending", value: stats.pending, icon: Calendar, color: "text-accent-amber" },
  ];

  return (
    <div className="min-h-screen">
      <Header
        title="Dashboard"
        subtitle={`Welcome back${user?.name ? `, ${user.name.split(" ")[0]}` : ""}! Track your job applications`}
      />

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((stat) => (
            <Card key={stat.label} className="flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-bg-tertiary ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                <p className="text-sm text-text-secondary">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Application Pipeline</h2>
            <p className="text-sm text-text-secondary">Drag jobs between stages to update status</p>
          </div>
          <Link href="/jobs">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Find Jobs
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-10 bg-bg-secondary rounded-xl" />
                <JobCardSkeleton />
                <JobCardSkeleton />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <Card className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="h-16 w-16 rounded-full bg-accent-cyan/10 flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-accent-cyan" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                No jobs yet
              </h3>
              <p className="text-text-secondary mb-6">
                Start your job search by finding opportunities that match your profile.
              </p>
              <Link href="/jobs">
                <Button>Find Your First Job</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <KanbanBoard
            jobs={jobs}
            onJobMove={handleJobMove}
            onJobClick={handleJobClick}
            onAddJob={() => router.push("/jobs")}
          />
        )}
      </div>
    </div>
  );
}
