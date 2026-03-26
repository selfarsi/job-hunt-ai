"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { JobCard } from "@/components/jobs/job-card";
import { Button, Input, Select, Card, JobCardSkeleton } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { useAppStore } from "@/store";
import { Job, JobStatus, JobSource } from "@/types";
import { Plus, Search, Filter, Briefcase, X, Loader2 } from "lucide-react";
import { parseSalary } from "@/lib/storage";

export default function JobsPage() {
  const router = useRouter();
  const { jobs, loadJobs, addJob, removeJob, updateJob } = useAppStore();
  const { addToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newJobForm, setNewJobForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    url: "",
    source: "linkedin" as JobSource,
  });

  useEffect(() => {
    loadJobs();
    setIsLoading(false);
  }, [loadJobs]);

  const filteredJobs = jobs.filter((job) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !job.title.toLowerCase().includes(query) &&
        !job.company.toLowerCase().includes(query) &&
        !job.location.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    if (sourceFilter && job.source !== sourceFilter) {
      return false;
    }
    return true;
  });

  const handleAddJob = () => {
    if (!newJobForm.title || !newJobForm.company || !newJobForm.description) {
      addToast({ type: "warning", title: "Missing fields", message: "Please fill in title, company, and description" });
      return;
    }

    const salary = parseSalary(newJobForm.salary);

    addJob({
      userId: "local-user",
      source: newJobForm.source,
      externalId: `manual-${Date.now()}`,
      title: newJobForm.title,
      company: newJobForm.company,
      location: newJobForm.location || "Not specified",
      salary: salary || undefined,
      type: "full-time",
      description: newJobForm.description,
      requirements: [],
      url: newJobForm.url || "#",
      postedDate: new Date().toISOString(),
      status: "saved" as JobStatus,
    });

    addToast({ type: "success", title: "Job added", message: "The job has been saved to your pipeline" });
    setShowAddModal(false);
    setNewJobForm({
      title: "",
      company: "",
      location: "",
      salary: "",
      description: "",
      url: "",
      source: "linkedin",
    });
  };

  const handleDeleteJob = (id: string) => {
    removeJob(id);
    addToast({ type: "success", title: "Job deleted" });
  };

  const handleStatusChange = (id: string, status: JobStatus) => {
    updateJob(id, { status });
    addToast({ type: "success", title: "Status updated" });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSourceFilter("");
  };

  const hasFilters = searchQuery || sourceFilter;

  return (
    <div className="min-h-screen">
      <Header title="Jobs" subtitle="Find and track job opportunities" />

      <div className="p-6">
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search jobs by title, company, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Job
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-4 animate-fade-in">
              <div className="w-48">
                <Select
                  label="Source"
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  placeholder="All sources"
                  options={[
                    { value: "linkedin", label: "LinkedIn" },
                    { value: "indeed", label: "Indeed" },
                    { value: "jobstreet", label: "JobStreet" },
                  ]}
                />
              </div>
              {hasFilters && (
                <div className="flex items-end">
                  <Button variant="ghost" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>

        <div className="flex items-center justify-between mb-4">
          <p className="text-text-secondary">
            {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"} found
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-stagger">
            {[...Array(6)].map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <Card className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="h-16 w-16 rounded-full bg-accent-cyan/10 flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-accent-cyan" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {hasFilters ? "No jobs match your filters" : "No jobs yet"}
              </h3>
              <p className="text-text-secondary mb-6">
                {hasFilters
                  ? "Try adjusting your search criteria"
                  : "Add jobs manually or search to get started"}
              </p>
              {hasFilters ? (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              ) : (
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Job
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-stagger">
            {filteredJobs.map((job) => (
              <div key={job._id.toString()} className="relative group">
                <JobCard job={job} />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteJob(job._id.toString());
                    }}
                    className="bg-bg-secondary/90 hover:bg-accent-rose/20 hover:text-accent-rose"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setShowAddModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="w-full max-w-lg bg-bg-secondary border border-border rounded-xl shadow-2xl pointer-events-auto animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="text-lg font-semibold text-text-primary">Add Job</h2>
                <Button variant="ghost" size="icon-sm" onClick={() => setShowAddModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-6 space-y-4">
                <Input
                  label="Job Title *"
                  value={newJobForm.title}
                  onChange={(e) => setNewJobForm({ ...newJobForm, title: e.target.value })}
                  placeholder="Senior Software Engineer"
                />
                <Input
                  label="Company *"
                  value={newJobForm.company}
                  onChange={(e) => setNewJobForm({ ...newJobForm, company: e.target.value })}
                  placeholder="Acme Inc."
                />
                <Input
                  label="Location"
                  value={newJobForm.location}
                  onChange={(e) => setNewJobForm({ ...newJobForm, location: e.target.value })}
                  placeholder="San Francisco, CA or Remote"
                />
                <Input
                  label="Salary Range"
                  value={newJobForm.salary}
                  onChange={(e) => setNewJobForm({ ...newJobForm, salary: e.target.value })}
                  placeholder="$100,000 - $150,000"
                />
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Source</label>
                  <Select
                    value={newJobForm.source}
                    onChange={(e) => setNewJobForm({ ...newJobForm, source: e.target.value as JobSource })}
                    options={[
                      { value: "linkedin", label: "LinkedIn" },
                      { value: "indeed", label: "Indeed" },
                      { value: "jobstreet", label: "JobStreet" },
                      { value: "other", label: "Other" },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Job Description *
                  </label>
                  <textarea
                    className="w-full h-32 bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus resize-none"
                    value={newJobForm.description}
                    onChange={(e) => setNewJobForm({ ...newJobForm, description: e.target.value })}
                    placeholder="Paste the job description here..."
                  />
                </div>
                <Input
                  label="Job URL"
                  value={newJobForm.url}
                  onChange={(e) => setNewJobForm({ ...newJobForm, url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
                <Button variant="ghost" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddJob}>Add Job</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
