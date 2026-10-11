import React, { useState, useEffect } from 'react';
import {
  Database,
  Plus,
  BookOpen,
  FileText,
  HelpCircle,
  Trash2,
  Edit,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  FolderPlus,
  Send,
  Zap,
  Code,
  ShieldCheck,
  Layers,
  ArrowRight,
  Download,
  UploadCloud,
  FileCheck,
  Paperclip
} from 'lucide-react';
import { AuthUser, Course, Article, Quiz, StudyMaterial } from '../types';

interface ContentDatabaseCMSProps {
  currentUser: AuthUser | null;
  onNavigate?: (view: string, id?: string) => void;
  onRefreshAllContent?: () => void;
}

export default function ContentDatabaseCMS({
  currentUser,
  onNavigate,
  onRefreshAllContent
}: ContentDatabaseCMSProps) {
  const isSuperAdmin =
    currentUser?.role === 'super_admin' ||
    currentUser?.email === 'rammilan.kumar7678@gmail.com' ||
    currentUser?.phone === '+91 7678829509' ||
    currentUser?.phone === '7678829509';

  const canManageCourses =
    isSuperAdmin || currentUser?.permissions?.includes('manage_courses');
  const canManageQuizzes =
    isSuperAdmin || currentUser?.permissions?.includes('manage_quizzes');

  const [activeContentType, setActiveContentType] = useState<'courses' | 'articles' | 'quizzes' | 'materials'>('courses');
  const [coursesList, setCoursesList] = useState<Course[]>([]);
  const [articlesList, setArticlesList] = useState<Article[]>([]);
  const [quizzesList, setQuizzesList] = useState<Quiz[]>([]);
  const [materialsList, setMaterialsList] = useState<StudyMaterial[]>([]);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Form states for Study Material
  const [materialForm, setMaterialForm] = useState({
    title: '',
    category: 'engineering',
    type: 'PDF' as 'PDF' | 'Notes' | 'Cheatsheet' | 'Paper',
    downloadUrl: '',
    fileSize: '5.2 MB',
    description: ''
  });

  // Form states for Course
  const [courseForm, setCourseForm] = useState({
    title: '',
    category: 'engineering',
    subcategory: '',
    description: '',
    icon: '📚',
    difficulty: 'Beginner',
    rating: 4.9,
    students: 250,
    roadmapStep1: 'Stage 1: Core Fundamentals & Prerequisite Foundations',
    roadmapStep2: 'Stage 2: Practical Lab Implementations & Syntax',
    roadmapStep3: 'Stage 3: High-Yield Interview Questions & Algorithms',
    roadmapStep4: 'Stage 4: Real-World Industry Projects & Deployment',
    roadmapStep5: 'Stage 5: Final Comprehensive Mastery Assessment',
    syllabusModule1: 'Module 1: Architecture & Core Foundations',
    syllabusTopics1: 'Core Concepts, Tooling Setup, Environment Variables',
    syllabusModule2: 'Module 2: Advanced Design, Scaling & Performance',
    syllabusTopics2: 'Optimization, Profiling, Fault Tolerance, Production Deployment',
    interviewQ1: 'What is the primary architecture and mental model of this technology?',
    interviewA1: 'It utilizes standard modular principles with strict boundary isolation and optimized runtime telemetry.',
    interviewQ2: 'How do you troubleshoot latency and optimize performance?',
    interviewA2: 'By profiling runtime metrics, balancing caching layers, eliminating redundant cycles, and optimizing data structures.',
    projectTitle: 'Production-Grade Distributed System',
    projectDesc: 'An end-to-end full stack deployment demonstrating high concurrency, testing suites, and containerized runtime.',
    notes: 'Key formulas, architectural diagrams, quick reference cheatsheets, and common gotchas.'
  });

  // Form states for Article
  const [articleForm, setArticleForm] = useState({
    title: '',
    category: 'engineering',
    tags: 'Engineering, System Design, Best Practices',
    summary: '',
    content: '',
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop'
  });

  // Form states for Quiz
  const [quizForm, setQuizForm] = useState({
    title: '',
    category: 'engineering',
    difficulty: 'Medium',
    timeLimitSeconds: 180,
    q1Question: 'What is the primary architectural principle of fault-tolerant systems?',
    q1Opt0: 'Graceful degradation & isolated boundaries',
    q1Opt1: 'Single point of execution failure',
    q1Opt2: 'Unchecked continuous recursion',
    q1Opt3: 'Infinite retry loops without backoff',
    q1Correct: 0,
    q1Expl: 'Fault tolerant architectures isolate failure domains to ensure partial service continuity.',
    q2Question: 'Which data structure offers average O(1) lookups?',
    q2Opt0: 'Linked list',
    q2Opt1: 'Hash table with effective distribution',
    q2Opt2: 'Binary search tree',
    q2Opt3: 'Unsorted flat array',
    q2Correct: 1,
    q2Expl: 'A well-hashed table delivers constant time average lookup complexity.'
  });

  // Quick 1-Click Preset Templates
  const ONE_CLICK_COURSE_TEMPLATES = [
    {
      title: 'Full Stack Next.js & React 19',
      category: 'programming',
      icon: '⚡',
      description: 'Master server components, action mutations, server-side caching, and production edge deployment.',
      difficulty: 'Intermediate'
    },
    {
      title: 'Quantum Computing & Algorithms',
      category: 'science',
      icon: '⚛️',
      description: 'Qubits, quantum gates, entanglement, and Shor & Grover algorithm simulations.',
      difficulty: 'Advanced'
    },
    {
      title: 'Kubernetes & Cloud Infrastructure',
      category: 'engineering',
      icon: '☸️',
      description: 'Zero-trust network policies, pod autoscaling, ingress controllers, and Helm charts.',
      difficulty: 'Intermediate'
    },
    {
      title: 'Artificial Intelligence & Large Language Models',
      category: 'engineering',
      icon: '🧠',
      description: 'Transformer architectures, prompt engineering, attention mechanisms, fine-tuning, and RAG pipelines.',
      difficulty: 'Advanced'
    },
    {
      title: 'System Design & Distributed Scalability',
      category: 'engineering',
      icon: '🏗️',
      description: 'Load balancing, CAP theorem, consistent hashing, message queues (Kafka), and database sharding.',
      difficulty: 'Intermediate'
    }
  ];

  const ONE_CLICK_ARTICLE_TEMPLATES = [
    {
      title: 'Distributed Systems: Consistent Hashing Demystified',
      category: 'engineering',
      summary: 'Why consistent hashing minimizes node re-mappings during dynamic scaling in distributed caches like Memcached & Redis.',
      tags: 'Distributed Systems, System Design, Caching, Databases',
      readTime: '7 min read'
    },
    {
      title: 'Memory Allocators: jemalloc vs tcmalloc in High-QPS Microservices',
      category: 'engineering',
      summary: 'Benchmark analysis of thread-caching malloc architectures under intense multi-threaded HTTP workloads.',
      tags: 'Systems, Performance, Linux, C++',
      readTime: '9 min read'
    },
    {
      title: 'Zero-Trust Security Architecture for Cloud-Native APIs',
      category: 'engineering',
      summary: 'Practical checklist to implement mutual TLS (mTLS), SPIFFE/SPIRE workload identities, and continuous verification.',
      tags: 'Security, Cloud, DevOps, Networks',
      readTime: '5 min read'
    }
  ];

  const ONE_CLICK_QUIZ_TEMPLATES = [
    {
      title: 'System Design & Scalability Diagnostic Test',
      category: 'engineering',
      difficulty: 'Hard',
      timeLimitSeconds: 240
    },
    {
      title: 'Data Structures & Big-O Complexity Quick Check',
      category: 'programming',
      difficulty: 'Medium',
      timeLimitSeconds: 180
    },
    {
      title: 'Cloud & Container Security Essentials',
      category: 'engineering',
      difficulty: 'Easy',
      timeLimitSeconds: 150
    }
  ];

  const ONE_CLICK_MATERIAL_TEMPLATES = [
    {
      title: 'Complete GATE CS Comprehensive Handwritten Notes',
      category: 'exams',
      type: 'PDF' as const,
      fileSize: '14.2 MB',
      downloadUrl: '/uploads/sample_gate_cs_handwritten_notes.pdf',
      description: 'All 10 core subjects with formulas, theory, and 15-year previous year solved questions.'
    },
    {
      title: 'System Design Interview Handbook & Architecture Cheatsheet',
      category: 'engineering',
      type: 'PDF' as const,
      fileSize: '8.5 MB',
      downloadUrl: '/uploads/system_design_cheat_sheet.pdf',
      description: 'High-level architectures, CAP theorem, load balancers, caching strategies, and distributed database patterns.'
    },
    {
      title: 'DSA Master 450 Coding Problem Explanations & Solutions',
      category: 'programming',
      type: 'Notes' as const,
      fileSize: '11.0 MB',
      downloadUrl: '/uploads/dsa_450_master_sheet.pdf',
      description: 'Topic-wise curated problems covering arrays, trees, dynamic programming, and graphs in C++ & Java.'
    },
    {
      title: 'Modern AI & Machine Learning Mathematical Foundations',
      category: 'science',
      type: 'Cheatsheet' as const,
      fileSize: '6.4 MB',
      downloadUrl: '/uploads/ai_math_foundations.pdf',
      description: 'Linear algebra, multivariate calculus, optimization gradients, and probability for machine learning.'
    }
  ];

  // Fetch all CMS content from backend
  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/content/all');
      if (res.ok) {
        const data = await res.json();
        setCoursesList(data.courses || []);
        setArticlesList(data.articles || []);
        setQuizzesList(data.quizzes || []);
        setMaterialsList(data.materials || []);
      }
    } catch (err) {
      console.error('Failed to load content database:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // Quick 1-Click Course Insertion Handler
  const handleQuickAddCourse = async (preset: typeof ONE_CLICK_COURSE_TEMPLATES[0]) => {
    setStatusMessage({ type: 'info', text: `Publishing "${preset.title}" in 1-click...` });
    try {
      const res = await fetch('/api/content/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: preset.title,
          category: preset.category,
          icon: preset.icon,
          description: preset.description,
          difficulty: preset.difficulty,
          author: currentUser?.name || 'RAM SAKAL (Super Admin)',
          requesterEmail: currentUser?.email || 'rammilan.kumar7678@gmail.com'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: 'success', text: `✓ 1-Click Success: "${preset.title}" added to Database!` });
        await fetchContent();
        if (onRefreshAllContent) onRefreshAllContent();
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to add course.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Connection error.' });
    }
  };

  // Quick 1-Click Article Insertion Handler
  const handleQuickAddArticle = async (preset: typeof ONE_CLICK_ARTICLE_TEMPLATES[0]) => {
    setStatusMessage({ type: 'info', text: `Publishing article "${preset.title}" in 1-click...` });
    try {
      const res = await fetch('/api/content/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: preset.title,
          category: preset.category,
          summary: preset.summary,
          tags: preset.tags.split(',').map(t => t.trim()),
          readTime: preset.readTime,
          content: `## Executive Overview\n\n${preset.summary}\n\n### Key Principles & Implementation Strategy\n1. Establish strict benchmark baselines.\n2. Isolate components with well-defined interface contracts.\n3. Validate under high synthetic loads.\n\n### Conclusion\nAdopting these architectural patterns prevents costly production downtime and elevates engineering rigor.`,
          author: currentUser?.name || 'RAM SAKAL (Super Admin)',
          requesterEmail: currentUser?.email || 'rammilan.kumar7678@gmail.com'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: 'success', text: `✓ 1-Click Success: Article "${preset.title}" published!` });
        await fetchContent();
        if (onRefreshAllContent) onRefreshAllContent();
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to add article.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Connection error.' });
    }
  };

  // Quick 1-Click Quiz Insertion Handler
  const handleQuickAddQuiz = async (preset: typeof ONE_CLICK_QUIZ_TEMPLATES[0]) => {
    setStatusMessage({ type: 'info', text: `Publishing quiz "${preset.title}" in 1-click...` });
    try {
      const res = await fetch('/api/content/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: preset.title,
          category: preset.category,
          difficulty: preset.difficulty,
          timeLimitSeconds: preset.timeLimitSeconds,
          author: currentUser?.name || 'RAM SAKAL (Super Admin)',
          requesterEmail: currentUser?.email || 'rammilan.kumar7678@gmail.com'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: 'success', text: `✓ 1-Click Success: Quiz "${preset.title}" published!` });
        await fetchContent();
        if (onRefreshAllContent) onRefreshAllContent();
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to add quiz.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Connection error.' });
    }
  };

  // Quick 1-Click Study Material Insertion Handler
  const handleQuickAddMaterial = async (preset: typeof ONE_CLICK_MATERIAL_TEMPLATES[0]) => {
    setStatusMessage({ type: 'info', text: `Publishing study material "${preset.title}" in 1-click...` });
    try {
      const res = await fetch('/api/content/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...preset,
          author: currentUser?.name || 'RAM SAKAL (Super Admin)',
          requesterEmail: currentUser?.email || 'rammilan.kumar7678@gmail.com'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: 'success', text: `✓ 1-Click Success: Material "${preset.title}" published!` });
        await fetchContent();
        if (onRefreshAllContent) onRefreshAllContent();
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to add material.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Connection error.' });
    }
  };

  // File Uploader Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingFile(true);
    setStatusMessage({ type: 'info', text: `Uploading file "${file.name}"...` });
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const res = await fetch('/api/content/upload-file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileData: base64Data,
            contentType: file.type || 'application/pdf',
            title: file.name.replace(/\.[^/.]+$/, ''),
            category: 'engineering',
            type: file.name.endsWith('.pdf') ? 'PDF' : 'Notes',
            author: currentUser?.name || 'RAM SAKAL (Super Admin)',
            requesterEmail: currentUser?.email || 'rammilan.kumar7678@gmail.com'
          })
        });
        const data = await res.json();
        if (res.ok) {
          setStatusMessage({ type: 'success', text: `✓ File "${file.name}" uploaded & published!` });
          await fetchContent();
          if (onRefreshAllContent) onRefreshAllContent();
        } else {
          setStatusMessage({ type: 'error', text: data.error || 'Upload failed.' });
        }
        setIsUploadingFile(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'File read error.' });
      setIsUploadingFile(false);
    }
  };

  // Delete Material Handler
  const handleDeleteMaterial = async (id: string, title: string) => {
    if (!confirm(`Delete study material "${title}" from Content Database?`)) return;
    try {
      const res = await fetch(`/api/content/materials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMessage({ type: 'success', text: `Study material "${title}" deleted.` });
        await fetchContent();
        if (onRefreshAllContent) onRefreshAllContent();
      } else {
        const data = await res.json();
        setStatusMessage({ type: 'error', text: data.error || 'Failed to delete.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Delete error.' });
    }
  };

  // Submit Custom Material Form
  const handleSubmitMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialForm.title.trim()) return;

    setStatusMessage({ type: 'info', text: 'Saving study material...' });
    try {
      const res = await fetch('/api/content/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...materialForm,
          author: currentUser?.name || 'RAM SAKAL (Super Admin)',
          requesterEmail: currentUser?.email || 'rammilan.kumar7678@gmail.com'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: 'success', text: `✓ Material "${materialForm.title}" published!` });
        setModalOpen(false);
        setEditingItem(null);
        await fetchContent();
        if (onRefreshAllContent) onRefreshAllContent();
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to save material.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Network error.' });
    }
  };

  // Submit Custom Course Form
  const handleSubmitCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title.trim()) return;

    setStatusMessage({ type: 'info', text: 'Saving course to Database...' });
    try {
      const payload = {
        title: courseForm.title,
        category: courseForm.category,
        description: courseForm.description,
        icon: courseForm.icon,
        difficulty: courseForm.difficulty,
        rating: courseForm.rating,
        students: courseForm.students,
        roadmap: [
          courseForm.roadmapStep1,
          courseForm.roadmapStep2,
          courseForm.roadmapStep3,
          courseForm.roadmapStep4,
          courseForm.roadmapStep5
        ],
        syllabus: [
          {
            title: courseForm.syllabusModule1,
            topics: courseForm.syllabusTopics1.split(',').map(t => t.trim())
          },
          {
            title: courseForm.syllabusModule2,
            topics: courseForm.syllabusTopics2.split(',').map(t => t.trim())
          }
        ],
        interviewQuestions: [
          { question: courseForm.interviewQ1, answer: courseForm.interviewA1 },
          { question: courseForm.interviewQ2, answer: courseForm.interviewA2 }
        ],
        projects: [
          {
            title: courseForm.projectTitle,
            difficulty: 'Intermediate',
            description: courseForm.projectDesc,
            tech: ['TypeScript', 'Cloud Engine', 'Modern Architecture']
          }
        ],
        notes: courseForm.notes,
        author: currentUser?.name || 'RAM SAKAL (Super Admin)',
        requesterEmail: currentUser?.email || 'rammilan.kumar7678@gmail.com'
      };

      const res = await fetch('/api/content/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: 'success', text: `✓ Course "${courseForm.title}" saved to Content Database!` });
        setModalOpen(false);
        setEditingItem(null);
        await fetchContent();
        if (onRefreshAllContent) onRefreshAllContent();
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to save course.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Network error.' });
    }
  };

  // Submit Custom Article Form
  const handleSubmitArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm.title.trim()) return;

    setStatusMessage({ type: 'info', text: 'Saving article to Database...' });
    try {
      const payload = {
        title: articleForm.title,
        category: articleForm.category,
        summary: articleForm.summary,
        tags: articleForm.tags.split(',').map(t => t.trim()),
        content: articleForm.content,
        readTime: articleForm.readTime,
        imageUrl: articleForm.imageUrl,
        author: currentUser?.name || 'RAM SAKAL (Super Admin)',
        requesterEmail: currentUser?.email || 'rammilan.kumar7678@gmail.com'
      };

      const res = await fetch('/api/content/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: 'success', text: `✓ Article "${articleForm.title}" published!` });
        setModalOpen(false);
        setEditingItem(null);
        await fetchContent();
        if (onRefreshAllContent) onRefreshAllContent();
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to save article.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Network error.' });
    }
  };

  // Submit Custom Quiz Form
  const handleSubmitQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizForm.title.trim()) return;

    setStatusMessage({ type: 'info', text: 'Saving quiz to Database...' });
    try {
      const payload = {
        title: quizForm.title,
        category: quizForm.category,
        difficulty: quizForm.difficulty,
        timeLimitSeconds: quizForm.timeLimitSeconds,
        questions: [
          {
            id: `q-${Date.now()}-1`,
            question: quizForm.q1Question,
            options: [quizForm.q1Opt0, quizForm.q1Opt1, quizForm.q1Opt2, quizForm.q1Opt3],
            correctAnswerIndex: Number(quizForm.q1Correct),
            explanation: quizForm.q1Expl
          },
          {
            id: `q-${Date.now()}-2`,
            question: quizForm.q2Question,
            options: [quizForm.q2Opt0, quizForm.q2Opt1, quizForm.q2Opt2, quizForm.q2Opt3],
            correctAnswerIndex: Number(quizForm.q2Correct),
            explanation: quizForm.q2Expl
          }
        ],
        author: currentUser?.name || 'RAM SAKAL (Super Admin)',
        requesterEmail: currentUser?.email || 'rammilan.kumar7678@gmail.com'
      };

      const res = await fetch('/api/content/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: 'success', text: `✓ Quiz "${quizForm.title}" saved to Database!` });
        setModalOpen(false);
        setEditingItem(null);
        await fetchContent();
        if (onRefreshAllContent) onRefreshAllContent();
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to save quiz.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Network error.' });
    }
  };

  // Delete Handlers
  const handleDeleteCourse = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete course "${title}" from the database?`)) return;
    try {
      const res = await fetch(`/api/content/courses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMessage({ type: 'success', text: `Course "${title}" deleted successfully.` });
        await fetchContent();
        if (onRefreshAllContent) onRefreshAllContent();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteArticle = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete article "${title}" from the database?`)) return;
    try {
      const res = await fetch(`/api/content/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMessage({ type: 'success', text: `Article "${title}" deleted successfully.` });
        await fetchContent();
        if (onRefreshAllContent) onRefreshAllContent();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteQuiz = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete quiz "${title}" from the database?`)) return;
    try {
      const res = await fetch(`/api/content/quizzes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMessage({ type: 'success', text: `Quiz "${title}" deleted successfully.` });
        await fetchContent();
        if (onRefreshAllContent) onRefreshAllContent();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered lists
  const filteredCourses = coursesList.filter(
    c =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredArticles = articlesList.filter(
    a =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredQuizzes = quizzesList.filter(
    q =>
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMaterials = materialsList.filter(
    m =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Deck */}
      <div className="bg-gradient-to-br from-indigo-950/80 via-zinc-900 to-zinc-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              <span>Live Visual CMS & Content Database</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-sans">
              1-Click Content Management Engine
            </h2>
            <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
              Super Admin और Co-Admin बिना किसी बैकएंड कोड या टर्मिनल में जाए, यहाँ से सिर्फ
              <strong>एक क्लिक में नए Courses, Research Articles और Quizzes</strong> डेटाबेस में जोड़ सकते हैं। सभी बदलाव तुरंत लाइव साइट पर उपलब्ध हो जाते हैं।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setEditingItem(null);
                setModalOpen(true);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 text-zinc-950" />
              <span>Add Custom Content</span>
            </button>
            <button
              onClick={fetchContent}
              disabled={isLoading}
              className="px-3.5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-bold flex items-center space-x-2 border border-zinc-700 cursor-pointer transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
              <span>Sync Database</span>
            </button>
          </div>
        </div>

        {/* Database Metrics Counter */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-zinc-800/80">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3">
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Custom Courses</div>
            <div className="text-2xl font-black text-indigo-400 mt-1">{coursesList.length}</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Persistent in Content DB</div>
          </div>
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3">
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Custom Articles</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{articlesList.length}</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Published by Admins</div>
          </div>
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3">
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Custom Quizzes</div>
            <div className="text-2xl font-black text-amber-400 mt-1">{quizzesList.length}</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Assessment Modules</div>
          </div>
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3">
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Study Materials</div>
            <div className="text-2xl font-black text-purple-400 mt-1">{materialsList.length}</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">PDFs & Notes Uploaded</div>
          </div>
        </div>
      </div>

      {/* Status Feedback Pill */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs md:text-sm font-semibold flex items-center justify-between shadow-lg transition-all animate-in fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : statusMessage.type === 'error'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs hover:underline cursor-pointer opacity-70 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1-CLICK INSTANT PRESETS SECTION */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
              1-Click Instant Publishing & File Uploads (तुरुंत जोड़ें व फाइल अपलोड करें)
            </h3>
          </div>
          
          {/* Direct File / PDF Upload Button */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.zip,.txt,.png,.jpg,.jpeg"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingFile}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-purple-600/20 cursor-pointer disabled:opacity-50 transition-all"
            >
              <UploadCloud className={`w-3.5 h-3.5 ${isUploadingFile ? 'animate-bounce' : ''}`} />
              <span>{isUploadingFile ? 'Uploading File...' : 'Upload Any File / PDF (फाइल अपलोड)'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1-Click Courses */}
          <div className="space-y-2 p-3.5 bg-zinc-50 dark:bg-zinc-850 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="text-xs font-black text-indigo-600 dark:text-indigo-400 flex items-center space-x-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Instant Courses (1-Click)</span>
            </div>
            <div className="space-y-1.5">
              {ONE_CLICK_COURSE_TEMPLATES.slice(0, 3).map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAddCourse(item)}
                  className="w-full text-left p-2 rounded-lg bg-white dark:bg-zinc-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 transition-all flex items-center justify-between group cursor-pointer text-xs"
                >
                  <div className="truncate pr-2">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {item.icon} {item.title}
                    </span>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                    + Add
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 1-Click Articles */}
          <div className="space-y-2 p-3.5 bg-zinc-50 dark:bg-zinc-850 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Instant Articles (1-Click)</span>
            </div>
            <div className="space-y-1.5">
              {ONE_CLICK_ARTICLE_TEMPLATES.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAddArticle(item)}
                  className="w-full text-left p-2 rounded-lg bg-white dark:bg-zinc-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-400 transition-all flex items-center justify-between group cursor-pointer text-xs"
                >
                  <div className="truncate pr-2">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      📰 {item.title}
                    </span>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                    + Add
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 1-Click Quizzes */}
          <div className="space-y-2 p-3.5 bg-zinc-50 dark:bg-zinc-850 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center space-x-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Instant Quizzes (1-Click)</span>
            </div>
            <div className="space-y-1.5">
              {ONE_CLICK_QUIZ_TEMPLATES.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAddQuiz(item)}
                  className="w-full text-left p-2 rounded-lg bg-white dark:bg-zinc-900 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-zinc-200 dark:border-zinc-800 hover:border-amber-400 transition-all flex items-center justify-between group cursor-pointer text-xs"
                >
                  <div className="truncate pr-2">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                      📝 {item.title}
                    </span>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
                    + Add
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 1-Click Materials & PDFs */}
          <div className="space-y-2 p-3.5 bg-zinc-50 dark:bg-zinc-850 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="text-xs font-black text-purple-600 dark:text-purple-400 flex items-center space-x-1.5">
              <Paperclip className="w-3.5 h-3.5" />
              <span>Instant Notes & PDFs (1-Click)</span>
            </div>
            <div className="space-y-1.5">
              {ONE_CLICK_MATERIAL_TEMPLATES.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAddMaterial(item)}
                  className="w-full text-left p-2 rounded-lg bg-white dark:bg-zinc-900 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-zinc-200 dark:border-zinc-800 hover:border-purple-400 transition-all flex items-center justify-between group cursor-pointer text-xs"
                >
                  <div className="truncate pr-2">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                      📂 {item.title}
                    </span>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                    + Add
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DATABASE EXPLORER & MANAGEMENT TABS */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        {/* Navigation bar between content types */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50/50 dark:bg-zinc-850/50">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveContentType('courses')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center space-x-2 transition-all cursor-pointer ${
                activeContentType === 'courses'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Courses ({coursesList.length})</span>
            </button>

            <button
              onClick={() => setActiveContentType('articles')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center space-x-2 transition-all cursor-pointer ${
                activeContentType === 'articles'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Articles ({articlesList.length})</span>
            </button>

            <button
              onClick={() => setActiveContentType('quizzes')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center space-x-2 transition-all cursor-pointer ${
                activeContentType === 'quizzes'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Quizzes ({quizzesList.length})</span>
            </button>

            <button
              onClick={() => setActiveContentType('materials')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center space-x-2 transition-all cursor-pointer ${
                activeContentType === 'materials'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
              }`}
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span>Materials & PDFs ({materialsList.length})</span>
            </button>
          </div>

          {/* Search filter input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder={`Search ${activeContentType}...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-750 rounded-xl focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Content Type Tables/Grids */}
        <div className="p-4 sm:p-6">
          {/* 1. COURSES TAB */}
          {activeContentType === 'courses' && (
            <div>
              {filteredCourses.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 flex items-center justify-center mx-auto">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">No Custom Courses in Content Database Yet</h4>
                  <p className="text-xs text-zinc-500 max-w-md mx-auto">
                    Use the 1-Click presets above or click "Add Custom Content" to publish your first persistent course.
                  </p>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setModalOpen(true);
                    }}
                    className="mt-2 px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer hover:bg-indigo-500"
                  >
                    Create New Course
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCourses.map(course => (
                    <div
                      key={course.id}
                      className="p-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-850/70 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl p-1.5 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">{course.icon || '📚'}</span>
                            <div>
                              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm leading-tight line-clamp-1">
                                {course.title}
                              </h4>
                              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                {course.category} • {course.difficulty}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                            Live DB
                          </span>
                        </div>

                        <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>

                        <div className="text-[11px] text-zinc-500 space-y-0.5 pt-1">
                          <div>Syllabus: <strong>{course.syllabus?.length || 0} Modules</strong></div>
                          <div>Roadmap: <strong>{course.roadmap?.length || 0} Stages</strong></div>
                          <div>Q&A: <strong>{course.interviewQuestions?.length || 0} Questions</strong></div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                        <span className="text-[10px] text-zinc-400">By {course.author || 'Admin'}</span>
                        <div className="flex items-center space-x-1">
                          {onNavigate && (
                            <button
                              onClick={() => onNavigate('course', course.id)}
                              className="p-1.5 text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
                              title="View on site"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteCourse(course.id, course.title)}
                            className="p-1.5 text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
                            title="Delete from Database"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. ARTICLES TAB */}
          {activeContentType === 'articles' && (
            <div>
              {filteredArticles.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">No Custom Articles in Content Database Yet</h4>
                  <p className="text-xs text-zinc-500 max-w-md mx-auto">
                    Add tech research articles, GATE guides, and engineering briefs in one click.
                  </p>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setModalOpen(true);
                    }}
                    className="mt-2 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer hover:bg-emerald-500"
                  >
                    Write New Article
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredArticles.map(article => (
                    <div
                      key={article.id}
                      className="p-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-850/70 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm leading-tight line-clamp-1">
                            {article.title}
                          </h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold shrink-0">
                            {article.readTime || '5 min'}
                          </span>
                        </div>

                        <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                          {article.summary}
                        </p>

                        <div className="flex flex-wrap gap-1 pt-1">
                          {article.tags?.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                        <span className="text-[10px] text-zinc-400">By {article.author}</span>
                        <div className="flex items-center space-x-1">
                          {onNavigate && (
                            <button
                              onClick={() => onNavigate('article', article.id)}
                              className="p-1.5 text-zinc-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
                              title="Read article"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteArticle(article.id, article.title)}
                            className="p-1.5 text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
                            title="Delete from Database"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. QUIZZES TAB */}
          {activeContentType === 'quizzes' && (
            <div>
              {filteredQuizzes.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center mx-auto">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">No Custom Quizzes in Content Database Yet</h4>
                  <p className="text-xs text-zinc-500 max-w-md mx-auto">
                    Create instant automated assessment quizzes with custom timers and question banks.
                  </p>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setModalOpen(true);
                    }}
                    className="mt-2 px-4 py-2 bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer hover:bg-amber-500"
                  >
                    Build New Quiz
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredQuizzes.map(quiz => (
                    <div
                      key={quiz.id}
                      className="p-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-850/70 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/40 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm leading-tight line-clamp-1">
                            {quiz.title}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 shrink-0">
                            {quiz.difficulty}
                          </span>
                        </div>

                        <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1 pt-1">
                          <div>Questions: <strong>{quiz.questions?.length || 0} Questions</strong></div>
                          <div>Timer: <strong>{quiz.timeLimitSeconds} seconds ({Math.round(quiz.timeLimitSeconds / 60)} min)</strong></div>
                          <div>Category: <strong className="capitalize">{quiz.category}</strong></div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                        <span className="text-[10px] text-zinc-400">Database Entry</span>
                        <div className="flex items-center space-x-1">
                          {onNavigate && (
                            <button
                              onClick={() => onNavigate('quiz', quiz.id)}
                              className="p-1.5 text-zinc-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
                              title="Take quiz"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteQuiz(quiz.id, quiz.title)}
                            className="p-1.5 text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
                            title="Delete from Database"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. MATERIALS & PDF EXPLORER */}
          {activeContentType === 'materials' && (
            <div className="p-5">
              {filteredMaterials.length === 0 ? (
                <div className="py-14 text-center text-zinc-400 space-y-3">
                  <Paperclip className="w-10 h-10 mx-auto text-zinc-300 dark:text-zinc-600" />
                  <p className="text-xs">No study materials found. Click "Upload Any File / PDF" or use 1-Click presets above to publish notes!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMaterials.map(mat => (
                    <div
                      key={mat.id}
                      className="bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col justify-between hover:border-purple-500/50 transition-all shadow-sm group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 uppercase">
                            {mat.type} • {mat.fileSize || 'PDF'}
                          </span>
                          <span className="text-[10px] text-zinc-400 uppercase font-mono">
                            {mat.category}
                          </span>
                        </div>
                        <h4 className="font-black text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                          {mat.title}
                        </h4>
                        <p className="text-[11px] text-zinc-500 line-clamp-2">
                          {mat.description}
                        </p>
                        <div className="text-[10px] text-zinc-400">
                          By: <strong className="text-zinc-600 dark:text-zinc-300">{mat.author}</strong>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                        <a
                          href={mat.downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          download
                          className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold flex items-center space-x-1 shadow-sm cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </a>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}${mat.downloadUrl}`);
                              setStatusMessage({ type: 'success', text: `Link for "${mat.title}" copied to clipboard!` });
                            }}
                            className="p-1.5 text-zinc-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-zinc-800 rounded-lg cursor-pointer text-xs"
                            title="Copy Download URL"
                          >
                            🔗
                          </button>
                          <button
                            onClick={() => handleDeleteMaterial(mat.id, mat.title)}
                            className="p-1.5 text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
                            title="Delete from Database"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FULL-FEATURED MODAL TO ADD CUSTOM CONTENT */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-850">
              <div className="flex items-center space-x-2">
                <FolderPlus className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-zinc-900 dark:text-zinc-100 text-base">
                  Direct Content Publisher (Admin Database)
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content Type Selector */}
            <div className="p-4 bg-zinc-100/70 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setActiveContentType('courses')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeContentType === 'courses'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                📚 Course Curriculum
              </button>
              <button
                type="button"
                onClick={() => setActiveContentType('articles')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeContentType === 'articles'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                📰 Research Article
              </button>
              <button
                type="button"
                onClick={() => setActiveContentType('quizzes')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeContentType === 'quizzes'
                    ? 'bg-amber-600 text-white shadow'
                    : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                📝 Interactive Quiz
              </button>
              <button
                type="button"
                onClick={() => setActiveContentType('materials')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeContentType === 'materials'
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                📁 Study Material
              </button>
            </div>

            {/* Modal Body with Form */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* COURSE FORM */}
              {activeContentType === 'courses' && (
                <form id="cms-course-form" onSubmit={handleSubmitCourse} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase mb-1">
                        Course Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Distributed Consensus in Raft"
                        value={courseForm.title}
                        onChange={e => setCourseForm({ ...courseForm, title: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase mb-1">
                        Category & Icon
                      </label>
                      <div className="flex space-x-2">
                        <select
                          value={courseForm.category}
                          onChange={e => setCourseForm({ ...courseForm, category: e.target.value })}
                          className="flex-1 px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                        >
                          <option value="engineering">Engineering</option>
                          <option value="programming">Programming & Web Dev</option>
                          <option value="exams">Exams (GATE/JEE)</option>
                          <option value="science">Basic Sciences</option>
                          <option value="tools">Tools & Utilities</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Icon"
                          value={courseForm.icon}
                          onChange={e => setCourseForm({ ...courseForm, icon: e.target.value })}
                          className="w-14 text-center px-2 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase mb-1">
                      Overview Description *
                    </label>
                    <textarea
                      rows={2}
                      placeholder="High-yield syllabus summary and industry relevance..."
                      value={courseForm.description}
                      onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase mb-1">
                        Difficulty
                      </label>
                      <select
                        value={courseForm.difficulty}
                        onChange={e => setCourseForm({ ...courseForm, difficulty: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="All Levels">All Levels</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase mb-1">
                        Initial Rating
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        max="5.0"
                        min="1.0"
                        value={courseForm.rating}
                        onChange={e => setCourseForm({ ...courseForm, rating: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-zinc-50 dark:bg-zinc-850 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                    <span className="text-[11px] font-bold text-indigo-500 uppercase">Syllabus Modules (Curriculum)</span>
                    <input
                      type="text"
                      placeholder="Module 1: Title"
                      value={courseForm.syllabusModule1}
                      onChange={e => setCourseForm({ ...courseForm, syllabusModule1: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Module 1: Comma-separated topics"
                      value={courseForm.syllabusTopics1}
                      onChange={e => setCourseForm({ ...courseForm, syllabusTopics1: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg"
                    />
                  </div>

                  <div className="p-3 bg-zinc-50 dark:bg-zinc-850 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                    <span className="text-[11px] font-bold text-emerald-500 uppercase">Interview Question 1</span>
                    <input
                      type="text"
                      placeholder="Question"
                      value={courseForm.interviewQ1}
                      onChange={e => setCourseForm({ ...courseForm, interviewQ1: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg"
                    />
                    <textarea
                      rows={2}
                      placeholder="Answer"
                      value={courseForm.interviewA1}
                      onChange={e => setCourseForm({ ...courseForm, interviewA1: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg"
                    />
                  </div>
                </form>
              )}

              {/* ARTICLE FORM */}
              {activeContentType === 'articles' && (
                <form id="cms-article-form" onSubmit={handleSubmitArticle} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase mb-1">
                      Article Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Modern Memory Allocators in Distributed Storage"
                      value={articleForm.title}
                      onChange={e => setArticleForm({ ...articleForm, title: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase mb-1">
                        Category
                      </label>
                      <select
                        value={articleForm.category}
                        onChange={e => setArticleForm({ ...articleForm, category: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                      >
                        <option value="engineering">Engineering</option>
                        <option value="deep-learning">Artificial Intelligence</option>
                        <option value="rust">Rust & Systems</option>
                        <option value="react">Web Development</option>
                        <option value="devops">Cloud & DevOps</option>
                        <option value="gate">Entrance Exams</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase mb-1">
                        Read Time
                      </label>
                      <input
                        type="text"
                        value={articleForm.readTime}
                        onChange={e => setArticleForm({ ...articleForm, readTime: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase mb-1">
                      Summary (TL;DR) *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Executive summary of key takeaways..."
                      value={articleForm.summary}
                      onChange={e => setArticleForm({ ...articleForm, summary: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase mb-1">
                      Article Content (Markdown supported) *
                    </label>
                    <textarea
                      rows={6}
                      required
                      placeholder="## Introduction&#10;&#10;Detailed technical writeup and implementation metrics..."
                      value={articleForm.content}
                      onChange={e => setArticleForm({ ...articleForm, content: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase mb-1">
                      Tags (Comma-separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. AI, Systems, Security"
                      value={articleForm.tags}
                      onChange={e => setArticleForm({ ...articleForm, tags: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                    />
                  </div>
                </form>
              )}

              {/* QUIZ FORM */}
              {activeContentType === 'quizzes' && (
                <form id="cms-quiz-form" onSubmit={handleSubmitQuiz} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase mb-1">
                        Quiz Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Distributed Database Transactions"
                        value={quizForm.title}
                        onChange={e => setQuizForm({ ...quizForm, title: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase mb-1">
                        Difficulty & Time Limit
                      </label>
                      <div className="flex space-x-2">
                        <select
                          value={quizForm.difficulty}
                          onChange={e => setQuizForm({ ...quizForm, difficulty: e.target.value as any })}
                          className="flex-1 px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                        <input
                          type="number"
                          placeholder="Seconds"
                          value={quizForm.timeLimitSeconds}
                          onChange={e => setQuizForm({ ...quizForm, timeLimitSeconds: parseInt(e.target.value) })}
                          className="w-24 px-2 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-zinc-50 dark:bg-zinc-850 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                    <span className="text-[11px] font-bold text-amber-500 uppercase">Question 1</span>
                    <input
                      type="text"
                      placeholder="Question text"
                      value={quizForm.q1Question}
                      onChange={e => setQuizForm({ ...quizForm, q1Question: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Option A"
                        value={quizForm.q1Opt0}
                        onChange={e => setQuizForm({ ...quizForm, q1Opt0: e.target.value })}
                        className="px-2 py-1 text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded"
                      />
                      <input
                        type="text"
                        placeholder="Option B"
                        value={quizForm.q1Opt1}
                        onChange={e => setQuizForm({ ...quizForm, q1Opt1: e.target.value })}
                        className="px-2 py-1 text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded"
                      />
                      <input
                        type="text"
                        placeholder="Option C"
                        value={quizForm.q1Opt2}
                        onChange={e => setQuizForm({ ...quizForm, q1Opt2: e.target.value })}
                        className="px-2 py-1 text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded"
                      />
                      <input
                        type="text"
                        placeholder="Option D"
                        value={quizForm.q1Opt3}
                        onChange={e => setQuizForm({ ...quizForm, q1Opt3: e.target.value })}
                        className="px-2 py-1 text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded"
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-1">
                      <span className="text-[10px] text-zinc-500">Correct Option Index:</span>
                      <select
                        value={quizForm.q1Correct}
                        onChange={e => setQuizForm({ ...quizForm, q1Correct: parseInt(e.target.value) })}
                        className="px-2 py-0.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded"
                      >
                        <option value={0}>A (First)</option>
                        <option value={1}>B (Second)</option>
                        <option value={2}>C (Third)</option>
                        <option value={3}>D (Fourth)</option>
                      </select>
                    </div>
                  </div>
                </form>
              )}

              {/* STUDY MATERIAL FORM */}
              {activeContentType === 'materials' && (
                <form id="cms-material-form" onSubmit={handleSubmitMaterial} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase mb-1">
                        Material Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Operating Systems Kernel Handbook (PDF)"
                        value={materialForm.title}
                        onChange={e => setMaterialForm({ ...materialForm, title: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase mb-1">
                        Category & Type
                      </label>
                      <div className="flex space-x-2">
                        <select
                          value={materialForm.category}
                          onChange={e => setMaterialForm({ ...materialForm, category: e.target.value })}
                          className="flex-1 px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                        >
                          <option value="engineering">Engineering</option>
                          <option value="programming">Programming</option>
                          <option value="exams">Exams (GATE/JEE)</option>
                          <option value="science">Science</option>
                          <option value="tools">Tools</option>
                        </select>
                        <select
                          value={materialForm.type}
                          onChange={e => setMaterialForm({ ...materialForm, type: e.target.value as any })}
                          className="w-24 px-2 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                        >
                          <option value="PDF">PDF</option>
                          <option value="Notes">Notes</option>
                          <option value="Cheatsheet">Cheatsheet</option>
                          <option value="Paper">Paper</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase mb-1">
                      Download File URL or Path *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="e.g. /uploads/os_handbook.pdf or https://example.com/file.pdf"
                        value={materialForm.downloadUrl}
                        onChange={e => setMaterialForm({ ...materialForm, downloadUrl: e.target.value })}
                        className="flex-1 px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl font-mono"
                      />
                      <input
                        type="text"
                        placeholder="Size (e.g. 8 MB)"
                        value={materialForm.fileSize}
                        onChange={e => setMaterialForm({ ...materialForm, fileSize: e.target.value })}
                        className="w-24 px-2 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase mb-1">
                      Brief Description / Topics Covered
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Summary of notes, chapters, diagrams and practice sets included..."
                      value={materialForm.description}
                      onChange={e => setMaterialForm({ ...materialForm, description: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                    />
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-850 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                form={
                  activeContentType === 'courses'
                    ? 'cms-course-form'
                    : activeContentType === 'articles'
                    ? 'cms-article-form'
                    : activeContentType === 'quizzes'
                    ? 'cms-quiz-form'
                    : 'cms-material-form'
                }
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-md cursor-pointer flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish to Live Database</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
