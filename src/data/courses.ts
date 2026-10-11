import { Course } from '../types';

export const CATEGORY_LABELS = {
  engineering: 'Engineering Disciplines',
  programming: 'Programming & Web Dev',
  exams: 'Entrance Exams & College',
  science: 'Basic Sciences & Soft Skills',
  tools: 'Interactive Utilities',
  other: 'More Resources'
};

// Map of all subcategories requested by user with customized structural details
export const SUBCATEGORIES: { [key: string]: { name: string; parent: keyof typeof CATEGORY_LABELS; description: string } } = {
  // Engineering
  'computer-science': { name: 'Computer Science', parent: 'engineering', description: 'Theoretical computing foundations, software design, and algorithms.' },
  'mechanical': { name: 'Mechanical Engineering', parent: 'engineering', description: 'Thermodynamics, fluid mechanics, and machine design.' },
  'electrical': { name: 'Electrical Engineering', parent: 'engineering', description: 'Power systems, electrical machines, and electromagnetic fields.' },
  'electronics': { name: 'Electronics Engineering', parent: 'engineering', description: 'Semiconductors, signal processing, and microprocessors.' },
  'civil': { name: 'Civil Engineering', parent: 'engineering', description: 'Structural analysis, concrete design, and fluid hydraulics.' },
  'chemical': { name: 'Chemical Engineering', parent: 'engineering', description: 'Chemical reactions, mass transfer, and process control.' },
  'aerospace': { name: 'Aerospace Engineering', parent: 'engineering', description: 'Aerodynamics, propulsion, and orbital mechanics.' },
  'robotics': { name: 'Robotics Engineering', parent: 'engineering', description: 'Kinematics, sensor integration, and robot operating systems.' },
  'ai': { name: 'Artificial Intelligence', parent: 'engineering', description: 'Foundational AI, search algorithms, and heuristic methodologies.' },
  'machine-learning': { name: 'Machine Learning', parent: 'engineering', description: 'Supervised, unsupervised, and reinforcement learning paradigms.' },
  'deep-learning': { name: 'Deep Learning', parent: 'engineering', description: 'Neural networks, computer vision, and NLP.' },
  'generative-ai': { name: 'Generative AI', parent: 'engineering', description: 'Large Language Models, Diffusion models, and prompt architectures.' },
  'prompt-engineering': { name: 'Prompt Engineering', parent: 'engineering', description: 'Advanced prompt techniques, RAG, and AI agent instructions.' },
  'cyber-security': { name: 'Cyber Security', parent: 'engineering', description: 'Network defense, cryptography, and penetration testing.' },
  'web-development': { name: 'Web Development', parent: 'engineering', description: 'Full-stack development, modern frameworks, and responsive design.' },
  'android-development': { name: 'Android Development', parent: 'engineering', description: 'Kotlin, Compose, and Android SDK mobile engineering.' },
  'ios-development': { name: 'iOS Development', parent: 'engineering', description: 'Swift, SwiftUI, and Apple ecosystem application development.' },
  'cloud-computing': { name: 'Cloud Computing', parent: 'engineering', description: 'AWS, GCP, containerization, and cloud architecture design.' },
  'devops': { name: 'DevOps', parent: 'engineering', description: 'CI/CD pipelines, Docker, Kubernetes, and infrastructure as code.' },
  'data-science': { name: 'Data Science', parent: 'engineering', description: 'Statistical analysis, data visualization, and predictive modeling.' },
  'operating-system': { name: 'Operating System', parent: 'engineering', description: 'Process management, virtual memory, file systems, and threads.' },
  'dbms': { name: 'DBMS', parent: 'engineering', description: 'Relational databases, SQL querying, transactions, and indexing.' },
  'networking': { name: 'Computer Networking', parent: 'engineering', description: 'OSI layers, TCP/IP, routing protocols, and socket programming.' },
  'compiler-design': { name: 'Compiler Design', parent: 'engineering', description: 'Lexical analysis, parsing, semantic analysis, and code generation.' },
  'computer-architecture': { name: 'Computer Architecture', parent: 'engineering', description: 'CPU execution pipelines, memory hierarchy, and instruction sets.' },
  'dsa': { name: 'Data Structures & Algorithms', parent: 'engineering', description: 'Complex data configurations, search/sort algorithms, and dynamic programming.' },

  // Programming Languages
  'c': { name: 'C Programming', parent: 'programming', description: 'Low-level procedural programming, memory management, and pointers.' },
  'c-plus-plus': { name: 'C++', parent: 'programming', description: 'Object-oriented programming, templates, and STL algorithms.' },
  'python': { name: 'Python', parent: 'programming', description: 'Readable, versatile programming for scripting, AI, and data analysis.' },
  'java': { name: 'Java', parent: 'programming', description: 'Class-based, object-oriented language for enterprise applications.' },
  'javascript': { name: 'JavaScript', parent: 'programming', description: 'The programming language of the web, interactive frontends, and Node.' },
  'go': { name: 'Go (Golang)', parent: 'programming', description: 'Statically typed language built for high concurrency and cloud services.' },
  'rust': { name: 'Rust', parent: 'programming', description: 'System language designed for memory safety, concurrency, and high speed.' },
  'php': { name: 'PHP', parent: 'programming', description: 'Server-side scripting language for traditional dynamic web pages.' },
  'sql': { name: 'SQL & Databases', parent: 'programming', description: 'Relational database query language and relational theory.' },
  'html': { name: 'HTML5', parent: 'programming', description: 'Semantic web structure, accessibility tags, and SEO layout.' },
  'css': { name: 'CSS3', parent: 'programming', description: 'Modern styling, layouts (Grid/Flex), animations, and variables.' },
  'react': { name: 'React', parent: 'programming', description: 'Component-based frontend library, state management, and hooks.' },
  'nodejs': { name: 'Node.js', parent: 'programming', description: 'Asynchronous event-driven JavaScript runtime for servers.' },
  'nextjs': { name: 'Next.js', parent: 'programming', description: 'Production React framework for server rendering and static generation.' },
  'linux': { name: 'Linux Commands', parent: 'programming', description: 'Command line utilities, shell scripting, and systems operations.' },
  'git': { name: 'Git', parent: 'programming', description: 'Distributed version control, branching strategies, and collaboration.' },
  'github': { name: 'GitHub Ecosystem', parent: 'programming', description: 'GitHub Actions, collaboration workflows, issues, and pages.' },

  // Entrance Exams
  'jee': { name: 'JEE Main & Advanced', parent: 'exams', description: 'Preparation resources for premier Indian engineering entrance examinations.' },
  'gate': { name: 'GATE (Graduate Aptitude Test)', parent: 'exams', description: 'Graduate entrance exam covering core engineering subjects.' },
  'uptac': { name: 'UPTAC Counselling & Prep', parent: 'exams', description: 'Engineering state counselling admissions guide and resources.' },
  'cuet': { name: 'CUET (Common University Test)', parent: 'exams', description: 'Admissions guidance for central university undergraduate admissions.' },
  'iit-nit-iiit-aktu': { name: 'College Guide (IIT/NIT/IIIT/AKTU)', parent: 'exams', description: 'Detailed reviews, cutoffs, syllabus, and college comparison matrix.' },

  // Basic Sciences
  'maths': { name: 'Engineering Mathematics', parent: 'science', description: 'Linear algebra, calculus, differential equations, and probability.' },
  'physics': { name: 'Engineering Physics', parent: 'science', description: 'Electromagnetism, optics, quantum mechanics, and solid state.' },
  'chemistry': { name: 'Engineering Chemistry', parent: 'science', description: 'Thermodynamics, chemical kinetics, polymer sciences, and batteries.' },
  'english': { name: 'English Literature & Grammar', parent: 'science', description: 'Technical reading comprehension, vocabulary, and grammar.' },
  'soft-skills': { name: 'Soft Skills & Communication', parent: 'science', description: 'Corporate communication, leadership, and public speaking.' },
  'aptitude-reasoning': { name: 'Aptitude & Logical Reasoning', parent: 'science', description: 'Numerical ability, puzzles, data sufficiency, and analytical reasoning.' },

  // Careers & Other
  'scholarships': { name: 'Scholarships & Funding', parent: 'other', description: 'Academic grants, research assistantships, and international funding.' },
  'internships': { name: 'Internship Tracker', parent: 'other', description: 'Global tech internship applications, interview timelines, and tips.' },
  'jobs': { name: 'Tech Job Board', parent: 'other', description: 'Direct application links, salary insights, and referral guides.' },
  'career-guidance': { name: 'Career Guidance', parent: 'other', description: 'Career path assessments, industry outlooks, and roadmap consulting.' },
  'current-affairs': { name: 'Current Tech Affairs', parent: 'other', description: 'Daily digests of cutting-edge technology releases, mergers, and breakthroughs.' },
  'research-papers': { name: 'Research Papers & ArXiv', parent: 'other', description: 'Scientific paper summaries, methodology reviews, and citation guides.' },
  'api-directory': { name: 'Developer API Directory', parent: 'other', description: 'Documentation maps for Google Cloud, OpenAI, GitHub, and Twitter APIs.' },
  'download-center': { name: 'PDF & Book Download Center', parent: 'other', description: 'Curated standard text-book reference PDFs and cheatsheets.' }
};

// Generates substantial fallback Course detail dynamically if a particular topic is clicked
export function getCourseForSubcategory(slug: string): Course {
  const meta = SUBCATEGORIES[slug] || { name: 'Technology Overview', parent: 'engineering', description: 'Core principles and advanced structures in modern science and tech.' };

  const syllabus = [
    {
      title: 'Module 1: Fundamental Concepts & Onboarding',
      topics: ['Theoretical Core Foundations', 'History & Modern Evolution', 'Setting up the Environment & Core Tools', 'First Hello World / Diagnostic Check']
    },
    {
      title: 'Module 2: Mid-Level Principles & Architecture',
      topics: ['Data Formats & Internal Structural Mechanics', 'Performance Analysis & Algorithmic Complexities', 'Core Best Practices & Design Patterns', 'Working with Real-World Integrations']
    },
    {
      title: 'Module 3: Advanced Optimization & Deployment',
      topics: ['Security Hardening & Threat Auditing', 'Caching, Scaling, and Enterprise Architecture', 'CI/CD Pipelines, Containers & Microservices', 'Production-ready Case Study & Assessment']
    }
  ];

  const interviewQuestions = [
    {
      question: `What are the core pillars/principles governing ${meta.name}?`,
      answer: `The core principles include modular design, separation of concerns, high throughput with minimized overhead, and strict structural enforcement to avoid runtime exception flags.`
    },
    {
      question: `How do you optimize performance and troubleshoot latency in ${meta.name}?`,
      answer: `By identifying bottlenecks through systematic logging, applying caching strategies (like Redis/local storage), reducing network calls, optimizing asset payloads, and balancing query indices.`
    },
    {
      question: `Explain a real-world disaster scenario in this domain and how to prevent it.`,
      answer: `A critical crash usually stems from resource starvation or security bypasses. Prevention is achieved through robust input validation, secure default configurations, active health monitoring, and defensive programming.`
    }
  ];

  const projects = [
    {
      title: `High-Performance ${meta.name} Framework`,
      difficulty: 'Advanced' as const,
      description: `Create an open-source library that implements the core specifications of ${meta.name} with 10x lower memory foot-print.`,
      tech: ['TypeScript', 'Rust', 'Docker', 'GitHub Actions']
    },
    {
      title: `Responsive Dashboard & Analytics Monitor`,
      difficulty: 'Intermediate' as const,
      description: `A responsive control panel that displays real-time performance telemetry and logs for diagnostic assessments.`,
      tech: ['React', 'Tailwind CSS', 'Recharts', 'lucide-react']
    },
    {
      title: `Interactive Sandbox & Guide`,
      difficulty: 'Beginner' as const,
      description: `A interactive web play-ground teaching the foundational syntax and operations step-by-step.`,
      tech: ['HTML5', 'CSS3', 'JavaScript', 'Local Storage']
    }
  ];

  const recommendedBooks = [
    { title: `Mastering ${meta.name}: Deep Dive`, author: 'Dr. Evelyn Foster', rating: 4.9, type: 'Paid' as const },
    { title: `${meta.name} Cheatsheet & Reference Guide`, author: 'Nova Editorial Team', rating: 4.7, type: 'Free' as const },
    { title: `Modern Architectures in Practice`, author: 'Marcus Sterling', rating: 4.8, type: 'Paid' as const }
  ];

  const resources = [
    { name: `Official ${meta.name} Documentation Portal`, url: 'https://docs.example.com', type: 'Documentation' as const },
    { name: `Full Video Course: Zero to Hero`, url: 'https://youtube.com', type: 'Video' as const },
    { name: `Curated PDF Handbook (V2)`, url: '#', type: 'PDF' as const }
  ];

  const roadmap = [
    'Stage 1: Complete Foundational Math & Concepts',
    'Stage 2: Setup Development Workspace & Run Diagnostics',
    'Stage 3: Build Mini-Projects addressing core design rules',
    'Stage 4: Explore Security, Optimization, and Scalability',
    'Stage 5: Contribute to Open-source & complete Certification Quiz'
  ];

  return {
    id: slug,
    title: meta.name,
    category: meta.parent,
    subcategory: slug,
    description: meta.description,
    icon: slug,
    roadmap,
    syllabus,
    interviewQuestions,
    projects,
    notes: `This comprehensive reference guide covers the absolute essentials of **${meta.name}**. Designed for engineering students, researchers, and professional developers, this documentation addresses theoretical design guidelines alongside production-ready code structures. Make sure to complete the interactive sandbox projects and practice the interview preparation panel to build deep operational competence.`,
    recommendedBooks,
    resources,
    difficulty: 'All Levels',
    rating: 4.8,
    students: 12450 + (slug.length * 150),
    author: 'Nova Intel Expert Council'
  };
}

// 5 Curated Top Featured Articles for home page and trending list
export const FEATURED_ARTICLES = [
  {
    id: 'ai-scaling-laws-2026',
    title: 'The AI Scaling Laws of 2026: Quantum Computing & Generative Transformers',
    summary: 'A deep architectural exploration of how modern large language models leverage quantum annealing systems to achieve sub-millisecond reasoning times.',
    content: `Historically, training large language models demanded exponential power growth. In 2026, we are witnessing a fundamental shift towards specialized hybrid quantum-classical hardware accelerators. 
    
    ### Core Architecture Upgrades
    1. **Dynamic Attention Routing**: Eliminating dense layers to route focus tokens based on real-time task complexity.
    2. **Sparse Autoencoders**: Compressing latent representation models to fit directly on-chip, resulting in a 70% latency reduction.
    3. **Sub-symbolic Reasoning**: Merging traditional neural networks with logic solvers to prevent hallucinations entirely.
    
    ### Why This Matters for Engineers
    Engineers must learn to construct Prompt Engines that supply semantic grounding. RAG (Retrieval-Augmented Generation) has evolved from basic vector lookup to dynamic AST (Abstract Syntax Tree) querying.`,
    category: 'deep-learning',
    tags: ['AI', 'Quantum', 'Transformers', 'Next-Gen'],
    author: 'Dr. Sarah Jenkins',
    date: 'July 15, 2026',
    readTime: '6 min read',
    views: 45892,
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'rust-vs-cpp-memory-safety',
    title: 'Rust vs C++: Analyzing Kernel-Level Security and Memory Layouts',
    summary: 'An objective analysis of modern memory allocations, borrow checkers, and pointer arithmetic in operating system kernel design.',
    content: `When building high-throughput systems, every byte counts. For decades, C++ was the unchallenged sovereign of system engineering. Rust has challenged this status-quo with a compile-time promise of memory safety.
    
    ### Memory Ownership Models
    - **C++**: Manual allocation (new/delete) or RAII smart pointers. Subject to user error leading to double-free, use-after-free, and segmentation leaks.
    - **Rust**: Static ownership tracker with strict lifetimes. Checks ownership rules at compile-time with zero runtime overhead.
    
    ### Benchmark Metrics
    In standard TCP routing benchmarks, Rust matches or exceeds C++ throughput while generating 90% fewer runtime safety patches.`,
    category: 'rust',
    tags: ['Rust', 'C++', 'Security', 'Systems'],
    author: 'Alex Riverstone',
    date: 'July 10, 2026',
    readTime: '8 min read',
    views: 32104,
    imageUrl: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'react-19-server-actions',
    title: 'React 19 Deep Dive: Server Components, Asset Loading, and Form Actions',
    summary: 'How React 19 streamlines client-server boundaries, eliminates boilerplate, and dramatically improves Google Lighthouse SEO & First Contentful Paint metrics.',
    content: `React 19 brings the most significant architectural paradigm shift in the framework's history. By introducing native asynchronous Form Actions, compiler support, and server components, developers can write cleaner code that ships fewer kilobytes to the client.
    
    ### Key Features
    1. **Actions API**: Use \`useTransition\` to handle pending states, error boundaries, and visual feedback automatically.
    2. **Document Metadata Support**: Declare title, meta description, and link tags natively within components. React automatically hoists them to the head.
    3. **Optimized Suspense**: Direct integration with stylesheets, scripts, and preloading strategies.
    
    This ensures that our Lighthouse Core Web Vitals stay green consistently.`,
    category: 'react',
    tags: ['React', 'Frontend', 'Web Dev', 'JavaScript'],
    author: 'Maya Lin',
    date: 'July 05, 2026',
    readTime: '5 min read',
    views: 29011,
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'securing-cloud-kubernetes',
    title: 'Securing Kubernetes Clusters: Zero-Trust Network Policy Setup',
    summary: 'Step-by-step devops playbook for establishing mutual TLS, container sandboxing, and strict ingress verification.',
    content: `Deploying containers is simple; keeping them secure is a formidable task. In modern Kubernetes configurations, we must assume that the internal network is untrusted.
    
    ### Zero-Trust Checklist
    - **mTLS (Mutual TLS)**: Secure all service-to-service communication via Linkerd or Istio sidecars.
    - **Non-Root Execution**: Configure Docker containers to run as low-privilege users.
    - **NetworkPolicies**: Set default-deny rules on all namespaces, explicitly whitelisting communication channels.`,
    category: 'devops',
    tags: ['DevOps', 'Cloud', 'Kubernetes', 'Security'],
    author: 'Vikram Mehta',
    date: 'June 28, 2026',
    readTime: '10 min read',
    views: 22409,
    imageUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'gate-2027-cs-syllabus',
    title: 'GATE Computer Science 2027: Winning Strategy & Subject Weightages',
    summary: 'An analytical review of key topics, highly rated text-books, and high-yield scoring units to secure an AIR under 100.',
    content: `Cracking the Graduate Aptitude Test in Engineering (GATE) demands an analytical study pattern rather than rote memorization.
    
    ### Subject Weightage Metrics (CS)
    - **Data Structures & Algorithms**: 15-18% of total score.
    - **Operating Systems & DBMS**: 12-15%.
    - **Theory of Computation & Compiler**: 10-12%.
    - **Engineering Mathematics & General Aptitude**: 15% (Strict mandatory score boosters).
    
    Ensure you solve at least 20 years of previous year questions (PYQs) and complete active full-syllabus test series.`,
    category: 'gate',
    tags: ['GATE', 'Computer Science', 'Career', 'Exam'],
    author: 'Prof. Ramesh Shashtri',
    date: 'June 20, 2026',
    readTime: '7 min read',
    views: 41002,
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop'
  }
];
