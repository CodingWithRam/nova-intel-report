import React, { useState, useEffect } from 'react';
import {
  Shield, Users, Activity, UserPlus, Key, Lock, Eye, EyeOff, RefreshCw,
  Search, Filter, CheckCircle2, AlertTriangle, XCircle, ShieldAlert,
  Download, ArrowUpRight, Check, X, ChevronRight, LogOut, Clock,
  Smartphone, Monitor, Laptop, Globe, UserCheck, UserX, Settings,
  Sparkles, FileText, Award, Layers, Terminal, Edit3, Save, Crown,
  Sliders, ToggleLeft, ToggleRight, Fingerprint, ShieldCheck, Database, Zap,
  Copy, Share2, Briefcase
} from 'lucide-react';
import ContentDatabaseCMS from './ContentDatabaseCMS';
import OrgHierarchyTree from './OrgHierarchyTree';
import AdminApprovalsQueue from './AdminApprovalsQueue';
import { AuthUser, AuthLog, AdminPermission, UserRole, AdminApplication } from '../types';

interface AdminPortalProps {
  currentUser: AuthUser | null;
  onNavigate: (view: string, sub?: string) => void;
  onOpenAuthModal: () => void;
  onOpenAdminAuthModal?: () => void;
  onUpdateSuperAdminProfile?: (user: AuthUser) => void;
}

const ALL_AVAILABLE_PERMISSIONS: { id: AdminPermission; label: string; description: string; icon: string }[] = [
  { id: 'manage_courses', label: 'Course & Curriculum Authoring', description: 'Create and modify course syllabi and roadmaps', icon: '📚' },
  { id: 'manage_quizzes', label: 'Quiz & Assessment Engine', description: 'Create, edit and grade academic quizzes', icon: '📝' },
  { id: 'manage_articles', label: 'Article & Research Publishing', description: 'Publish and format technical articles', icon: '📰' },
  { id: 'upload_materials', label: 'Study Materials & PDF Uploader', description: 'Upload notes, PDFs, and guides', icon: '📂' },
  { id: 'review_students', label: 'Student Reviews & QA', description: 'Review student performance and quiz submissions', icon: '🎓' },
  { id: 'manage_tools', label: 'Interactive Tools & Code Runners', description: 'Configure interactive playgrounds and simulators', icon: '💻' },
  { id: 'view_analytics', label: 'Academic & Usage Analytics', description: 'Inspect study trends and platform statistics', icon: '📊' },
  { id: 'view_logs', label: 'Live Login & Audit Monitoring', description: 'Monitor user sign-in and sign-up activities', icon: '👁️' },
  { id: 'export_data', label: 'Data & Report Export', description: 'Export student lists and activity logs to CSV', icon: '💾' },
  { id: 'moderate_discussions', label: 'Community & Doubt Moderation', description: 'Moderate discussion threads and student comments', icon: '💬' }
];

export default function AdminPortal({ currentUser, onNavigate, onOpenAuthModal, onOpenAdminAuthModal, onUpdateSuperAdminProfile }: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<'tree' | 'approvals' | 'contentdb' | 'coadmins' | 'monitor' | 'students' | 'security' | 'identity'>('tree');
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [logs, setLogs] = useState<AuthLog[]>([]);
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [pendingApplicationsCount, setPendingApplicationsCount] = useState<number>(0);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Monitor Filter states
  const [logFilterAction, setLogFilterAction] = useState<string>('all');
  const [logFilterRole, setLogFilterRole] = useState<string>('all');
  const [logSearchQuery, setLogSearchQuery] = useState<string>('');

  // Super Admin Identity & Privacy Management states
  const [editSuperAdminName, setEditSuperAdminName] = useState<string>(currentUser?.name || 'RAM SAKAL');
  const [isNameVisible, setIsNameVisible] = useState<boolean>(currentUser?.isNameVisible !== false);
  const [superAdminPublicTitle, setSuperAdminPublicTitle] = useState<string>(currentUser?.publicTitle || 'Chief Administrator');
  const [superAdminDept, setSuperAdminDept] = useState<string>(currentUser?.department || 'Executive Administration & Systems');
  const [superAdminInstitution, setSuperAdminInstitution] = useState<string>(currentUser?.institution || 'Nova Intel HQ');
  const [isSavingIdentity, setIsSavingIdentity] = useState(false);
  const [showIdentityModal, setShowIdentityModal] = useState(false);

  // Sync state if currentUser changes
  useEffect(() => {
    if (currentUser) {
      setEditSuperAdminName(currentUser.name || 'RAM SAKAL');
      setIsNameVisible(currentUser.isNameVisible !== false);
      setSuperAdminPublicTitle(currentUser.publicTitle || 'Chief Administrator');
      if (currentUser.department) setSuperAdminDept(currentUser.department);
      if (currentUser.institution) setSuperAdminInstitution(currentUser.institution);
    }
  }, [currentUser]);

  // Create/Edit Co-Admin Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAdminRole, setNewAdminRole] = useState<'co_admin' | 'worker'>('co_admin');
  const [newAdminCustomId, setNewAdminCustomId] = useState('');
  const [newAdminSupervisorId, setNewAdminSupervisorId] = useState('usr-super-admin');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPhone, setNewAdminPhone] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminDept, setNewAdminDept] = useState('Curriculum & Engineering Faculty');
  const [newAdminInstitution, setNewAdminInstitution] = useState('Nova Intel Academy');
  const [createdCredentialsCard, setCreatedCredentialsCard] = useState<any | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<AdminPermission[]>([
    'manage_courses',
    'manage_quizzes',
    'manage_articles',
    'upload_materials'
  ]);
  const [isSubmittingAdmin, setIsSubmittingAdmin] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Fetch candidate applications
  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/admin/applications');
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
        setPendingApplicationsCount(data.pendingCount || 0);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  // Edit permissions modal
  const [editingUser, setEditingUser] = useState<AuthUser | null>(null);

  // Security Gatekeeper PIN & Password states
  const [securityPinInput, setSecurityPinInput] = useState('');
  const [securityPasswordInput, setSecurityPasswordInput] = useState('');
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  const isSuperAdmin = currentUser?.role === 'super_admin' || currentUser?.email === 'rammilan.kumar7678@gmail.com' || currentUser?.phone === '+91 7678829509' || currentUser?.phone === '7678829509';
  const isCoAdmin = currentUser?.role === 'co_admin';
  const isAuthorizedAdmin = isSuperAdmin || isCoAdmin;

  // Handler: Unlock with Master Security PIN & Required Password
  const handleUnlockWithPin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!securityPasswordInput.trim()) {
      setPinError('सुरक्षा नियम: सुपर चीफ एडमिन बिना पासवर्ड के प्रवेश नहीं कर सकते (Password is required)');
      return;
    }
    if (!securityPinInput.trim()) {
      setPinError('कृपया मास्टर सिक्योरिटी पिन दर्ज करें (Please enter Master PIN)');
      return;
    }
    setIsVerifyingPin(true);
    setPinError(null);
    try {
      const res = await fetch('/api/admin/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: securityPinInput.trim(),
          password: securityPasswordInput.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Access Denied: Invalid Security Key or Password');

      if (onUpdateSuperAdminProfile && data.user) {
        onUpdateSuperAdminProfile(data.user);
      }
      showNotification('Super Admin Master Clearance Verified! Welcome back.', 'success');
      setSecurityPinInput('');
      setSecurityPasswordInput('');
      fetchUsers();
      fetchLogs();
    } catch (err: any) {
      setPinError(err.message || 'Invalid PIN or Password. Authorized Super Admin only.');
    } finally {
      setIsVerifyingPin(false);
    }
  };

  // Sync profile from server
  const fetchSuperAdminProfile = async () => {
    try {
      const res = await fetch('/api/admin/super-admin/profile');
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          setEditSuperAdminName(data.profile.name || 'RAM SAKAL');
          setIsNameVisible(data.profile.isNameVisible !== false);
          setSuperAdminPublicTitle(data.profile.publicTitle || 'Chief Administrator');
          if (data.profile.department) setSuperAdminDept(data.profile.department);
          if (data.profile.institution) setSuperAdminInstitution(data.profile.institution);
        }
      }
    } catch (err) {
      console.error('Error syncing admin profile:', err);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Fetch audit logs
  const fetchLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const params = new URLSearchParams();
      if (logFilterAction !== 'all') params.append('action', logFilterAction);
      if (logFilterRole !== 'all') params.append('role', logFilterRole);
      if (logSearchQuery) params.append('query', logSearchQuery);

      const res = await fetch(`/api/admin/logs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchUsers();
    fetchLogs();
    fetchSuperAdminProfile();
    fetchApplications();
  }, [logFilterAction, logFilterRole]);

  // Auto-refresh timer for live monitoring
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchLogs();
      fetchUsers();
      fetchApplications();
    }, 6000);
    return () => clearInterval(interval);
  }, [autoRefresh, logFilterAction, logFilterRole, logSearchQuery]);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMessage({ text, type });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleOpenCreateWithRole = (defaultRole: 'co_admin' | 'worker' = 'co_admin', supervisorId?: string) => {
    setNewAdminRole(defaultRole);
    const randNum = Math.floor(1000 + Math.random() * 9000);
    setNewAdminCustomId(defaultRole === 'worker' ? `WRK-${randNum}` : `COADM-${randNum}`);
    setNewAdminPassword(`Nova@${Math.floor(1000 + Math.random() * 9000)}#`);
    if (supervisorId) setNewAdminSupervisorId(supervisorId);
    setShowCreateModal(true);
  };

  // Handler: Save Super Admin Name & Visibility settings
  const handleSaveSuperAdminIdentity = async (
    overrideName?: string,
    overrideVisibility?: boolean,
    overrideTitle?: string
  ) => {
    setIsSavingIdentity(true);
    try {
      const targetName = (overrideName !== undefined ? overrideName : editSuperAdminName).trim();
      const targetVisibility = overrideVisibility !== undefined ? overrideVisibility : isNameVisible;
      const targetTitle = (overrideTitle !== undefined ? overrideTitle : superAdminPublicTitle).trim();

      if (!targetName) {
        showNotification('Super Admin name cannot be empty', 'error');
        setIsSavingIdentity(false);
        return;
      }

      const res = await fetch('/api/admin/super-admin/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: targetName,
          isNameVisible: targetVisibility,
          publicTitle: targetTitle,
          department: superAdminDept.trim(),
          institution: superAdminInstitution.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update super admin profile');

      setEditSuperAdminName(targetName);
      setIsNameVisible(targetVisibility);
      setSuperAdminPublicTitle(targetTitle);

      showNotification(
        `Profile updated! Name: "${targetName}" • Public Visibility: ${targetVisibility ? 'ON (Visible to All)' : 'OFF (Hidden / Stealth Mode)'}`,
        'success'
      );

      if (onUpdateSuperAdminProfile && data.user) {
        onUpdateSuperAdminProfile(data.user);
      }
      fetchUsers();
      fetchLogs();
      setShowIdentityModal(false);
    } catch (err: any) {
      showNotification(err.message || 'Action failed', 'error');
    } finally {
      setIsSavingIdentity(false);
    }
  };

  // Quick toggle visibility (ON / OFF)
  const handleToggleVisibility = async () => {
    const nextVal = !isNameVisible;
    setIsNameVisible(nextVal);
    await handleSaveSuperAdminIdentity(editSuperAdminName, nextVal, superAdminPublicTitle);
  };

  // Handler: Create Co-Admin or Worker
  const handleCreateCoAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName.trim() || (!newAdminEmail.trim() && !newAdminPhone.trim())) {
      showNotification('Name and at least Email or Mobile are required', 'error');
      return;
    }

    setIsSubmittingAdmin(true);
    try {
      const res = await fetch('/api/admin/co-admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newAdminName.trim(),
          email: newAdminEmail.trim(),
          phone: newAdminPhone.trim() || undefined,
          password: newAdminPassword.trim() || undefined,
          role: newAdminRole,
          customId: newAdminCustomId.trim() || undefined,
          supervisorId: newAdminSupervisorId || undefined,
          department: newAdminDept.trim(),
          institution: newAdminInstitution.trim(),
          permissions: selectedPermissions,
          requesterEmail: currentUser?.email || 'RAM SAKAL (Super Admin)'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create administrative account');

      if (data.credentials) {
        setCreatedCredentialsCard(data.credentials);
      }
      showNotification(`${newAdminRole === 'worker' ? 'Worker' : 'Co-Admin'} "${newAdminName}" successfully appointed!`);
      setShowCreateModal(false);
      setNewAdminName('');
      setNewAdminEmail('');
      setNewAdminPhone('');
      setNewAdminPassword('');
      setNewAdminCustomId('');
      fetchUsers();
      fetchLogs();
    } catch (err: any) {
      showNotification(err.message || 'Action failed', 'error');
    } finally {
      setIsSubmittingAdmin(false);
    }
  };

  // Handler: Promote or Demote user
  const handleUpdateRole = async (userId: string, newRole: UserRole, userName: string) => {
    const confirmationMsg = newRole === 'co_admin'
      ? `Promote "${userName}" to Co-Admin under your supervision?`
      : `Demote "${userName}" to regular Student and revoke all admin privileges?`;

    if (!window.confirm(confirmationMsg)) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newRole,
          requesterEmail: currentUser?.email || 'RAM SAKAL (Super Admin)'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update role');

      showNotification(`User "${userName}" is now a ${newRole.toUpperCase()}`);
      fetchUsers();
      fetchLogs();
    } catch (err: any) {
      showNotification(err.message || 'Action failed', 'error');
    }
  };

  // Handler: Toggle Active / Suspended
  const handleToggleStatus = async (user: AuthUser) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    if (!window.confirm(`Are you sure you want to ${newStatus === 'suspended' ? 'SUSPEND' : 'REACTIVATE'} ${user.name}?`)) return;

    try {
      const res = await fetch(`/api/admin/users/${user.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status');

      showNotification(`${user.name} status set to ${newStatus.toUpperCase()}`);
      fetchUsers();
      fetchLogs();
    } catch (err: any) {
      showNotification(err.message || 'Action failed', 'error');
    }
  };

  // Handler: Force Revoke Session
  const handleRevokeSession = async (user: AuthUser) => {
    if (!window.confirm(`Terminate and revoke the active session for ${user.name}? They will be forced to log in again.`)) return;

    try {
      const res = await fetch('/api/admin/revoke-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to revoke session');

      showNotification(`Session terminated for ${user.name}`);
      fetchLogs();
    } catch (err: any) {
      showNotification(err.message || 'Action failed', 'error');
    }
  };

  // Handler: Save permissions update
  const handleSavePermissions = async () => {
    if (!editingUser) return;
    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}/permissions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions: editingUser.permissions })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update permissions');

      showNotification(`Permissions updated for ${editingUser.name}`);
      setEditingUser(null);
      fetchUsers();
      fetchLogs();
    } catch (err: any) {
      showNotification(err.message || 'Failed to update permissions', 'error');
    }
  };

  // Export audit logs to CSV
  const handleExportCsv = () => {
    if (!logs.length) {
      showNotification('No logs available to export', 'error');
      return;
    }
    const headers = ['Log ID', 'User Name', 'Email', 'Role', 'Action', 'Date & Time', 'Device', 'Browser', 'IP Address', 'Status', 'Details'];
    const rows = logs.map(l => [
      l.id,
      `"${l.userName}"`,
      l.userEmail,
      l.userRole,
      l.action,
      `"${l.dateFormatted}"`,
      `"${l.device}"`,
      `"${l.browser}"`,
      l.ip,
      l.status,
      `"${l.details?.replace(/"/g, '""') || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Nova_Auth_Audit_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Audit log CSV exported successfully!');
  };

  // Computed counts
  const totalCoAdmins = users.filter(u => u.role === 'co_admin').length;
  const totalStudents = users.filter(u => u.role === 'student').length;
  const signInsToday = logs.filter(l => l.action === 'sign_in').length;
  const signUpsToday = logs.filter(l => l.action === 'sign_up').length;

  // 0. Super Admin Security Gatekeeper Access Control
  if (!currentUser || !isAuthorizedAdmin) {
    return (
      <div className="min-h-[85vh] py-16 px-4 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex items-center justify-center animate-in fade-in duration-300">
        <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 via-red-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-red-500/20">
              <ShieldAlert className="w-8 h-8" />
            </div>
            
            <div className="space-y-1.5">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800">
                RESTRICTED ACCESS • CLEARANCE LEVEL 0
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-white pt-1">
                Super Admin Security Gatekeeper
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                सुपर एडमिन पोर्टल केवल अधिकृत मुख्य सुपर एडमिन (<strong>RAM SAKAL</strong>) और उनके द्वारा नियुक्त को-एडमिन के लिए सुरक्षित है।
              </p>
            </div>
          </div>

          {currentUser ? (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs space-y-1.5">
              <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Current Account: {currentUser.name} ({currentUser.role.toUpperCase()})</span>
              </div>
              <p className="text-amber-700 dark:text-amber-400 text-[11px] leading-relaxed">
                You are currently logged in as a <strong>Student</strong>. Regular learners are not permitted to access or modify Super Admin controls, audit logs, or co-admin rosters.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs space-y-1 text-zinc-600 dark:text-zinc-300">
              <span className="font-bold text-zinc-900 dark:text-white">Authentication Status: Unauthenticated</span>
              <p className="text-[11px] text-zinc-500">Please sign in with your Super Admin credentials (RAM SAKAL) or enter your Master Security PIN below to unlock clearance.</p>
            </div>
          )}

          {/* Dedicated Super Admin Login / Reset Button */}
          {onOpenAdminAuthModal && (
            <button
              type="button"
              onClick={onOpenAdminAuthModal}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black rounded-2xl text-xs font-black shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <Key className="w-4 h-4" />
              <span>Dedicated Super Admin Login &amp; OTP Reset (सुपर एडमिन लॉगिन पोर्टल)</span>
            </button>
          )}

          {/* Master PIN & Password Unlock Section */}
          <form onSubmit={handleUnlockWithPin} className="space-y-3 p-4 rounded-2xl border border-indigo-500/30 bg-indigo-500/5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>
                <strong>सुरक्षा नीति:</strong> सुपर चीफ एडमिन बिना पासवर्ड के प्रवेश नहीं कर सकते। पिन और पासवर्ड दोनों दर्ज करें।
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-indigo-950 dark:text-indigo-200 flex items-center space-x-1.5 mb-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Super Admin Password (सुपर एडमिन पासवर्ड) *</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={securityPasswordInput}
                  onChange={(e) => setSecurityPasswordInput(e.target.value)}
                  placeholder="सुपर एडमिन पासवर्ड दर्ज करें"
                  className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-indigo-300 dark:border-indigo-700 rounded-xl text-center text-sm text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-indigo-950 dark:text-indigo-200 flex items-center space-x-1.5 mb-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-600" />
                <span>Master Security PIN (मास्टर सुरक्षा पिन) *</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  maxLength={8}
                  value={securityPinInput}
                  onChange={(e) => setSecurityPinInput(e.target.value)}
                  placeholder="मास्टर पिन (उदा. 7678)"
                  className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-indigo-300 dark:border-indigo-700 rounded-xl text-center font-mono tracking-widest text-base text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {pinError && (
              <p className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center space-x-1">
                <XCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{pinError}</span>
              </p>
            )}

            <button
              type="submit"
              disabled={isVerifyingPin || !securityPinInput.trim() || !securityPasswordInput.trim()}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isVerifyingPin ? 'Verifying Clearance...' : 'Verify Password + PIN & Unlock Super Admin'}</span>
            </button>
          </form>

          {/* Alternative Actions */}
          <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <Smartphone className="w-4 h-4" />
              <span>Sign In with Mobile / Email / OTP</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="w-full py-2 px-4 text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors text-center cursor-pointer"
            >
              &larr; Return to Academic Courses & Home
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 animate-in fade-in duration-200">
      
      {/* Top Banner & Control Deck */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Super Admin Title & Identity */}
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl md:text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                    Master Admin Control & Monitoring
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700">
                    {isSuperAdmin ? '👑 SUPER ADMIN (CHIEF)' : isCoAdmin ? '🛡️ CO-ADMIN' : 'STUDENT VIEW'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Super Admin: <strong className="text-indigo-600 dark:text-indigo-400">{currentUser?.name || 'RAM SAKAL'}</strong> ({currentUser?.email || 'rammilan.kumar7678@gmail.com'})
                  </p>
                  {isSuperAdmin && (
                    <button
                      onClick={handleToggleVisibility}
                      className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                        isNameVisible
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                      }`}
                      title="Click to toggle: Show name to public or hide in stealth mode"
                    >
                      {isNameVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{isNameVisible ? 'Name: Visible to Public (Click to Hide)' : 'Stealth Mode Active (Click to Show)'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions Header */}
            <div className="flex items-center space-x-2">
              {isSuperAdmin && (
                <>
                  <button
                    onClick={() => setActiveTab('identity')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center space-x-1.5 transition-all cursor-pointer ${
                      activeTab === 'identity'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
                        : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-750'
                    }`}
                    title="Change Name & Visibility settings"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>Change Name / Privacy</span>
                  </button>

                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>+ Appoint Co-Admin</span>
                  </button>
                </>
              )}

              <button
                onClick={() => { fetchUsers(); fetchLogs(); }}
                disabled={isLoadingLogs}
                className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                title="Refresh Live Data"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingLogs ? 'animate-spin text-indigo-500' : ''}`} />
              </button>

              {!currentUser && (
                <button
                  onClick={onOpenAuthModal}
                  className="px-3 py-1.5 rounded-xl border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              )}
            </div>

          </div>

          {/* Tab Navigation */}
          <div className="flex items-center space-x-1.5 mt-4 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('tree')}
              className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'tree'
                  ? 'bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30 font-black'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-indigo-500/30'
              }`}
            >
              <span>🌳</span>
              <span>Org Hierarchy Tree (पदानुक्रम)</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-indigo-500/20 text-indigo-300 uppercase">
                ROOT
              </span>
            </button>

            <button
              onClick={() => setActiveTab('approvals')}
              className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'approvals'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30 font-black'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-amber-500/30'
              }`}
            >
              <span>📋</span>
              <span>Pending Approvals (अनुमोदन कतार)</span>
              {pendingApplicationsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white animate-pulse">
                  {pendingApplicationsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('contentdb')}
              className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'contentdb'
                  ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-md shadow-amber-500/30 font-black'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-amber-500/30'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>Content Database (1-Click Add)</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500/20 text-amber-300 uppercase">
                CMS
              </span>
            </button>

            <button
              onClick={() => setActiveTab('coadmins')}
              className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'coadmins'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Co-Admins & Workers ({users.filter(u => u.role === 'co_admin' || u.role === 'worker').length})</span>
            </button>

            <button
              onClick={() => setActiveTab('monitor')}
              className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'monitor'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Live Monitor</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'students'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Students Directory ({totalStudents})</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Security & RBAC Matrix</span>
            </button>

            {isSuperAdmin && (
              <button
                onClick={() => setActiveTab('identity')}
                className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center space-x-2 transition-all cursor-pointer ${
                  activeTab === 'identity'
                    ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Identity & Privacy (नाम व गोपनीयता)</span>
                <span className={`px-1.5 py-0.5 text-[9px] rounded font-black uppercase ${
                  isNameVisible ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {isNameVisible ? 'Public' : 'Stealth'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">

        {/* Global Feedback notification */}
        {feedbackMessage && (
          <div className={`p-4 rounded-2xl border text-xs md:text-sm font-semibold flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-150 ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
              : 'bg-red-500/15 border-red-500/40 text-red-400'
          }`}>
            <div className="flex items-center space-x-2">
              {feedbackMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              <span>{feedbackMessage.text}</span>
            </div>
            <button onClick={() => setFeedbackMessage(null)} className="p-1 hover:opacity-75">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Real-Time KPI Stats Deck */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Users</span>
              <Users className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-black text-zinc-900 dark:text-white">{users.length}</span>
              <span className="text-[11px] text-zinc-500">Across Portal</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Co-Admins</span>
              <Shield className="w-4 h-4 text-pink-500" />
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-black text-pink-500">{totalCoAdmins}</span>
              <span className="text-[11px] text-zinc-500">Supervised by RAM SAKAL</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Sign-Ins Tracked</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-black text-emerald-500">{signInsToday}</span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Active sessions logged</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">New Sign-Ups</span>
              <UserCheck className="w-4 h-4 text-violet-500" />
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-black text-violet-500">{signUpsToday}</span>
              <span className="text-[11px] text-zinc-500">Registered</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: LIVE SIGN-IN & SIGN-UP MONITOR                     */}
        {/* ========================================================= */}
        {activeTab === 'monitor' && (
          <div className="space-y-4">
            {/* Controls & Filter Bar */}
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative min-w-[200px] flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
                  <input
                    type="text"
                    value={logSearchQuery}
                    onChange={(e) => setLogSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchLogs()}
                    placeholder="Search user name, email, IP..."
                    className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Role filter */}
                <select
                  value={logFilterRole}
                  onChange={(e) => setLogFilterRole(e.target.value)}
                  className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-700 dark:text-zinc-300 outline-none"
                >
                  <option value="all">All Roles (सब रोल)</option>
                  <option value="super_admin">Super Admin Only</option>
                  <option value="co_admin">Co-Admins Only (को-एडमिन)</option>
                  <option value="student">Students Only (विद्यार्थी)</option>
                </select>

                {/* Action filter */}
                <select
                  value={logFilterAction}
                  onChange={(e) => setLogFilterAction(e.target.value)}
                  className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-700 dark:text-zinc-300 outline-none"
                >
                  <option value="all">All Events (सभी घटनाएं)</option>
                  <option value="sign_in">Sign In Events (लॉगिन)</option>
                  <option value="sign_up">Sign Up Events (रजिस्ट्रेशन)</option>
                  <option value="co_admin_created">Co-Admin Created</option>
                  <option value="session_revoked">Session Revoked</option>
                </select>

                {/* Specific Co-Admin Monitoring Selector */}
                {users.filter(u => u.role === 'co_admin').length > 0 && (
                  <select
                    value={logFilterRole === 'co_admin' ? logSearchQuery : ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val) {
                        setLogFilterRole('co_admin');
                        setLogSearchQuery(val);
                      } else {
                        setLogFilterRole('all');
                        setLogSearchQuery('');
                      }
                    }}
                    className="px-3 py-1.5 bg-pink-50 dark:bg-pink-950/40 border border-pink-300 dark:border-pink-800 text-pink-700 dark:text-pink-300 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="">👁️ Filter by Co-Admin (को-एडमिन मॉनिटरिंग)</option>
                    {users.filter(u => u.role === 'co_admin').map(admin => (
                      <option key={admin.id} value={admin.email || admin.name}>
                        🛡️ {admin.name} ({admin.email || admin.phone})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Right tools */}
              <div className="flex items-center space-x-2">
                <label className="flex items-center space-x-1.5 text-xs text-zinc-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-0 cursor-pointer"
                  />
                  <span>Live Stream (5s)</span>
                </label>

                <button
                  onClick={handleExportCsv}
                  className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Live Feed Table */}
            <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
              <div className="px-5 py-3.5 bg-zinc-50 dark:bg-zinc-850/50 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-xs md:text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wider">
                    Live Surveillance Feed • {logs.length} Total Events Monitored
                  </h3>
                </div>
                <span className="text-[11px] text-zinc-400">
                  Real-time IP & Device Fingerprinting
                </span>
              </div>

              {logs.length === 0 ? (
                <div className="p-10 text-center text-zinc-400 space-y-2">
                  <ShieldAlert className="w-8 h-8 mx-auto text-zinc-500" />
                  <p className="text-xs">No audit logs matching current filter parameters.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 font-bold border-b border-zinc-200 dark:border-zinc-800">
                      <tr>
                        <th className="p-3.5">Timestamp (IST)</th>
                        <th className="p-3.5">User Identity</th>
                        <th className="p-3.5">Assigned Role</th>
                        <th className="p-3.5">Authentication Action</th>
                        <th className="p-3.5">Device / Browser</th>
                        <th className="p-3.5">IP Location</th>
                        <th className="p-3.5">Status & Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-medium">
                      {logs.map((log) => {
                        const isCoadmin = log.userRole === 'co_admin';
                        const isSuper = log.userRole === 'super_admin';

                        return (
                          <tr
                            key={log.id}
                            className={`hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors ${
                              isSuper ? 'bg-indigo-500/5' : isCoadmin ? 'bg-pink-500/5' : ''
                            }`}
                          >
                            <td className="p-3.5 whitespace-nowrap text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">
                              {log.dateFormatted}
                            </td>

                            <td className="p-3.5 whitespace-nowrap">
                              <div className="font-bold text-zinc-900 dark:text-white">
                                {log.userName}
                              </div>
                              <div className="text-[11px] text-zinc-400">
                                {log.userEmail}
                              </div>
                            </td>

                            <td className="p-3.5 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase ${
                                isSuper
                                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-500/30'
                                  : isCoadmin
                                  ? 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300 border border-pink-500/30'
                                  : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                              }`}>
                                {log.userRole.replace('_', ' ')}
                              </span>
                            </td>

                            <td className="p-3.5 whitespace-nowrap">
                              <span className={`inline-flex items-center space-x-1 font-bold ${
                                log.action === 'sign_in'
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : log.action === 'sign_up'
                                  ? 'text-indigo-600 dark:text-indigo-400'
                                  : log.action === 'co_admin_created'
                                  ? 'text-pink-600 dark:text-pink-400'
                                  : 'text-yellow-600 dark:text-yellow-400'
                              }`}>
                                <span>
                                  {log.action === 'sign_in' ? '🟢 Sign In (लॉगिन)' :
                                   log.action === 'sign_up' ? '✨ Sign Up (रजिस्ट्रेशन)' :
                                   log.action === 'co_admin_created' ? '👑 Co-Admin Appointed' :
                                   log.action.replace('_', ' ').toUpperCase()}
                                </span>
                              </span>
                              {log.details && (
                                <div className="text-[10px] text-zinc-400 truncate max-w-xs mt-0.5">
                                  {log.details}
                                </div>
                              )}
                            </td>

                            <td className="p-3.5 whitespace-nowrap text-zinc-600 dark:text-zinc-300">
                              <div className="flex items-center space-x-1.5">
                                {log.device.includes('Android') || log.device.includes('iOS') || log.device.includes('iPhone') ? (
                                  <Smartphone className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                                ) : (
                                  <Monitor className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                )}
                                <span>{log.device}</span>
                              </div>
                              <div className="text-[10px] text-zinc-400">{log.browser}</div>
                            </td>

                            <td className="p-3.5 whitespace-nowrap font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                              {log.ip}
                            </td>

                            <td className="p-3.5 whitespace-nowrap">
                              <span className="inline-flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Verified Session</span>
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: CO-ADMIN DELEGATION & MANAGEMENT                   */}
        {/* ========================================================= */}
        {activeTab === 'coadmins' && (
          <div className="space-y-6">
            
            {/* Delegation Overview Header */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900/30 via-violet-900/20 to-pink-900/20 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base md:text-lg font-black text-zinc-900 dark:text-white flex items-center space-x-2">
                  <span>Co-Admin Hierarchical Delegation System</span>
                  <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">Chief Control</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                  As the Super Admin, you can delegate specific responsibilities to your chosen Co-Admins. Co-Admins cannot delete other administrators or alter the master account. You retain 100% monitoring oversight on their sign-ins and activities.
                </p>
              </div>

              {isSuperAdmin && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center space-x-2 shrink-0 transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Appoint New Co-Admin</span>
                </button>
              )}
            </div>

            {/* Co-Admins Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users.filter(u => u.role === 'co_admin').map((admin) => (
                <div
                  key={admin.id}
                  className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4 hover:border-pink-500/40 transition-colors"
                >
                  {/* Co-Admin Card Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 to-violet-600 text-white flex items-center justify-center font-black text-sm uppercase shadow-md">
                        {admin.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                            {admin.name}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            admin.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {admin.status}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-400">{admin.email}</div>
                        <div className="text-[10px] text-indigo-400 font-medium mt-0.5">
                          {admin.department} • {admin.institution}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-pink-500 bg-pink-500/10 px-2 py-0.5 rounded-md border border-pink-500/20 uppercase">
                      CO-ADMIN
                    </span>
                  </div>

                  {/* Supervision Info */}
                  <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Supervised By:</span>
                      <strong className="text-zinc-800 dark:text-zinc-200">{admin.assignedBy || 'RAM SAKAL (Super Admin)'}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Last Signed In:</span>
                      <span className="font-mono text-indigo-400">
                        {admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleString('en-IN') : 'Never'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Total Logins Tracked:</span>
                      <span className="font-bold text-zinc-900 dark:text-white">{admin.loginCount || 0} times</span>
                    </div>
                  </div>

                  {/* Delegated Permissions */}
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Delegated Privileges ({admin.permissions?.length || 0}):
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {admin.permissions && admin.permissions.length > 0 ? (
                        admin.permissions.map(perm => {
                          const permMeta = ALL_AVAILABLE_PERMISSIONS.find(p => p.id === perm);
                          return (
                            <span
                              key={perm}
                              className="px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[10px] font-semibold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 flex items-center space-x-1"
                            >
                              <span>{permMeta?.icon || '🔹'}</span>
                              <span>{permMeta?.label || perm}</span>
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-[10px] text-zinc-500 italic">No specific permissions assigned</span>
                      )}
                    </div>
                  </div>

                  {/* Super Admin Action Controls */}
                  {isSuperAdmin && (
                    <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingUser(admin)}
                          className="px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-indigo-600 dark:text-indigo-400 font-bold transition-colors cursor-pointer"
                        >
                          ⚙️ Edit Permissions
                        </button>
                        <button
                          onClick={() => {
                            setLogFilterRole('co_admin');
                            setLogSearchQuery(admin.email || admin.name);
                            setActiveTab('monitor');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-pink-50 dark:bg-pink-950/40 hover:bg-pink-100 dark:hover:bg-pink-900/50 text-pink-600 dark:text-pink-400 font-bold transition-colors cursor-pointer flex items-center space-x-1"
                          title="Monitor activity logs for this Co-Admin"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>मॉनिटर गतिविधि (Audit)</span>
                        </button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleStatus(admin)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            admin.status === 'active'
                              ? 'text-yellow-500 hover:bg-yellow-500/10'
                              : 'text-emerald-500 hover:bg-emerald-500/10'
                          }`}
                        >
                          {admin.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>

                        <button
                          onClick={() => handleUpdateRole(admin.id, 'student', admin.name)}
                          className="px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 text-red-500 font-bold transition-colors cursor-pointer"
                          title="Demote to Student"
                        >
                          Demote
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {users.filter(u => u.role === 'co_admin').length === 0 && (
              <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                <Shield className="w-12 h-12 mx-auto text-zinc-400 animate-bounce" />
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">No Co-Admins Appointed Yet</h3>
                <p className="text-xs text-zinc-500 max-w-md mx-auto">
                  Click the &ldquo;+ Appoint Co-Admin&rdquo; button above to create a Co-Admin account under your supervision with custom course, quiz, and moderation permissions.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: REGISTERED STUDENTS & USER DIRECTORY               */}
        {/* ========================================================= */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Student User Accounts ({totalStudents})
                </h3>
                <p className="text-xs text-zinc-500">
                  Every registered learner on the platform. As Super Admin, you can promote any student directly into a Co-Admin.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
              {users.filter(u => u.role === 'student').length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 mx-auto flex items-center justify-center text-xl font-bold">
                    🎓
                  </div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                    केवल वास्तविक साइन-अप / लॉगिन किए हुए छात्र ही यहाँ दिखेंगे
                  </h4>
                  <p className="text-xs text-zinc-500 max-w-md mx-auto">
                    सिस्टम से सभी डमी डेटा हटा दिए गए हैं। जैसे ही कोई नया विद्यार्थी मोबाइल, ईमेल, गूगल अथवा फेसबुक से रजिस्टर या लॉगिन करेगा, उसका रिकॉर्ड यहाँ स्वतः दिखाई देगा।
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 font-bold border-b border-zinc-200 dark:border-zinc-800">
                      <tr>
                        <th className="p-3.5">Student Name</th>
                        <th className="p-3.5">Email</th>
                        <th className="p-3.5">Department & Institution</th>
                        <th className="p-3.5">Registered On</th>
                        <th className="p-3.5">Total Logins</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Administrative Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-medium">
                      {users.filter(u => u.role === 'student').map((student) => (
                        <tr key={student.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                          <td className="p-3.5 font-bold text-zinc-900 dark:text-white flex items-center space-x-2">
                            <div className="w-7 h-7 rounded-lg bg-zinc-700 text-white flex items-center justify-center font-bold text-xs uppercase">
                              {student.name.charAt(0)}
                            </div>
                            <span>{student.name}</span>
                          </td>
                          <td className="p-3.5 text-zinc-400 font-mono text-[11px]">{student.email}</td>
                          <td className="p-3.5 text-zinc-500">{student.department || 'Engineering'} • {student.institution || 'University'}</td>
                          <td className="p-3.5 text-zinc-400">{new Date(student.createdAt).toLocaleDateString('en-IN')}</td>
                          <td className="p-3.5 font-bold text-zinc-800 dark:text-zinc-200">{student.loginCount || 1} logins</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              {student.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            {isSuperAdmin && (
                              <button
                                onClick={() => handleUpdateRole(student.id, 'co_admin', student.name)}
                                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center space-x-1 ml-auto"
                              >
                                <Shield className="w-3.5 h-3.5" />
                                <span>Promote to Co-Admin</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: SECURITY & RBAC MATRIX                             */}
        {/* ========================================================= */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black">
                  🔐
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-900 dark:text-white">
                    Role-Based Access Control (RBAC) Architecture
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Comprehensive hierarchy enforcement rules for Nova Intel Report
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    👑 Super Admin (Master Root)
                  </span>
                  <div className="text-sm font-bold text-zinc-900 dark:text-white">
                    RAM SAKAL
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Unrestricted control. Can appoint Co-Admins, revoke permissions, supervise live sign-ins/sign-ups, terminate sessions, and export audit trails.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-pink-600 dark:text-pink-400">
                    🛡️ Co-Admin (Delegated Sub-Admin)
                  </span>
                  <div className="text-sm font-bold text-zinc-900 dark:text-white">
                    Appointed by Super Admin
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Can manage curricula, author quizzes, review students, and access tools based strictly on checkboxes granted by RAM SAKAL. Cannot alter other admins.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
                    🎓 Student & Learner
                  </span>
                  <div className="text-sm font-bold text-zinc-900 dark:text-white">
                    Standard Academic User
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Access to course roadmaps, AI tutor, PDF generation, quizzes, resume builder, and code runners. Subject to active monitoring.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 5. SUPER ADMIN IDENTITY & PRIVACY CONTROL TAB             */}
        {/* ========================================================= */}
        {activeTab === 'identity' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Identity Hero Banner */}
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-indigo-500/10 to-pink-500/15 border border-amber-500/30 dark:border-amber-400/20 shadow-sm relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-amber-500/20 shrink-0">
                    <Crown className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h2 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white">
                        Super Admin Identity & Privacy Cockpit
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                        सुपर एडमिन नाम व गोपनीयता
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-300 max-w-2xl leading-relaxed">
                      आप अपना नाम (Super Admin Name) कभी भी बदल सकते हैं, और सार्वजनिक प्रदर्शन (Public Visibility) को जब चाहें <strong>ON (सबको दिखाएं)</strong> या <strong>OFF (Stealth / नाम छिपाएं)</strong> कर सकते हैं।
                    </p>
                  </div>
                </div>

                {/* Instant Quick Visibility Switch */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Current Public State:
                    </div>
                    <div className={`text-xs font-black flex items-center sm:justify-end space-x-1.5 ${
                      isNameVisible ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {isNameVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      <span>{isNameVisible ? 'PUBLIC (सबको दिखेगा)' : 'STEALTH (नाम छिपा हुआ है)'}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleToggleVisibility}
                    disabled={isSavingIdentity}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-black shadow-md flex items-center space-x-2 transition-all cursor-pointer active:scale-95 ${
                      isNameVisible
                        ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25'
                    }`}
                  >
                    {isNameVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span>{isNameVisible ? 'नाम छुपाएं (Turn OFF)' : 'नाम सबको दिखाएं (Turn ON)'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2-Column Controls: Name Editor + Visibility Switch */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* CARD 1: SUPER ADMIN NAME & PROFILE EDITOR */}
              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Edit3 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-zinc-900 dark:text-white">
                        1. Super Admin Name Customization (नाम बदलें)
                      </h3>
                      <p className="text-[11px] text-zinc-500">
                        Change how your name is registered across the master portal
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Super Admin Name Input */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center justify-between">
                      <span>Super Admin Display Name (आपका नाम):</span>
                      <span className="text-[10px] text-indigo-500 font-normal">Active across platform</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={editSuperAdminName}
                        onChange={(e) => setEditSuperAdminName(e.target.value)}
                        placeholder="e.g. RAM SAKAL"
                        className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm font-bold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                      />
                      <Crown className="w-4 h-4 text-amber-500 absolute right-3.5 top-3" />
                    </div>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-500 mb-1.5">
                      Quick Name Suggestions (क्लिक करके तुरंत चुनें):
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'RAM SAKAL',
                        'RAM SAKAL (SUPER ADMIN)',
                        'Er. RAM SAKAL',
                        'Chief Director RAM SAKAL',
                        'System Administrator'
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setEditSuperAdminName(preset)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                            editSuperAdminName === preset
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold'
                              : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Public Title (when name is OFF) */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center justify-between">
                      <span>Public Title / Stealth Alias (जब नाम OFF रहेगा):</span>
                      <span className="text-[10px] text-zinc-400 font-normal">Shown to students in stealth mode</span>
                    </label>
                    <input
                      type="text"
                      value={superAdminPublicTitle}
                      onChange={(e) => setSuperAdminPublicTitle(e.target.value)}
                      placeholder="e.g. Chief Administrator"
                      className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {['Chief Administrator', 'Nova Executive Council', 'Academic Director', 'System Root'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSuperAdminPublicTitle(t)}
                          className="px-2 py-0.5 text-[10px] rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-indigo-500 cursor-pointer"
                        >
                          + {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Department & Institution */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                        Executive Department
                      </label>
                      <input
                        type="text"
                        value={superAdminDept}
                        onChange={(e) => setSuperAdminDept(e.target.value)}
                        placeholder="Executive Administration"
                        className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                        Institution / HQ
                      </label>
                      <input
                        type="text"
                        value={superAdminInstitution}
                        onChange={(e) => setSuperAdminInstitution(e.target.value)}
                        placeholder="Nova Intel HQ"
                        className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Save Profile Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleSaveSuperAdminIdentity()}
                      disabled={isSavingIdentity}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      {isSavingIdentity ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>Save Name & Settings (परिवर्तन सुरक्षित करें)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* CARD 2: MASTER PUBLIC VISIBILITY SWITCH */}
              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <Sliders className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-zinc-900 dark:text-white">
                          2. Public Visibility Switch (सार्वजनिक प्रदर्शन ON / OFF)
                        </h3>
                        <p className="text-[11px] text-zinc-500">
                          Decide when to show your name to students and when to stay in stealth mode
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* The Two Choice Boxes */}
                  <div className="mt-4 space-y-3">
                    
                    {/* Choice 1: Visibility ON */}
                    <div
                      onClick={() => {
                        if (!isNameVisible) handleToggleVisibility();
                      }}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        isNameVisible
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-md shadow-emerald-500/10'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/30'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                            isNameVisible ? 'bg-emerald-500 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500'
                          }`}>
                            <Eye className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-zinc-900 dark:text-white flex items-center space-x-1.5">
                              <span>🟢 Show Name to Everyone (सबको दिखेगा)</span>
                              {isNameVisible && (
                                <span className="px-1.5 py-0.2 bg-emerald-500 text-white text-[9px] font-black rounded uppercase">
                                  ACTIVE
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                              आपका असली नाम (उदा. <strong>{editSuperAdminName}</strong>) हेडर, को-एडमिन पैनल, कोर्स ऑथरिंग और स्टूडेंट पोर्टल में सभी को साफ़ तौर पर दिखाई देगा।
                            </p>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="visibilityOption"
                          checked={isNameVisible}
                          onChange={() => { if (!isNameVisible) handleToggleVisibility(); }}
                          className="mt-1 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Choice 2: Visibility OFF (Stealth) */}
                    <div
                      onClick={() => {
                        if (isNameVisible) handleToggleVisibility();
                      }}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        !isNameVisible
                          ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-md shadow-amber-500/10'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/30'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                            !isNameVisible ? 'bg-amber-500 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500'
                          }`}>
                            <EyeOff className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-zinc-900 dark:text-white flex items-center space-x-1.5">
                              <span>🔒 Stealth Mode / Hide Name (नाम छिपाएं / केवल आपको दिखेगा)</span>
                              {!isNameVisible && (
                                <span className="px-1.5 py-0.2 bg-amber-500 text-white text-[9px] font-black rounded uppercase">
                                  ACTIVE
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                              आपका नाम छात्रों और सार्वजनिक आगंतुकों से पूरी तरह छिपा रहेगा। इसके स्थान पर उन्हें केवल <strong>"{superAdminPublicTitle}"</strong> दिखाई देगा। केवल आपके लॉगिन पर आपको आपका असली नाम दिखेगा।
                            </p>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="visibilityOption"
                          checked={!isNameVisible}
                          onChange={() => { if (isNameVisible) handleToggleVisibility(); }}
                          className="mt-1 text-amber-600 focus:ring-amber-500 cursor-pointer"
                        />
                      </div>
                    </div>

                  </div>
                </div>

                {/* Big Toggle Action Button */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={handleToggleVisibility}
                    disabled={isSavingIdentity}
                    className={`w-full py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm active:scale-95 ${
                      isNameVisible
                        ? 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {isNameVisible ? (
                      <>
                        <ToggleRight className="w-4 h-4 text-emerald-500" />
                        <span>वर्तमान: सब देख सकते हैं — [क्लिक करके नाम गुप्त करें (Stealth Mode)]</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-4 h-4 text-amber-500" />
                        <span>वर्तमान: नाम गुप्त है — [क्लिक करके नाम सबको दिखाएं (Public Mode)]</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

            {/* 3. LIVE DUAL-VIEW PERSPECTIVE SIMULATOR */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Monitor className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-zinc-900 dark:text-white">
                      3. Real-Time Dual Perspective Simulation (लाइव सिमुलेशन)
                    </h3>
                    <p className="text-[11px] text-zinc-500">
                      Compare what you see as Super Admin vs. what standard students and public visitors see right now
                    </p>
                  </div>
                </div>
                <div className="text-[10px] font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full">
                  Instant Mirroring
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                
                {/* Perspective 1: Super Admin View */}
                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <Crown className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-xs font-black uppercase text-indigo-700 dark:text-indigo-300">
                        👑 What You See (सुपर एडमिन का नज़रिया)
                      </span>
                    </div>
                    <span className="text-[10px] font-bold bg-indigo-200/60 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200 px-2 py-0.5 rounded">
                      AUTHENTICATED ROOT
                    </span>
                  </div>

                  {/* Mock Navbar Item */}
                  <div className="p-3 bg-white dark:bg-zinc-800 rounded-xl border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center uppercase">
                        {editSuperAdminName.charAt(0) || 'R'}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-900 dark:text-white flex items-center space-x-1">
                          <span>{editSuperAdminName}</span>
                          {isNameVisible ? (
                            <span title="Visible to public">
                              <Eye className="w-3 h-3 text-emerald-500" />
                            </span>
                          ) : (
                            <span title="Hidden from public">
                              <EyeOff className="w-3 h-3 text-amber-500" />
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase">
                          SUPER ADMIN • {currentUser?.email || 'rammilan.kumar7678@gmail.com'}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 px-2 py-0.5 rounded font-black">
                      FULL ACCESS
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    You always see your true identity, unmasked email, and complete management credentials regardless of the privacy switch.
                  </p>
                </div>

                {/* Perspective 2: Student / Public View */}
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  isNameVisible
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                    : 'bg-zinc-100/70 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <Users className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                      <span className="text-xs font-black uppercase text-zinc-700 dark:text-zinc-300">
                        👁️ What Students & Public See (छात्रों का नज़रिया)
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isNameVisible
                        ? 'bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200'
                        : 'bg-amber-200/60 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200'
                    }`}>
                      {isNameVisible ? 'NAME VISIBLE' : 'STEALTH MASKED'}
                    </span>
                  </div>

                  {/* Mock Navbar / Badge for Public */}
                  <div className="p-3 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-8 h-8 rounded-lg text-white font-bold text-xs flex items-center justify-center uppercase ${
                        isNameVisible ? 'bg-indigo-600' : 'bg-zinc-600'
                      }`}>
                        {isNameVisible ? (editSuperAdminName.charAt(0) || 'R') : 'A'}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-900 dark:text-white flex items-center space-x-1">
                          <span>{isNameVisible ? editSuperAdminName : superAdminPublicTitle}</span>
                          {!isNameVisible && (
                            <span title="Stealth Alias">
                              <ShieldCheck className="w-3 h-3 text-amber-500" />
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-zinc-500 font-bold uppercase">
                          {isNameVisible ? 'CHIEF SUPER ADMIN' : 'VERIFIED SYSTEM STAFF'}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded font-black">
                      {isNameVisible ? 'PUBLIC LEADER' : 'PROTECTED IDENTITY'}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {isNameVisible ? (
                      <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                        ✓ Students can see your personal name "{editSuperAdminName}" across the site.
                      </span>
                    ) : (
                      <span className="text-amber-700 dark:text-amber-300 font-medium">
                        ✓ Your personal name is masked! Students only see "{superAdminPublicTitle}".
                      </span>
                    )}
                  </p>
                </div>

              </div>
            </div>

            {/* 4. IDENTITY & VISIBILITY AUDIT LOGS */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Fingerprint className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-zinc-900 dark:text-white">
                      4. Privacy & Name Modification Audit Trail (निगरानी लॉग)
                    </h3>
                    <p className="text-[11px] text-zinc-500">
                      Surveillance records whenever you change your name or toggle visibility
                    </p>
                  </div>
                </div>
                <button
                  onClick={fetchLogs}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {(() => {
                const identityLogs = logs.filter(l => 
                  l.action === 'profile_updated' || 
                  l.action === 'identity_visibility_changed' ||
                  l.action === 'permissions_updated'
                );

                if (identityLogs.length === 0) {
                  return (
                    <div className="py-8 text-center text-zinc-400 text-xs">
                      No identity changes recorded yet. Changes you save will appear here with timestamp and IP log.
                    </div>
                  );
                }

                return (
                  <div className="space-y-2">
                    {identityLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            log.action === 'identity_visibility_changed' ? 'bg-amber-500' : 'bg-indigo-500'
                          }`} />
                          <div>
                            <span className="font-bold text-zinc-900 dark:text-zinc-100">{log.userName}</span>
                            <span className="text-zinc-400 mx-1.5">•</span>
                            <span className="text-zinc-600 dark:text-zinc-300">{log.details}</span>
                          </div>
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • IP: {log.ip}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

          </div>
        )}

        {/* 6. CONTENT DATABASE CMS TAB (1-CLICK PUBLISHER) */}
        {activeTab === 'contentdb' && (
          <ContentDatabaseCMS
            currentUser={currentUser}
            onNavigate={onNavigate}
            onRefreshAllContent={() => {
              fetchLogs();
            }}
          />
        )}

        {/* 7. ORGANIZATIONAL HIERARCHY TREE TAB */}
        {activeTab === 'tree' && (
          <OrgHierarchyTree
            currentUser={currentUser}
            users={users}
            onOpenCreateModal={(role, supervisorId) => handleOpenCreateWithRole(role, supervisorId)}
            onEditPermissions={(u) => setEditingUser(u)}
            onToggleStatus={(u) => handleToggleStatus(u)}
          />
        )}

        {/* 8. PENDING CANDIDATE APPROVALS TAB */}
        {activeTab === 'approvals' && (
          <AdminApprovalsQueue
            applications={applications}
            currentUser={currentUser}
            onRefreshApplications={fetchApplications}
            onRefreshUsers={fetchUsers}
          />
        )}

      </div>

      {/* Freshly Created Credentials Alert Card */}
      {createdCredentialsCard && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md p-5 rounded-3xl bg-zinc-950 border-2 border-emerald-500 shadow-2xl space-y-3 text-zinc-100 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-400 font-extrabold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>नया खाता तैयार! (Account Created & ID Issued)</span>
            </div>
            <button
              onClick={() => setCreatedCredentialsCard(null)}
              className="text-zinc-500 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-zinc-400">Name:</span>
              <strong className="text-white">{createdCredentialsCard.name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Role:</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-300">
                {createdCredentialsCard.role}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Login ID:</span>
              <span className="font-mono text-indigo-400 font-bold">{createdCredentialsCard.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Password:</span>
              <span className="font-mono text-amber-400 font-bold">{createdCredentialsCard.password}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <button
              onClick={() => {
                const credText = `🏛️ NOVA INTEL ADMIN ACCESS CREDENTIALS\nName: ${createdCredentialsCard.name}\nRole: ${createdCredentialsCard.role?.toUpperCase()}\nLogin ID: ${createdCredentialsCard.id}\nPassword: ${createdCredentialsCard.password}\nLogin Portal: ${window.location.origin}`;
                navigator.clipboard.writeText(credText);
                showNotification('Credentials copied to clipboard!');
              }}
              className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Details</span>
            </button>

            <button
              onClick={() => {
                const text = `*Nova Intel Login Credentials*\nHello ${createdCredentialsCard.name}, your account as ${createdCredentialsCard.role === 'worker' ? 'Worker/Staff' : 'Co-Admin'} has been created by Chief Admin RAM SAKAL!\n\n*Login ID:* ${createdCredentialsCard.id}\n*Password:* ${createdCredentialsCard.password}\n*Portal:* ${window.location.origin}`;
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer transition-colors"
              title="Share on WhatsApp"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE NEW CO-ADMIN OR WORKER                      */}
      {/* ========================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 pb-4 bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-pink-900/40 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-pink-600 text-white flex items-center justify-center shadow-md">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-900 dark:text-white">
                    Appoint {newAdminRole === 'worker' ? 'Worker / Staff (कार्यकर्ता)' : 'Co-Admin (सह-प्रशासक)'}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Chief Admin RAM SAKAL के अधीन आईडी-पासवर्ड के साथ नया खाता बनाएं
                  </p>
                </div>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-1 text-zinc-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateCoAdmin} className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Role Toggle */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  पद का चयन करें (Select Position):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewAdminRole('co_admin');
                      setNewAdminCustomId(`COADM-${Math.floor(1000 + Math.random() * 9000)}`);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer transition-all ${
                      newAdminRole === 'co_admin'
                        ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400 shadow-sm'
                        : 'border-zinc-700 bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Co-Admin (सह-प्रशासक)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewAdminRole('worker');
                      setNewAdminCustomId(`WRK-${Math.floor(1000 + Math.random() * 9000)}`);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer transition-all ${
                      newAdminRole === 'worker'
                        ? 'border-purple-500 bg-purple-500/20 text-purple-400 shadow-sm'
                        : 'border-zinc-700 bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Worker / Staff (कार्यकर्ता)</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Full Name (पूरा नाम) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="priya@university.edu"
                    className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Login Credentials: Custom ID & Password Generation */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-black text-indigo-900 dark:text-indigo-300 flex items-center space-x-1.5">
                    <Key className="w-3.5 h-3.5 text-indigo-600" />
                    <span>लॉगिन आईडी एवं पासवर्ड (Issued Login Credentials)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const prefix = newAdminRole === 'worker' ? 'WRK' : 'COADM';
                      const rand = Math.floor(1000 + Math.random() * 9000);
                      setNewAdminCustomId(`${prefix}-${rand}`);
                      setNewAdminPassword(`Nova@${Math.floor(1000 + Math.random() * 9000)}#`);
                    }}
                    className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    🎲 Regenerate Both
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Assigned Login ID (विशिष्ट आईडी)
                    </label>
                    <input
                      type="text"
                      value={newAdminCustomId}
                      onChange={(e) => setNewAdminCustomId(e.target.value)}
                      placeholder={newAdminRole === 'worker' ? 'WRK-1082' : 'COADM-4921'}
                      className="w-full px-3.5 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Secure Password (पासवर्ड)
                    </label>
                    <input
                      type="text"
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      placeholder="e.g. Nova@7678#"
                      className="w-full px-3.5 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs font-mono font-bold text-amber-500 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Mobile Number (वैकल्पिक / WhatsApp)
                  </label>
                  <input
                    type="tel"
                    value={newAdminPhone}
                    onChange={(e) => setNewAdminPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Assigned Department (विभाग)
                  </label>
                  <input
                    type="text"
                    value={newAdminDept}
                    onChange={(e) => setNewAdminDept(e.target.value)}
                    placeholder="Curriculum & Course Assessment"
                    className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Institution / Campus
                  </label>
                  <input
                    type="text"
                    value={newAdminInstitution}
                    onChange={(e) => setNewAdminInstitution(e.target.value)}
                    placeholder="Nova Intel Academy"
                    className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Granular Permissions Checkboxes */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Granular Permissions Granted (अधिकार चुनें):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ALL_AVAILABLE_PERMISSIONS.map((perm) => {
                    const isChecked = selectedPermissions.includes(perm.id);
                    return (
                      <label
                        key={perm.id}
                        className={`p-2.5 rounded-xl border text-xs flex items-start space-x-2.5 cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500/50 text-zinc-900 dark:text-white'
                            : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700 text-zinc-500'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedPermissions(selectedPermissions.filter(p => p !== perm.id));
                            } else {
                              setSelectedPermissions([...selectedPermissions, perm.id]);
                            }
                          }}
                          className="mt-0.5 rounded text-indigo-600 focus:ring-0"
                        />
                        <div>
                          <div className="font-bold flex items-center space-x-1">
                            <span>{perm.icon}</span>
                            <span>{perm.label}</span>
                          </div>
                          <div className="text-[10px] text-zinc-400 mt-0.5">{perm.description}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAdmin}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50 flex items-center space-x-1.5"
                >
                  <span>{isSubmittingAdmin ? 'Creating...' : `Appoint ${newAdminRole === 'worker' ? 'Worker' : 'Co-Admin'}`}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT CO-ADMIN PERMISSIONS                          */}
      {/* ========================================================= */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-black text-zinc-900 dark:text-white">
                  Edit Delegated Permissions
                </h3>
                <p className="text-xs text-zinc-400">
                  {editingUser.name} ({editingUser.email})
                </p>
              </div>
              <button onClick={() => setEditingUser(null)} className="p-1 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {ALL_AVAILABLE_PERMISSIONS.map((perm) => {
                const isChecked = editingUser.permissions?.includes(perm.id);
                return (
                  <label
                    key={perm.id}
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer ${
                      isChecked
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500/50 text-zinc-900 dark:text-white'
                        : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700 text-zinc-500'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{perm.icon}</span>
                      <div>
                        <div className="font-bold">{perm.label}</div>
                        <div className="text-[10px] text-zinc-400">{perm.description}</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        const nextPerms = isChecked
                          ? editingUser.permissions.filter(p => p !== perm.id)
                          : [...editingUser.permissions, perm.id];
                        setEditingUser({ ...editingUser, permissions: nextPerms });
                      }}
                      className="rounded text-indigo-600 focus:ring-0"
                    />
                  </label>
                );
              })}
            </div>

            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePermissions}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: SUPER ADMIN QUICK NAME & VISIBILITY CONTROLLER     */}
      {/* ========================================================= */}
      {showIdentityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 pb-4 bg-gradient-to-r from-amber-900/40 via-indigo-900/40 to-pink-900/40 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-900 dark:text-white">
                    Super Admin Identity & Privacy (नाम व गोपनीयता)
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Change your name and control public visibility instantly
                  </p>
                </div>
              </div>
              <button onClick={() => setShowIdentityModal(false)} className="p-1 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              
              {/* Name Input */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Super Admin Display Name (आपका नाम)
                </label>
                <input
                  type="text"
                  value={editSuperAdminName}
                  onChange={(e) => setEditSuperAdminName(e.target.value)}
                  placeholder="e.g. RAM SAKAL"
                  className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs font-bold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {['RAM SAKAL', 'RAM SAKAL (ADMIN)', 'Chief RAM SAKAL', 'System Administrator'].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setEditSuperAdminName(n)}
                      className="px-2 py-0.5 text-[10px] rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-indigo-500"
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Public Visibility Toggle Box */}
              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {isNameVisible ? (
                      <Eye className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-amber-500" />
                    )}
                    <span className="text-xs font-bold text-zinc-900 dark:text-white">
                      {isNameVisible ? '🟢 Public Mode (सबको नाम दिखेगा)' : '🔒 Stealth Mode (नाम गुप्त रहेगा)'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsNameVisible(!isNameVisible)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      isNameVisible
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                        : 'bg-amber-500 text-white hover:bg-amber-600'
                    }`}
                  >
                    {isNameVisible ? 'Hide Name (OFF)' : 'Show Name (ON)'}
                  </button>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  {isNameVisible
                    ? 'Your personal name will be openly visible to all students, co-admins, and visitors.'
                    : `Your name will be hidden from everyone! Public views will display "${superAdminPublicTitle}".`}
                </p>
              </div>

              {/* Stealth Title */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Public Title / Stealth Alias (जब नाम OFF हो)
                </label>
                <input
                  type="text"
                  value={superAdminPublicTitle}
                  onChange={(e) => setSuperAdminPublicTitle(e.target.value)}
                  placeholder="e.g. Chief Administrator"
                  className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Dept & Inst */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={superAdminDept}
                    onChange={(e) => setSuperAdminDept(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={superAdminInstitution}
                    onChange={(e) => setSuperAdminInstitution(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs"
                  />
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-850 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShowIdentityModal(false);
                  setActiveTab('identity');
                }}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                Open Full Identity Cockpit →
              </button>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowIdentityModal(false)}
                  className="px-3 py-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveSuperAdminIdentity()}
                  disabled={isSavingIdentity}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center space-x-1.5"
                >
                  {isSavingIdentity ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Profile</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
