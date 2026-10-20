export interface Course {
  id: string;
  title: string;
  category: 'engineering' | 'programming' | 'exams' | 'science' | 'tools' | 'other';
  subcategory: string;
  description: string;
  icon: string;
  roadmap: string[];
  syllabus: { title: string; topics: string[] }[];
  interviewQuestions: { question: string; answer: string }[];
  projects: { title: string; difficulty: 'Beginner' | 'Intermediate' | 'Advanced'; description: string; tech: string[] }[];
  notes: string;
  recommendedBooks: { title: string; author: string; rating: number; type: 'Free' | 'Paid' }[];
  resources: { name: string; url: string; type: 'Video' | 'PDF' | 'Documentation' }[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  rating: number;
  students: number;
  author: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions: QuizQuestion[];
  timeLimitSeconds: number;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  readTime: string;
  views: number;
  imageUrl: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  institution: string;
  streak: number;
  xp: number;
  completedQuizzes: { quizId: string; score: number; date: string }[];
  savedResumes: any[];
}

export interface ResumeData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  website: string;
  summary: string;
  education: { institution: string; degree: string; field: string; startYear: string; endYear: string; grade: string }[];
  experience: { company: string; position: string; location: string; startMonthYear: string; endMonthYear: string; description: string }[];
  skills: string[];
  projects: { name: string; description: string; url: string; tech: string }[];
  certifications: string[];
}

export interface Bookmark {
  id: string;
  type: 'course' | 'article' | 'quiz';
  title: string;
  timestamp: number;
}

export interface ReadingHistory {
  id: string;
  type: 'course' | 'article';
  title: string;
  progress: number; // 0 to 100
  timestamp: number;
}

export type UserRole = 'super_admin' | 'co_admin' | 'worker' | 'student';

export type AdminPermission =
  | 'manage_courses'
  | 'manage_quizzes'
  | 'manage_articles'
  | 'upload_materials'
  | 'review_students'
  | 'manage_tools'
  | 'view_analytics'
  | 'view_logs'
  | 'export_data'
  | 'moderate_discussions';

export interface AuthUser {
  id: string;
  customId?: string; // Assigned Admin/Worker ID (e.g. ADM-ROOT-7678, COADM-4912, WRK-1084)
  name: string;
  email: string;
  phone?: string;
  password?: string;
  authProvider?: 'email' | 'phone' | 'google' | 'facebook';
  avatar?: string;
  role: UserRole;
  status: 'active' | 'suspended';
  department?: string;
  institution?: string;
  permissions: AdminPermission[];
  assignedBy?: string;
  supervisorId?: string; // Reports to Chief Admin or Co-Admin
  createdAt: string;
  lastLoginAt?: string;
  loginCount: number;
  lastIp?: string;
  lastDevice?: string;
  isNameVisible?: boolean; // Super Admin privacy control: true = visible to everyone, false = stealth mode (hidden)
  publicTitle?: string; // Custom public alias / stealth title (e.g. 'Chief Administrator')
}

export type User = AuthUser;

export interface AdminApplication {
  id: string;
  name: string;
  email: string;
  phone?: string;
  desiredRole: 'co_admin' | 'worker';
  department: string;
  institution?: string;
  reason: string;
  qualifications: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  generatedId?: string;
  generatedPassword?: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  category: string;
  type: 'pdf' | 'notes' | 'video' | 'link' | 'PDF' | 'Notes' | 'Cheatsheet' | 'Paper';
  fileUrl?: string;
  externalUrl?: string;
  downloadUrl?: string;
  fileSize?: string;
  description: string;
  author: string;
  downloads?: number;
  createdAt: string;
}

export interface AuthLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  action: 'sign_in' | 'sign_up' | 'sign_out' | 'co_admin_created' | 'worker_created' | 'application_approved' | 'application_rejected' | 'role_promoted' | 'role_demoted' | 'status_changed' | 'permissions_updated' | 'session_revoked' | 'profile_updated' | 'identity_visibility_changed';
  timestamp: number;
  dateFormatted: string;
  device: string;
  browser: string;
  ip: string;
  status: 'success' | 'warning' | 'alert';
  details?: string;
}
