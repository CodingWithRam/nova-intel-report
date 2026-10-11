import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  UserCheck,
  Send,
  X,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Mail,
  Smartphone,
  GraduationCap,
  Sparkles,
  Users
} from 'lucide-react';

interface CoAdminApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplicationSuccess?: () => void;
}

export default function CoAdminApplicationModal({
  isOpen,
  onClose,
  onApplicationSuccess
}: CoAdminApplicationModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [desiredRole, setDesiredRole] = useState<'co_admin' | 'worker'>('co_admin');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [institution, setInstitution] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || (!email.trim() && !phone.trim())) {
      setError('कृपया अपना पूरा नाम और ईमेल या मोबाइल नंबर दर्ज करें (Name and Email or Phone required).');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          desiredRole,
          department: department.trim(),
          institution: institution.trim(),
          qualifications: qualifications.trim(),
          reason: reason.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'आवेदन सबमिट करने में विफल');

      setIsSuccess(true);
      if (onApplicationSuccess) onApplicationSuccess();
    } catch (err: any) {
      setError(err.message || 'Submission failed. Please check network.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setName('');
    setEmail('');
    setPhone('');
    setQualifications('');
    setReason('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-xl bg-zinc-950 border border-indigo-500/30 rounded-3xl shadow-2xl overflow-hidden text-zinc-100 my-8"
      >
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-indigo-950/70 via-zinc-900 to-amber-950/60 border-b border-zinc-800">
          <button
            onClick={handleResetAndClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 font-black text-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black tracking-wide text-white uppercase">
                  Co-Admin & Worker Application
                </h2>
                <span className="bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  OFFICIAL PORTAL
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                सर्वोच्च प्रशासक RAM SAKAL को सह-प्रशासक या कार्यकर्ता पद हेतु आवेदन भेजें
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl font-black text-white">आवेदन सफलतापूर्वक प्राप्त हुआ!</h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                  आपका आवेदन सर्वोच्च प्रशासक <strong>RAM SAKAL (Chief Admin)</strong> के पास अंतिम अनुमोदन (Final Approval) हेतु भेज दिया गया है।
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 max-w-md mx-auto text-left space-y-2">
                <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>आगे क्या होगा (Next Steps):</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-zinc-400 text-[11px]">
                  <li>चीफ एडमिन आपके विवरण की समीक्षा करेंगे।</li>
                  <li>अनुमोदन होने पर आपको एक अद्वितीय <strong>ID</strong> और <strong>Password</strong> जारी किया जाएगा।</li>
                  <li>आप उस ID और पासवर्ड से सीधे एडमिन पैनल में लॉगिन करके कंटेंट अपलोड कर सकेंगे।</li>
                </ul>
              </div>
              <button
                onClick={handleResetAndClose}
                className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer shadow-lg shadow-indigo-600/30 transition-all"
              >
                समझ गया, विंडो बंद करें (Close)
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-2">
                  आप किस पद के लिए आवेदन कर रहे हैं? (Select Desired Role):
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDesiredRole('co_admin')}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                      desiredRole === 'co_admin'
                        ? 'border-indigo-500 bg-indigo-500/15 shadow-md shadow-indigo-500/10'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-xs text-white">Co-Admin (सह-प्रशासक)</span>
                      <ShieldCheck className={`w-4 h-4 ${desiredRole === 'co_admin' ? 'text-indigo-400' : 'text-zinc-600'}`} />
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-snug">
                      कोर्स, क्विज, और विभाग का प्रबंधन। उच्च विशेषाधिकार।
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDesiredRole('worker')}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                      desiredRole === 'worker'
                        ? 'border-purple-500 bg-purple-500/15 shadow-md shadow-purple-500/10'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-xs text-white">Worker / Staff (कार्यकर्ता)</span>
                      <Briefcase className={`w-4 h-4 ${desiredRole === 'worker' ? 'text-purple-400' : 'text-zinc-600'}`} />
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-snug">
                      स्टडी नोट्स, पीडीएफ, आर्टिकल्स और प्रश्न अपलोड करना।
                    </p>
                  </button>
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                    आपका पूरा नाम (Full Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                    ईमेल आईडी (Email Address) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. candidate@example.com"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                    मोबाइल नंबर (Phone / WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 9876543210"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                    संबंधित विभाग (Department / Specialty)
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Mechanical & Electrical Faculty">Mechanical & Electrical Faculty</option>
                    <option value="Competitive Exam (GATE / JEE / UPSC)">Competitive Exam (GATE / JEE / UPSC)</option>
                    <option value="Programming & Web Development">Programming & Web Development</option>
                    <option value="Science, AI & Research Unit">Science, AI & Research Unit</option>
                    <option value="General Curriculum & Study Material">General Curriculum & Study Material</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                  कॉलेज / संस्थान / पद (Institution or University)
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. IIT Delhi, NIT, Engineering Faculty"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                  योग्यता एवं अनुभव (Qualifications & Technical Skills)
                </label>
                <input
                  type="text"
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science, 3 yrs teaching experience, Python/React expert"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                  आप क्यों जुड़ना चाहते हैं? (Why do you want to join Nova?)
                </label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. I want to author quality course roadmaps, format quizzes, and assist students..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  रद्द करें (Cancel)
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center space-x-2 cursor-pointer disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? (
                    <span>सबमिट हो रहा है...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>आवेदन सबमिट करें (Submit Application)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
