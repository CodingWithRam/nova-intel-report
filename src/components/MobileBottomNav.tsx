import React from 'react';
import { Home, Sparkles, Wrench, Smartphone, ShieldCheck } from 'lucide-react';

interface MobileBottomNavProps {
  activeView: string;
  onNavigate: (view: string, sub?: string) => void;
  onOpenInstallModal: () => void;
  isSuperAdmin?: boolean;
}

export default function MobileBottomNav({
  activeView,
  onNavigate,
  onOpenInstallModal,
  isSuperAdmin
}: MobileBottomNavProps) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-zinc-200/80 dark:border-zinc-800/80 px-2 py-2 flex items-center justify-around shadow-2xl safe-area-bottom">
      <button
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition cursor-pointer ${
          activeView === 'home'
            ? 'text-indigo-600 dark:text-indigo-400 font-bold'
            : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
        }`}
      >
        <Home className="w-4 h-4" />
        <span className="text-[10px] mt-0.5">Home</span>
      </button>

      <button
        onClick={() => onNavigate('aistudio')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition cursor-pointer relative ${
          activeView === 'aistudio'
            ? 'text-pink-600 dark:text-pink-400 font-bold'
            : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
        }`}
      >
        <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
        <span className="text-[10px] mt-0.5">11 AI Studio</span>
        <span className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-pink-500" />
      </button>

      <button
        onClick={() => onNavigate('tools')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition cursor-pointer ${
          activeView === 'tools'
            ? 'text-indigo-600 dark:text-indigo-400 font-bold'
            : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
        }`}
      >
        <Wrench className="w-4 h-4" />
        <span className="text-[10px] mt-0.5">Tools</span>
      </button>

      <button
        onClick={onOpenInstallModal}
        className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition cursor-pointer text-indigo-600 dark:text-indigo-400 font-bold"
      >
        <Smartphone className="w-4 h-4" />
        <span className="text-[10px] mt-0.5">Install App</span>
      </button>

      <button
        onClick={() => onNavigate('admin')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition cursor-pointer ${
          activeView === 'admin'
            ? 'text-indigo-600 dark:text-indigo-400 font-bold'
            : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
        }`}
      >
        <ShieldCheck className="w-4 h-4" />
        <span className="text-[10px] mt-0.5">{isSuperAdmin ? 'Chief' : 'Admin'}</span>
      </button>
    </div>
  );
}
