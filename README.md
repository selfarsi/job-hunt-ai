# JobHunt AI - Intelligent Job Search & Application Management System

A comprehensive, AI-powered job search and application tracking system. **100% Free - No database, no API keys required!**

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38b2ac?style=flat-square&logo=tailwind-css)
![LocalStorage](https://img.shields.io/badge/Storage-LocalStorage-green?style=flat-square)

## Features

### Core Features (No External Services)
- **Job Management**: Add, track, and organize job applications
- **Kanban Dashboard**: Drag-and-drop application tracking (Saved → Applied → Pending → Interview → Rejected)
- **Split-Screen View**: Job description on left, AI analysis on right
- **Keyword-Based Matching**: Smart algorithm to match your resume with job descriptions

### AI-Powered Features (Local Algorithm)
- **Match Score Calculation**: Calculates compatibility based on skill overlap
- **Gap Analysis**: Identifies matched skills, skills to highlight, and missing keywords
- **Cover Letter Generator**: Creates professional cover letters using templates
- **Resume Optimization**: Suggests keyword improvements for ATS

### User Interface
- **Premium Dark Theme**: Linear-inspired design with cyan accents
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Polished micro-interactions throughout
- **Data Export**: Export/import your data as JSON backup

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone or download the project:
```bash
cd job-hunt-ai
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

That's it! No database setup, no API keys needed.

## How It Works

### Data Storage
All data is stored in your browser's LocalStorage. This means:
- Your data is private (never sent to any server)
- Works offline
- Instant save/load
- Easy to export/backup

### Matching Algorithm
The keyword-based matching system:
1. Extracts skills from your resume
2. Extracts requirements from job description
3. Calculates overlap percentage
4. Identifies gaps and recommendations

Skills detected include:
- Programming languages (JavaScript, Python, Java, etc.)
- Frameworks (React, Node.js, Django, etc.)
- Cloud platforms (AWS, Azure, GCP)
- Tools (Git, Docker, Kubernetes, etc.)
- Soft skills (Leadership, Communication, etc.)

## Project Structure

```
job-hunt-ai/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Login page
│   │   ├── (dashboard)/       # Dashboard pages
│   │   │   ├── jobs/          # Job listing & details
│   │   │   ├── documents/     # Resume management
│   │   │   └── settings/      # User settings
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   ├── layout/           # Layout components
│   │   ├── jobs/             # Job-related components
│   │   ├── kanban/           # Kanban board components
│   │   └── ai/               # AI analysis components
│   ├── lib/
│   │   ├── storage.ts        # LocalStorage utilities
│   │   └── utils.ts          # Helper functions
│   ├── store/
│   │   └── index.ts          # Zustand store
│   └── types/
│       └── index.ts          # TypeScript types
└── public/                   # Static assets
```

## Usage Guide

### 1. Create Account
Simply enter your email to get started. No password required for demo mode.

### 2. Add Your Resume
Go to Documents → Add your resume text. This enables job matching features.

### 3. Add Jobs
- Click "Add Job" on the Jobs page
- Paste job description
- System will automatically analyze match score

### 4. Track Applications
- Use the Dashboard Kanban board
- Drag jobs between columns to update status
- Click on jobs to see detailed analysis

### 5. Generate Materials
- View job details to generate cover letters
- Use different tones (Professional, Creative, Technical)

## Customization

### Theme Colors
Edit `tailwind.config.ts` to change the color scheme:
```typescript
colors: {
  accent: {
    cyan: "#00D4FF",
    violet: "#8B5CF6",
    // ...
  }
}
```

### Adding New Skills
Edit the `SKILL_KEYWORDS` array in `src/lib/storage.ts` to add more skills for matching.

## Limitations

Since this runs entirely in the browser without external AI:
- Match scoring uses keyword matching, not neural networks
- Cover letters are template-based, not AI-generated
- No email integration (requires external APIs)

For AI-powered features, you would need to:
1. Set up MongoDB for data persistence
2. Add OpenAI API key for GPT-4 features
3. Configure email integration

See the `mongodb-version` branch for the full-featured version.

## Browser Support

Works on all modern browsers:
- Chrome/Edge 90+
- Firefox 90+
- Safari 14+

## License

MIT License - feel free to use for personal projects.
