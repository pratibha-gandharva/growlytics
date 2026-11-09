import { 
  StudentProfile, 
  Project, 
  InternshipRole, 
  RoadmapModule 
} from '../types'

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  name: "Alex Chen",
  headline: "Computer Science Junior building production-grade web systems",
  university: "State University",
  major: "B.S. in Computer Science",
  graduationYear: "Spring 2027",
  githubUsername: "alexchen-dev",
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  personalWebsite: "https://alexchen.dev",
  targetRoleId: "fullstack-intern",
  recruitmentSeason: "Summer 2027 Internships",
  bio: "Passionate about building responsive, fast full-stack applications with TypeScript, React, and resilient backend systems. Actively closing skill gaps in Docker containerization and database query tuning."
}

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "DevPulse Analytics",
    tagline: "Real-time telemetry and API performance dashboard for developer teams",
    description: "Built a responsive analytics platform featuring interactive charts, latency percentile tracking (p50/p95/p99), and rate limit alerts. Includes mock synthetic traffic generation and exportable performance audit reports.",
    category: "Full-Stack",
    techStack: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Tailwind CSS", "Recharts"],
    githubUrl: "https://github.com/alexchen-dev/devpulse-analytics",
    liveDemoUrl: "https://devpulse-demo.growlytics.app",
    status: "Completed",
    featured: true,
    milestones: [
      {
        id: "m-1-1",
        title: "Relational Schema & Migration Pipeline",
        description: "Designed PostgreSQL normalized tables for time-series API metrics with indexed timestamps.",
        completed: true,
        completedAt: "2026-09-12",
        skillsAwarded: ["PostgreSQL", "SQL Schema Design"]
      },
      {
        id: "m-1-2",
        title: "Express RESTful API with Zod Validation",
        description: "Implemented typed route handlers, input sanitization, and structured JSON error responses.",
        completed: true,
        completedAt: "2026-09-24",
        skillsAwarded: ["Node.js", "Express", "TypeScript"]
      },
      {
        id: "m-1-3",
        title: "Interactive Charts & Custom Metric Filtering",
        description: "Integrated Recharts with custom time-bucket aggregations and smooth SVG tooltip animations.",
        completed: true,
        completedAt: "2026-10-08",
        skillsAwarded: ["React", "Data Visualization", "Tailwind CSS"]
      },
      {
        id: "m-1-4",
        title: "Vercel + Railway Production Deployment",
        description: "Set up automated environment variables, database pooling with pg-pool, and SSL termination.",
        completed: true,
        completedAt: "2026-10-18",
        skillsAwarded: ["Web Deployment", "Environment Config"]
      }
    ],
    keyLearnings: [
      "Optimized query execution time by 64% using compound indexes on (service_id, timestamp_desc).",
      "Handled high-frequency React rerenders with memoization and debounced brush sliders."
    ],
    createdAt: "2026-08-20",
    updatedAt: "2026-10-19"
  },
  {
    id: "proj-2",
    title: "QueryCraft — SQL Planner Visualizer",
    tagline: "Interactive EXPLAIN ANALYZE visual execution tree for students",
    description: "An educational web tool that parses raw PostgreSQL EXPLAIN execution JSON and renders an interactive tree graph with cost nodes, sequential scan warnings, and index recommendations.",
    category: "Frontend",
    techStack: ["React", "TypeScript", "Tailwind CSS", "SVG Graphs", "Zustand"],
    githubUrl: "https://github.com/alexchen-dev/querycraft-visualizer",
    liveDemoUrl: "https://querycraft.growlytics.app",
    status: "In Progress",
    featured: true,
    milestones: [
      {
        id: "m-2-1",
        title: "EXPLAIN JSON Syntax Parser & Tree Normalizer",
        description: "Developed recursive parser converting nested node plans into a unified layout structure.",
        completed: true,
        completedAt: "2026-10-02",
        skillsAwarded: ["TypeScript", "Data Structures", "Algorithms"]
      },
      {
        id: "m-2-2",
        title: "Interactive SVG Canvas with Pan & Zoom",
        description: "Custom lightweight SVG transformation matrix with keyboard accessibility and mini-map.",
        completed: true,
        completedAt: "2026-10-15",
        skillsAwarded: ["React", "Canvas/SVG", "Frontend Performance"]
      },
      {
        id: "m-2-3",
        title: "Performance Heuristics & Bottleneck Detection",
        description: "Flag expensive Sequential Scans vs Index Scans with actionable tips for database beginners.",
        completed: false,
        skillsAwarded: ["Database Optimization", "UX Design"]
      },
      {
        id: "m-2-4",
        title: "End-to-End Test Suite with Playwright",
        description: "Automate cross-browser regression testing on query parsing and responsive tree layouts.",
        completed: false,
        skillsAwarded: ["Testing (E2E)", "CI Automation"]
      }
    ],
    keyLearnings: [
      "Avoided third-party heavyweight graph libraries by implementing a lightweight recursive SVG layout algorithm.",
      "Learned deeply how query optimizers estimate rows vs actual execution timings."
    ],
    createdAt: "2026-09-15",
    updatedAt: "2026-10-22"
  },
  {
    id: "proj-3",
    title: "EchoFlow Event Broker",
    tagline: "Lightweight pub/sub event dispatcher with Redis and WebSockets",
    description: "A resilient message distribution hub connecting multiple client services. Demonstrates channel subscriptions, backpressure mitigation, message delivery guarantees, and a real-time monitor client.",
    category: "Backend",
    techStack: ["Node.js", "TypeScript", "Redis", "WebSockets", "Docker", "Vitest"],
    githubUrl: "https://github.com/alexchen-dev/echoflow-broker",
    status: "In Progress",
    featured: false,
    milestones: [
      {
        id: "m-3-1",
        title: "WebSocket Server Architecture & Connection Pool",
        description: "Constructed heartbeat ping/pong protocol to cleanly drop stale sockets and manage reconnects.",
        completed: true,
        completedAt: "2026-10-10",
        skillsAwarded: ["WebSockets", "Node.js", "Concurrency"]
      },
      {
        id: "m-3-2",
        title: "Redis Pub/Sub Integration for Multi-Node Fanout",
        description: "Implemented Redis channels enabling horizontal scaling across multiple broker processes.",
        completed: false,
        skillsAwarded: ["Redis", "Distributed Systems"]
      },
      {
        id: "m-3-3",
        title: "Docker Compose Multi-Container Orchestration",
        description: "Configured multi-stage Dockerfiles and compose stack for Redis, broker, and mock publisher.",
        completed: false,
        skillsAwarded: ["Docker", "DevOps & Tooling"]
      },
      {
        id: "m-3-4",
        title: "Integration Test Suite & Load Benchmarks",
        description: "Benchmarked throughput with autocannon measuring latency under 5,000 concurrent sockets.",
        completed: false,
        skillsAwarded: ["Testing (Unit/Integration)", "Performance Benchmarking"]
      }
    ],
    keyLearnings: [
      "Discovered memory leak hazards when storing dangling callback closures inside WebSocket listeners.",
      "Understood how Redis Streams differ from simple ephemeral Pub/Sub."
    ],
    createdAt: "2026-10-01",
    updatedAt: "2026-10-24"
  },
  {
    id: "proj-4",
    title: "NeuralScribe — Semantic Markdown Workspace",
    tagline: "Local markdown notes powered by semantic vector search and summaries",
    description: "Desktop note-taking web interface that breaks user documents into semantic chunks, generates local vector embeddings, and provides intelligent context retrieval using an embeddable LLM endpoint.",
    category: "AI/ML",
    techStack: ["Python", "FastAPI", "React", "TypeScript", "ChromaDB", "Tailwind CSS"],
    githubUrl: "https://github.com/alexchen-dev/neural-scribe",
    liveDemoUrl: "https://neuralscribe-preview.growlytics.app",
    status: "Completed",
    featured: true,
    milestones: [
      {
        id: "m-4-1",
        title: "Markdown Chunking & Token Window Splitting",
        description: "Implemented sliding window document segmentation preserving headers and code blocks.",
        completed: true,
        completedAt: "2026-07-14",
        skillsAwarded: ["Python", "Text Processing"]
      },
      {
        id: "m-4-2",
        title: "FastAPI REST API with Async Background Tasks",
        description: "Created non-blocking embedding generation queues to keep the interactive editor fast.",
        completed: true,
        completedAt: "2026-07-28",
        skillsAwarded: ["FastAPI", "Asynchronous Programming"]
      },
      {
        id: "m-4-3",
        title: "Vector Similarity Query & Cosine Ranking",
        description: "Integrated ChromaDB local persistent index for sub-50ms relevant context lookups.",
        completed: true,
        completedAt: "2026-08-10",
        skillsAwarded: ["Vector Databases", "Embeddings"]
      },
      {
        id: "m-4-4",
        title: "Clean Split-Pane Markdown UI with Syntax Highlighting",
        description: "Polished keyboard shortcuts, instant preview, and theme synchronization.",
        completed: true,
        completedAt: "2026-08-22",
        skillsAwarded: ["React", "UI/UX Design", "Accessibility"]
      }
    ],
    keyLearnings: [
      "Chunk overlap sizing drastically impacts semantic retrieval accuracy for programming notes.",
      "Async FastAPI dependency injection cleanly decouples vector store clients from HTTP handlers."
    ],
    createdAt: "2026-06-30",
    updatedAt: "2026-08-25"
  }
]

export const BENCHMARK_ROLES: InternshipRole[] = [
  {
    id: "fullstack-intern",
    name: "Full-Stack Developer Intern",
    subtitle: "End-to-end web applications, modern APIs, and relational databases",
    description: "Expected to contribute across frontend component trees and backend REST/GraphQL services. Must understand database normalization, asynchronous JavaScript, and basic containerization.",
    badgeText: "High Industry Demand",
    iconName: "Layers",
    requiredSkills: [
      {
        skillName: "React & Component Architecture",
        category: "Frontend",
        importance: "Critical",
        targetLevel: 4,
        explanation: "Must write clean, reusable components with hooks, state management, and semantic DOM structure.",
        recommendedAction: "Demonstrated in DevPulse and QueryCraft projects."
      },
      {
        skillName: "TypeScript (Strict Mode)",
        category: "Frontend",
        importance: "Critical",
        targetLevel: 4,
        explanation: "Interviews heavily test generics, unions, interface segregation, and type narrowing.",
        recommendedAction: "Strongly demonstrated across your projects."
      },
      {
        skillName: "Node.js & Express / RESTful APIs",
        category: "Backend",
        importance: "Critical",
        targetLevel: 4,
        explanation: "Core requirement for backend services: middleware, authentication, error handling.",
        recommendedAction: "Demonstrated in DevPulse."
      },
      {
        skillName: "Relational Databases & SQL (PostgreSQL)",
        category: "Backend",
        importance: "Critical",
        targetLevel: 4,
        explanation: "Expected to write joins, group by queries, index optimizations, and prevent N+1 queries.",
        recommendedAction: "Demonstrated in DevPulse. Deepen transaction isolation understanding."
      },
      {
        skillName: "Docker & Containerization",
        category: "DevOps & Tooling",
        importance: "Important",
        targetLevel: 3,
        explanation: "Companies expect interns to run services locally in containers and understand multi-stage builds.",
        recommendedAction: "Skill gap identified. Complete the Docker containerization milestone in EchoFlow."
      },
      {
        skillName: "Automated Testing (Unit & Integration)",
        category: "DevOps & Tooling",
        importance: "Important",
        targetLevel: 3,
        explanation: "Shows engineering maturity. Knowing how to write testable code with Vitest/Jest and Playwright.",
        recommendedAction: "Developing. Add integration tests for API endpoints."
      },
      {
        skillName: "Redis & Caching Strategies",
        category: "Backend",
        importance: "Important",
        targetLevel: 3,
        explanation: "Used ubiquitously for session stores, rate limiters, and response caching.",
        recommendedAction: "Skill gap identified. Complete the Redis integration module in your roadmap."
      },
      {
        skillName: "CI/CD & GitHub Actions",
        category: "DevOps & Tooling",
        importance: "Nice-to-Have",
        targetLevel: 2,
        explanation: "Setting up automated linting, test runners, and preview deployments on pull requests.",
        recommendedAction: "Follow the GitHub Actions guide in Growth Path."
      },
      {
        skillName: "Web Security Fundamentals",
        category: "Core CS",
        importance: "Important",
        targetLevel: 3,
        explanation: "Understanding CORS, CSRF, XSS, rate limiting, and SQL injection prevention.",
        recommendedAction: "Review OWASP Top 10 web vulnerabilities."
      }
    ]
  },
  {
    id: "frontend-intern",
    name: "Frontend Engineer Intern",
    subtitle: "Modern user interfaces, state architecture, and web performance",
    description: "Focuses on delivering delightful, accessible user experiences with deep knowledge of CSS/Tailwind, React re-render optimization, browser rendering lifecycles, and TypeScript.",
    badgeText: "Visual & Interactive",
    iconName: "Palette",
    requiredSkills: [
      {
        skillName: "React & Component Architecture",
        category: "Frontend",
        importance: "Critical",
        targetLevel: 5,
        explanation: "Deep mastery of component composition, custom hooks, ref management, and render cycles.",
        recommendedAction: "Demonstrated in QueryCraft and DevPulse."
      },
      {
        skillName: "TypeScript (Strict Mode)",
        category: "Frontend",
        importance: "Critical",
        targetLevel: 4,
        explanation: "Typing component props, event handlers, and complex state models without 'any'.",
        recommendedAction: "Strongly demonstrated."
      },
      {
        skillName: "CSS, Tailwind & Design Systems",
        category: "Frontend",
        importance: "Critical",
        targetLevel: 4,
        explanation: "Translating Figma designs into accessible, responsive, token-based user interfaces.",
        recommendedAction: "Demonstrated in Growlytics and QueryCraft."
      },
      {
        skillName: "Web Accessibility (WCAG & ARIA)",
        category: "Frontend",
        importance: "Critical",
        targetLevel: 3,
        explanation: "Top tier tech companies evaluate keyboard navigation, color contrast, and screen reader roles.",
        recommendedAction: "Developing. Audit QueryCraft for keyboard focus rings and ARIA landmarks."
      },
      {
        skillName: "Browser Performance & Core Web Vitals",
        category: "Frontend",
        importance: "Important",
        targetLevel: 3,
        explanation: "Understanding LCP, CLS, INP, code splitting, memoization, and bundle size reduction.",
        recommendedAction: "Skill gap identified. Profile QueryCraft re-renders with React DevTools."
      },
      {
        skillName: "State Management (Zustand / Redux)",
        category: "Frontend",
        importance: "Important",
        targetLevel: 4,
        explanation: "Deciding when to use local state, URL query state, or global shared stores.",
        recommendedAction: "Demonstrated in QueryCraft visualizer."
      },
      {
        skillName: "End-to-End Testing (Playwright / Cypress)",
        category: "DevOps & Tooling",
        importance: "Important",
        targetLevel: 3,
        explanation: "Testing critical user flows and preventing UI regressions.",
        recommendedAction: "Complete the Playwright test milestone in QueryCraft."
      }
    ]
  },
  {
    id: "backend-intern",
    name: "Backend Engineer Intern",
    subtitle: "Distributed services, database scalability, and concurrency",
    description: "Concentrates on server reliability, relational and NoSQL databases, message queues, and high-throughput network protocols. Strong foundation in data structures and operating systems required.",
    badgeText: "Systems & Scalability",
    iconName: "Server",
    requiredSkills: [
      {
        skillName: "Node.js / Go / Python Server Development",
        category: "Backend",
        importance: "Critical",
        targetLevel: 4,
        explanation: "Building reliable HTTP APIs with graceful shutdowns and structured logging.",
        recommendedAction: "Demonstrated in DevPulse and EchoFlow."
      },
      {
        skillName: "Relational Databases & SQL (PostgreSQL)",
        category: "Backend",
        importance: "Critical",
        targetLevel: 5,
        explanation: "Query planning, transaction ACID guarantees, indexes (B-Tree, GIN), and migrations.",
        recommendedAction: "Strongly demonstrated in DevPulse. Study lock contention."
      },
      {
        skillName: "Redis & In-Memory Data Structures",
        category: "Backend",
        importance: "Critical",
        targetLevel: 4,
        explanation: "Pub/Sub, TTL expirations, distributed locks, and Sorted Sets for leaderboards.",
        recommendedAction: "Developing in EchoFlow. Complete the Redis fan-out milestone."
      },
      {
        skillName: "System Design & Microservices Basics",
        category: "Core CS",
        importance: "Important",
        targetLevel: 3,
        explanation: "Understanding load balancers, rate limiting algorithms (Token Bucket), and message brokers.",
        recommendedAction: "Follow the system design interview roadmap track."
      },
      {
        skillName: "Docker & Containerization",
        category: "DevOps & Tooling",
        importance: "Critical",
        targetLevel: 3,
        explanation: "Container networking, volumes, environment configuration, and healthchecks.",
        recommendedAction: "Skill gap identified. Complete the Docker Compose task in EchoFlow."
      },
      {
        skillName: "Concurrency & Asynchronous I/O",
        category: "Core CS",
        importance: "Important",
        targetLevel: 3,
        explanation: "Event loops, thread safety, connection pooling, and race condition avoidance.",
        recommendedAction: "Demonstrated in EchoFlow WebSocket handling."
      }
    ]
  },
  {
    id: "aiml-intern",
    name: "AI / Machine Learning Engineer Intern",
    subtitle: "Vector databases, embedding retrieval, and AI application engineering",
    description: "Applies machine learning models, semantic search, and modern ML pipelines to software applications. Requires proficiency in Python, data processing libraries, and REST APIs.",
    badgeText: "Modern AI Engineering",
    iconName: "Cpu",
    requiredSkills: [
      {
        skillName: "Python for Data & Systems",
        category: "Data/ML",
        importance: "Critical",
        targetLevel: 4,
        explanation: "Type annotations, async generators, virtual environments, and high-performance packages.",
        recommendedAction: "Demonstrated in NeuralScribe."
      },
      {
        skillName: "FastAPI / Backend Model Serving",
        category: "Backend",
        importance: "Critical",
        targetLevel: 4,
        explanation: "Serving inferences with async streaming, dependency injection, and Pydantic validation.",
        recommendedAction: "Demonstrated in NeuralScribe."
      },
      {
        skillName: "Vector Databases & Semantic Search",
        category: "Data/ML",
        importance: "Critical",
        targetLevel: 4,
        explanation: "Embeddings, cosine distance, HNSW indexing, and chunking strategies.",
        recommendedAction: "Demonstrated in NeuralScribe with ChromaDB."
      },
      {
        skillName: "Data Structures & Linear Algebra Fundamentals",
        category: "Core CS",
        importance: "Critical",
        targetLevel: 3,
        explanation: "Matrix multiplication, gradient descent principles, and evaluation metrics (Precision/Recall).",
        recommendedAction: "Reviewed in academic coursework. Build a custom evaluator script."
      },
      {
        skillName: "Prompt Engineering & Evaluation Frameworks",
        category: "Data/ML",
        importance: "Important",
        targetLevel: 3,
        explanation: "Structured output JSON schemas, hallucination benchmarks, and few-shot calibration.",
        recommendedAction: "Skill gap identified. Add an automated evaluation test in NeuralScribe."
      },
      {
        skillName: "Docker for Reproducible ML Environments",
        category: "DevOps & Tooling",
        importance: "Important",
        targetLevel: 3,
        explanation: "Packaging CUDA / Python dependencies into reproducible container images.",
        recommendedAction: "Skill gap identified. Containerize the NeuralScribe FastAPI service."
      }
    ]
  }
]

export const INITIAL_ROADMAP: RoadmapModule[] = [
  {
    id: "road-1",
    roleId: "fullstack-intern",
    title: "Master Redis for Caching & Rate Limiting",
    goal: "Implement Redis caching on an Express endpoint to drop query response time under 10ms",
    skillTarget: "Redis & Caching Strategies",
    estimatedHours: 4,
    priority: "High",
    completed: false,
    whyItMatters: "Full-stack interviews frequently test your ability to protect databases from stampedes using cache invalidation (TTL, cache-aside pattern).",
    portfolioChallenge: "Add a sliding-window rate limiter middleware using Redis to your DevPulse project.",
    resources: [
      {
        title: "Redis Official Documentation — Getting Started",
        url: "https://redis.io/docs/latest/develop/get-started/",
        type: "Official Docs",
        isFree: true
      },
      {
        title: "System Design Primer — Caching Patterns",
        url: "https://github.com/donnemartin/system-design-primer#cache",
        type: "GitHub Guide",
        isFree: true
      }
    ]
  },
  {
    id: "road-2",
    roleId: "fullstack-intern",
    title: "Containerize Multi-Service Stack with Docker Compose",
    goal: "Write a production multi-stage Dockerfile and docker-compose.yml running app + database",
    skillTarget: "Docker & Containerization",
    estimatedHours: 5,
    priority: "High",
    completed: false,
    whyItMatters: "Engineering teams want to see that any developer can clone your repo, type `docker compose up`, and have the entire system working instantly.",
    portfolioChallenge: "Create a compose file for EchoFlow bringing up Redis, broker, and test clients with health checks.",
    resources: [
      {
        title: "Docker Curriculum for Beginners",
        url: "https://docker-curriculum.com/",
        type: "Interactive Tutorial",
        isFree: true
      },
      {
        title: "Docker Docs — Multi-stage builds",
        url: "https://docs.docker.com/build/building/multi-stage/",
        type: "Official Docs",
        isFree: true
      }
    ]
  },
  {
    id: "road-3",
    roleId: "fullstack-intern",
    title: "Automated End-to-End Testing with Playwright",
    goal: "Write automated browser tests verifying user authentication and primary user workflows",
    skillTarget: "Automated Testing (Unit & Integration)",
    estimatedHours: 3,
    priority: "Medium",
    completed: false,
    whyItMatters: "Recruiters love candidate repos that feature passing CI test badges. Demonstrates you don't break production.",
    portfolioChallenge: "Add 3 critical path tests to QueryCraft verifying SQL plan rendering and node inspection.",
    resources: [
      {
        title: "Playwright Fast-Track Getting Started",
        url: "https://playwright.dev/docs/intro",
        type: "Official Docs",
        isFree: true
      }
    ]
  },
  {
    id: "road-4",
    roleId: "fullstack-intern",
    title: "GitHub Actions CI Pipeline for Lint & Test",
    goal: "Configure automated pull-request validation that blocks broken builds before merge",
    skillTarget: "CI/CD & GitHub Actions",
    estimatedHours: 2,
    priority: "Medium",
    completed: true,
    completedAt: "2026-10-18",
    whyItMatters: "Proves familiarity with modern team workflows and automated code hygiene.",
    portfolioChallenge: "Add a `.github/workflows/ci.yml` matrix checking Node 20 and Node 22.",
    resources: [
      {
        title: "GitHub Skills — Introduction to GitHub Actions",
        url: "https://skills.github.com/",
        type: "Interactive Tutorial",
        isFree: true
      }
    ]
  },
  {
    id: "road-5",
    roleId: "frontend-intern",
    title: "Core Web Vitals & React Render Profiling",
    goal: "Audit and eliminate unnecessary component re-renders using React DevTools and memoization",
    skillTarget: "Browser Performance & Core Web Vitals",
    estimatedHours: 3,
    priority: "High",
    completed: false,
    whyItMatters: "Distinguishes high-level candidates from beginners who just use useEffect for everything.",
    portfolioChallenge: "Profile QueryCraft's tree graph zoom and reduce re-render time by at least 40%.",
    resources: [
      {
        title: "web.dev — Core Web Vitals Guide",
        url: "https://web.dev/explore/learn-core-web-vitals",
        type: "Official Docs",
        isFree: true
      },
      {
        title: "React Official Docs — Keeping Components Pure",
        url: "https://react.dev/learn/keeping-components-pure",
        type: "Official Docs",
        isFree: true
      }
    ]
  },
  {
    id: "road-6",
    roleId: "frontend-intern",
    title: "Keyboard Navigation & ARIA Accessibility Audit",
    goal: "Ensure full keyboard navigability (Tab, Enter, Escape) and screen-reader label compliance",
    skillTarget: "Web Accessibility (WCAG & ARIA)",
    estimatedHours: 3,
    priority: "High",
    completed: false,
    whyItMatters: "Accessibility is an interview topic at Google, Apple, and Microsoft. Demonstrates inclusive engineering.",
    portfolioChallenge: "Add focus rings, trap focus in dialogs, and test with browser screen reader.",
    resources: [
      {
        title: "W3C WAI ARIA Authoring Practices Guide (APG)",
        url: "https://www.w3.org/WAI/ARIA/apg/",
        type: "Official Docs",
        isFree: true
      }
    ]
  },
  {
    id: "road-7",
    roleId: "backend-intern",
    title: "SQL Index Optimization & Lock Contention",
    goal: "Analyze slow queries using EXPLAIN (ANALYZE, BUFFERS) and design compound indexes",
    skillTarget: "Relational Databases & SQL (PostgreSQL)",
    estimatedHours: 4,
    priority: "High",
    completed: true,
    completedAt: "2026-10-12",
    whyItMatters: "The most common backend interview system design question involves database bottlenecks and indexing.",
    portfolioChallenge: "Demonstrate before/after query plans with index scan vs sequential scan in DevPulse.",
    resources: [
      {
        title: "Use The Index, Luke! — SQL Indexing Guide",
        url: "https://use-the-index-luke.com/",
        type: "Interactive Tutorial",
        isFree: true
      }
    ]
  },
  {
    id: "road-8",
    roleId: "backend-intern",
    title: "Distributed Message Queues & WebSockets",
    goal: "Build reliable message distribution with heartbeat detection and client reconnection logic",
    skillTarget: "Redis & In-Memory Data Structures",
    estimatedHours: 5,
    priority: "High",
    completed: false,
    whyItMatters: "Real-time systems (Slack, Uber, Discord) rely on socket pools and distributed pub/sub brokers.",
    portfolioChallenge: "Connect EchoFlow broker to Redis channels for cross-instance broadcasts.",
    resources: [
      {
        title: "MDN — Writing WebSocket Servers",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers",
        type: "Official Docs",
        isFree: true
      }
    ]
  },
  {
    id: "road-9",
    roleId: "aiml-intern",
    title: "Containerize Python ML Inference Microservices",
    goal: "Package FastAPI with dependencies and model weights into an isolated Docker container",
    skillTarget: "Docker for Reproducible ML Environments",
    estimatedHours: 4,
    priority: "High",
    completed: false,
    whyItMatters: "Machine learning code is notorious for 'it works on my machine'. Containers solve this completely.",
    portfolioChallenge: "Build and test a Docker container for NeuralScribe with ChromaDB persistence volume.",
    resources: [
      {
        title: "FastAPI in Containers — Docker Official Guide",
        url: "https://fastapi.tiangolo.com/deployment/docker/",
        type: "Official Docs",
        isFree: true
      }
    ]
  }
]
