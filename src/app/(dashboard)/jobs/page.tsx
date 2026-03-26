"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { JobCard } from "@/components/jobs/job-card";
import { Button, Input, Select, Card, JobCardSkeleton, Tabs, TabsList, TabsTrigger } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { useAppStore } from "@/store";
import { JobStatus, JobSource } from "@/types";
import { Plus, Search, Filter, Briefcase, X, Loader2, Link2, ExternalLink, Globe } from "lucide-react";
import { parseSalary } from "@/lib/storage";
import { JobSearchResult, searchJobs, parseJobFromURL, generateSampleSearchResults } from "@/lib/jobSearch";

export default function JobsPage() {
  const { jobs, loadJobs, addJob, removeJob, updateJob } = useAppStore();
  const { addToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalTab, setAddModalTab] = useState<"search" | "url" | "manual">("search");
  
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<JobSearchResult[]>([]);
  const [searchLocation, setSearchLocation] = useState("");
  
  const [urlInput, setUrlInput] = useState("");
  const [isParsingUrl, setIsParsingUrl] = useState(false);
  const [parsedJob, setParsedJob] = useState<any>(null);
  
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

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      addToast({ type: "warning", title: "Enter a search term", message: "What job title do you want to search for?" });
      return;
    }
    
    setIsSearching(true);
    setSearchResults([]);
    
    const results = await searchJobs(searchQuery, searchLocation);
    
    if (results.length === 0) {
      addToast({ type: "info", title: "No results", message: "Try different keywords or location" });
    } else {
      addToast({ type: "success", title: `${results.length} jobs found`, message: "Click Add to save them to your tracker" });
    }
    
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleAddFromSearch = (result: JobSearchResult) => {
    addJob({
      userId: "local-user",
      source: (result.source || "linkedin").toLowerCase().replace(" ", "") as JobSource,
      externalId: result.id,
      title: result.title,
      company: result.company,
      location: result.location,
      salary: result.salary,
      type: "full-time",
      description: result.description,
      requirements: [],
      url: result.url,
      postedDate: result.postedDate,
      status: "saved" as JobStatus,
    });
    
    setSearchResults(prev => prev.filter(r => r.id !== result.id));
    addToast({ type: "success", title: "Job added!", message: `${result.title} at ${result.company}` });
  };

  const handleParseUrl = async () => {
    if (!urlInput.trim()) {
      addToast({ type: "warning", title: "Enter a URL", message: "Paste a job posting URL" });
      return;
    }
    
    setIsParsingUrl(true);
    setParsedJob(null);
    
    try {
      const parsed = parseJobFromURL(urlInput);
      setParsedJob({
        title: parsed.title || "",
        company: parsed.company || "",
        location: "",
        salary: "",
        description: "",
        url: urlInput,
        source: (parsed.source || "linkedin").toLowerCase() as JobSource,
      });
      
      if (parsed.title) {
        addToast({ type: "success", title: "URL parsed!", message: `Found: ${parsed.title}` });
      } else {
        addToast({ type: "info", title: "Partial info", message: "Please fill in remaining details" });
      }
    } catch (error) {
      addToast({ type: "error", title: "Parse failed", message: "Could not extract job info" });
    } finally {
      setIsParsingUrl(false);
    }
  };

  const handleAddFromUrl = () => {
    if (!parsedJob?.title || !parsedJob?.company) {
      addToast({ type: "warning", title: "Missing info", message: "Please enter title and company" });
      return;
    }
    
    const salary = parsedJob.salary ? parseSalary(parsedJob.salary) : undefined;
    
    addJob({
      userId: "local-user",
      source: parsedJob.source || "linkedin",
      externalId: `url-${Date.now()}`,
      title: parsedJob.title,
      company: parsedJob.company,
      location: parsedJob.location || "Not specified",
      salary: salary || undefined,
      type: "full-time",
      description: parsedJob.description || "No description available",
      requirements: [],
      url: parsedJob.url || urlInput,
      postedDate: new Date().toISOString(),
      status: "saved" as JobStatus,
    });
    
    addToast({ type: "success", title: "Job added!" });
    setShowAddModal(false);
    setUrlInput("");
    setParsedJob(null);
    setAddModalTab("search");
  };

  const handleAddManual = () => {
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
                placeholder="Search your saved jobs by title, company, or location..."
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
              <Button onClick={() => { setAddModalTab("search"); setShowAddModal(true); }}>
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
            {filteredJobs.length} saved {filteredJobs.length === 1 ? "job" : "jobs"}
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
                {hasFilters ? "No jobs match your filters" : "No jobs saved yet"}
              </h3>
              <p className="text-text-secondary mb-6">
                {hasFilters
                  ? "Try adjusting your search criteria"
                  : "Search for jobs or paste a job URL to get started"}
              </p>
              {hasFilters ? (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              ) : (
                <Button onClick={() => { setAddModalTab("search"); setShowAddModal(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Find Jobs
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-stagger">
            {filteredJobs.map((job) => (
              <div key={job._id} className="relative group">
                <JobCard job={job} />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteJob(job._id);
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
              className="w-full max-w-2xl bg-bg-secondary border border-border rounded-xl shadow-2xl pointer-events-auto animate-scale-in max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-bg-secondary">
                <h2 className="text-lg font-semibold text-text-primary">Add Job</h2>
                <Button variant="ghost" size="icon-sm" onClick={() => setShowAddModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <Tabs value={addModalTab} onChange={(v) => setAddModalTab(v as any)} className="p-4">
                <TabsList className="mb-4">
                  <TabsTrigger value="search">
                    <Globe className="h-4 w-4 mr-2" />
                    Search Online
                  </TabsTrigger>
                  <TabsTrigger value="url">
                    <Link2 className="h-4 w-4 mr-2" />
                    Paste URL
                  </TabsTrigger>
                  <TabsTrigger value="manual">
                    <Plus className="h-4 w-4 mr-2" />
                    Manual
                  </TabsTrigger>
                </TabsList>

                {addModalTab === "search" && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <Input
                          label="Job Title"
                          placeholder="Software Engineer, Data Scientist..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          icon={<Search className="h-4 w-4" />}
                        />
                      </div>
                      <div className="w-48">
                        <Input
                          label="Location (optional)"
                          placeholder="Remote, NYC..."
                          value={searchLocation}
                          onChange={(e) => setSearchLocation(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button onClick={handleSearch} disabled={isSearching} className="w-full">
                      {isSearching ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Search Jobs
                        </>
                      )}
                    </Button>
                    
                    {searchResults.length > 0 && (
                      <div className="space-y-3 mt-4">
                        <p className="text-sm text-text-secondary">{searchResults.length} jobs found</p>
                        {searchResults.map((result) => (
                          <Card key={result.id} className="p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-text-primary truncate">{result.title}</h4>
                                <p className="text-sm text-text-secondary">{result.company}</p>
                                <p className="text-xs text-text-muted">{result.location}</p>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Button size="sm" onClick={() => handleAddFromSearch(result)}>
                                  Add
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => window.open(result.url, "_blank")}>
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                    
                    {searchResults.length === 0 && !isSearching && (
                      <p className="text-sm text-text-muted text-center py-4">
                        Enter a job title and click Search to find jobs online
                      </p>
                    )}
                  </div>
                )}

                {addModalTab === "url" && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        Paste Job URL
                      </label>
                      <div className="flex gap-3">
                        <Input
                          placeholder="https://linkedin.com/jobs/... or indeed.com/jobs/..."
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          icon={<Link2 className="h-4 w-4" />}
                        />
                        <Button onClick={handleParseUrl} disabled={isParsingUrl}>
                          {isParsingUrl ? <Loader2 className="h-4 w-4 animate-spin" /> : "Parse"}
                        </Button>
                      </div>
                      <p className="text-xs text-text-muted mt-2">
                        Supports LinkedIn, Indeed, JobStreet, and other job sites
                      </p>
                    </div>
                    
                    {parsedJob && (
                      <div className="space-y-3 pt-4 border-t border-border">
                        <p className="text-sm font-medium text-text-primary">Extracted Info:</p>
                        <Input
                          label="Job Title *"
                          value={parsedJob.title}
                          onChange={(e) => setParsedJob({ ...parsedJob, title: e.target.value })}
                          placeholder="Job title"
                        />
                        <Input
                          label="Company *"
                          value={parsedJob.company}
                          onChange={(e) => setParsedJob({ ...parsedJob, company: e.target.value })}
                          placeholder="Company name"
                        />
                        <Input
                          label="Location"
                          value={parsedJob.location}
                          onChange={(e) => setParsedJob({ ...parsedJob, location: e.target.value })}
                          placeholder="City or Remote"
                        />
                        <Input
                          label="Salary (optional)"
                          value={parsedJob.salary}
                          onChange={(e) => setParsedJob({ ...parsedJob, salary: e.target.value })}
                          placeholder="$100,000 - $150,000"
                        />
                        <div>
                          <label className="block text-sm font-medium text-text-secondary mb-1.5">
                            Job Description
                          </label>
                          <textarea
                            className="w-full h-24 bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus resize-none"
                            value={parsedJob.description}
                            onChange={(e) => setParsedJob({ ...parsedJob, description: e.target.value })}
                            placeholder="Paste job description (optional - will fetch if available)..."
                          />
                        </div>
                        <Button onClick={handleAddFromUrl} className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Job
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {addModalTab === "manual" && (
                  <div className="space-y-4 animate-fade-in">
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
                    <Button onClick={handleAddManual} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Job
                    </Button>
                  </div>
                )}
              </Tabs>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
