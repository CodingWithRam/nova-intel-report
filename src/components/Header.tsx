import React, { useState, useEffect, useRef } from 'react';
import { Search, Flame, Sun, Moon, Globe, BookMarked, User, Menu, X, BookOpen, Compass, Trophy, ShieldCheck, LogIn, LogOut, Eye, EyeOff, Edit3, Check, ChevronDown, Sparkles, Key, Smartphone, Wand2 } from 'lucide-react';
import { UserProfile, Bookmark, AuthUser } from '../types';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  language: string;
  setLanguage: (val: string) => void;
  user: UserProfile;
  currentUser: AuthUser | null;
  bookmarks: Bookmark[];
  onNavigate: (view: string, sub?: string) => void;
  onSearch: (query: string) => void;
  onOpenAuthModal: () => void;
  onOpenAdminAuthModal?: () => void;
  onOpenInstallModal?: () => void;
  onOpenApplyModal?: () => void;
  onSignOut?: () => void;
  onUpdateSuperAdminProfile?: (user: AuthUser) => void;
}

export default function Header({
  darkMode,
  setDarkMode,
  language,
  setLanguage,
  user,
  currentUser,
  bookmarks,
  onNavigate,
  onSearch,
  onOpenAuthModal,
  onOpenAdminAuthModal,
  onOpenInstallModal,
  onOpenApplyModal,
  onSignOut,
  onUpdateSuperAdminProfile
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newNameInput, setNewNameInput] = useState(currentUser?.name || 'RAM SAKAL');
  const [isSavingName, setIsSavingName] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentUser) {
      setNewNameInput(currentUser.name);
    }
  }, [currentUser]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
        setIsEditingName(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isSuperAdmin = currentUser?.role === 'super_admin' || currentUser?.email === 'rammilan.kumar7678@gmail.com' || currentUser?.phone === '+91 7678829509' || currentUser?.phone === '7678829509';
  const isCoAdmin = currentUser?.role === 'co_admin';

  // Fast name updater directly from Header
  const handleQuickSaveName = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanName = newNameInput.trim();
    if (!cleanName || !currentUser) return;

    setIsSavingName(true);
    try {
      if (isSuperAdmin) {
        const res = await fetch('/api/admin/super-admin/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: cleanName,
            isNameVisible: currentUser.isNameVisible !== false,
            publicTitle: currentUser.publicTitle || 'Chief Administrator',
            department: currentUser.department || 'Executive Administration & Systems',
            institution: currentUser.institution || 'Nova Intel HQ'
          })
        });
        const data = await res.json();
        if (res.ok && data.user && onUpdateSuperAdminProfile) {
          onUpdateSuperAdminProfile(data.user);
        }
      } else {
        const updated: AuthUser = { ...currentUser, name: cleanName };
        if (onUpdateSuperAdminProfile) {
          onUpdateSuperAdminProfile(updated);
        }
      }
      setIsEditingName(false);
    } catch (err) {
      console.error('Error updating name:', err);
    } finally {
      setIsSavingName(false);
    }
  };

  // Fast toggle visibility
  const handleToggleVisibility = async () => {
    if (!currentUser || !isSuperAdmin) return;
    const nextVis = currentUser.isNameVisible === false;
    try {
      const res = await fetch('/api/admin/super-admin/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: currentUser.name,
          isNameVisible: nextVis,
          publicTitle: currentUser.publicTitle || 'Chief Administrator'
        })
      });
      const data = await res.json();
      if (res.ok && data.user && onUpdateSuperAdminProfile) {
        onUpdateSuperAdminProfile(data.user);
      }
    } catch (err) {
      console.error('Error toggling visibility:', err);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      onNavigate('search');
    }
  };

  const selectLanguage = (code: string) => {
    setLanguage(code);
    setLangDropdownOpen(false);
  };

  const getLangName = (code: string) => {
    const names: { [key: string]: string } = {
      en: 'English',
      hi: 'हिन्दी (Hindi)',
      hinglish: 'Hinglish'
    };
    return names[code] || 'English';
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200/50 dark:border-zinc-800/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2.5 group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
            >
              <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:rotate-6 transition-transform">
                <Compass className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="text-left">
                <span className="block font-black text-lg text-zinc-900 dark:text-white tracking-tight leading-none">
                  NOVA
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                  Intel Report
                </span>
              </div>
            </button>
          </div>

          {/* Core Search Engine Input Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 100+ courses, interview prep, quizzes..."
              className="w-full pl-9 pr-4 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-xl text-xs md:text-sm text-zinc-800 dark:text-zinc-200 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white dark:focus:bg-zinc-950 transition-all placeholder:text-zinc-400"
            />
          </form>

          {/* Desktop Right items */}
          <div className="hidden lg:flex items-center space-x-3 text-zinc-600 dark:text-zinc-300">
            
            {/* Quick navigators */}
            <nav className="flex items-center space-x-1.5 text-xs font-bold mr-2">
              <button onClick={() => onNavigate('home')} className="px-3 py-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</button>
              
              {/* 11 AI Features Studio Link */}
              <button
                onClick={() => onNavigate('aistudio')}
                className="px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition-all cursor-pointer bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-pink-500/30 text-pink-600 dark:text-pink-400 hover:scale-[1.02]"
                title="11 AI Features: Veo 3, Lyria, Live Voice, Search, Maps, Science..."
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
                <span>AI Studio</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-pink-500 text-white uppercase tracking-wider">
                  11 AI
                </span>
              </button>

              <button onClick={() => onNavigate('dashboard')} className="px-3 py-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center space-x-1">
                <span>Dashboard</span>
              </button>
              <button onClick={() => onNavigate('tools')} className="px-3 py-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Tools</button>
              <button onClick={() => onNavigate('about')} className="px-3 py-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About</button>
              <button onClick={() => onNavigate('contact')} className="px-3 py-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact</button>

              {/* Install App Button */}
              {onOpenInstallModal && (
                <button
                  onClick={onOpenInstallModal}
                  className="px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition-all cursor-pointer bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 hover:bg-indigo-100"
                  title="Install Nova App on Device"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Install App</span>
                </button>
              )}

              {/* Admin Portal Button */}
              <button
                onClick={() => onNavigate('admin')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  isSuperAdmin
                    ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-md shadow-indigo-600/20'
                    : isCoAdmin
                    ? 'bg-pink-600 text-white shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 hover:bg-zinc-200 dark:hover:bg-zinc-750'
                }`}
                title="Admin Control & Surveillance Portal"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isSuperAdmin ? 'Chief Admin' : isCoAdmin ? 'Co-Admin' : 'Admin Portal'}</span>
              </button>
            </nav>

            {/* Streak count */}
            <div className="flex items-center space-x-1 text-pink-500 bg-pink-50 dark:bg-pink-950/20 px-2.5 py-1 rounded-full border border-pink-100/30 font-bold text-xs" title="Daily study streak!">
              <Flame className="w-4 h-4 fill-current" />
              <span>{user.streak} Days</span>
            </div>

            {/* Language switch */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                title="Change language"
              >
                <Globe className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg py-1 z-50 text-xs text-left text-zinc-700 dark:text-zinc-300 animate-fade-in">
                  <button onClick={() => selectLanguage('en')} className="w-full text-left px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-850">English</button>
                  <button onClick={() => selectLanguage('hi')} className="w-full text-left px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-850">हिन्दी (Hindi)</button>
                  <button onClick={() => selectLanguage('hinglish')} className="w-full text-left px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-850">Hinglish</button>
                </div>
              )}
            </div>

            {/* Light/Dark Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
              title="Toggle theme"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-yellow-500" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* User Profile / Dashboard trigger with Dropdown */}
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                {(() => {
                  const isNameVisible = currentUser.isNameVisible !== false;
                  const displayName = isSuperAdmin
                    ? (isNameVisible ? currentUser.name : 'Chief Admin (Stealth)')
                    : currentUser.name;
                  const displayRole = isSuperAdmin
                    ? (isNameVisible ? 'Super Admin' : 'Stealth Admin')
                    : currentUser.role.replace('_', ' ');

                  return (
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="p-1.5 pr-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-750 rounded-xl transition-colors cursor-pointer flex items-center space-x-2 border border-zinc-200/60 dark:border-zinc-700/60"
                      title={`Logged in as ${currentUser.name} (${currentUser.role})`}
                    >
                      <div className={`w-7 h-7 rounded-lg text-white flex items-center justify-center font-bold text-xs uppercase relative ${
                        isSuperAdmin ? 'bg-indigo-600' : isCoAdmin ? 'bg-pink-600' : 'bg-zinc-700'
                      }`}>
                        {currentUser.name ? currentUser.name.charAt(0) : 'A'}
                        {isSuperAdmin && (
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white dark:border-zinc-900 ${
                              isNameVisible ? 'bg-emerald-400' : 'bg-amber-400'
                            }`}
                            title={isNameVisible ? 'Publicly Visible' : 'Stealth Mode'}
                          />
                        )}
                      </div>
                      <div className="text-left hidden sm:block max-w-[130px] truncate">
                        <div className="text-[11px] font-bold text-zinc-900 dark:text-white leading-none truncate flex items-center space-x-1">
                          <span className="truncate">{displayName}</span>
                        </div>
                        <div className="text-[9px] font-black uppercase text-indigo-500 dark:text-indigo-400 mt-0.5">
                          {displayRole}
                        </div>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                  );
                })()}

                {/* User Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-3 z-50 text-xs space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
                    
                    {/* Header profile info */}
                    <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-lg text-white flex items-center justify-center font-bold text-sm ${
                          isSuperAdmin ? 'bg-indigo-600' : isCoAdmin ? 'bg-pink-600' : 'bg-zinc-700'
                        }`}>
                          {currentUser.name ? currentUser.name.charAt(0) : 'A'}
                        </div>
                        <div className="overflow-hidden flex-1">
                          <div className="font-bold text-zinc-900 dark:text-white truncate flex items-center space-x-1">
                            <span>{currentUser.name}</span>
                            {isSuperAdmin && <span className="text-[10px]" title="Chief Super Admin">👑</span>}
                          </div>
                          <div className="text-[10px] text-zinc-400 truncate">
                            {currentUser.email || currentUser.phone || 'Standard User'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Instant Name Editor */}
                    <div className="space-y-1.5 px-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                        <span>Display Name (नाम बदलें)</span>
                        {!isEditingName && (
                          <button
                            type="button"
                            onClick={() => setIsEditingName(true)}
                            className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1 cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        )}
                      </div>

                      {isEditingName ? (
                        <form onSubmit={handleQuickSaveName} className="space-y-2">
                          <input
                            type="text"
                            required
                            autoFocus
                            value={newNameInput}
                            onChange={(e) => setNewNameInput(e.target.value)}
                            placeholder="Enter full name"
                            className="w-full px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-indigo-500 rounded-lg text-xs text-zinc-900 dark:text-white outline-none"
                          />
                          <div className="flex items-center space-x-1.5">
                            <button
                              type="submit"
                              disabled={isSavingName || !newNameInput.trim()}
                              className="flex-1 py-1 px-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-bold flex items-center justify-center space-x-1 cursor-pointer disabled:opacity-50"
                            >
                              <Check className="w-3 h-3" />
                              <span>{isSavingName ? 'Saving...' : 'Save Name'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsEditingName(false);
                                setNewNameInput(currentUser.name);
                              }}
                              className="py-1 px-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-[11px] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/40 text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center justify-between">
                          <span className="truncate">{currentUser.name}</span>
                          <span className="text-[10px] text-zinc-400">Current</span>
                        </div>
                      )}
                    </div>

                    {/* Super Admin Visibility Toggle */}
                    {isSuperAdmin && (
                      <div className="px-1 pt-1 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                        <div className="text-[11px]">
                          <div className="font-bold text-zinc-800 dark:text-zinc-200">Public Visibility</div>
                          <div className="text-[10px] text-zinc-400">
                            {currentUser.isNameVisible !== false ? '🟢 Visible to all users' : '🔒 Stealth mode (hidden)'}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleToggleVisibility}
                          className={`p-1.5 rounded-lg border text-xs font-bold flex items-center space-x-1 cursor-pointer transition-all ${
                            currentUser.isNameVisible !== false
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400'
                              : 'bg-amber-50 text-amber-600 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400'
                          }`}
                          title="Toggle public visibility"
                        >
                          {currentUser.isNameVisible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>{currentUser.isNameVisible !== false ? 'Public' : 'Hidden'}</span>
                        </button>
                      </div>
                    )}

                    {/* Navigation Actions */}
                    <div className="space-y-1 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                      {(isSuperAdmin || isCoAdmin) && (
                        <button
                          type="button"
                          onClick={() => {
                            onNavigate('admin');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 font-bold flex items-center justify-between cursor-pointer"
                        >
                          <span className="flex items-center space-x-1.5">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Super Admin Portal</span>
                          </span>
                          <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-black">OPEN</span>
                        </button>
                      )}

                      {onOpenAdminAuthModal && (
                        <button
                          type="button"
                          onClick={() => {
                            onOpenAdminAuthModal();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold flex items-center justify-between cursor-pointer"
                        >
                          <span className="flex items-center space-x-1.5">
                            <Key className="w-3.5 h-3.5 text-amber-500" />
                            <span>सुपर एडमिन लॉगिन / रिसेट</span>
                          </span>
                          <span className="text-[10px] bg-amber-500 text-black px-1.5 py-0.2 rounded font-black">LOGIN</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          onNavigate('profile');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium flex items-center space-x-1.5 cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Student Profile & Progress</span>
                      </button>

                      {onSignOut && (
                        <button
                          type="button"
                          onClick={() => {
                            onSignOut();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 font-semibold flex items-center space-x-1.5 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out (लॉग आउट)</span>
                        </button>
                      )}
                    </div>

                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-3 py-1.5 rounded-xl border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors cursor-pointer flex items-center space-x-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile Right items (Menu trigger) */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-zinc-800 dark:text-zinc-200" /> : <Menu className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 space-y-4 shadow-lg animate-slide-down">
          
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subjects, questions..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm"
            />
          </form>

          <nav className="flex flex-col space-y-2.5 text-sm font-bold text-zinc-700 dark:text-zinc-300">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl"
            >
              Home
            </button>

            {/* Mobile 11 AI Features Button */}
            <button
              onClick={() => {
                onNavigate('aistudio');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-pink-500/30 text-pink-600 dark:text-pink-400 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
                <span>11 AI Features Studio</span>
              </div>
              <span className="text-[10px] bg-pink-500 text-white px-2 py-0.5 rounded font-black">
                Veo 3 • Lyria • Live Voice
              </span>
            </button>

            {/* Mobile Install App Button */}
            {onOpenInstallModal && (
              <button
                onClick={() => {
                  onOpenInstallModal();
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-indigo-500" />
                  <span>Install Nova App (PWA)</span>
                </div>
                <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded font-black">
                  100% OFFLINE
                </span>
              </button>
            )}

            <button
              onClick={() => {
                onNavigate('dashboard');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl flex justify-between items-center"
            >
              <span>Dashboard</span>
              <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">View</span>
            </button>
            <button
              onClick={() => {
                onNavigate('tools');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl"
            >
              Interactive Tools
            </button>
            <button
              onClick={() => {
                onNavigate('about');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl"
            >
              About
            </button>
            <button
              onClick={() => {
                onNavigate('contact');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl"
            >
              Contact
            </button>

            {/* Mobile Admin Portal Link */}
            <button
              onClick={() => {
                onNavigate('admin');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 bg-gradient-to-r from-indigo-600/10 to-pink-600/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Admin & Monitoring Portal</span>
              </div>
              <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded font-black">
                {isSuperAdmin ? 'SUPER ADMIN' : isCoAdmin ? 'CO-ADMIN' : 'ACCESS'}
              </span>
            </button>
          </nav>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs font-bold">
            <span className="text-zinc-500">Streak:</span>
            <span className="text-pink-500 bg-pink-50 dark:bg-pink-950/20 px-3 py-1 rounded-full">{user.streak} Days study</span>
          </div>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
            <div className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Preferred Language</div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <button onClick={() => { selectLanguage('en'); setMobileMenuOpen(false); }} className={`py-1.5 rounded-lg border ${language === 'en' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600' : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300'}`}>English</button>
              <button onClick={() => { selectLanguage('hi'); setMobileMenuOpen(false); }} className={`py-1.5 rounded-lg border ${language === 'hi' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600' : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300'}`}>हिन्दी</button>
              <button onClick={() => { selectLanguage('hinglish'); setMobileMenuOpen(false); }} className={`py-1.5 rounded-lg border ${language === 'hinglish' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600' : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300'}`}>Hinglish</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-2">
            <button
              onClick={() => {
                onNavigate('profile');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl flex items-center justify-center space-x-1"
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile</span>
            </button>
            {currentUser ? (
              <button
                onClick={() => {
                  if (onSignOut) onSignOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl flex items-center justify-center space-x-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenAuthModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center space-x-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
