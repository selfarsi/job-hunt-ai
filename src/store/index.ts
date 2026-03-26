import { create } from "zustand";
import { Job, JobStatus, GapAnalysis } from "@/types";
import { storage, calculateMatchScore, loadSampleJobs, generateCoverLetterContent, parseSalary, StoredUser } from "@/lib/storage";

interface JobFilters {
  source?: string;
  status?: JobStatus;
  minMatchScore?: number;
  search?: string;
}

interface AppState {
  user: StoredUser | null;
  setUser: (user: StoredUser | null) => void;
  updateUser: (updates: Partial<StoredUser>) => void;

  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
  loadJobs: () => void;
  addJob: (job: Omit<Job, "_id" | "createdAt" | "updatedAt">) => Job;
  updateJob: (id: string, updates: Partial<Job>) => void;
  removeJob: (id: string) => void;
  moveJob: (id: string, newStatus: JobStatus) => void;

  selectedJob: Job | null;
  setSelectedJob: (job: Job | null) => void;

  filters: JobFilters;
  setFilters: (filters: JobFilters) => void;
  clearFilters: () => void;

  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  analyzeJob: (jobId: string) => { score: number; gapAnalysis: GapAnalysis };
  generateCoverLetter: (jobId: string) => string;

  searchJobs: (query: string) => Job[];
}

export const useAppStore = create<AppState>((set, get) => ({
  user: storage.getUser(),
  setUser: (user) => {
    if (user) storage.saveUser(user);
    set({ user });
  },
  updateUser: (updates) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      storage.saveUser(updatedUser);
      set({ user: updatedUser });
    }
  },

  jobs: [],
  setJobs: (jobs) => {
    storage.saveJobs(jobs);
    set({ jobs });
  },
  loadJobs: () => {
    let jobs = storage.getJobs();
    if (jobs.length === 0) {
      jobs = loadSampleJobs();
    }
    set({ jobs });
  },
  addJob: (job) => {
    const newJob = storage.addJob(job);
    set((state) => ({ jobs: [...state.jobs, newJob] }));
    return newJob;
  },
  updateJob: (id, updates) => {
    const updated = storage.updateJob(id, updates);
    if (updated) {
      set((state) => ({
        jobs: state.jobs.map((j) => (j._id === id ? updated : j)),
      }));
    }
  },
  removeJob: (id) => {
    storage.deleteJob(id);
    set((state) => ({
      jobs: state.jobs.filter((j) => j._id !== id),
    }));
  },
  moveJob: (id, newStatus) => {
    get().updateJob(id, { status: newStatus });
  },

  selectedJob: null,
  setSelectedJob: (job) => set({ selectedJob: job }),

  filters: {},
  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
  clearFilters: () => set({ filters: {} }),

  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),

  sidebarOpen: true,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  analyzeJob: (jobId) => {
    const job = get().jobs.find((j) => j._id === jobId);
    const user = get().user;
    if (!job || !user?.resumeText) {
      return { score: 0, gapAnalysis: { matchedSkills: [], toHighlight: [], missingKeywords: [] } };
    }
    const result = calculateMatchScore(user.resumeText, job.description);
    get().updateJob(jobId, { matchScore: result.score, gapAnalysis: result.gapAnalysis });
    return result;
  },

  generateCoverLetter: (jobId) => {
    const job = get().jobs.find((j) => j._id === jobId);
    const user = get().user;
    if (!job || !user) {
      return "";
    }
    return generateCoverLetterContent(
      user.name || "Applicant",
      job.title,
      job.company,
      job.description,
      user.resumeText || ""
    );
  },

  searchJobs: (query) => {
    const jobs = get().jobs;
    const lowerQuery = query.toLowerCase();
    return jobs.filter((job) =>
      job.title.toLowerCase().includes(lowerQuery) ||
      job.company.toLowerCase().includes(lowerQuery) ||
      job.description.toLowerCase().includes(lowerQuery)
    );
  },
}));

export const getJobsByStatus = (jobs: Job[], status: JobStatus): Job[] => {
  return jobs.filter((job) => job.status === status);
};

export const getFilteredJobs = (jobs: Job[], filters: JobFilters): Job[] => {
  return jobs.filter((job) => {
    if (filters.source && job.source !== filters.source) return false;
    if (filters.status && job.status !== filters.status) return false;
    if (filters.minMatchScore && (job.matchScore ?? 0) < filters.minMatchScore) return false;
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const matchesSearch =
        job.title.toLowerCase().includes(search) ||
        job.company.toLowerCase().includes(search) ||
        job.location.toLowerCase().includes(search);
      if (!matchesSearch) return false;
    }
    return true;
  });
};

export const getJobStats = (jobs: Job[]) => {
  return {
    total: jobs.length,
    saved: jobs.filter((j) => j.status === "saved").length,
    applied: jobs.filter((j) => j.status === "applied").length,
    pending: jobs.filter((j) => j.status === "pending").length,
    interview: jobs.filter((j) => j.status === "interview").length,
    rejected: jobs.filter((j) => j.status === "rejected").length,
  };
};
