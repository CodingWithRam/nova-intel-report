import React, { useState } from 'react';
import {
  Crown,
  Shield,
  Briefcase,
  Users,
  ChevronDown,
  ChevronRight,
  UserPlus,
  Key,
  Copy,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  Share2,
  Sparkles,
  Smartphone,
  Mail,
  Building,
  CheckCircle2
} from 'lucide-react';
import { AuthUser, UserRole } from '../types';

interface OrgHierarchyTreeProps {
  currentUser: AuthUser | null;
  users: AuthUser[];
  onOpenCreateModal: (defaultRole?: 'co_admin' | 'worker', supervisorId?: string) => void;
  onEditPermissions?: (user: AuthUser) => void;
  onToggleStatus?: (user: AuthUser) => void;
}

export default function OrgHierarchyTree({
  currentUser,
  users,
  onOpenCreateModal,
  onEditPermissions,
  onToggleStatus
}: OrgHierarchyTreeProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedPasswords, setRevealedPasswords] = useState<{ [key: string]: boolean }>({});
  const [expandedNodes, setExpandedNodes] = useState<{ [key: string]: boolean }>({
    root: true
  });

  const isSuperAdmin =
    currentUser?.role === 'super_admin' ||
    currentUser?.email === 'rammilan.kumar7678@gmail.com' ||
    currentUser?.phone === '+91 7678829509' ||
    currentUser?.phone === '7678829509';

  const superAdmin =
    users.find(u => u.role === 'super_admin' || u.email === 'rammilan.kumar7678@gmail.com') ||
    currentUser || {
      id: 'usr-super-admin',
      customId: 'ADM-ROOT-7678',
      name: 'RAM SAKAL',
      email: 'rammilan.kumar7678@gmail.com',
      phone: '+91 7678829509',
      role: 'super_admin' as UserRole,
      status: 'active' as const,
      department: 'Executive Administration & Systems',
      institution: 'Nova Intel HQ',
      permissions: ['manage_courses', 'manage_quizzes', 'manage_articles', 'upload_materials', 'view_analytics'],
      loginCount: 52,
      createdAt: '2026-01-01'
    };

  const coAdmins = users.filter(u => u.role === 'co_admin');
  const workers = users.filter(u => u.role === 'worker');

  const togglePasswordReveal = (id: string) => {
    setRevealedPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyCredentials = (user: AuthUser) => {
    const credText = `🏛️ NOVA INTEL ADMIN ACCESS CREDENTIALS\nName: ${user.name}\nRole: ${user.role.toUpperCase()}\nLogin ID: ${user.customId || user.id}\nEmail: ${user.email}\n${user.phone ? `Mobile: ${user.phone}\n` : ''}${user.password ? `Password: ${user.password}\n` : ''}Department: ${user.department || 'N/A'}\nLogin Link: ${window.location.origin}`;
    navigator.clipboard.writeText(credText);
    setCopiedId(user.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const shareViaWhatsApp = (user: AuthUser) => {
    const text = `*Nova Intel Admin Credentials*\nName: ${user.name}\nRole: ${user.role === 'worker' ? 'Worker/Staff' : 'Co-Admin'}\nLogin ID: ${user.customId || user.id}\nPassword: ${user.password || 'Contact Chief Admin'}\nLogin Portal: ${window.location.origin}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner & Overview Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30">
          <div className="flex items-center space-x-2 text-amber-500 font-bold text-xs mb-1">
            <Crown className="w-4 h-4" />
            <span>Chief Admin (मुख्य)</span>
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white">1</div>
          <p className="text-[10px] text-zinc-400 mt-0.5">RAM SAKAL (Root Authority)</p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent border border-indigo-500/30">
          <div className="flex items-center space-x-2 text-indigo-500 font-bold text-xs mb-1">
            <Shield className="w-4 h-4" />
            <span>Co-Admins (सह-प्रशासक)</span>
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white">{coAdmins.length}</div>
          <p className="text-[10px] text-zinc-400 mt-0.5">विभागीय प्रमुख एवं नियंत्रण</p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border border-purple-500/30">
          <div className="flex items-center space-x-2 text-purple-500 font-bold text-xs mb-1">
            <Briefcase className="w-4 h-4" />
            <span>Workers / Staff (कार्यकर्ता)</span>
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white">{workers.length}</div>
          <p className="text-[10px] text-zinc-400 mt-0.5">सामग्री निर्माता एवं शोधकर्ता</p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30">
          <div className="flex items-center space-x-2 text-emerald-500 font-bold text-xs mb-1">
            <Users className="w-4 h-4" />
            <span>Total Team (कुल टीम)</span>
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white">
            {1 + coAdmins.length + workers.length}
          </div>
          <p className="text-[10px] text-zinc-400 mt-0.5">सक्रिय प्रशासनिक सदस्य</p>
        </div>
      </div>

      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
        <div>
          <h2 className="text-base font-black text-white flex items-center space-x-2">
            <span>संगठनात्मक पदानुक्रम वृक्ष (Organizational Hierarchy Tree)</span>
            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              INTERACTIVE TREE
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            चीफ सुपर एडमिन के अधीन सह-प्रशासक (Co-Admins) एवं कार्यकर्ता (Workers) का त्रि-स्तरीय ढांचा
          </p>
        </div>

        {isSuperAdmin && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpenCreateModal('worker')}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/20 flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>+ Add Worker (कार्यकर्ता)</span>
            </button>

            <button
              onClick={() => onOpenCreateModal('co_admin')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Appoint Co-Admin</span>
            </button>
          </div>
        )}
      </div>

      {/* Visual Tree Rendering */}
      <div className="space-y-6">
        {/* LEVEL 1: CHIEF SUPER ADMIN (ROOT) */}
        <div className="relative">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/60 via-zinc-900 to-indigo-950/60 border-2 border-amber-500/50 shadow-xl shadow-amber-500/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 text-black flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-500/30 shrink-0">
                  <Crown className="w-7 h-7 text-zinc-950" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-black text-white">{superAdmin.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      👑 CHIEF SUPER ADMIN (ROOT AUTHORITY)
                    </span>
                    <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                      ID: {superAdmin.customId || 'ADM-ROOT-7678'}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-300 mt-1 flex flex-wrap items-center gap-3">
                    <span className="flex items-center space-x-1">
                      <Mail className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{superAdmin.email}</span>
                    </span>
                    {superAdmin.phone && (
                      <span className="flex items-center space-x-1">
                        <Smartphone className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{superAdmin.phone}</span>
                      </span>
                    )}
                    <span className="text-amber-400 font-medium">
                      {superAdmin.department} • {superAdmin.institution}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => copyCredentials(superAdmin as AuthUser)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer border border-zinc-700"
                  title="Copy Super Admin details"
                >
                  {copiedId === superAdmin.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === superAdmin.id ? 'Copied!' : 'Copy ID'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tree Line Connector */}
          <div className="w-0.5 h-8 bg-gradient-to-b from-amber-500 to-indigo-500 mx-auto" />
        </div>

        {/* LEVEL 2: CO-ADMINS BRANCHES */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-widest text-zinc-400 px-2">
            <span>Level 2: Co-Admins Branches ({coAdmins.length})</span>
            <span className="text-[11px] text-zinc-500 font-normal">Department Heads & Sub-Admins</span>
          </div>

          {coAdmins.length === 0 ? (
            <div className="p-8 text-center bg-zinc-900/60 rounded-3xl border border-dashed border-zinc-800 space-y-3">
              <Shield className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-400">
                अभी तक कोई Co-Admin नहीं बनाया गया है। ऊपर &ldquo;+ Appoint Co-Admin&rdquo; बटन दबाकर नया Co-Admin बनाएं।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {coAdmins.map((coAdmin) => {
                const assignedWorkers = workers.filter(
                  w => w.supervisorId === coAdmin.id || w.department === coAdmin.department
                );
                const isPasswordShown = revealedPasswords[coAdmin.id];

                return (
                  <div
                    key={coAdmin.id}
                    className="p-5 rounded-3xl bg-zinc-900 border border-indigo-500/30 shadow-md space-y-4 hover:border-indigo-500/60 transition-colors"
                  >
                    {/* Co-Admin Node Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
                          <Shield className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-base font-extrabold text-white">{coAdmin.name}</h4>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                              CO-ADMIN
                            </span>
                            <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-zinc-800 text-indigo-300 border border-zinc-700">
                              ID: {coAdmin.customId || coAdmin.id}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                              coAdmin.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {coAdmin.status}
                            </span>
                          </div>
                          <div className="text-xs text-zinc-400 mt-0.5 flex flex-wrap items-center gap-2">
                            <span>{coAdmin.email}</span>
                            {coAdmin.phone && <span>• {coAdmin.phone}</span>}
                            <span>• <strong className="text-indigo-400">{coAdmin.department}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Credentials & Actions */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Password toggle */}
                        {coAdmin.password && (
                          <div className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-zinc-800 text-xs font-mono border border-zinc-700">
                            <Key className="w-3.5 h-3.5 text-amber-400" />
                            <span>{isPasswordShown ? coAdmin.password : '••••••••'}</span>
                            <button
                              onClick={() => togglePasswordReveal(coAdmin.id)}
                              className="text-zinc-400 hover:text-white ml-1 cursor-pointer"
                              title={isPasswordShown ? 'Hide Password' : 'Show Password'}
                            >
                              {isPasswordShown ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                          </div>
                        )}

                        <button
                          onClick={() => copyCredentials(coAdmin)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                          title="Copy Full Credentials"
                        >
                          {copiedId === coAdmin.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === coAdmin.id ? 'Copied' : 'Copy'}</span>
                        </button>

                        <button
                          onClick={() => shareViaWhatsApp(coAdmin)}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                          title="Share via WhatsApp"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </button>

                        {isSuperAdmin && (
                          <button
                            onClick={() => onOpenCreateModal('worker', coAdmin.id)}
                            className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>+ Assign Worker</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Permissions tags */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-800 text-[10px]">
                      <span className="font-bold text-zinc-500 uppercase mr-1">Privileges:</span>
                      {coAdmin.permissions && coAdmin.permissions.length > 0 ? (
                        coAdmin.permissions.map(p => (
                          <span key={p} className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-medium border border-zinc-700">
                            {p.replace(/_/g, ' ')}
                          </span>
                        ))
                      ) : (
                        <span className="text-zinc-500 italic">No specific permissions</span>
                      )}
                    </div>

                    {/* Subordinate Workers under this Co-Admin */}
                    {assignedWorkers.length > 0 && (
                      <div className="pl-4 sm:pl-6 border-l-2 border-purple-500/40 space-y-2 mt-3 pt-2">
                        <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center space-x-1.5">
                          <Briefcase className="w-3 h-3" />
                          <span>Subordinate Workers ({assignedWorkers.length})</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {assignedWorkers.map((w) => (
                            <div
                              key={w.id}
                              className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between gap-2"
                            >
                              <div>
                                <div className="flex items-center space-x-1.5">
                                  <span className="font-extrabold text-xs text-white">{w.name}</span>
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-purple-500/20 text-purple-300">
                                    {w.customId || w.id}
                                  </span>
                                </div>
                                <div className="text-[10px] text-zinc-400 mt-0.5">
                                  {w.email} {w.phone ? `• ${w.phone}` : ''}
                                </div>
                              </div>

                              <div className="flex items-center space-x-1 shrink-0">
                                <button
                                  onClick={() => copyCredentials(w)}
                                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                                  title="Copy credentials"
                                >
                                  {copiedId === w.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                </button>
                                <button
                                  onClick={() => shareViaWhatsApp(w)}
                                  className="p-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-900/70 text-emerald-300 transition-colors cursor-pointer"
                                  title="Share WhatsApp"
                                >
                                  <Share2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* LEVEL 3: DIRECT WORKERS (Under Chief Admin) */}
        {workers.filter(w => !w.supervisorId || w.supervisorId === superAdmin.id || w.supervisorId === 'usr-super-admin').length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-widest text-zinc-400 px-2">
              <span>Direct Workers / Staff reporting to Chief Admin</span>
              <span className="text-[11px] text-zinc-500 font-normal">Content Authors & Formatters</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {workers
                .filter(w => !w.supervisorId || w.supervisorId === superAdmin.id || w.supervisorId === 'usr-super-admin')
                .map((w) => {
                  const isPasswordShown = revealedPasswords[w.id];
                  return (
                    <div
                      key={w.id}
                      className="p-4 rounded-2xl bg-zinc-900 border border-purple-500/30 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <h5 className="font-extrabold text-sm text-white">{w.name}</h5>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-purple-500/20 text-purple-300">
                              WORKER
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-zinc-400 block mt-0.5">
                            ID: {w.customId || w.id}
                          </span>
                        </div>

                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          w.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {w.status}
                        </span>
                      </div>

                      <div className="text-[11px] text-zinc-400 space-y-0.5">
                        <div className="truncate">{w.email}</div>
                        {w.phone && <div>{w.phone}</div>}
                        <div className="text-purple-400 font-medium">{w.department || 'Content Creation'}</div>
                      </div>

                      {/* Password & Credentials */}
                      <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                        <div className="text-[10px] font-mono text-zinc-400 flex items-center space-x-1">
                          <Key className="w-3 h-3 text-amber-400" />
                          <span>{isPasswordShown ? w.password : '••••••'}</span>
                          <button
                            onClick={() => togglePasswordReveal(w.id)}
                            className="text-zinc-500 hover:text-white ml-1 cursor-pointer"
                          >
                            {isPasswordShown ? <EyeOff className="w-2.5 h-2.5" /> : <Eye className="w-2.5 h-2.5" />}
                          </button>
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => copyCredentials(w)}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                            title="Copy credentials"
                          >
                            {copiedId === w.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                          <button
                            onClick={() => shareViaWhatsApp(w)}
                            className="p-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-900/70 text-emerald-300 cursor-pointer"
                            title="Share WhatsApp"
                          >
                            <Share2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
