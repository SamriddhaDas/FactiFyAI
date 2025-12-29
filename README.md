# FactiFyAI
A website verifying the integrity of a given news using an url or by pasting the paragraph of it. Built with Next.js 14, JavaScript, and Tailwind CSS.

# Background
During emergencies and major events, misinformation spreads rapidly across social media 
platforms. Unverified content often creates panic, confusion, and real-world harm, while fully 
automated censorship systems risk bias and misuse.

# Features
● Rule-based credibility checks (source, time, language patterns)
● Context and source reliability indicators
● Clear explanations for low credibility scores
● User prompts that encourage critical thinking

# Target Users
● General Public
● Social Media Users
● Journalists
● Fact Checkers

# Techstack
Frontend:
  ● Framework: Next.js 14 (App Router)
  ● Language: JavaScript
  ● Styling: Tailwind CSS
  ● State Management: React Context API
  
Backend:
  ● Python (Flask)
  ● Rule based verification logic

  # Project Structure (Frontend)
  factifyai/
│ package.json
│ tailwind.config.js
│ postcss.config.js
│ next.config.js
│ jsconfig.json
│ globals.css
│
├── app/
│   ├── layout.js
│   ├── page.js
│   │
│   ├── verify/
│   │   └── page.js
│   │
│   ├── about/
│   │   └── page.js
│   │
│   └── resources/
│       └── page.js
│
├── components/
│   ├── Header.jsx
│   ├── Hero.jsx
│   ├── CredibilityCard.jsx
│   └── Footer.jsx
│
└── public/
    └── bg-news.png       # Your background

# Project Structure (Backend)
backend/
│ app.py


