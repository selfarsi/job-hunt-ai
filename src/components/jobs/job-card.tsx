"use client";

import { Job } from "@/types";
import { cn, formatDate, formatSalary, getMatchScoreColor, getMatchScoreBg, getStatusColor } from "@/lib/utils";
import { Badge, Button, Card } from "@/components/ui";
import { MapPin, DollarSign, ExternalLink, Bookmark, Clock } from "lucide-react";
import Link from "next/link";

interface JobCardProps {
  job: Job;
  onSave?: (job: Job) => void;
  onApply?: (job: Job) => void;
  compact?: boolean;
  draggable?: boolean;
}

export function JobCard({ job, onSave, onApply, compact = false, draggable = false }: JobCardProps) {
  const statusColors = getStatusColor(job.status);
  const matchScoreColor = getMatchScoreColor(job.matchScore ?? 0);

  return (
    <Card
      hover
      className={cn(
        "group cursor-pointer",
        draggable && "cursor-grab active:cursor-grabbing"
      )}
    >
      <Link href={`/jobs/${job._id}`} className="block">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-bg-tertiary flex items-center justify-center flex-shrink-0 overflow-hidden">
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={job.company} className="h-full w-full object-cover" />
            ) : (
              <span className="text-lg font-bold text-text-muted">
                {job.company.charAt(0)}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-text-primary truncate group-hover:text-accent-cyan transition-colors">
                  {job.title}
                </h3>
                <p className="text-sm text-text-secondary truncate">{job.company}</p>
              </div>
              {job.matchScore !== undefined && (
                <div className={cn("flex-shrink-0 text-right", matchScoreColor)}>
                  <span className="text-lg font-bold">{job.matchScore}%</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {job.location}
              </span>
              {job.salary && (
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {formatSalary(job.salary)}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDate(job.postedDate)}
              </span>
            </div>

            {!compact && (
              <p className="mt-3 text-sm text-text-secondary line-clamp-2">
                {job.description.slice(0, 150)}...
              </p>
            )}

            <div className="flex items-center gap-2 mt-3">
              <Badge status={job.status} dot>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </Badge>
              <Badge variant="default">{job.source}</Badge>
              <Badge variant="default">{job.type}</Badge>
            </div>
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1"
          onClick={(e) => {
            e.preventDefault();
            window.open(job.url, "_blank");
          }}
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          View
        </Button>
        {onSave && (
          <Button variant="outline" size="sm" onClick={(e) => { e.preventDefault(); onSave(job); }}>
            <Bookmark className="h-4 w-4" />
          </Button>
        )}
        {onApply && job.status === "saved" && (
          <Button variant="primary" size="sm" className="flex-1" onClick={(e) => { e.preventDefault(); onApply(job); }}>
            Apply
          </Button>
        )}
      </div>
    </Card>
  );
}
