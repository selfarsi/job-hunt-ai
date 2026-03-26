const ADZUNA_APP_ID = "cd9d59d6";
const ADZUNA_APP_KEY = "4b5d69c7c26c7e8f6b5b6f8e8c8d7e8f6b5b6f8e";

export interface JobSearchResult {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: { min: number; max: number; currency: string };
  description: string;
  url: string;
  postedDate: string;
  source: string;
}

export async function searchJobsAdzuna(query: string, location?: string): Promise<JobSearchResult[]> {
  try {
    const params = new URLSearchParams({
      "app_id": ADZUNA_APP_ID,
      "app_key": ADZUNA_APP_KEY,
      "results_per_page": "20",
      "what": query,
      ...(location && { "where": location }),
    });

    const response = await fetch(`https://api.adzuna.com/v1/api/jobs/us/search/1?${params}`);
    
    if (!response.ok) {
      console.error("Adzuna API error:", response.status);
      return [];
    }

    const data = await response.json();
    
    return (data.results || []).map((job: any) => ({
      id: `adzuna-${job.id}`,
      title: job.title,
      company: job.company?.display_name || "Unknown",
      location: job.location?.display_name || job.location?.area?.join(", ") || "Remote",
      salary: job.salary_min && job.salary_max ? {
        min: Math.round(job.salary_min),
        max: Math.round(job.salary_max),
        currency: job.salary_currency || "USD",
      } : undefined,
      description: job.description || "",
      url: job.redirect_url || "",
      postedDate: job.date_posted || new Date().toISOString(),
      source: "Adzuna",
    }));
  } catch (error) {
    console.error("Job search error:", error);
    return [];
  }
}

export function parseJobFromURL(url: string): Partial<JobSearchResult> {
  const result: Partial<JobSearchResult> = {
    url,
    source: detectSource(url),
  };

  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname.toLowerCase();
    const hostname = urlObj.hostname.toLowerCase();

    if (hostname.includes("linkedin")) {
      const titleMatch = path.match(/\/jobs\/([^/]+)/i);
      if (titleMatch) {
        result.title = formatJobTitle(titleMatch[1]);
      }
      const companyMatch = url.match(/company\/([^/]+)/i);
      if (companyMatch) {
        result.company = formatCompanyName(companyMatch[1]);
      }
    } else if (hostname.includes("indeed")) {
      const titleMatch = url.match(/jt=([^&]+)/);
      if (titleMatch) {
        result.title = decodeURIComponent(titleMatch[1]).replace(/-/g, " ");
      }
      const companyMatch = url.match(/company=([^&]+)/);
      if (companyMatch) {
        result.company = decodeURIComponent(companyMatch[1]);
      }
    } else if (hostname.includes("jobstreet")) {
      const parts = path.split("/").filter(Boolean);
      if (parts.length > 0) {
        result.title = formatJobTitle(parts[parts.length - 1]);
      }
    } else {
      const pathParts = path.split("/").filter(p => p && p !== "jobs" && p !== "job" && p !== "careers");
      if (pathParts.length > 0) {
        result.title = formatJobTitle(pathParts[pathParts.length - 1]);
        if (pathParts.length > 1) {
          result.company = formatCompanyName(pathParts[0]);
        }
      }
    }
  } catch (error) {
    console.error("URL parse error:", error);
  }

  return result;
}

function detectSource(url: string): string {
  const lower = url.toLowerCase();
  if (lower.includes("linkedin")) return "LinkedIn";
  if (lower.includes("indeed")) return "Indeed";
  if (lower.includes("jobstreet")) return "JobStreet";
  if (lower.includes("glassdoor")) return "Glassdoor";
  if (lower.includes("monster")) return "Monster";
  return "Other";
}

function formatJobTitle(title: string): string {
  return title
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\d+/g, "")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .filter(word => word.length > 1)
    .join(" ");
}

function formatCompanyName(name: string): string {
  return name
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export const SAMPLE_SEARCH_RESULTS: JobSearchResult[] = [
  {
    id: "sample-1",
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    salary: { min: 150000, max: 200000, currency: "USD" },
    description: "We are looking for an experienced frontend developer to join our team...",
    url: "https://linkedin.com/jobs/sample-1",
    postedDate: new Date().toISOString(),
    source: "LinkedIn",
  },
  {
    id: "sample-2",
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "Remote",
    salary: { min: 120000, max: 160000, currency: "USD" },
    description: "Join our growing team and build amazing products...",
    url: "https://indeed.com/jobs/sample-2",
    postedDate: new Date().toISOString(),
    source: "Indeed",
  },
  {
    id: "sample-3",
    title: "Backend Developer",
    company: "DataFlow Inc",
    location: "New York, NY",
    salary: { min: 130000, max: 170000, currency: "USD" },
    description: "Build scalable backend systems...",
    url: "https://linkedin.com/jobs/sample-3",
    postedDate: new Date().toISOString(),
    source: "LinkedIn",
  },
];
