import { Job, JobStatus, JobSource, GapAnalysis } from "@/types";

const STORAGE_KEYS = {
  JOBS: "jobhunt_jobs",
  USER: "jobhunt_user",
  DOCUMENTS: "jobhunt_documents",
  SETTINGS: "jobhunt_settings",
};

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  resumeText: string;
  preferences: {
    targetTitles: string[];
    locations: string[];
    minSalary: number;
    matchThreshold: number;
  };
}

export const storage = {
  getJobs(): Job[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.JOBS);
    return data ? JSON.parse(data) : [];
  },

  saveJobs(jobs: Job[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  },

  addJob(job: Omit<Job, "_id" | "createdAt" | "updatedAt">): Job {
    const jobs = this.getJobs();
    const newJob: Job = {
      ...job,
      _id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    jobs.push(newJob);
    this.saveJobs(jobs);
    return newJob;
  },

  updateJob(id: string, updates: Partial<Job>): Job | null {
    const jobs = this.getJobs();
    const index = jobs.findIndex((j) => j._id === id);
    if (index === -1) return null;
    jobs[index] = { ...jobs[index], ...updates, updatedAt: new Date().toISOString() };
    this.saveJobs(jobs);
    return jobs[index];
  },

  deleteJob(id: string): boolean {
    const jobs = this.getJobs();
    const filtered = jobs.filter((j) => j._id !== id);
    if (filtered.length === jobs.length) return false;
    this.saveJobs(filtered);
    return true;
  },

  getUser(): StoredUser | null {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  saveUser(user: StoredUser): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  getDocuments(): any[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    return data ? JSON.parse(data) : [];
  },

  saveDocuments(documents: any[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
  },
};

const SKILL_KEYWORDS = [
  "javascript", "typescript", "python", "java", "c++", "c#", "ruby", "go", "rust", "php",
  "react", "vue", "angular", "nextjs", "nodejs", "express", "django", "flask", "spring",
  "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "jenkins", "ci/cd",
  "sql", "mongodb", "postgresql", "mysql", "redis", "elasticsearch",
  "git", "github", "gitlab", "agile", "scrum", "jira",
  "html", "css", "sass", "tailwind", "bootstrap",
  "machine learning", "ai", "data science", "tensorflow", "pytorch",
  "api", "rest", "graphql", "microservices", "microservices",
  "leadership", "management", "communication", "problem-solving",
  "senior", "junior", "mid-level", "principal", "staff", "architect",
];

const SOFT_SKILLS = [
  "leadership", "communication", "teamwork", "problem-solving", "analytical",
  "creative", "adaptable", "detail-oriented", "time management", "collaboration",
];

export function extractSkills(text: string): string[] {
  const lowerText = text.toLowerCase();
  return SKILL_KEYWORDS.filter(skill => lowerText.includes(skill));
}

export function calculateMatchScore(resumeText: string, jobDescription: string): { score: number; gapAnalysis: GapAnalysis } {
  if (!resumeText || !jobDescription) {
    return {
      score: 0,
      gapAnalysis: {
        matchedSkills: [],
        toHighlight: [],
        missingKeywords: [],
      },
    };
  }

  const resumeSkills = extractSkills(resumeText.toLowerCase());
  const jobSkills = extractSkills(jobDescription.toLowerCase());
  const jobLower = jobDescription.toLowerCase();

  const matchedSkills = jobSkills.filter(skill => resumeSkills.includes(skill));
  const resumeLower = resumeText.toLowerCase();
  const toHighlight = resumeSkills.filter(skill => {
    const relatedTerms = getRelatedTerms(skill);
    return relatedTerms.some(term => jobLower.includes(term)) && !matchedSkills.includes(skill);
  });
  const missingKeywords = jobSkills.filter(skill => !matchedSkills.includes(skill));

  const jobRequirements = extractRequirements(jobDescription);
  const resumeExperience = extractExperience(resumeText, jobDescription);

  const skillScore = matchedSkills.length / Math.max(jobSkills.length, 1) * 50;
  const experienceScore = resumeExperience * 30;
  const requirementScore = jobRequirements * 20;

  const score = Math.min(Math.round(skillScore + experienceScore + requirementScore), 100);

  return {
    score,
    gapAnalysis: {
      matchedSkills: matchedSkills.slice(0, 10),
      toHighlight: toHighlight.slice(0, 5),
      missingKeywords: missingKeywords.slice(0, 5),
    },
  };
}

function getRelatedTerms(skill: string): string[] {
  const relatedMap: Record<string, string[]> = {
    javascript: ["js", "ecmascript"],
    typescript: ["ts"],
    react: ["reactjs", "react.js"],
    nodejs: ["node", "node.js", "express"],
    python: ["python", "django", "flask"],
    aws: ["amazon", "amazon web services"],
    docker: ["container", "containerization"],
    kubernetes: ["k8s", "orchestration"],
    sql: ["database", "mysql", "postgresql"],
    git: ["github", "gitlab", "version control"],
  };
  return [skill, ...(relatedMap[skill] || [])];
}

function extractRequirements(jobDescription: string): number {
  const requirements = [
    "requirement", "required", "must have", "minimum", "years of experience",
    "experience with", "proficiency", "expertise", "knowledge of",
  ];
  let count = 0;
  const lower = jobDescription.toLowerCase();
  requirements.forEach(req => {
    const matches = lower.match(new RegExp(req, "gi"));
    if (matches) count += matches.length;
  });
  return Math.min(count / 10, 1);
}

function extractExperience(resumeText: string, jobDescription: string): number {
  const yearsMatch = resumeText.match(/(\d+)\+?\s*(years?|yrs?)\s*(of)?\s*(experience|exp)/i);
  const resumeYears = yearsMatch ? parseInt(yearsMatch[1]) / 10 : 0.5;

  const jobLevelMatch = jobDescription.match(/(junior|senior|lead|principal|architect)/i);
  const hasSenior = jobLevelMatch && jobLevelMatch[1].toLowerCase() === "senior";

  if (hasSenior && resumeYears < 0.6) return 0.3;
  if (resumeYears >= 0.7) return 1;
  return resumeYears;
}

export function generateCoverLetterContent(
  userName: string,
  jobTitle: string,
  companyName: string,
  jobDescription: string,
  resumeText: string
): string {
  const skills = extractSkills(jobDescription);
  const topSkills = skills.slice(0, 5).join(", ");
  const experience = resumeText.match(/(\d+)\+?\s*(years?|yrs?)/i)?.[0] || "several years";

  const templates = [
    `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. With ${experience} of hands-on experience and expertise in ${topSkills || "various technologies"}, I am confident in my ability to contribute meaningfully to your team.

Throughout my career, I have developed a passion for building scalable solutions and collaborating with cross-functional teams. My background has equipped me with the technical depth and problem-solving abilities that align well with the requirements outlined in your job description.

I am particularly drawn to ${companyName} because of your commitment to innovation and your reputation in the industry. I would welcome the opportunity to discuss how my background and skills would benefit your team.

Thank you for considering my application. I look forward to hearing from you.

Best regards,
${userName}`,

    `Hello,

I was excited to see the ${jobTitle} opening at ${companyName}. After reviewing the job description, I believe my ${experience} of experience combined with my proficiency in ${topSkills || "relevant technologies"} makes me an excellent fit for this role.

In my professional journey, I've focused on delivering high-quality work while maintaining a collaborative approach. I've had the opportunity to work on challenging projects that have sharpened my technical skills and problem-solving capabilities.

${companyName}'s approach to ${extractCompanyFocus(jobDescription)} resonates with my career goals. I am eager to bring my expertise to your team and contribute to your continued success.

I would love to discuss this opportunity further. Please feel free to reach out at your convenience.

Warm regards,
${userName}`,
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

function extractCompanyFocus(jobDescription: string): string {
  const focuses = [
    "innovation", "excellence", "customer satisfaction", "team collaboration",
    "continuous improvement", "cutting-edge technology", "sustainable growth",
  ];
  for (const focus of focuses) {
    if (jobDescription.toLowerCase().includes(focus)) {
      return focus;
    }
  }
  return "professional excellence";
}

export function parseSalary(text: string): { min: number; max: number; currency: string } | null {
  const patterns = [
    /\$[\d,]+(?:\s*[-–]\s*\$[\d,]+)?/g,
    /[\d,]+(?:\s*[-–]\s*[\d,]+)?\s*(?:k|K)/g,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const cleanNum = (s: string) => parseInt(s.replace(/[\$,Kk]/g, "")) * (s.includes("k") || s.includes("K") ? 1000 : 1);
      const nums = match[0].split(/[-–]/).map(s => cleanNum(s.trim()));
      return {
        min: nums[0],
        max: nums[1] || nums[0] * 1.3,
        currency: "USD",
      };
    }
  }
  return null;
}

export const SAMPLE_JOBS: Omit<Job, "_id" | "createdAt" | "updatedAt">[] = [
  {
    userId: "sample",
    source: "linkedin",
    externalId: "linkedin-1",
    title: "Senior Full Stack Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA (Remote)",
    salary: { min: 140000, max: 180000, currency: "USD" },
    type: "full-time",
    description: `We're looking for a Senior Full Stack Developer to join our growing engineering team.

Requirements:
- 5+ years of experience in full stack development
- Strong proficiency in React, TypeScript, and Node.js
- Experience with cloud platforms (AWS or GCP)
- Familiarity with PostgreSQL or MongoDB
- Excellent problem-solving skills
- Experience with Agile methodologies

Nice to have:
- Kubernetes and Docker experience
- GraphQL expertise
- Team leadership experience

We offer competitive salary, health benefits, and equity.`,
    requirements: ["React", "TypeScript", "Node.js", "AWS", "PostgreSQL", "5+ years experience"],
    url: "https://linkedin.com/jobs/sample-1",
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    matchScore: 85,
    gapAnalysis: {
      matchedSkills: ["javascript", "typescript", "react", "nodejs", "sql"],
      toHighlight: ["aws", "docker"],
      missingKeywords: ["kubernetes", "graphql"],
    },
    status: "saved",
  },
  {
    userId: "sample",
    source: "indeed",
    externalId: "indeed-1",
    title: "Backend Engineer",
    company: "DataFlow Systems",
    location: "New York, NY",
    salary: { min: 120000, max: 160000, currency: "USD" },
    type: "full-time",
    description: `Join our backend team building scalable data pipelines!

Responsibilities:
- Design and implement APIs and microservices
- Optimize database queries and performance
- Collaborate with frontend and data teams
- Write clean, maintainable code

Requirements:
- 3+ years backend development experience
- Proficiency in Python or Go
- Experience with RESTful API design
- Knowledge of SQL and NoSQL databases
- Strong debugging skills

Benefits: Health insurance, 401k matching, flexible hours`,
    requirements: ["Python", "Go", "REST API", "SQL", "NoSQL", "3+ years"],
    url: "https://indeed.com/jobs/sample-1",
    postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    matchScore: 72,
    gapAnalysis: {
      matchedSkills: ["python", "sql", "mongodb"],
      toHighlight: ["microservices"],
      missingKeywords: ["go", "docker"],
    },
    status: "applied",
  },
  {
    userId: "sample",
    source: "linkedin",
    externalId: "linkedin-2",
    title: "DevOps Engineer",
    company: "CloudScale Solutions",
    location: "Austin, TX (Hybrid)",
    salary: { min: 130000, max: 170000, currency: "USD" },
    type: "full-time",
    description: `We need a DevOps Engineer to help us scale our infrastructure!

Key Responsibilities:
- Manage CI/CD pipelines
- Infrastructure as Code (Terraform)
- Container orchestration with Kubernetes
- Monitor and optimize performance
- Security best practices

Requirements:
- 4+ years DevOps experience
- Strong AWS or Azure skills
- Docker and Kubernetes expertise
- Terraform/Pulumi experience
- Scripting skills (Bash, Python)

Great team, great culture, great benefits!`,
    requirements: ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD", "4+ years"],
    url: "https://linkedin.com/jobs/sample-2",
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    matchScore: 68,
    gapAnalysis: {
      matchedSkills: ["docker", "aws", "git"],
      toHighlight: ["ci/cd", "python"],
      missingKeywords: ["kubernetes", "terraform"],
    },
    status: "saved",
  },
  {
    userId: "sample",
    source: "jobstreet",
    externalId: "jobstreet-1",
    title: "Frontend Developer",
    company: "DesignFirst Agency",
    location: "Remote",
    salary: { min: 90000, max: 120000, currency: "USD" },
    type: "full-time",
    description: `Looking for a talented Frontend Developer!

What you'll do:
- Build beautiful, responsive web applications
- Collaborate with designers on UI/UX
- Optimize performance and accessibility
- Write clean React components

Requirements:
- 2+ years React experience
- Strong CSS/Tailwind skills
- TypeScript proficiency
- Eye for design
- Communication skills

Perks: Remote work, learning budget, team retreats`,
    requirements: ["React", "TypeScript", "CSS", "Tailwind", "2+ years"],
    url: "https://jobstreet.com/jobs/sample-1",
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    matchScore: 91,
    gapAnalysis: {
      matchedSkills: ["react", "typescript", "css", "tailwind"],
      toHighlight: ["html"],
      missingKeywords: [],
    },
    status: "interview",
  },
  {
    userId: "sample",
    source: "linkedin",
    externalId: "linkedin-3",
    title: "Software Engineering Manager",
    company: "InnovateTech",
    location: "Seattle, WA",
    salary: { min: 180000, max: 220000, currency: "USD" },
    type: "full-time",
    description: `Lead a team of talented engineers!

Role:
- Manage and grow a team of 8-10 engineers
- Drive technical decisions and architecture
- Mentor developers and conduct code reviews
- Work closely with product management
- Deliver projects on time and within scope

Requirements:
- 7+ years software engineering experience
- 2+ years people management
- Strong technical background
- Experience with Agile/Scrum
- Excellent communication

We offer top-tier compensation and equity!`,
    requirements: ["Java", "Python", "Leadership", "Agile", "7+ years"],
    url: "https://linkedin.com/jobs/sample-3",
    postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    matchScore: 45,
    gapAnalysis: {
      matchedSkills: ["agile", "scrum", "git"],
      toHighlight: ["leadership"],
      missingKeywords: ["java", "python"],
    },
    status: "pending",
  },
];

export function loadSampleJobs(): Job[] {
  const existingJobs = storage.getJobs();
  if (existingJobs.length > 0) return existingJobs;

  return SAMPLE_JOBS.map(job => storage.addJob(job));
}
