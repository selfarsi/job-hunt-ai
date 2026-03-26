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

export interface JSearchResponse {
  status: string;
  request_id: string;
  parameters: {
    query: string;
    page: number;
    num_pages: number;
    date_posted?: string;
  };
  data: JSearchJob[];
}

export interface JSearchJob {
  job_id: string;
  job_title: string;
  employer_name: string;
  employer_logo: string | null;
  job_city: string | null;
  job_state: string | null;
  job_country: string;
  job_google_link: string;
  job_posted_at_datetime_utc: string;
  job_description: string;
  job_min_salary: number | null;
  job_max_salary: number | null;
  job_salary_period: string;
  job_employment_type: string;
  job_benefits: string | null;
  job_qualifications: string | null;
}

export async function searchJobs(query: string, location?: string): Promise<JobSearchResult[]> {
  try {
    const searchQuery = location ? `${query} in ${location}` : query;
    const url = `/api/jsearch?query=${encodeURIComponent(searchQuery)}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error("JSearch API error:", response.status);
      return [];
    }

    const data: JSearchResponse = await response.json();

    if (data.status !== "OK" || !data.data) {
      return [];
    }

    return data.data.map((job) => ({
      id: `jsearch-${job.job_id}`,
      title: job.job_title,
      company: job.employer_name || "Unknown",
      location: [job.job_city, job.job_state, job.job_country].filter(Boolean).join(", ") || "Remote",
      salary: job.job_min_salary && job.job_max_salary
        ? {
            min: job.job_min_salary,
            max: job.job_max_salary,
            currency: "USD",
          }
        : undefined,
      description: cleanDescription(job.job_description),
      url: job.job_google_link || "#",
      postedDate: job.job_posted_at_datetime_utc || new Date().toISOString(),
      source: extractSource(job.job_google_link || ""),
    }));
  } catch (error) {
    console.error("Job search error:", error);
    return [];
  }
}

function cleanDescription(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function extractSource(url: string): string {
  const lower = url.toLowerCase();
  if (lower.includes("linkedin")) return "LinkedIn";
  if (lower.includes("indeed")) return "Indeed";
  if (lower.includes("ziprecruiter")) return "ZipRecruiter";
  if (lower.includes("glassdoor")) return "Glassdoor";
  if (lower.includes("monster")) return "Monster";
  if (lower.includes("simplyhired")) return "SimplyHired";
  return "Job Board";
}

export function parseJobFromURL(url: string): Partial<JobSearchResult> {
  const result: Partial<JobSearchResult> = {
    url,
    source: detectSource(url),
  };

  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname.toLowerCase();

    if (url.includes("linkedin")) {
      const titleMatch = url.match(/jobs\/([^/?]+)/i);
      if (titleMatch) {
        result.title = formatJobTitle(titleMatch[1]);
      }
      const companyMatch = url.match(/company\/([^/?&]+)/i);
      if (companyMatch) {
        result.company = formatCompanyName(companyMatch[1]);
      }
    } else if (url.includes("indeed")) {
      const titleMatch = url.match(/jt=([^&]+)/);
      if (titleMatch) {
        result.title = decodeURIComponent(titleMatch[1]).replace(/-/g, " ");
      }
      const companyMatch = url.match(/company=([^&]+)/);
      if (companyMatch) {
        result.company = decodeURIComponent(companyMatch[1]).replace(/\+/g, " ");
      }
    } else if (url.includes("jobstreet")) {
      const parts = path.split("/").filter(Boolean);
      if (parts.length > 0) {
        result.title = formatJobTitle(parts[parts.length - 1]);
      }
    } else if (url.includes("glassdoor")) {
      const titleMatch = url.match(/job\/([^/?]+)/i);
      if (titleMatch) {
        result.title = formatJobTitle(titleMatch[1]);
      }
    } else {
      const pathParts = path.split("/").filter(p => 
        p && 
        !["jobs", "job", "careers", "position", "opportunities"].includes(p.toLowerCase())
      );
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
  if (lower.includes("ziprecruiter")) return "ZipRecruiter";
  return "Other";
}

function formatJobTitle(title: string): string {
  return title
    .replace(/[-_]/g, " ")
    .replace(/\d+/g, "")
    .split(" ")
    .filter(word => word.length > 1)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function formatCompanyName(name: string): string {
  return name
    .replace(/[-_]/g, " ")
    .split(" ")
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function generateSampleSearchResults(query: string): JobSearchResult[] {
  const titles = [
    "Senior Software Engineer",
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Engineer",
    "DevOps Engineer",
    "Data Scientist",
    "Product Manager",
    "UX Designer",
    "Mobile Developer",
    "Cloud Architect",
  ];

  const companies = [
    "TechCorp Inc.",
    "StartupXYZ",
    "DataFlow Systems",
    "CloudScale Solutions",
    "InnovateTech",
    "DesignFirst Agency",
    "NextGen Solutions",
    "GlobalTech",
  ];

  const locations = [
    "Remote",
    "San Francisco, CA",
    "New York, NY",
    "Austin, TX",
    "Seattle, WA",
    "Boston, MA",
    "Denver, CO",
    "Chicago, IL",
  ];

  const salaries = [
    { min: 80000, max: 120000 },
    { min: 100000, max: 140000 },
    { min: 120000, max: 160000 },
    { min: 140000, max: 180000 },
    { min: 160000, max: 200000 },
  ];

  const queryLower = query.toLowerCase();
  
  return titles
    .filter(title => 
      title.toLowerCase().includes(queryLower) || 
      queryLower === "job" || 
      queryLower === "engineer" || 
      queryLower === "developer"
    )
    .slice(0, 5)
    .map((title, i) => {
      const company = companies[Math.floor(Math.random() * companies.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const salary = salaries[Math.floor(Math.random() * salaries.length)];
      const daysAgo = Math.floor(Math.random() * 14) + 1;
      
      return {
        id: `sample-${Date.now()}-${i}`,
        title,
        company,
        location,
        salary: { ...salary, currency: "USD" },
        description: `We are looking for a talented ${title} to join our team. This is an exciting opportunity to work on cutting-edge technology and make a real impact.`,
        url: `https://linkedin.com/jobs/${title.toLowerCase().replace(/\s+/g, "-")}-${company.toLowerCase().replace(/\s+/g, "-")}`,
        postedDate: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
        source: ["LinkedIn", "Indeed", "JobStreet"][Math.floor(Math.random() * 3)],
      };
    });
}
