import React, { useState, useEffect } from 'react';
import {
  X, Shield, User, Mail, Lock, CheckCircle, ArrowRight, Sparkles,
  AlertCircle, Phone, Key, Smartphone, Send, Eye, EyeOff, Check, RefreshCw
} from 'lucide-react';
import { AuthUser } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onAuthSuccess: (user: AuthUser) => void;
  initialMode?: 'signin' | 'signup';
}

export default function AuthModal({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
  initialMode = 'signin'
}: AuthModalProps) {
  const [tab, setTab] = useState<'signin' | 'signup'>(initialMode);
  
  // Login method: 'password' or 'otp'
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  
  // Form fields
  const [identifier, setIdentifier] = useState(''); // Mobile or Email
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // OTP state
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [sentOtpPreview, setSentOtpPreview] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  
  // Signup fields
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupDepartment, setSignupDepartment] = useState('');
  const [signupInstitution, setSignupInstitution] = useState('');
  
  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialMode) setTab(initialMode);
  }, [initialMode, isOpen]);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: any;
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  if (!isOpen) return null;

  // 1. Dispatch OTP to Phone or Email
  const handleSendOtp = async () => {
    const target = identifier.trim();
    if (!target) {
      setError('Please enter your Mobile Number or Email address first.');
      return;
    }

    setIsSendingOtp(true);
    setError(null);
    try {
      const isEmail = target.includes('@');
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target,
          type: isEmail ? 'email' : 'phone',
          purpose: tab === 'signin' ? 'login' : 'signup'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');

      setOtpSent(true);
      setOtpTimer(60);
      setSentOtpPreview(data.otpCode || null);
      setSuccessMsg(data.message || `OTP sent to ${target}`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Could not send OTP');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // 2. Verify OTP Login
  const handleVerifyOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: identifier.trim(),
          otp: otpCode.trim(),
          purpose: 'login'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid OTP');

      setSuccessMsg(data.message || `Welcome back, ${data.user.name}!`);
      setTimeout(() => {
        onAuthSuccess(data.user);
        onClose();
      }, 500);
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  // 3. Password Login (Supports Mobile or Email)
  const handlePasswordLogin = async (e?: React.FormEvent, customTarget?: string, customPass?: string) => {
    if (e) e.preventDefault();
    const target = (customTarget || identifier).trim();
    const pass = customPass || password;

    if (!target) {
      setError('Please enter your Mobile Number or Email address.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: target,
          password: pass || undefined
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      setSuccessMsg(data.message || `Welcome back, ${data.user.name}!`);
      setTimeout(() => {
        onAuthSuccess(data.user);
        onClose();
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // 4. Register with Full Details & Password
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!signupEmail.trim() && !signupPhone.trim()) {
      setError('Please provide at least a Mobile Number or an Email address');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupName.trim(),
          email: signupEmail.trim() || undefined,
          phone: signupPhone.trim() || undefined,
          password: signupPassword.trim() || undefined,
          department: signupDepartment.trim() || 'Engineering Department',
          institution: signupInstitution.trim() || 'Engineering College',
          authProvider: signupPhone ? 'phone' : 'email'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      setSuccessMsg(data.message || 'Account created successfully!');
      setTimeout(() => {
        onAuthSuccess(data.user);
        onClose();
      }, 600);
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  // 5. Social Login (Google & Facebook)
  const handleSocialAuth = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    setError(null);
    try {
      // Simulate OAuth response with standard profile
      const email = provider === 'google' ? 'rammilan.kumar7678@gmail.com' : 'ramsakal.fb@nova.edu';
      const name = 'RAM SAKAL';
      
      const res = await fetch('/api/auth/oauth-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          email,
          name,
          avatar: provider === 'google' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' : undefined
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `${provider} login failed`);

      setSuccessMsg(`Signed in with ${provider === 'google' ? 'Google' : 'Facebook'}!`);
      setTimeout(() => {
        onAuthSuccess(data.user);
        onClose();
      }, 500);
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${provider}`);
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-Click login helper
  const quickLoginAs = (target: string, pass: string) => {
    setIdentifier(target);
    setPassword(pass);
    handlePasswordLogin(undefined, target, pass);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl text-zinc-800 dark:text-zinc-100 custom-scrollbar">
        
        {/* Header Bar */}
        <div className="relative p-5 pb-4 bg-gradient-to-r from-indigo-950 via-zinc-900 to-indigo-900 border-b border-zinc-200 dark:border-zinc-800 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center space-x-2">
                <span>Nova Intel Security Access</span>
              </h2>
              <p className="text-xs text-indigo-200/80">
                Super Admin, Faculty & Student Authentication
              </p>
            </div>
          </div>

          {/* Tab Switcher: Sign In vs Sign Up */}
          <div className="flex mt-4 p-1 bg-black/30 rounded-xl border border-white/10">
            <button
              onClick={() => { setTab('signin'); setError(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                tab === 'signin'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sign In (लॉगिन करें)
            </button>
            <button
              onClick={() => { setTab('signup'); setError(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                tab === 'signup'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sign Up (नया खाता बनाएं)
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4">
          
          {/* Notifications */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-start space-x-2.5">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Social Sign In Buttons: Google & Facebook */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              {tab === 'signin' ? 'Continue With Social Account' : 'Sign Up With Social Account'}
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {/* Google Button */}
              <button
                type="button"
                onClick={() => handleSocialAuth('google')}
                disabled={loading}
                className="py-2.5 px-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-750 transition-colors flex items-center justify-center space-x-2 text-xs font-bold text-zinc-800 dark:text-zinc-100 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google</span>
              </button>

              {/* Facebook Button */}
              <button
                type="button"
                onClick={() => handleSocialAuth('facebook')}
                disabled={loading}
                className="py-2.5 px-3 rounded-xl border border-blue-600/30 bg-blue-600/10 hover:bg-blue-600/20 transition-colors flex items-center justify-center space-x-2 text-xs font-bold text-blue-700 dark:text-blue-400 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex-1 h-px bg-zinc-200 dark:border-zinc-800"></div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase">Or Continue With</span>
            <div className="flex-1 h-px bg-zinc-200 dark:border-zinc-800"></div>
          </div>

          {/* TAB 1: SIGN IN */}
          {tab === 'signin' ? (
            <div className="space-y-4">
              
              {/* Dual Option Switcher: Password vs OTP */}
              <div className="p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center text-xs font-bold">
                <button
                  type="button"
                  onClick={() => { setLoginMethod('password'); setError(null); }}
                  className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                    loginMethod === 'password'
                      ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Login with Password</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginMethod('otp'); setError(null); }}
                  className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                    loginMethod === 'otp'
                      ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Login with OTP (ओटीपी)</span>
                </button>
              </div>

              {/* Identifier Input: Mobile or Email */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Mobile Number or Email Address (मोबाइल नंबर या ईमेल)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. 7678829509 or rammilan.kumar7678@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs md:text-sm text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <p className="text-[10px] text-zinc-400 mt-1">
                  Enter your 10-digit mobile number or registered email address.
                </p>
              </div>

              {/* OPTION A: PASSWORD LOGIN */}
              {loginMethod === 'password' && (
                <form onSubmit={handlePasswordLogin} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Password (पासवर्ड)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-9 pr-10 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs md:text-sm text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <span>{loading ? 'Authenticating...' : 'Sign In with Password'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setLoginMethod('otp')}
                      className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      Don't remember password? Log in with OTP instead &rarr;
                    </button>
                  </div>
                </form>
              )}

              {/* OPTION B: OTP LOGIN */}
              {loginMethod === 'otp' && (
                <form onSubmit={handleVerifyOtpLogin} className="space-y-3.5">
                  {!otpSent ? (
                    <div>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isSendingOtp || !identifier.trim()}
                        className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                        <span>{isSendingOtp ? 'Generating & Sending OTP...' : 'Send 6-Digit OTP (ओटीपी भेजें)'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                            Enter 6-Digit OTP Code
                          </label>
                          {otpTimer > 0 ? (
                            <span className="text-[10px] font-mono font-bold text-indigo-500">
                              Resend in {otpTimer}s
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              className="text-[10px] font-bold text-indigo-500 hover:underline flex items-center space-x-1"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Resend OTP</span>
                            </button>
                          )}
                        </div>

                        <div className="relative">
                          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400">
                            <Key className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            maxLength={6}
                            required
                            autoFocus
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                            placeholder="Enter 6-digit code (e.g. 753216)"
                            className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-indigo-500 rounded-xl text-base font-mono tracking-widest text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 text-center"
                          />
                        </div>

                        {/* Test helper preview banner */}
                        {sentOtpPreview && (
                          <div
                            onClick={() => setOtpCode(sentOtpPreview)}
                            className="mt-2 p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between text-xs cursor-pointer hover:bg-indigo-100 transition-colors"
                          >
                            <span className="text-indigo-800 dark:text-indigo-300 font-medium">
                              Live OTP Code: <strong className="font-mono font-bold text-sm">{sentOtpPreview}</strong>
                            </span>
                            <span className="text-[10px] font-bold text-indigo-600 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded shadow-xs">
                              Click to Auto-fill
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={loading || otpCode.length < 6}
                        className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        <span>{loading ? 'Verifying OTP...' : 'Verify OTP & Sign In'}</span>
                      </button>
                    </div>
                  )}
                </form>
              )}

              {/* Quick 1-Click Access Demo Profiles */}
              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Quick Access Demo Credentials
                </div>

                {/* Super Admin */}
                <button
                  type="button"
                  onClick={() => quickLoginAs('rammilan.kumar7678@gmail.com', 'password7678')}
                  className="w-full p-2.5 rounded-xl border border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/20 text-left transition-colors flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      👑
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-white flex items-center space-x-1.5">
                        <span>RAM SAKAL</span>
                        <span className="bg-indigo-600 text-white text-[9px] px-1.5 py-0.2 rounded font-black">SUPER ADMIN</span>
                      </div>
                      <div className="text-[10px] text-indigo-400">+91 7678829509 • rammilan.kumar7678@gmail.com</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-500 group-hover:underline">1-Click Sign In &rarr;</span>
                </button>
              </div>

            </div>
          ) : (
            /* TAB 2: SIGN UP */
            <form onSubmit={handleSignUp} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Full Name (पूरा नाम) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. RAM SAKAL"
                    className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs md:text-sm text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Mobile Number (मोबाइल) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs md:text-sm text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Email Address (ईमेल) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="user@institute.edu"
                      className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs md:text-sm text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Create Password (पासवर्ड बनाएं)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full pl-9 pr-10 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs md:text-sm text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={signupDepartment}
                    onChange={(e) => setSignupDepartment(e.target.value)}
                    placeholder="Computer Science"
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Institution / University
                  </label>
                  <input
                    type="text"
                    value={signupInstitution}
                    onChange={(e) => setSignupInstitution(e.target.value)}
                    placeholder="IIT / NIT / University"
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? 'Creating Account...' : 'Register Account (खाता बनाएं)'}</span>
                <Sparkles className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-zinc-400 text-center pt-1">
                You can subsequently sign in using either your Password or via Mobile OTP anytime!
              </p>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
