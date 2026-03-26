export type JobSource = "linkedin" | "indeed" | "jobstreet";
export type JobStatus = "saved" | "applied" | "pending" | "interview" | "rejected";
export type JobType = "full-time" | "part-time" | "contract" | "internship";
export type DocumentType = "resume" | "cover-letter" | "template";

export interface Salary {
  min: number;
  max: number;
  currency: string;
}

export interface GapAnalysis {
  matchedSkills: string[];
  toHighlight: string[];
  missingKeywords: string[];
}

export interface Job {
  _id: string;
  userId: string;
  source: JobSource;
  externalId: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  salary?: Salary;
  type: JobType;
  description: string;
  requirements: string[];
  url: string;
  postedDate: string;
  matchScore?: number;
  gapAnalysis?: GapAnalysis;
  status: JobStatus;
  appliedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StatusHistory {
  status: JobStatus;
  date: string;
  note?: string;
}

export interface Application {
  _id: string;
  userId: string;
  jobId: string;
  resumeVersion?: string;
  coverLetterUrl?: string;
  status: JobStatus;
  statusHistory: StatusHistory[];
  emailThreadId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentVersion {
  content: string;
  createdAt: string;
}

export interface Document {
  _id: string;
  userId: string;
  type: DocumentType;
  name: string;
  content: string;
  targetJobId?: string;
  versions: DocumentVersion[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CoverLetterInput {
  resumeText: string;
  jobDescription: string;
  companyName: string;
  jobTitle: string;
}

export interface ResumeOptimizeInput {
  currentResume: string;
  jobDescription: string;
  tone: "professional" | "creative" | "technical";
}
