import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Briefcase,
  Copy,
  Check,
  Share2,
  Key,
  UserCheck,
  UserX,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Search,
  Filter,
  Users
} from 'lucide-react';
import { AdminApplication, AuthUser } from '../types';

interface AdminApprovalsQueueProps {
  applications: AdminApplication[];
  currentUser: AuthUser | null;
  onRefreshApplications: () => void;
  onRefreshUsers: () => void;
}

export default function AdminApprovalsQueue({
  applications,
  currentUser,
  onRefreshApplications,
  onRefreshUsers
}: AdminApprovalsQueueProps) {
  const [activeFilter, setActiveFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<AdminApplication | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Approval form state
  const [customId, setCustomId] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [assignedDept, setAssignedDept] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    'manage_courses',
    'manage_quizzes',
    'manage_articles',
    'upload_materials'
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [approvedCredentialsCard, setApprovedCredentialsCard] = useState<any | null>(null);

  const pendingCount = applications.filter(a => a.status === 'pending').length;
  const approvedCount = applications.filter(a => a.status === 'approved').length;
  const rejectedCount = applications.filter(a => a.status === 'rejected').length;

  const filteredApps = applications.filter(app => {
    if (activeFilter !== 'all' && app.status !== activeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        app.name.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        (app.phone && app.phone.includes(q)) ||
        app.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const openApproveDialog = (app: AdminApplication) => {
    setSelectedApp(app);
    const randNum = Math.floor(1000 + Math.random() * 9000);
    setCustomId(app.desiredRole === 'worker' ? `WRK-${randNum}` : `COADM-${randNum}`);
    setCustomPassword(`Nova@${Math.floor(1000 + Math.random() * 9000)}#`);
    setAssignedDept(app.department);
    setSelectedPermissions(
      app.desiredRole === 'worker'
        ? ['manage_courses', 'manage_quizzes', 'manage_articles', 'upload_materials']
        : ['manage_courses', 'manage_quizzes', 'manage_articles', 'upload_materials', 'view_analytics']
    );
    setShowApprovalModal(true);
  };

  const handleApproveConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/applications/${selectedApp.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customId: customId.trim(),
          password: customPassword.trim(),
          department: assignedDept.trim(),
          permissions: selectedPermissions,
          reviewerEmail: currentUser?.email || 'rammilan.kumar7678@gmail.com'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to approve application');

      setApprovedCredentialsCard(data.credentials);
      setStatusMessage({
        text: `✓ ${selectedApp.name} officially approved! Issued ID: ${data.credentials.id}`,
        type: 'success'
      });
      setShowApprovalModal(false);
      onRefreshApplications();
      onRefreshUsers();
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Approval error', type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/applications/${selectedApp.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: rejectReason.trim(),
          reviewerEmail: currentUser?.email || 'rammilan.kumar7678@gmail.com'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reject application');

      setStatusMessage({ text: `Application for ${selectedApp.name} rejected.`, type: 'success' });
      setShowRejectModal(false);
      setRejectReason('');
      onRefreshApplications();
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Rejection error', type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyCredText = (cred: any) => {
    const text = `🏛️ NOVA INTEL ADMIN ACCESS CREDENTIALS\nName: ${cred.name}\nRole: ${cred.role?.toUpperCase()}\nLogin ID: ${cred.id}\nPassword: ${cred.password}\nLogin Portal: ${window.location.origin}`;
    navigator.clipboard.writeText(text);
    setCopiedId(cred.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const shareCredWhatsApp = (cred: any) => {
    const text = `*Nova Intel Login Credentials*\nHello ${cred.name}, your application for ${cred.role === 'worker' ? 'Worker/Staff' : 'Co-Admin'} has been approved by Chief Admin RAM SAKAL!\n\n*Login ID:* ${cred.id}\n*Password:* ${cred.password}\n*Portal:* ${window.location.origin}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs font-bold ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}
        >
          <span>{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)} className="text-zinc-400 hover:text-white cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Freshly Approved Credentials Card Popup */}
      {approvedCredentialsCard && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-zinc-900 to-indigo-950/80 border-2 border-emerald-500/60 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-400 font-extrabold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>सफलतापूर्वक अनुमोदित एवं क्रेडेंशियल जारी (Credentials Issued)!</span>
            </div>
            <button
              onClick={() => setApprovedCredentialsCard(null)}
              className="text-xs text-zinc-400 hover:text-white cursor-pointer px-2 py-1 rounded bg-zinc-800"
            >
              बंद करें (Close)
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-zinc-500 block uppercase font-bold">Candidate Name</span>
              <strong className="text-white text-sm">{approvedCredentialsCard.name}</strong>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 block uppercase font-bold">Assigned Login ID</span>
              <strong className="text-indigo-400 font-mono text-sm">{approvedCredentialsCard.id}</strong>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 block uppercase font-bold">Secure Password</span>
              <strong className="text-amber-400 font-mono text-sm">{approvedCredentialsCard.password}</strong>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 block uppercase font-bold">Role</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300">
                {approvedCredentialsCard.role?.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
            <button
              onClick={() => copyCredText(approvedCredentialsCard)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-md transition-colors"
            >
              {copiedId === approvedCredentialsCard.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedId === approvedCredentialsCard.id ? 'Copied to Clipboard!' : '1-Click Copy Credentials'}</span>
            </button>

            <button
              onClick={() => shareCredWhatsApp(approvedCredentialsCard)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-md transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Send via WhatsApp</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs & Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-all ${
              activeFilter === 'pending'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>लंबित आवेदन (Pending: {pendingCount})</span>
            {pendingCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
            )}
          </button>

          <button
            onClick={() => setActiveFilter('approved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-all ${
              activeFilter === 'approved'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>स्वीकृत (Approved: {approvedCount})</span>
          </button>

          <button
            onClick={() => setActiveFilter('rejected')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-all ${
              activeFilter === 'rejected'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>अस्वीकृत (Rejected: {rejectedCount})</span>
          </button>

          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeFilter === 'all'
                ? 'bg-zinc-700 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            सभी (All: {applications.length})
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search applications..."
            className="w-full sm:w-60 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {filteredApps.length === 0 ? (
          <div className="p-12 text-center bg-zinc-900/60 rounded-3xl border border-zinc-800 space-y-2">
            <Users className="w-10 h-10 text-zinc-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">कोई आवेदन नहीं मिला (No Applications in this category)</h4>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              नए उम्मीदवार वेबसाइट के &ldquo;Apply for Co-Admin / Worker&rdquo; फॉर्म के माध्यम से आवेदन कर सकते हैं।
            </p>
          </div>
        ) : (
          filteredApps.map((app) => (
            <div
              key={app.id}
              className={`p-5 rounded-3xl border transition-all space-y-3 ${
                app.status === 'pending'
                  ? 'bg-zinc-900 border-amber-500/40 shadow-lg shadow-amber-500/5'
                  : app.status === 'approved'
                  ? 'bg-zinc-900/80 border-emerald-500/30'
                  : 'bg-zinc-900/50 border-zinc-800 opacity-70'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start space-x-3.5">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm uppercase shrink-0 shadow-md ${
                      app.desiredRole === 'worker'
                        ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white'
                        : 'bg-gradient-to-br from-indigo-500 to-pink-600 text-white'
                    }`}
                  >
                    {app.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-extrabold text-white">{app.name}</h4>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          app.desiredRole === 'worker'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                        }`}
                      >
                        {app.desiredRole === 'worker' ? 'WORKER APPLICANT' : 'CO-ADMIN APPLICANT'}
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                          app.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : app.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {app.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-xs text-zinc-400 mt-0.5 flex flex-wrap items-center gap-2">
                      <span>{app.email}</span>
                      {app.phone && <span>• {app.phone}</span>}
                      <span>• <strong className="text-indigo-400">{app.department}</strong></span>
                      {app.institution && <span>({app.institution})</span>}
                    </div>
                  </div>
                </div>

                {/* Actions / Status Badges */}
                <div className="flex items-center space-x-2 shrink-0">
                  {app.status === 'pending' && (
                    <>
                      <button
                        onClick={() => openApproveDialog(app)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center space-x-1 cursor-pointer transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>अनुमोदित करें (Approve)</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setShowRejectModal(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-zinc-700 text-xs font-bold cursor-pointer transition-colors"
                      >
                        अस्वीकृत (Reject)
                      </button>
                    </>
                  )}

                  {app.status === 'approved' && app.generatedId && (
                    <div className="flex items-center space-x-2">
                      <div className="px-2.5 py-1 rounded-xl bg-zinc-800 text-xs font-mono text-emerald-400 border border-zinc-700">
                        ID: {app.generatedId}
                      </div>
                      <button
                        onClick={() =>
                          copyCredText({
                            name: app.name,
                            id: app.generatedId,
                            password: app.generatedPassword,
                            role: app.desiredRole
                          })
                        }
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                        title="Copy Credentials"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          shareCredWhatsApp({
                            name: app.name,
                            id: app.generatedId,
                            password: app.generatedPassword,
                            role: app.desiredRole
                          })
                        }
                        className="p-1.5 rounded-lg bg-emerald-900/50 hover:bg-emerald-900/80 text-emerald-300 cursor-pointer"
                        title="Share on WhatsApp"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Application Details Body */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800 text-xs">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-0.5">
                    Qualifications & Technical Background:
                  </span>
                  <p className="text-zinc-300">{app.qualifications || 'Academic credentials submitted'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-0.5">
                    Reason / Motivation for Role:
                  </span>
                  <p className="text-zinc-300">{app.reason || 'Requested to contribute educational materials'}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1">
                <span>Applied: {new Date(app.appliedAt).toLocaleString('en-IN')}</span>
                {app.reviewedBy && (
                  <span>Reviewed by {app.reviewedBy} on {new Date(app.reviewedAt || '').toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Approval Modal */}
      {showApprovalModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-zinc-950 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-zinc-100">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-white">Approve & Issue ID/Password</h3>
              </div>
              <button
                onClick={() => setShowApprovalModal(false)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Chief Admin <strong>RAM SAKAL</strong>: आप <strong>{selectedApp.name}</strong> को{' '}
              {selectedApp.desiredRole === 'worker' ? 'Worker/Staff' : 'Co-Admin'} पद पर अधिकृत कर रहे हैं। इनके लिए लॉगिन आईडी और पासवर्ड जारी करें:
            </p>

            <form onSubmit={handleApproveConfirm} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                    Assign Login ID (विशिष्ट आईडी) *
                  </label>
                  <input
                    type="text"
                    required
                    value={customId}
                    onChange={(e) => setCustomId(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-indigo-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                    Set Password (गोपनीय पासवर्ड) *
                  </label>
                  <input
                    type="text"
                    required
                    value={customPassword}
                    onChange={(e) => setCustomPassword(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                  Department / Scope (विभाग)
                </label>
                <input
                  type="text"
                  value={assignedDept}
                  onChange={(e) => setAssignedDept(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                  अनुमतियां (Granted Permissions):
                </label>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  {[
                    { id: 'manage_courses', label: '📚 Course Authoring' },
                    { id: 'manage_quizzes', label: '📝 Quiz Generator' },
                    { id: 'manage_articles', label: '📰 Article Publishing' },
                    { id: 'upload_materials', label: '📂 Study Material / PDF' },
                    { id: 'view_analytics', label: '📊 View Analytics' }
                  ].map(p => (
                    <label key={p.id} className="flex items-center space-x-1.5 p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 cursor-pointer text-zinc-300">
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(p.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedPermissions([...selectedPermissions, p.id]);
                          else setSelectedPermissions(selectedPermissions.filter(x => x !== p.id));
                        }}
                        className="rounded accent-emerald-500"
                      />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowApprovalModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white cursor-pointer"
                >
                  रद्द करें (Cancel)
                </button>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 cursor-pointer disabled:opacity-50 transition-all"
                >
                  {isProcessing ? 'अनुमोदित हो रहा है...' : '✓ अंतिम स्वीकृति दें और खाता बनाएं (Confirm Approval)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-zinc-950 border border-red-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-zinc-100">
            <h3 className="text-base font-black text-white flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <span>Reject Application for {selectedApp.name}</span>
            </h3>

            <p className="text-xs text-zinc-400">
              कृपया अस्वीकृति का कारण दर्ज करें (Enter reason for rejection):
            </p>

            <form onSubmit={handleRejectConfirm} className="space-y-3">
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Incomplete credentials, department full, or missing requirements."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
              />

              <div className="flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Confirm Reject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
