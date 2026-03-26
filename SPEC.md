# JobHunt AI - Intelligent Job Search & Application Management System

## 1. Concept & Vision

**JobHunt AI** is a sophisticated personal job search command center that transforms the chaotic job hunt into a streamlined, intelligent process. It combines the power of AI with elegant design to give job seekers a competitive edge. The aesthetic evokes a high-end productivity tool—think Linear meets Notion—with dark mode sophistication and subtle gradients that make spending hours job-hunting feel less like a chore and more like strategic warfare.

The system treats your resume as a strategic asset, analyzing every opportunity against your unique profile and presenting insights that would take hours to compile manually.

---

## 2. Design Language

### Aesthetic Direction
**Premium Dark Command Center** — Inspired by Linear's clean UI, Vercel's sophistication, and Raycast's efficiency. A dark-first interface with strategic pops of electric cyan and warm amber accents.

### Color Palette
```
--bg-primary: #0A0A0F        (Deep space black)
--bg-secondary: #12121A      (Elevated surfaces)
--bg-tertiary: #1A1A24       (Cards, inputs)
--bg-hover: #222230          (Hover states)

--accent-cyan: #00D4FF       (Primary actions, links)
--accent-cyan-dim: #00D4FF20 (Glows, backgrounds)
--accent-amber: #FFB800      (Warnings, highlights)
--accent-emerald: #10B981    (Success states)
--accent-rose: #F43F5E       (Errors, rejections)
--accent-violet: #8B5CF6     (AI-related elements)

--text-primary: #FAFAFA      (Headings)
--text-secondary: #A0A0B0    (Body text)
--text-muted: #606070        (Placeholders)

--border: #2A2A3A            (Dividers)
--border-focus: #00D4FF      (Focus rings)
```

### Typography
- **Headings**: Inter (700, 600) — Clean, modern, highly legible
- **Body**: Inter (400, 500) — Consistent with headings
- **Monospace**: JetBrains Mono — Code snippets, technical content
- **Scale**: 12px (caption) / 14px (body) / 16px (large body) / 20px (h3) / 24px (h2) / 32px (h1) / 48px (display)

### Spatial System
- Base unit: 4px
- Common spacing: 8px, 12px, 16px, 24px, 32px, 48px, 64px
- Border radius: 6px (small), 8px (medium), 12px (large), 16px (cards)
- Container max-width: 1400px

### Motion Philosophy
- **Micro-interactions**: 150ms ease-out for hover/focus states
- **Layout transitions**: 300ms ease-in-out for panels, modals
- **Stagger animations**: 50ms delay between list items
- **Loading states**: Subtle pulse animations with cyan glow
- **Page transitions**: Fade-in 200ms with slight Y-translate

### Visual Assets
- **Icons**: Lucide React — Consistent 1.5px stroke weight
- **Illustrations**: Abstract gradient blobs for empty states
- **Avatars**: Gradient placeholders based on initials
- **Status indicators**: Glowing dots with matching colors

---

## 3. Layout & Structure

### Application Shell
```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo]  JobHunt AI              [Search]    [Notifications] [User] │
├─────────┬───────────────────────────────────────────────────────┤
│         │                                                        │
│  NAV    │                    MAIN CONTENT                        │
│         │                                                        │
│ Dashboard│                                                       │
│ Jobs     │                                                       │
│ Applied  │                                                       │
│ Documents│                                                       │
│ Settings │                                                       │
│         │                                                        │
│─────────│                                                        │
│ [Status]│                                                        │
└─────────┴───────────────────────────────────────────────────────┘
```

### Dashboard Layout (Kanban)
```
┌─────────────────────────────────────────────────────────────────┐
│  Dashboard              [Filter] [Search] [Add Job]             │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│ │  SAVED  │ │ APPLIED │ │PENDING  │ │INTERVIEW│ │REJECTED │    │
│ │  (12)   │ │  (5)    │ │  (3)    │ │  (2)    │ │  (8)    │    │
│ ├─────────┤ ├─────────┤ ├─────────┤ ├─────────┤ ├─────────┤    │
│ │ [Card]  │ │ [Card]  │ │ [Card]  │ │ [Card]  │ │ [Card]  │    │
│ │ [Card]  │ │ [Card]  │ │ [Card]  │ │ [Card]  │ │ [Card]  │    │
│ │ [Card]  │ │ [Card]  │ │         │ │         │ │ [Card]  │    │
│ │ [More]  │ │         │ │         │ │         │ │ [More]  │    │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Job Detail Split View
```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back                    [Company Logo] Company Name           │
├───────────────────────────────┬─────────────────────────────────┤
│                               │  🤖 AI MATCH ANALYSIS            │
│     JOB DESCRIPTION           │                                 │
│                               │  Match Score: 87%               │
│     Title: Senior Engineer    │  ████████████████░░░            │
│     Location: Remote          │                                 │
│     Salary: $120-150k         │  Gap Analysis:                  │
│                               │  ✓ 5 skills matched             │
│     [Full JD content...]      │  ⚠ 2 skills to highlight        │
│                               │  ✗ 3 missing keywords           │
│                               │                                 │
│                               │  [Generate Cover Letter]       │
│                               │  [Apply Now]                   │
│                               │                                 │
└───────────────────────────────┴─────────────────────────────────┘
```

### Responsive Strategy
- **Desktop (1200px+)**: Full layout with sidebar
- **Tablet (768-1199px)**: Collapsible sidebar, stacked split view
- **Mobile (< 768px)**: Bottom navigation, full-screen views

---

## 4. Features & Interactions

### 4.1 Job Aggregator

**Data Sources:**
- LinkedIn Jobs (via API/scraping)
- Indeed (via API/scraping)
- JobStreet (via API/scraping)

**Search Configuration:**
- Job titles (multiple)
- Location (city, state, remote)
- Salary range
- Experience level
- Job type (full-time, contract, etc.)
- Date posted (24h, 7d, 30d)

**Interactions:**
- Search triggers: Debounced 500ms after typing stops
- Loading: Skeleton cards with pulse animation
- Error: Toast notification with retry button
- Empty: Illustration + "No jobs found" message

### 4.2 Intelligent Matching (AI Agent)

**Match Score Calculation:**
1. Parse resume → extract skills, experience, education
2. Parse JD → extract requirements, qualifications
3. Calculate weighted similarity across:
   - Technical skills (40%)
   - Soft skills (20%)
   - Experience level (25%)
   - Education (15%)
4. Generate overall score 0-100%

**Gap Analysis Output:**
```
Skills Matched:
• React, TypeScript, Node.js
• System design experience
• Agile/Scrum methodology

Skills to Highlight:
• Project leadership (you have 3 years)
• API integration (your电商 experience)

Missing Keywords:
• "Kubernetes" (consider adding)
• "AWS certified" (add if applicable)
```

### 4.3 Application Tracking

**Status Flow:**
```
SAVED → APPLIED → PENDING CONFIRMATION → INTERVIEW → OFFER/REJECTED
                ↓
             REJECTED (from any stage)
```

**Auto-Updates:**
- Email scanning identifies application updates
- Manual status override always available
- Timeline shows all status changes with timestamps

**Drag & Drop:**
- Cards can be dragged between columns
- Visual feedback: Column highlights on drag-over
- Animation: Card slides into new position

### 4.4 Email Integration

**Connection Methods:**
- Gmail API (OAuth2)
- IMAP (manual credentials)

**Email Scanning Rules:**
```
Pattern: "thank you for applying" → Mark as Applied
Pattern: "we have received your application" → Mark as Applied  
Pattern: "moving forward" / "next steps" → Mark as Pending
Pattern: "interview" / "schedule a call" → Mark as Interview
Pattern: "unfortunately" / "other candidates" → Mark as Rejected
```

**Frequency:** Every 30 minutes (configurable)

### 4.5 Daily Notifications

**Summary Email Contains:**
- Top 5 jobs with >80% match score
- Jobs posted in last 24h
- Application status updates
- Upcoming interview reminders

**Timing:** 8:00 AM local time (configurable)

### 4.6 AI Content Engine

**Resume Generator:**
- Upload existing resume or start fresh
- Select target JD for keyword optimization
- Choose tone: Professional, Creative, Technical
- Output: ATS-optimized, keyword-rich resume

**Cover Letter Generator:**
- Input: Resume + JD + Company info
- Output: 3-paragraph letter with:
  - Opening hook (specific to company)
  - Body highlighting relevant experience
  - Closing with call to action
- Tone: Professional yet personable

**Anti-AI Check:**
- Avoids clichés: "Synergy", "Go-getter", "Think outside the box"
- Uses varied sentence structures
- Includes specific metrics and achievements
- Sounds like 10+ years experience, not fresh grad

---

## 5. Component Inventory

### Navigation
- **Sidebar**: Fixed left, 240px width, collapsible to 64px
- **NavItem**: Icon + label, active state with cyan accent bar
- **UserMenu**: Avatar, name, dropdown with settings/logout

### Cards
- **JobCard**: 
  - States: default, hover (lift + glow), dragging (opacity 0.7)
  - Content: Company logo, title, company, location, salary, match %, date
  - Actions: Quick apply, save, view details
- **JobCardExpanded**: Full details in modal/drawer

### Forms
- **Input**: Dark bg, subtle border, cyan focus ring, label above
- **TextArea**: Same styling, auto-grow
- **Select**: Custom dropdown with search for long lists
- **Checkbox/Toggle**: Cyan when active

### Buttons
- **Primary**: Cyan bg, dark text, hover: brightness 1.1
- **Secondary**: Transparent, cyan border, cyan text
- **Ghost**: No border, text only, hover: subtle bg
- **Danger**: Rose color scheme
- **Loading**: Spinner replaces text, disabled state

### Feedback
- **Toast**: Slide in from top-right, auto-dismiss 5s
- **Modal**: Centered, backdrop blur, scale-in animation
- **Drawer**: Slide from right, 480px width
- **Skeleton**: Pulse animation matching component shape

### AI Components
- **MatchScore**: Circular progress with percentage, color gradient
- **SkillBadge**: Matched (green), Missing (gray), ToHighlight (amber)
- **AIPanel**: Dedicated panel for AI analysis, violet accent

---

## 6. Technical Architecture

### Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **State**: Zustand for global state
- **Database**: MongoDB with Mongoose ODM
- **Auth**: NextAuth.js with credentials + Google OAuth
- **AI**: OpenAI GPT-4o API
- **Email**: Gmail API + IMAP
- **Background Jobs**: Custom scheduler with node-cron
- **File Storage**: Local filesystem (resumes, generated docs)

### API Design

**Jobs**
```
GET    /api/jobs                    - List all jobs (with filters)
GET    /api/jobs/:id                - Get single job
POST   /api/jobs/scrape             - Trigger job scraping
DELETE /api/jobs/:id                - Delete job
PATCH  /api/jobs/:id/status          - Update job status
```

**Applications**
```
GET    /api/applications            - List all applications
POST   /api/applications             - Create application
PATCH  /api/applications/:id        - Update application
```

**AI**
```
POST   /api/ai/match                - Calculate match score
POST   /api/ai/cover-letter         - Generate cover letter
POST   /api/ai/resume-optimize      - Optimize resume for JD
```

**Email**
```
POST   /api/email/connect           - Connect email account
GET    /api/email/status            - Check connection status
POST   /api/email/scan              - Trigger email scan
```

**Auth**
```
POST   /api/auth/signup             - Register user
POST   /api/auth/login              - Login
GET    /api/auth/me                 - Get current user
```

### Data Models

**User**
```typescript
{
  _id: ObjectId,
  email: string,
  passwordHash: string,
  name: string,
  resumeUrl: string,
  resumeText: string,
  preferences: {
    targetTitles: string[],
    locations: string[],
    minSalary: number,
    matchThreshold: number
  },
  emailConfig: {
    provider: 'gmail' | 'imap',
    accessToken: string,
    refreshToken: string
  },
  notifications: {
    daily: boolean,
    time: string
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Job**
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  source: 'linkedin' | 'indeed' | 'jobstreet',
  externalId: string,
  title: string,
  company: string,
  companyLogo: string,
  location: string,
  salary: { min: number, max: number, currency: string },
  type: 'full-time' | 'part-time' | 'contract' | 'internship',
  description: string,
  requirements: string[],
  url: string,
  postedDate: Date,
  matchScore: number,
  gapAnalysis: {
    matchedSkills: string[],
    toHighlight: string[],
    missingKeywords: string[]
  },
  status: 'saved' | 'applied' | 'pending' | 'interview' | 'rejected',
  appliedDate: Date,
  notes: string,
  createdAt: Date,
  updatedAt: Date
}
```

**Application**
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  jobId: ObjectId,
  resumeVersion: string,
  coverLetterUrl: string,
  status: string,
  statusHistory: [{ status: string, date: Date, note: string }],
  emailThreadId: string,
  createdAt: Date,
  updatedAt: Date
}
```

**Document**
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  type: 'resume' | 'cover-letter' | 'template',
  name: string,
  content: string,
  targetJobId: ObjectId,
  versions: [{ content: string, createdAt: Date }],
  isDefault: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Security
- Passwords hashed with bcrypt (12 rounds)
- JWT tokens for API authentication
- HTTPS only
- CSRF protection
- Rate limiting on all endpoints
- Sensitive data encrypted at rest

---

## 7. File Structure

```
job-hunt-ai/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx (Dashboard)
│   │   │   ├── jobs/page.tsx
│   │   │   ├── jobs/[id]/page.tsx
│   │   │   ├── documents/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── jobs/route.ts
│   │   │   ├── jobs/[id]/route.ts
│   │   │   ├── ai/match/route.ts
│   │   │   ├── ai/cover-letter/route.ts
│   │   │   ├── email/route.ts
│   │   │   └── ...
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/ (Button, Input, Card, Modal, etc.)
│   │   ├── layout/ (Sidebar, Header, etc.)
│   │   ├── jobs/ (JobCard, JobList, JobFilters)
│   │   ├── kanban/ (KanbanBoard, KanbanColumn, KanbanCard)
│   │   ├── ai/ (MatchScore, GapAnalysis, CoverLetterGen)
│   │   └── email/ (EmailConnect, EmailStatus)
│   ├── lib/
│   │   ├── db.ts (MongoDB connection)
│   │   ├── auth.ts (NextAuth config)
│   │   ├── openai.ts (AI client)
│   │   ├── scraper.ts (Job scrapers)
│   │   └── email.ts (Email integration)
│   ├── models/
│   │   ├── User.ts
│   │   ├── Job.ts
│   │   ├── Application.ts
│   │   └── Document.ts
│   ├── store/
│   │   └── index.ts (Zustand store)
│   └── types/
│       └── index.ts
├── public/
├── .env.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── SPEC.md
```

---

## 8. Implementation Phases

### Phase 1: Foundation
- [x] Project setup (Next.js, TypeScript, Tailwind)
- [x] Database connection (MongoDB)
- [x] Authentication system
- [x] Base UI components
- [x] Layout structure

### Phase 2: Core Features
- [ ] Job scraping system
- [ ] Dashboard with Kanban board
- [ ] Job detail view with split screen
- [ ] Application tracking

### Phase 3: AI Integration
- [ ] OpenAI integration
- [ ] Match score calculation
- [ ] Gap analysis
- [ ] Cover letter generation
- [ ] Resume optimization

### Phase 4: Email & Notifications
- [ ] Email integration
- [ ] Auto-status updates
- [ ] Daily notifications
- [ ] Background job scheduler

### Phase 5: Polish
- [ ] Animations and transitions
- [ ] Error handling
- [ ] Loading states
- [ ] Mobile optimization
