import { useState, useEffect } from 'react';
import {
  Compass, Search, Flame, Sun, Moon, Globe, BookMarked, User, Menu, X, BookOpen,
  Trophy, Play, CheckCircle, Calendar, ChevronRight, ChevronDown, Bookmark, History,
  Sparkles, Code, Award, Mail, Phone, MapPin, Printer, Heart, Share2, Send, Check,
  ExternalLink, Lock, Cpu, Layers, Terminal, BookOpenCheck, HelpCircle, GraduationCap,
  Smartphone, Wand2
} from 'lucide-react';

import Header from './components/Header';
import Footer from './components/Footer';
import Breadcrumbs from './components/Breadcrumbs';
import InteractiveTools from './components/InteractiveTools';
import ResumeBuilder from './components/ResumeBuilder';
import AssessmentEngine from './components/AssessmentEngine';
import SEO from './components/SEO';
import NovaAI from './components/NovaAI';
import AdminPortal from './components/AdminPortal';
import AuthModal from './components/AuthModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import AIStudioSuite from './components/AIStudioSuite';
import PWAInstallModal from './components/PWAInstallModal';
import OfflineIndicator from './components/OfflineIndicator';
import MobileBottomNav from './components/MobileBottomNav';

import { SUBCATEGORIES, getCourseForSubcategory, FEATURED_ARTICLES, CATEGORY_LABELS } from './data/courses';
import { QUIZZES } from './data/quizzes';
import { TRANSLATIONS } from './utils/translations';
import { UserProfile, Bookmark as BookmarkType, ReadingHistory, Quiz, AuthUser } from './types';

export default function App() {
  // --- Dynamic Quizzes State for AI-generated Quizzes ---
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>(QUIZZES);

  // --- 1. CORE THEMING & TRANSLATIONS ---
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('nova-theme') === 'dark' || true; // Default dark mode
  });
  const [language, setLanguage] = useState<string>(() => {
    return localStorage.getItem('nova-lang') || 'en';
  });

  // --- 2. USER PROFILE STATE & AUTHENTICATION ---
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('nova-auth-user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    // Default logged in as Super Admin RAM SAKAL!
    return {
      id: 'usr-super-admin',
      name: 'RAM SAKAL',
      email: 'rammilan.kumar7678@gmail.com',
      role: 'super_admin',
      status: 'active',
      department: 'Executive Administration & Systems',
      institution: 'Nova Intel HQ',
      permissions: [
        'manage_courses',
        'manage_quizzes',
        'review_students',
        'manage_tools',
        'view_analytics',
        'view_logs',
        'export_data',
        'moderate_discussions'
      ],
      assignedBy: 'System Root (Chief Admin)',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      loginCount: 42,
      isNameVisible: true,
      publicTitle: 'Chief Administrator'
    };
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  const handleUpdateSuperAdminProfile = (updatedUser: AuthUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('nova-auth-user', JSON.stringify(updatedUser));
    setUserProfile(prev => ({
      ...prev,
      name: updatedUser.name,
      email: updatedUser.email
    }));
  };

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('nova-profile');
    if (saved) return JSON.parse(saved);
    return {
      name: 'RAM SAKAL',
      email: 'rammilan.kumar7678@gmail.com',
      role: 'Super Admin',
      institution: 'Nova Intel HQ',
      streak: 7,
      xp: 450,
      completedQuizzes: [],
      savedResumes: []
    };
  });

  // --- 3. INTERACTIVE NAVIGATION STATES ---
  const [activeView, setActiveView] = useState<string>('home'); // home, dashboard, tools, resume, quiz, course, article, search, about, contact, terms, privacy, faq
  const [activeSubcategory, setActiveSubcategory] = useState<string>('computer-science');
  const [activeQuizId, setActiveQuizId] = useState<string>('');
  const [activeArticleId, setActiveArticleId] = useState<string>('ai-scaling-laws-2026');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // --- 4. PERSISTED SOCIAL & TRACKING STATES ---
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>(() => {
    const saved = localStorage.getItem('nova-bookmarks');
    return saved ? JSON.parse(saved) : [
      { id: 'computer-science', type: 'course', title: 'Computer Science', timestamp: Date.now() },
      { id: 'ai-scaling-laws-2026', type: 'article', title: 'The AI Scaling Laws of 2026', timestamp: Date.now() }
    ];
  });

  const [readingHistory, setReadingHistory] = useState<ReadingHistory[]>(() => {
    const saved = localStorage.getItem('nova-history');
    return saved ? JSON.parse(saved) : [
      { id: 'python', type: 'course', title: 'Python', progress: 40, timestamp: Date.now() }
    ];
  });

  // Interactive comments section state
  const [comments, setComments] = useState<{ [key: string]: { author: string; text: string; date: string }[] }>({
    'computer-science': [
      { author: 'Rahul K.', text: 'This curriculum matches the GATE specifications perfectly. Extremely helpful roadmap!', date: 'July 14, 2026' },
      { author: 'Emily Watson', text: 'The practice interview questions are exactly what recruiters ask. Highly recommended.', date: 'July 16, 2026' }
    ],
    'ai-scaling-laws-2026': [
      { author: 'Dr. Dev', text: 'Stunning insights about dense layers vs sparse autoencoders. Quantum annealing integration is the real deal.', date: 'July 15, 2026' }
    ]
  });
  const [newCommentAuthor, setNewCommentAuthor] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  // Course study completion checkboxes
  const [completedModules, setCompletedModules] = useState<{ [key: string]: boolean }>({});

  // Contact form submission visual feedback
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactName, setContactName] = useState('');

  // Share overlay alert notification
  const [shareSuccessMessage, setShareSuccessMessage] = useState<string | null>(null);

  // --- 5. EFFECTS & SYNCERS ---
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('nova-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('nova-theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('nova-lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('nova-profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('nova-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('nova-history', JSON.stringify(readingHistory));
  }, [readingHistory]);

  const t = (key: string) => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  };

  // --- 6. ACTION CONTROLLERS ---
  const handleNavigate = (view: string, sub?: string) => {
    setActiveView(view);
    if (sub) {
      if (view === 'course') {
        setActiveSubcategory(sub);
        // Track course reading history
        updateHistory(sub, 'course', SUBCATEGORIES[sub]?.name || sub, 10);
      } else if (view === 'quiz') {
        setActiveQuizId(sub);
      } else if (view === 'article') {
        setActiveArticleId(sub);
        updateHistory(sub, 'article', FEATURED_ARTICLES.find(a => a.id === sub)?.title || sub, 100);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveView('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Bookmark toggler
  const toggleBookmark = (id: string, type: 'course' | 'article' | 'quiz', title: string) => {
    const exists = bookmarks.find(b => b.id === id && b.type === type);
    if (exists) {
      setBookmarks(bookmarks.filter(b => !(b.id === id && b.type === type)));
    } else {
      setBookmarks([...bookmarks, { id, type, title, timestamp: Date.now() }]);
    }
  };

  // History updater
  const updateHistory = (id: string, type: 'course' | 'article', title: string, progress: number) => {
    const filtered = readingHistory.filter(h => !(h.id === id && h.type === type));
    setReadingHistory([{ id, type, title, progress, timestamp: Date.now() }, ...filtered].slice(0, 8));
  };

  // Clear Bookmarks & history helpers
  const clearBookmarks = () => setBookmarks([]);
  const clearHistory = () => setReadingHistory([]);

  // Comment submittal
  const submitComment = (id: string) => {
    if (!newCommentAuthor.trim() || !newCommentText.trim()) return;
    const list = comments[id] || [];
    const updated = [
      ...list,
      { author: newCommentAuthor.trim(), text: newCommentText.trim(), date: 'Today' }
    ];
    setComments({ ...comments, [id]: updated });
    setNewCommentAuthor('');
    setNewCommentText('');
  };

  // Sharing copy action
  const triggerShare = (title: string) => {
    navigator.clipboard.writeText(`${window.location.href} - Study ${title} on Nova`);
    setShareSuccessMessage(`✓ Share link for "${title}" copied to clipboard!`);
    setTimeout(() => setShareSuccessMessage(null), 3000);
  };

  // Quiz evaluation hook
  const handleQuizCompleted = (score: number) => {
    const xpEarned = score * 20 + 30;
    const updatedQuizzes = [
      ...userProfile.completedQuizzes,
      { quizId: activeQuizId, score, date: new Date().toLocaleDateString() }
    ];
    setUserProfile({
      ...userProfile,
      xp: userProfile.xp + xpEarned,
      streak: userProfile.streak + 1,
      completedQuizzes: updatedQuizzes
    });
  };

  // Handle loading dynamic AI generated quiz
  const handleLoadDynamicQuiz = (dynamicQuiz: Quiz) => {
    setAllQuizzes(prev => {
      if (prev.some(q => q.id === dynamicQuiz.id)) return prev;
      return [...prev, dynamicQuiz];
    });
    setActiveQuizId(dynamicQuiz.id);
    setActiveView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Checkbox curriculum module completion
  const toggleModuleCheck = (courseId: string, moduleIdx: number) => {
    const key = `${courseId}-mod-${moduleIdx}`;
    const nextVal = !completedModules[key];
    setCompletedModules({ ...completedModules, [key]: nextVal });

    // Update history reading progress
    const courseModules = 3; // total modules
    const completedCount = Object.keys(completedModules).filter(k => k.startsWith(`${courseId}-`) && completedModules[k]).length + (nextVal ? 1 : -1);
    const progress = Math.min(100, Math.round((completedCount / courseModules) * 100));
    updateHistory(courseId, 'course', SUBCATEGORIES[courseId]?.name || courseId, progress > 0 ? progress : 10);
  };

  // Dynamic AI-powered Course Recommender Logic
  // It suggests 3 subcategories based on current interests, bookmarks, and viewing patterns
  const getAIRecommendations = () => {
    const defaultRecs = ['ai', 'machine-learning', 'python'];
    if (activeView === 'course') {
      if (activeSubcategory === 'computer-science' || activeSubcategory === 'dsa') {
        return ['dsa', 'c-plus-plus', 'operating-system'];
      }
      if (activeSubcategory === 'ai' || activeSubcategory === 'machine-learning' || activeSubcategory === 'deep-learning') {
        return ['generative-ai', 'prompt-engineering', 'data-science'];
      }
      if (activeSubcategory === 'web-development' || activeSubcategory === 'javascript') {
        return ['react', 'nodejs', 'nextjs'];
      }
      if (activeSubcategory === 'mechanical' || activeSubcategory === 'electrical') {
        return ['electronics', 'robotics', 'aerospace'];
      }
    }
    // Pull from bookmarks if available
    const bookmarkedSubjects = bookmarks.filter(b => b.type === 'course').map(b => b.id);
    if (bookmarkedSubjects.length > 0) {
      if (bookmarkedSubjects.includes('python')) return ['data-science', 'ai', 'machine-learning'];
      if (bookmarkedSubjects.includes('cyber-security')) return ['networking', 'linux', 'cloud-computing'];
    }
    return defaultRecs;
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col transition-colors duration-300 antialiased font-sans">
      <SEO
        title={activeView === 'course' ? SUBCATEGORIES[activeSubcategory]?.name : 'Encyclopedia Platform'}
        description={t('heroSub')}
      />

      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        language={language}
        setLanguage={setLanguage}
        user={userProfile}
        currentUser={currentUser}
        bookmarks={bookmarks}
        onNavigate={handleNavigate}
        onSearch={handleSearch}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenAdminAuthModal={() => setIsAdminAuthModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onSignOut={() => {
          setCurrentUser(null);
          localStorage.removeItem('nova-auth-user');
        }}
        onUpdateSuperAdminProfile={handleUpdateSuperAdminProfile}
      />

      {/* Floating global notifications drawer */}
      {shareSuccessMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 text-xs font-bold border border-zinc-800 animate-slide-up">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>{shareSuccessMessage}</span>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* --- ROUTING SECTION --- */}

        {/* 1. HOME VIEW */}
        {activeView === 'home' && (
          <div className="space-y-12">
            
            {/* Visual Glassmorphic Hero Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-zinc-900 text-white p-8 md:p-14 shadow-2xl border border-zinc-800">
              {/* Background gradient shapes */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-500/20 via-pink-500/10 to-transparent rounded-full filter blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-500/20 via-purple-500/10 to-transparent rounded-full filter blur-3xl pointer-events-none" />

              <div className="relative max-w-3xl space-y-6">
                <span className="inline-flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interactive Educational Matrix v2.6</span>
                </span>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight uppercase font-sans">
                  {t('heroTitle')}
                </h1>
                
                <p className="text-sm md:text-base text-zinc-400 leading-relaxed font-normal">
                  {t('heroSub')}
                </p>

                <div className="flex flex-wrap gap-3 pt-3">
                  <button
                    onClick={() => handleNavigate('aistudio')}
                    className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-90 text-white px-6 py-3 rounded-xl text-xs md:text-sm font-black transition-all shadow-lg shadow-pink-600/25 cursor-pointer flex items-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4 text-pink-200 animate-pulse" />
                    <span>Explore 11 AI Features</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/20 text-white">Veo 3 • Lyria</span>
                  </button>

                  <button
                    onClick={() => setIsInstallModalOpen(true)}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center space-x-2"
                  >
                    <Smartphone className="w-4 h-4 text-indigo-400" />
                    <span>Install Mobile App (PWA)</span>
                  </button>

                  <button
                    onClick={() => {
                      const el = document.getElementById('curriculum-grid');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-5 py-3 rounded-xl text-xs md:text-sm font-semibold border border-zinc-700 transition-all cursor-pointer"
                  >
                    {t('getStarted')}
                  </button>
                  <button
                    onClick={() => handleNavigate('tools')}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-5 py-3 rounded-xl text-xs md:text-sm font-semibold border border-zinc-700 transition-all cursor-pointer"
                  >
                    {t('toolsBtn')}
                  </button>
                </div>
              </div>
            </div>

            {/* Core Statistics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: '100+', label: 'Syllabus Portals', sub: 'Engineering + Programming' },
                { value: '50+', label: 'Interconnected Pages', sub: 'Comprehensive Syllabus' },
                { value: '12K+', label: 'Active Scholars', sub: 'Institutional Members' },
                { value: '6+', label: 'Interactive Sandbox Tools', sub: 'Calculators & Editors' }
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm text-center">
                  <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{stat.value}</div>
                  <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-1 uppercase tracking-wider">{stat.label}</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* AI recommendation widget */}
            <div className="bg-indigo-50/50 dark:bg-indigo-950/10 p-5 rounded-2xl border border-indigo-100/50 dark:border-indigo-950/30">
              <div className="flex items-center space-x-2 text-indigo-900 dark:text-indigo-300 mb-4">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider">AI Study Advisor Recommendations</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {getAIRecommendations().map((slug) => {
                  const sub = SUBCATEGORIES[slug] || { name: slug, description: 'Explore details...' };
                  return (
                    <button
                      key={slug}
                      onClick={() => handleNavigate('course', slug)}
                      className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/60 p-4 rounded-xl text-left hover:scale-[1.02] hover:border-indigo-500 dark:hover:border-indigo-500 transition-all cursor-pointer shadow-sm"
                    >
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-50 truncate">{sub.name}</div>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">{sub.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Categories & Topics Portal Grid */}
            <div id="curriculum-grid" className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-zinc-950 dark:text-zinc-50 uppercase tracking-tight">{t('categoriesTitle')}</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Select any academy discipline to read detailed notes, syllabi, and coding guidelines.</p>
                </div>

                {/* Subcategory filtering */}
                <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl overflow-x-auto max-w-full whitespace-nowrap scrollbar-none space-x-1">
                  {['all', 'engineering', 'programming', 'exams', 'science', 'other'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                        categoryFilter === cat
                          ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-800'
                      }`}
                    >
                      {cat.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategories listings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(SUBCATEGORIES)
                  .filter(([_, data]) => categoryFilter === 'all' || data.parent === categoryFilter)
                  .map(([slug, data]) => (
                    <button
                      key={slug}
                      onClick={() => handleNavigate('course', slug)}
                      className="bg-white dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-850 p-5 rounded-2xl text-left hover:border-indigo-600 dark:hover:border-indigo-400 hover:shadow-md transition-all group cursor-pointer relative"
                    >
                      <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center font-bold text-xs uppercase mb-3">
                        {slug.slice(0, 2)}
                      </div>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {data.name}
                      </h4>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed line-clamp-3">
                        {data.description}
                      </p>
                      <div className="absolute bottom-4 right-4 text-zinc-300 dark:text-zinc-700 group-hover:text-indigo-500 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Featured Articles & Research Reports */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-zinc-950 dark:text-zinc-50 uppercase tracking-tight">{t('trendingTitle')}</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Deep-dive analyses and engineering notes published by academic mentors.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {FEATURED_ARTICLES.slice(0, 3).map((article) => (
                  <div
                    key={article.id}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:scale-[1.01] transition-transform"
                  >
                    <div className="relative h-40 overflow-hidden bg-zinc-200">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 bg-zinc-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        {article.category}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center text-[10px] text-zinc-400 space-x-2 mb-1.5">
                          <span>{article.author}</span>
                          <span>•</span>
                          <span>{article.date}</span>
                        </div>
                        <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 hover:text-indigo-600 cursor-pointer line-clamp-2" onClick={() => handleNavigate('article', article.id)}>
                          {article.title}
                        </h3>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-3">
                          {article.summary}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-3">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{article.readTime}</span>
                        <button
                          onClick={() => handleNavigate('article', article.id)}
                          className="text-xs text-indigo-600 dark:text-indigo-400 font-bold flex items-center space-x-1"
                        >
                          <span>Read Report</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links to Tools & Exams */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box 1 */}
              <div className="bg-zinc-900 text-white rounded-3xl p-6 md:p-8 border border-zinc-800 flex flex-col justify-between space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Self-Assessment Engine</span>
                  <h3 className="text-xl font-black uppercase">Take Interactive Mock Tests</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
                    Complete graded quizzes on core CS subjects, Python, JEE, and GATE. Earn points, build study streaks, and unlock academic certificates.
                  </p>
                </div>
                <button
                  onClick={() => handleNavigate('quiz', allQuizzes[0]?.id || '')}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold w-fit cursor-pointer transition-all"
                >
                  Start Assessment
                </button>
              </div>

              {/* Box 2 */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Career Guidance</span>
                  <h3 className="text-xl font-black uppercase text-zinc-900 dark:text-white">Build Your AI Resume</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm">
                    Generate highly professional, ATS-optimized single-page engineering CVs. Custom styled minimal templates instantly printable.
                  </p>
                </div>
                <button
                  onClick={() => handleNavigate('resume')}
                  className="bg-zinc-900 text-white dark:bg-zinc-800 hover:bg-zinc-700 px-5 py-2.5 rounded-xl text-xs font-bold w-fit cursor-pointer transition-all"
                >
                  Launch Resume Builder
                </button>
              </div>
            </div>

          </div>
        )}

        {/* 2. SCHOLAR DASHBOARD */}
        {activeView === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            <Breadcrumbs items={[{ label: t('dashboardTitle') }]} />

            {/* Profile dashboard banner */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-xl font-black uppercase">
                  {userProfile.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-50 uppercase">{userProfile.name}</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{userProfile.role} • {userProfile.institution}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-zinc-50 dark:bg-zinc-800 px-4 py-2.5 rounded-xl text-center border border-zinc-100 dark:border-zinc-800/80">
                  <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 block">{userProfile.xp}</span>
                  <span className="text-[9px] text-zinc-400 uppercase font-black tracking-wider">Total XP</span>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800 px-4 py-2.5 rounded-xl text-center border border-zinc-100 dark:border-zinc-800/80">
                  <span className="text-2xl font-black text-pink-500 block">{userProfile.streak}</span>
                  <span className="text-[9px] text-zinc-400 uppercase font-black tracking-wider">Day Streak</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Recent Reading History */}
              <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 p-6 rounded-2xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-widest flex items-center space-x-1.5">
                    <History className="w-4 h-4 text-indigo-500" />
                    <span>{t('recentHistory')}</span>
                  </h3>
                  {readingHistory.length > 0 && (
                    <button onClick={clearHistory} className="text-[10px] text-red-500 font-bold hover:underline">Clear All</button>
                  )}
                </div>

                <div className="space-y-4">
                  {readingHistory.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1">
                      <div>
                        <h4 className="font-bold text-zinc-800 dark:text-zinc-200 hover:text-indigo-600 cursor-pointer" onClick={() => handleNavigate(item.type, item.id)}>
                          {item.title}
                        </h4>
                        <span className="text-[9px] text-zinc-400 uppercase tracking-wide">{item.type}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        {/* Reading progress pill */}
                        <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                          {item.progress}% Read
                        </span>
                        <button
                          onClick={() => handleNavigate(item.type, item.id)}
                          className="text-indigo-600 hover:text-indigo-800 font-bold"
                        >
                          Resume
                        </button>
                      </div>
                    </div>
                  ))}
                  {readingHistory.length === 0 && (
                    <p className="text-zinc-400 italic text-center py-6 text-xs">No reading history registered yet. Click on any course above to start studying!</p>
                  )}
                </div>
              </div>

              {/* Right Column: Bookmarks */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 p-6 rounded-2xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-widest flex items-center space-x-1.5">
                    <BookMarked className="w-4 h-4 text-indigo-500" />
                    <span>{t('savedBookmarks')}</span>
                  </h3>
                  {bookmarks.length > 0 && (
                    <button onClick={clearBookmarks} className="text-[10px] text-red-500 font-bold hover:underline">Clear All</button>
                  )}
                </div>

                <div className="space-y-3">
                  {bookmarks.map((bookmark) => (
                    <div key={bookmark.id} className="flex items-center justify-between text-xs py-1 border-b border-zinc-50 dark:border-zinc-800/20 pb-2">
                      <div className="truncate max-w-[150px]">
                        <h4 className="font-bold text-zinc-800 dark:text-zinc-200 hover:text-indigo-600 cursor-pointer truncate" onClick={() => handleNavigate(bookmark.type, bookmark.id)}>
                          {bookmark.title}
                        </h4>
                        <span className="text-[9px] text-zinc-400 uppercase font-medium">{bookmark.type}</span>
                      </div>
                      <button
                        onClick={() => toggleBookmark(bookmark.id, bookmark.type, bookmark.title)}
                        className="text-red-500 hover:text-red-700 text-[10px] font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {bookmarks.length === 0 && (
                    <p className="text-zinc-400 italic text-center py-6 text-xs">No bookmarks saved yet.</p>
                  )}
                </div>
              </div>

            </div>

            {/* Assessment results list */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
              <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-3 flex items-center space-x-1.5">
                <Trophy className="w-4 h-4 text-indigo-500" />
                <span>{t('completedQuizzes')}</span>
              </h3>
              
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
                {userProfile.completedQuizzes.map((q, idx) => {
                  const quizDetail = allQuizzes.find(item => item.id === q.quizId) || { title: q.quizId };
                  return (
                    <div key={idx} className="flex justify-between items-center py-3">
                      <div>
                        <h4 className="font-bold text-zinc-800 dark:text-zinc-200">{quizDetail.title}</h4>
                        <p className="text-[9px] text-zinc-400 uppercase font-mono">{q.date}</p>
                      </div>
                      <span className="font-bold text-green-600 bg-green-50 dark:bg-green-950/20 px-2.5 py-1 rounded">
                        Score: {q.score} Correct
                      </span>
                    </div>
                  );
                })}
                {userProfile.completedQuizzes.length === 0 && (
                  <p className="text-zinc-400 italic text-center py-6">No completed exams yet. Start tests via the home page.</p>
                )}
              </div>
            </div>

          </div>
        )}

        {/* 3. INTERACTIVE TOOLS UNIT */}
        {activeView === 'tools' && (
          <div className="space-y-6 animate-fade-in">
            <Breadcrumbs items={[{ label: t('toolsTitle') }]} />
            <InteractiveTools />
          </div>
        )}

        {/* 4. AI RESUME BUILDER */}
        {activeView === 'resume' && (
          <div className="space-y-6 animate-fade-in">
            <Breadcrumbs items={[{ label: t('resumeBuilder') }]} />
            <ResumeBuilder />
          </div>
        )}

        {/* 5. ACADEMIC SYLLABUS PORTAL (COURSE DETAILS) */}
        {activeView === 'course' && (() => {
          const course = getCourseForSubcategory(activeSubcategory);
          const hasBookmarked = bookmarks.some(b => b.id === activeSubcategory && b.type === 'course');
          
          return (
            <div className="space-y-8 animate-fade-in">
              <Breadcrumbs items={[{ label: CATEGORY_LABELS[course.category] }, { label: course.title }]} />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT CORE COLUMN: THE SYLLABUS DETAILS */}
                <div className="lg:col-span-8 space-y-8">
                  
                  {/* Banner header details */}
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 px-2.5 py-0.5 rounded-md">
                        {course.category}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-pink-500 bg-pink-50 dark:bg-pink-950/10 px-2.5 py-0.5 rounded-md">
                        {course.difficulty}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-zinc-50 uppercase tracking-tight">
                        {course.title} Syllabus
                      </h1>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleBookmark(course.id, 'course', course.title)}
                          className={`p-2 border rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer ${
                            hasBookmarked ? 'border-pink-500 text-pink-500' : 'border-zinc-200 dark:border-zinc-800'
                          }`}
                          title="Bookmark course"
                        >
                          <Bookmark className={`w-4.5 h-4.5 ${hasBookmarked ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => triggerShare(course.title)}
                          className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                          title="Share report"
                        >
                          <Share2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-zinc-500 bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80 w-fit">
                      <span>Created by: <strong className="text-indigo-600 dark:text-indigo-400">Ramsakal</strong></span>
                      <span className="text-zinc-300 dark:text-zinc-700">•</span>
                      <span>Powered by: <strong className="text-indigo-600 dark:text-indigo-400">Nova Intel Report</strong></span>
                    </div>

                    <p className="text-zinc-600 dark:text-zinc-300 text-xs md:text-sm leading-relaxed max-w-3xl font-normal">
                      {course.description}
                    </p>
                  </div>

                  {/* Syllabus / Curriculum Accordion Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center space-x-1.5">
                      <Layers className="w-4 h-4 text-indigo-500" />
                      <span>{t('latestSyllabus')}</span>
                    </h3>

                    <div className="space-y-3">
                      {course.syllabus.map((mod, idx) => {
                        const isDone = completedModules[`${course.id}-mod-${idx}`] || false;
                        return (
                          <div key={idx} className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-4 rounded-xl shadow-sm space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2.5">
                                <button
                                  onClick={() => toggleModuleCheck(course.id, idx)}
                                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                                    isDone ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-zinc-300 dark:border-zinc-700'
                                  }`}
                                >
                                  {isDone && <Check className="w-3.5 h-3.5" />}
                                </button>
                                <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-100">{mod.title}</h4>
                              </div>
                            </div>

                            <ul className="pl-7 space-y-1.5 text-zinc-500 dark:text-zinc-400 text-xs">
                              {mod.topics.map((t, i) => (
                                <li key={i} className="flex items-center space-x-1.5">
                                  <ChevronRight className="w-3 h-3 text-zinc-300" />
                                  <span>{t}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Syllabus Notes Text Area */}
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-6 rounded-2xl shadow-sm space-y-3">
                    <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-widest pb-1 border-b border-zinc-50 dark:border-zinc-800">Syllabus Reference Notes</h3>
                    <p className="text-zinc-600 dark:text-zinc-300 text-xs leading-relaxed leading-6 font-normal">
                      {course.notes}
                    </p>
                  </div>

                  {/* Recommended Projects Column */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center space-x-1.5">
                      <Code className="w-4 h-4 text-indigo-500" />
                      <span>{t('projectsTitle')}</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.projects.map((proj, idx) => (
                        <div key={idx} className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                                {proj.difficulty}
                              </span>
                            </div>
                            <h4 className="text-xs font-black text-zinc-900 dark:text-zinc-50">{proj.title}</h4>
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed">{proj.description}</p>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {proj.tech.map((tech, i) => (
                              <span key={i} className="bg-zinc-50 dark:bg-zinc-800/50 px-2 py-0.5 rounded font-mono text-[9px] text-zinc-400">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interview Preparation Accordion */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center space-x-1.5">
                      <HelpCircle className="w-4 h-4 text-indigo-500" />
                      <span>Interview Preparation Q&As</span>
                    </h3>

                    <div className="space-y-3 text-xs">
                      {course.interviewQuestions.map((q, idx) => (
                        <div key={idx} className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-4 rounded-xl shadow-sm space-y-2">
                          <h4 className="font-bold text-zinc-900 dark:text-zinc-50 flex items-start">
                            <span className="text-indigo-600 mr-1.5">Q{idx+1}:</span>
                            <span>{q.question}</span>
                          </h4>
                          <p className="text-zinc-600 dark:text-zinc-300 pl-6 leading-relaxed leading-5">
                            {q.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Academic Comments Board Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2">Academic Discussion Board</h3>
                    
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm space-y-4">
                      {/* Comments feed */}
                      <div className="space-y-4 text-xs">
                        {(comments[course.id] || []).map((comm, idx) => (
                          <div key={idx} className="border-b border-zinc-50 dark:border-zinc-800/50 pb-3 last:border-0 last:pb-0">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-zinc-900 dark:text-zinc-100">{comm.author}</span>
                              <span className="text-[10px] text-zinc-400">{comm.date}</span>
                            </div>
                            <p className="text-zinc-600 dark:text-zinc-300">{comm.text}</p>
                          </div>
                        ))}
                      </div>

                      {/* Comment add form */}
                      <div className="space-y-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            value={newCommentAuthor}
                            onChange={(e) => setNewCommentAuthor(e.target.value)}
                            placeholder="Your Name..."
                            className="px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-lg outline-none"
                          />
                        </div>
                        <textarea
                          rows={2}
                          required
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          placeholder="Type academic comment or query..."
                          className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-lg outline-none"
                        />
                        <button
                          onClick={() => submitComment(course.id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm cursor-pointer"
                        >
                          Submit Post
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN: BOOK references and official resources */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Recommended Reference Books */}
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-4">
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2">Academic Text Books</h3>
                    
                    <div className="space-y-3 text-xs">
                      {course.recommendedBooks.map((book, i) => (
                        <div key={i} className="flex justify-between items-center py-1">
                          <div>
                            <h4 className="font-bold text-zinc-800 dark:text-zinc-200 leading-tight">{book.title}</h4>
                            <span className="text-[10px] text-zinc-400">{book.author}</span>
                          </div>
                          <span className="font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded text-[10px]">
                            {book.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resource Playlists & PDFs links */}
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-4">
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2">Syllabus Playlists</h3>

                    <div className="space-y-3 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      {course.resources.map((res, i) => (
                        <a
                          key={i}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-2 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                        >
                          <span>{res.name}</span>
                          <span className="text-[10px] font-bold text-zinc-400">{res.type}</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Related reports */}
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-3">
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2">Related Articles</h3>
                    
                    <div className="space-y-2 text-xs">
                      {FEATURED_ARTICLES.filter(a => a.id !== activeArticleId).slice(0, 2).map((art) => (
                        <div key={art.id} className="py-1">
                          <h4 className="font-bold text-zinc-800 dark:text-zinc-200 hover:text-indigo-600 cursor-pointer" onClick={() => handleNavigate('article', art.id)}>
                            {art.title}
                          </h4>
                          <span className="text-[10px] text-zinc-400">{art.author}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          );
        })()}

        {/* 6. EXTENDED ARTICLE DETAIL SCREEN */}
        {activeView === 'article' && (() => {
          const art = FEATURED_ARTICLES.find(a => a.id === activeArticleId) || FEATURED_ARTICLES[0];
          const hasBookmarked = bookmarks.some(b => b.id === art.id && b.type === 'article');

          return (
            <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
              <Breadcrumbs items={[{ label: 'Research Articles' }, { label: art.title }]} />

              <div className="relative h-64 md:h-80 overflow-hidden bg-zinc-950 rounded-3xl border border-zinc-800 shadow-xl">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded">
                    {art.category.toUpperCase()}
                  </span>
                  <h1 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight">{art.title}</h1>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-zinc-500 bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80 w-fit">
                <span>Created by: <strong className="text-indigo-600 dark:text-indigo-400">Ramsakal</strong></span>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <span>Powered by: <strong className="text-indigo-600 dark:text-indigo-400">Nova Intel Report</strong></span>
              </div>

              <div className="flex items-center justify-between border-y border-zinc-200/50 dark:border-zinc-800/80 py-4 text-xs text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold">
                    {art.author.charAt(0)}
                  </div>
                  <div>
                    <span className="block font-bold text-zinc-800 dark:text-zinc-200">{art.author}</span>
                    <span className="text-[10px] text-zinc-400">{art.date} • {art.readTime}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleBookmark(art.id, 'article', art.title)}
                    className={`p-2 border rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer ${
                      hasBookmarked ? 'border-pink-500 text-pink-500' : 'border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${hasBookmarked ? 'fill-current' : ''}`} />
                  </button>
                  <button onClick={() => triggerShare(art.title)} className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Core rich article markup */}
              <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed leading-7 space-y-6">
                <div className="whitespace-pre-wrap font-normal">
                  {art.content}
                </div>
              </div>

              {/* Share checklist banner */}
              <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                <div>
                  <h4 className="uppercase">Did you find this report informative?</h4>
                  <p className="text-[10px] text-zinc-500 font-normal">Share this research with your academic groups.</p>
                </div>
                <button
                  onClick={() => triggerShare(art.title)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  Copy Share link
                </button>
              </div>
            </div>
          );
        })()}

        {/* 7. DETAILED MOCK EXAM PORTAL (QUIZ PLAYER) */}
        {activeView === 'quiz' && (() => {
          const activeQuiz = allQuizzes.find(q => q.id === activeQuizId) || allQuizzes[0];
          return (
            <div className="space-y-6 animate-fade-in">
              <Breadcrumbs items={[{ label: 'Assessment Portals' }, { label: activeQuiz.title }]} />
              
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-zinc-500 bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80 w-fit">
                <span>Created by: <strong className="text-indigo-600 dark:text-indigo-400">Ramsakal</strong></span>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <span>Powered by: <strong className="text-indigo-600 dark:text-indigo-400">Nova Intel Report</strong></span>
              </div>

              <AssessmentEngine
                quiz={activeQuiz}
                onQuizCompleted={handleQuizCompleted}
                onExit={() => handleNavigate('dashboard')}
              />
            </div>
          );
        })()}

        {/* 8. ADVANCED SEARCH PAGE */}
        {activeView === 'search' && (
          <div className="space-y-8 animate-fade-in">
            <Breadcrumbs items={[{ label: 'Search Results' }]} />

            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">Advanced Search Matrix</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Showing results matching keyword: <strong className="text-indigo-600">"{searchQuery}"</strong></p>
            </div>

            {/* Match algorithm filtering */}
            {(() => {
              const query = searchQuery.toLowerCase();
              const matchedCourses = Object.entries(SUBCATEGORIES).filter(([slug, sub]) => {
                return slug.includes(query) || sub.name.toLowerCase().includes(query) || sub.description.toLowerCase().includes(query);
              });
              
              const matchedArticles = FEATURED_ARTICLES.filter(art => {
                return art.title.toLowerCase().includes(query) || art.summary.toLowerCase().includes(query) || art.tags.some(t => t.toLowerCase().includes(query));
              });

              const totalCount = matchedCourses.length + matchedArticles.length;

              return (
                <div className="space-y-6">
                  {totalCount === 0 ? (
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 p-12 rounded-3xl text-center space-y-3">
                      <Compass className="w-12 h-12 text-zinc-300 mx-auto" />
                      <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">No results found for "{searchQuery}"</h3>
                      <p className="text-xs text-zinc-400 max-w-sm mx-auto">Try typing standard keywords like "computer", "python", "safety", "gate", or "resume" to locate directories.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Matched Courses column */}
                      <div className="lg:col-span-6 space-y-4">
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2">Matched Syllabus ({matchedCourses.length})</h3>
                        <div className="space-y-3">
                          {matchedCourses.map(([slug, sub]) => (
                            <button
                              key={slug}
                              onClick={() => handleNavigate('course', slug)}
                              className="w-full text-left bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-4 rounded-xl shadow-sm hover:border-indigo-500 transition-all cursor-pointer flex justify-between items-center"
                            >
                              <div>
                                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50">{sub.name}</h4>
                                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">{sub.description}</p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-zinc-400" />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Matched Articles column */}
                      <div className="lg:col-span-6 space-y-4">
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2">Matched Articles ({matchedArticles.length})</h3>
                        <div className="space-y-3">
                          {matchedArticles.map((art) => (
                            <button
                              key={art.id}
                              onClick={() => handleNavigate('article', art.id)}
                              className="w-full text-left bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-4 rounded-xl shadow-sm hover:border-indigo-500 transition-all cursor-pointer flex justify-between items-center"
                            >
                              <div>
                                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50">{art.title}</h4>
                                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">{art.summary}</p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-zinc-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* 9. ABOUT ACADEMY SCREEN */}
        {activeView === 'about' && (
          <div className="space-y-8 animate-fade-in max-w-3xl mx-auto text-zinc-700 dark:text-zinc-300">
            <Breadcrumbs items={[{ label: 'About Us' }]} />
            
            <div className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-black text-zinc-950 dark:text-zinc-50 uppercase tracking-tight">Academic Excellence via Design</h1>
              <p className="text-xs md:text-sm leading-relaxed leading-6 font-normal">
                Nova Intel Report is engineered as an interconnected, fast-loading, offline-capable syllabus encylopedia designed for university students, programmers, and technology researchers. 
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 p-6 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">Our Scientific Principles</h3>
              <ul className="list-disc list-inside space-y-2 text-xs font-normal">
                <li><strong>Theoretical Depth</strong>: Our guides bridge basic sciences with contemporary industrial engineering mechanics.</li>
                <li><strong>Interactive Integration</strong>: High fidelity unit converters and code preview screens ensure practical experimentation.</li>
                <li><strong>Accessibility Commitment</strong>: Design guidelines matching strict WCAG standards ensure everyone has access to top tier technical curriculums.</li>
              </ul>
            </div>
          </div>
        )}

        {/* 10. CONTACT ACADEMIC SUPPORT */}
        {activeView === 'contact' && (
          <div className="space-y-8 animate-fade-in max-w-xl mx-auto">
            <Breadcrumbs items={[{ label: 'Contact Support' }]} />

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
              <div className="space-y-1 text-center">
                <h2 className="text-xl font-black text-zinc-950 dark:text-zinc-50 uppercase">Connect with Academic Support</h2>
                <p className="text-xs text-zinc-500">Ask questions, submit research, or report discrepancies.</p>
              </div>

              {contactSubmitted ? (
                <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-5 rounded-2xl text-center border border-indigo-100/40 text-xs space-y-2">
                  <CheckCircle className="w-10 h-16 text-indigo-600 dark:text-indigo-400 mx-auto" />
                  <h4 className="font-bold text-indigo-950 dark:text-indigo-300">Message Transmitted!</h4>
                  <p className="text-zinc-500 leading-relaxed font-normal">Thank you {contactName}. Our engineering support council will respond within 24 working hours.</p>
                  <button onClick={() => setContactSubmitted(false)} className="text-indigo-600 hover:underline font-bold mt-2">Submit another inquiry</button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                  }}
                  className="space-y-4 text-xs"
                >
                  <div>
                    <label className="block text-zinc-500 font-bold uppercase mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-500 font-bold uppercase mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-500 font-bold uppercase mb-1">Academic Discipline</label>
                    <select className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none">
                      <option>Computer Science & Engineering</option>
                      <option>Mechanical Engineering</option>
                      <option>Electrical / Electronics</option>
                      <option>Other / General Interest</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-500 font-bold uppercase mb-1">Your Message</label>
                    <textarea
                      rows={4}
                      required
                      className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-md cursor-pointer"
                  >
                    Transmit Information Securely
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* 11. LEGAL TERMS AND CONSTITUTION */}
        {activeView === 'terms' && (
          <div className="space-y-6 animate-fade-in max-w-3xl mx-auto text-zinc-700 dark:text-zinc-300 text-xs">
            <Breadcrumbs items={[{ label: 'Terms & Conditions' }]} />
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 p-6 md:p-8 rounded-3xl space-y-4">
              <h1 className="text-xl font-black text-zinc-950 dark:text-zinc-50 uppercase">Academic Terms & Agreements</h1>
              <p className="font-bold">Last Updated: July 17, 2026</p>
              <p className="leading-relaxed leading-5">
                By entering the Nova Intel Report platform, you explicitly agree to consume theoretical syllabus data under standard academic fair-use guidelines. Commercial syndication or web-scraping of this index is strictly prohibited under intellectual charters.
              </p>
            </div>
          </div>
        )}

        {/* 12. PRIVACY CHARTER */}
        {activeView === 'privacy' && (
          <div className="space-y-6 animate-fade-in max-w-3xl mx-auto text-zinc-700 dark:text-zinc-300 text-xs">
            <Breadcrumbs items={[{ label: 'Privacy Charter' }]} />
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 p-6 md:p-8 rounded-3xl space-y-4">
              <h1 className="text-xl font-black text-zinc-950 dark:text-zinc-50 uppercase">Privacy Policy</h1>
              <p className="font-bold">Last Updated: July 17, 2026</p>
              <p className="leading-relaxed leading-5">
                Nova Intel Report values your scholastic integrity. We only track study streaks, mock quiz outcomes, and bookmarked courses locally inside your browser's private local state. No personal files or details are ever transmitted to tracking servers.
              </p>
            </div>
          </div>
        )}

        {/* 13. FAQ HELPDESK ACCORDION */}
        {activeView === 'faq' && (
          <div className="space-y-8 animate-fade-in max-w-3xl mx-auto text-xs">
            <Breadcrumbs items={[{ label: 'FAQ' }]} />
            <div className="space-y-4">
              <h1 className="text-xl md:text-2xl font-black text-zinc-950 dark:text-zinc-50 uppercase">FAQ Helpdesk</h1>
              <p className="text-zinc-500">Quick answers regarding syllabus models, assessments, and builders.</p>
            </div>

            <div className="space-y-3">
              {[
                { q: 'Is the curriculum aligned with GATE/JEE guidelines?', a: 'Yes. Our academic panel reviews standard board examinations annually to align syllabus nodes with highly tested, high weightage units.' },
                { q: 'Where are my bookmarks and quiz scores stored?', a: 'All academic progress, streak tracking metrics, completed exams, and custom CVs are saved locally in your browser\'s local storage cache. They remain preserved unless your cache is explicitly wiped.' },
                { q: 'Can I print or export my completed resumes?', a: 'Yes! Our custom-styled Resume Builder features print-to-PDF formatting support. Clicking "Print CV" opens standard single-page printed layouts instantly.' }
              ].map((faqItem, i) => (
                <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200/50 p-4 rounded-xl shadow-sm space-y-2">
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-start">
                    <span className="text-indigo-600 mr-2">Q:</span>
                    <span>{faqItem.q}</span>
                  </h4>
                  <p className="text-zinc-600 dark:text-zinc-300 pl-6 leading-relaxed">
                    {faqItem.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 14. ADMIN & CO-ADMIN MONITORING PORTAL */}
        {activeView === 'admin' && (
          <AdminPortal
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onOpenAdminAuthModal={() => setIsAdminAuthModalOpen(true)}
            onUpdateSuperAdminProfile={handleUpdateSuperAdminProfile}
          />
        )}

        {/* 15. 11 AI FEATURES STUDIO (VEO 3, LYRIA, LIVE VOICE, SCIENCE, SEARCH, MAPS...) */}
        {activeView === 'aistudio' && (
          <AIStudioSuite onNavigate={handleNavigate} />
        )}

      </main>

      <NovaAI
        language={language}
        currentContext={activeSubcategory}
        onNavigate={handleNavigate}
        onLoadDynamicQuiz={handleLoadDynamicQuiz}
      />

      <Footer onNavigate={handleNavigate} />

      {/* Progressive Web App (PWA) Mobile App Experience & Installation Modal */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Offline Connectivity Status Badge */}
      <OfflineIndicator />

      {/* Smartphone Bottom Native-style Navigation Bar */}
      <MobileBottomNav
        activeView={activeView}
        onNavigate={handleNavigate}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        isSuperAdmin={currentUser?.role === 'super_admin'}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          localStorage.setItem('nova-auth-user', JSON.stringify(user));
          setUserProfile(prev => ({
            ...prev,
            name: user.name,
            email: user.email,
            role: user.role === 'super_admin' ? 'Super Admin' : user.role === 'co_admin' ? 'Co-Admin' : 'Student',
            institution: user.institution || prev.institution
          }));
        }}
      />

      {/* Dedicated Super Admin & Co-Admin Terminal & Password Reset Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          localStorage.setItem('nova-auth-user', JSON.stringify(user));
          setUserProfile(prev => ({
            ...prev,
            name: user.name,
            email: user.email,
            role: user.role === 'super_admin' ? 'Super Admin' : user.role === 'co_admin' ? 'Co-Admin' : 'Student',
            institution: user.institution || prev.institution
          }));
        }}
      />
    </div>
  );
}
