import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  KeyRound,
  Lock,
  Smartphone,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  X,
  UserCheck,
  Zap,
  HelpCircle
} from 'lucide-react';
import { User } from '../types';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  onOpenApplyModal?: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenApplyModal
}) => {
  // Tab: 'super_admin' | 'reset_password' | 'co_admin'
  const [activeTab, setActiveTab] = useState<'super_admin' | 'reset_password' | 'co_admin'>('super_admin');
  
  // Super Admin Credentials
  const [adminIdentifier, setAdminIdentifier] = useState('rammilan.kumar7678@gmail.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authMethod, setAuthMethod] = useState<'password' | 'pin' | 'otp'>('pin');

  // OTP Login & Reset State
  const [otpTarget, setOtpTarget] = useState('7678829509');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [previewOtp, setPreviewOtp] = useState<string | null>(null);

  // Password Reset Specific
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Co-Admin Credentials
  const [coAdminIdentifier, setCoAdminIdentifier] = useState('');
  const [coAdminPassword, setCoAdminPassword] = useState('');

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Send OTP handler
  const handleSendOtp = async (targetVal: string, purpose: 'login' | 'reset_password') => {
    if (!targetVal.trim()) {
      setError('कृपया मोबाइल नंबर या ईमेल आईडी दर्ज करें (Please enter mobile or email).');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const isEmail = targetVal.includes('@');
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: targetVal.trim(),
          type: isEmail ? 'email' : 'phone',
          purpose
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'ओटीपी भेजने में विफल');

      setOtpSent(true);
      setPreviewOtp(data.otpCode || '123456');
      setOtpCode(data.otpCode || '');
      setSuccessMessage(`ओटीपी सफलतापूर्वक भेजा गया (${data.message || 'OTP sent'})`);
      setCountdown(60);

      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'OTP send failed');
    } finally {
      setLoading(false);
    }
  };

  // 1. Super Admin PIN Login
  const handlePinLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPin.trim()) {
      setError('कृपया 4-अंकों का मास्टर सिक्योरिटी पिन दर्ज करें (Please enter Master PIN).');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/admin/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: adminPin.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'अमान्य सुरक्षा पिन');

      const user: User = {
        ...data.user,
        name: data.user.name || 'RAM SAKAL',
        role: 'super_admin'
      };
      onLoginSuccess(user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'PIN verification failed');
    } finally {
      setLoading(false);
    }
  };

  // 2. Super Admin / Co-Admin Password Login
  const handlePasswordLogin = async (identifierVal: string, passwordVal: string) => {
    if (!identifierVal.trim() || !passwordVal.trim()) {
      setError('कृपया मोबाइल/ईमेल और पासवर्ड दोनों दर्ज करें (Please enter identifier and password).');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifierVal.trim(),
          password: passwordVal.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'लॉगिन विफल हुआ');

      onLoginSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // 3. OTP Login
  const handleVerifyOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpTarget.trim() || !otpCode.trim()) {
      setError('कृपया 6-अंकों का ओटीपी दर्ज करें (Please enter 6-digit OTP).');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: otpTarget.trim(),
          otp: otpCode.trim(),
          name: 'RAM SAKAL'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'ओटीपी सत्यापन विफल');

      onLoginSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  // 4. Reset Password via OTP
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpTarget.trim()) {
      setError('कृपया मोबाइल नंबर या ईमेल आईडी दर्ज करें');
      return;
    }
    if (!otpCode.trim()) {
      setError('कृपया 6-अंकों का ओटीपी दर्ज करें');
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      setError('नया पासवर्ड कम से कम 4 अक्षरों का होना चाहिए (Password must be at least 4 characters)');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('दोनों पासवर्ड मेल नहीं खाते (Passwords do not match)');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: otpTarget.trim(),
          otp: otpCode.trim(),
          newPassword: newPassword.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'पासवर्ड रिसेट विफल');

      setSuccessMessage('पासवर्ड सफलतापूर्वक बदल दिया गया है! आप स्वतः लॉगिन हो रहे हैं...');
      setTimeout(() => {
        onLoginSuccess(data.user);
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        className="relative w-full max-w-xl bg-zinc-950 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden text-zinc-100 my-8"
      >
        {/* Top Header Banner */}
        <div className="relative p-6 bg-gradient-to-r from-amber-950/60 via-zinc-900 to-indigo-950/60 border-b border-zinc-800">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-black flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/20">
              <Shield className="w-6 h-6 text-zinc-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black tracking-wider text-white">RAM SAKAL</h2>
                <span className="bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                  SUPER ADMIN PORTAL
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                सर्वोच्च प्रशासनिक टर्मिनल एवं को-एडमिन अधिकृत एक्सेस
              </p>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="mt-5 grid grid-cols-3 gap-1.5 p-1 bg-zinc-900/90 rounded-xl border border-zinc-800 text-xs font-semibold">
            <button
              onClick={() => {
                setActiveTab('super_admin');
                setError(null);
                setSuccessMessage(null);
              }}
              className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                activeTab === 'super_admin'
                  ? 'bg-amber-500 text-black font-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>सुपर एडमिन</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('reset_password');
                setError(null);
                setSuccessMessage(null);
                setOtpSent(false);
              }}
              className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                activeTab === 'reset_password'
                  ? 'bg-amber-500 text-black font-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>ओटीपी रिसेट</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('co_admin');
                setError(null);
                setSuccessMessage(null);
              }}
              className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                activeTab === 'co_admin'
                  ? 'bg-amber-500 text-black font-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>को-एडमिन लॉगिन</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Error & Success Feedback Alerts */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>{successMessage}</div>
            </div>
          )}

          {/* 1. SUPER ADMIN TAB */}
          {activeTab === 'super_admin' && (
            <div className="space-y-4">
              {/* Method toggles */}
              <div className="flex items-center justify-between text-xs border-b border-zinc-800 pb-3">
                <span className="text-zinc-400">लॉगिन का माध्यम चुनें:</span>
                <div className="flex space-x-1">
                  <button
                    type="button"
                    onClick={() => setAuthMethod('pin')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      authMethod === 'pin'
                        ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    मास्टर पिन (7678)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMethod('password')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      authMethod === 'password'
                        ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    पासवर्ड लॉगिन
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMethod('otp')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      authMethod === 'otp'
                        ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    ओटीपी (OTP)
                  </button>
                </div>
              </div>

              {/* Method A: Master PIN */}
              {authMethod === 'pin' && (
                <form onSubmit={handlePinLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      सुपर एडमिन मास्टर सिक्योरिटी पिन (Master Security PIN)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={adminPin}
                        onChange={e => setAdminPin(e.target.value)}
                        placeholder="डिफ़ॉल्ट सिक्योरिटी पिन: 7678"
                        className="w-full pl-10 pr-12 py-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm font-mono tracking-wider text-white"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-center justify-between">
                    <span>त्वरित सत्यापन पिन: <strong className="font-mono text-amber-400">7678</strong></span>
                    <button
                      type="button"
                      onClick={() => setAdminPin('7678')}
                      className="px-2.5 py-1 bg-amber-500 text-black font-black text-[11px] rounded-lg hover:bg-amber-400 transition-colors"
                    >
                      ऑटो-भरें (Auto-Fill)
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-sm tracking-wide transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>सुपर एडमिन टर्मिनल अनलॉक करें (Unlock Terminal)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Method B: Mobile / Email + Password */}
              {authMethod === 'password' && (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handlePasswordLogin(adminIdentifier, adminPassword);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      रजिस्टर्ड मोबाइल नंबर या ईमेल आईडी (Registered Mobile or Email)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={adminIdentifier}
                        onChange={e => setAdminIdentifier(e.target.value)}
                        placeholder="7678829509 या rammilan.kumar7678@gmail.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm text-white"
                      />
                    </div>
                    <div className="flex gap-2 mt-1.5 text-[11px] text-zinc-400">
                      <span>क्विक सेलेक्ट:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setAdminIdentifier('7678829509');
                          setAdminPassword('password7678');
                        }}
                        className="text-amber-400 hover:underline font-mono"
                      >
                        Mobile (+91 7678829509)
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => {
                          setAdminIdentifier('rammilan.kumar7678@gmail.com');
                          setAdminPassword('password7678');
                        }}
                        className="text-amber-400 hover:underline font-mono"
                      >
                        Email
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-zinc-300">
                        पासवर्ड (Password)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('reset_password');
                          setError(null);
                        }}
                        className="text-[11px] text-amber-400 hover:underline"
                      >
                        पासवर्ड भूल गए? ओटीपी से रिसेट करें
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={adminPassword}
                        onChange={e => setAdminPassword(e.target.value)}
                        placeholder="पासवर्ड दर्ज करें (उदा. password7678)"
                        className="w-full pl-10 pr-12 py-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm tracking-wide transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>लॉगिन करें (Sign In as RAM SAKAL)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Method C: OTP Verification */}
              {authMethod === 'otp' && (
                <form onSubmit={handleVerifyOtpLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      मोबाइल नंबर या ईमेल आईडी (Mobile Number or Email)
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Smartphone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={otpTarget}
                          onChange={e => setOtpTarget(e.target.value)}
                          placeholder="7678829509 या rammilan.kumar7678@gmail.com"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-amber-500 text-sm text-white"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSendOtp(otpTarget, 'login')}
                        disabled={loading || countdown > 0}
                        className="px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-400 border border-zinc-700 text-xs font-bold whitespace-nowrap cursor-pointer disabled:opacity-50"
                      >
                        {countdown > 0 ? `${countdown}s` : 'ओटीपी भेजें'}
                      </button>
                    </div>
                  </div>

                  {otpSent && previewOtp && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
                      <span>प्राप्त 6-अंकों का ओटीपी: <strong className="font-mono text-sm text-emerald-200">{previewOtp}</strong></span>
                      <button
                        type="button"
                        onClick={() => setOtpCode(previewOtp)}
                        className="px-2.5 py-1 bg-emerald-600 text-white rounded font-bold text-[11px]"
                      >
                        ऑटो-भरें
                      </button>
                    </div>
                  )}

                  {otpSent && (
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        6-अंकों का ओटीपी कोड दर्ज करें (Enter 6-Digit OTP)
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={e => setOtpCode(e.target.value)}
                        placeholder="123456"
                        className="w-full py-3 px-4 text-center font-mono text-lg tracking-[0.5em] rounded-xl bg-zinc-900 border border-zinc-700 focus:border-amber-500 text-white"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !otpSent}
                    className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm tracking-wide transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>ओटीपी सत्यापित कर लॉगिन करें (Verify & Login)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* 2. RESET PASSWORD TAB */}
          {activeTab === 'reset_password' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start space-x-2.5">
                <RefreshCw className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-300">पासवर्ड रीसेट सिस्टम (OTP Based Reset)</div>
                  <div className="text-zinc-400 mt-0.5">
                    यदि आप पासवर्ड भूल गए हैं, तो अपने प्राथमिक रजिस्टर्ड मोबाइल (+91 7678829509) या ईमेल पर ओटीपी प्राप्त कर तुरंत नया पासवर्ड बना सकते हैं।
                  </div>
                </div>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    रजिस्टर्ड मोबाइल नंबर या ईमेल (Mobile Number or Email)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={otpTarget}
                      onChange={e => setOtpTarget(e.target.value)}
                      placeholder="7678829509 या rammilan.kumar7678@gmail.com"
                      className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-amber-500 text-sm text-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleSendOtp(otpTarget, 'reset_password')}
                      disabled={loading || countdown > 0}
                      className="px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black whitespace-nowrap cursor-pointer disabled:opacity-50"
                    >
                      {countdown > 0 ? `${countdown}s` : 'ओटीपी कोड भेजें'}
                    </button>
                  </div>
                </div>

                {otpSent && previewOtp && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
                    <span>रिसेट सत्यापन कोड: <strong className="font-mono text-sm text-emerald-200">{previewOtp}</strong></span>
                    <button
                      type="button"
                      onClick={() => setOtpCode(previewOtp)}
                      className="px-2.5 py-1 bg-emerald-600 text-white rounded font-bold text-[11px]"
                    >
                      ऑटो-भरें
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    प्राप्त 6-अंकों का ओटीपी दर्ज करें (Enter 6-Digit OTP)
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full py-2.5 px-4 font-mono text-center tracking-[0.4em] rounded-xl bg-zinc-900 border border-zinc-700 focus:border-amber-500 text-white text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      नया पासवर्ड (New Password)
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="नया पासवर्ड दर्ज करें"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-amber-500 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      पासवर्ड की पुष्टि करें (Confirm)
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="पासवर्ड दोबारा दर्ज करें"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-amber-500 text-sm text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-black text-sm tracking-wide transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>पासवर्ड अपडेट करें एवं लॉगिन करें (Reset & Sign In)</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* 3. CO-ADMIN TAB */}
          {activeTab === 'co_admin' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-200 flex items-start space-x-2.5">
                <UserCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-indigo-300">को-एडमिन अधिकृत लॉगिन (Co-Admin Access)</div>
                  <div className="text-zinc-400 mt-0.5">
                    केवल सुपर एडमिन <strong>RAM SAKAL</strong> द्वारा नियुक्त किए गए स्टाफ सदस्य ही अपनी दी गई आईडी और पासवर्ड/ओटीपी से लॉगिन कर सकते हैं।
                  </div>
                </div>
              </div>

              <form
                onSubmit={e => {
                  e.preventDefault();
                  handlePasswordLogin(coAdminIdentifier, coAdminPassword);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    लॉगिन आईडी, ईमेल या मोबाइल (Login ID, Email or Mobile)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={coAdminIdentifier}
                      onChange={e => setCoAdminIdentifier(e.target.value)}
                      placeholder="आईडी (उदा. COADM-4912, WRK-1084) या ईमेल या मोबाइल"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-indigo-500 text-sm text-white font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    पासवर्ड (Password)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={coAdminPassword}
                      onChange={e => setCoAdminPassword(e.target.value)}
                      placeholder="को-एडमिन पासवर्ड दर्ज करें"
                      className="w-full pl-10 pr-12 py-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-indigo-500 text-sm text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>को-एडमिन लॉगिन (Sign In)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOtpTarget(coAdminIdentifier || '');
                      setActiveTab('reset_password');
                    }}
                    className="px-4 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
                  >
                    ओटीपी लॉगिन
                  </button>
                </div>

                {onOpenApplyModal && (
                  <div className="pt-2 text-center border-t border-zinc-850">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenApplyModal();
                      }}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline cursor-pointer inline-flex items-center space-x-1.5"
                    >
                      <span>📝 को-एडमिन / स्टाफ बनने के लिए नया आवेदन करें (Apply as Co-Admin)</span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Quick Info Footer */}
          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
            <span className="flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              <span>Super Admin Authority: <strong>RAM SAKAL</strong></span>
            </span>
            <span>256-Bit Encrypted Audit Logged</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
