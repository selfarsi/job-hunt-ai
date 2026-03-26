"use client";

import { useState, DragEvent } from "react";
import { Job, JobStatus } from "@/types";
import { JobCard } from "@/components/jobs/job-card";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui";

interface KanbanColumn {
  id: JobStatus;
  title: string;
  color: string;
}

const columns: KanbanColumn[] = [
  { id: "saved", title: "Saved", color: "accent-cyan" },
  { id: "applied", title: "Applied", color: "accent-violet" },
  { id: "pending", title: "Pending", color: "accent-amber" },
  { id: "interview", title: "Interview", color: "accent-emerald" },
  { id: "rejected", title: "Rejected", color: "accent-rose" },
];

interface KanbanBoardProps {
  jobs: Job[];
  onJobMove: (jobId: string, newStatus: JobStatus) => void;
  onJobClick: (job: Job) => void;
  onAddJob?: () => void;
}

export function KanbanBoard({ jobs, onJobMove, onJobClick, onAddJob }: KanbanBoardProps) {
  const [draggedJob, setDraggedJob] = useState<Job | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<JobStatus | null>(null);

  const getJobsByStatus = (status: JobStatus) => {
    return jobs.filter((job) => job.status === status);
  };

  const handleDragStart = (e: DragEvent, job: Job) => {
    setDraggedJob(job);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", job._id);
  };

  const handleDragOver = (e: DragEvent, status: JobStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: DragEvent, status: JobStatus) => {
    e.preventDefault();
    if (draggedJob && draggedJob.status !== status) {
      onJobMove(draggedJob._id, status);
    }
    setDraggedJob(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedJob(null);
    setDragOverColumn(null);
  };

  return (
    <div className="flex gap-4 h-full overflow-x-auto pb-4">
      {columns.map((column) => {
        const columnJobs = getJobsByStatus(column.id);
        const isOver = dragOverColumn === column.id;

        return (
          <div
            key={column.id}
            className={cn(
              "flex-shrink-0 w-72 bg-bg-secondary/50 rounded-xl border border-border transition-colors",
              isOver && "border-accent-cyan bg-accent-cyan/5"
            )}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", `bg-${column.color}`)} />
                <h3 className="font-semibold text-text-primary">{column.title}</h3>
                <span className="text-sm text-text-muted">({columnJobs.length})</span>
              </div>
              {column.id === "saved" && onAddJob && (
                <Button variant="ghost" size="icon-sm" onClick={onAddJob}>
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="p-2 space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto">
              {columnJobs.map((job) => (
                <div
                  key={job._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, job)}
                  onDragEnd={handleDragEnd}
                  onClick={() => onJobClick(job)}
                  className={cn(
                    "transition-opacity",
                    draggedJob?._id === job._id && "opacity-50"
                  )}
                >
                  <JobCard job={job} compact />
                </div>
              ))}

              {columnJobs.length === 0 && (
                <div className="py-8 text-center text-text-muted text-sm">
                  No jobs in this stage
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
