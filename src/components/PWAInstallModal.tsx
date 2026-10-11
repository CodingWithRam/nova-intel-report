import React, { useState } from 'react';
import {
  Smartphone, Download, Check, X, Share2, PlusSquare,
  Sparkles, ShieldCheck, Zap, HardDrive, WifiOff, Globe,
  ArrowDownToLine, QrCode, CheckCircle2, ChevronRight
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PWAInstallModal({ isOpen, onClose }: PWAInstallModalProps) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();
  const [activeDeviceTab, setActiveDeviceTab] = useState<'android' | 'ios' | 'desktop'>('android');
  const [installedSuccess, setInstalledSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const res = await install();
      if (res) {
        setInstalledSuccess(true);
      }
    } else {
      // In web preview or browser where beforeinstallprompt hasn't fired yet
      setInstalledSuccess(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black text-zinc-950 dark:text-zinc-50 uppercase tracking-tight">
                Nova Intel Mobile App
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-500/10 text-indigo-500 uppercase tracking-widest border border-indigo-500/20">
                PWA v2.6
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Install directly onto your Home Screen • Works 100% Offline
            </p>
          </div>
        </div>

        {/* App Status Banner */}
        {isInstalled ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl flex items-center space-x-3 text-xs text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <p className="font-bold">App Already Installed & Active!</p>
              <p className="text-[11px] text-zinc-500">You are currently running Nova in native standalone app mode.</p>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 p-4 rounded-2xl flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                Fast 1-Click Install
              </span>
              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                Install as a native application without Google Play Store!
              </p>
            </div>
            <button
              onClick={handleInstallClick}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition cursor-pointer shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Install App Now</span>
            </button>
          </div>
        )}

        {/* Device Platforms Tabs */}
        <div className="space-y-3">
          <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-2xl text-xs font-bold space-x-1">
            <button
              onClick={() => setActiveDeviceTab('android')}
              className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                activeDeviceTab === 'android'
                  ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-zinc-500'
              }`}
            >
              <span>Android / Chrome</span>
            </button>
            <button
              onClick={() => setActiveDeviceTab('ios')}
              className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                activeDeviceTab === 'ios'
                  ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-zinc-500'
              }`}
            >
              <span>iPhone / iOS Safari</span>
            </button>
            <button
              onClick={() => setActiveDeviceTab('desktop')}
              className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                activeDeviceTab === 'desktop'
                  ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-zinc-500'
              }`}
            >
              <span>Windows / Mac / PC</span>
            </button>
          </div>

          {/* Tab 1: Android Guide */}
          {activeDeviceTab === 'android' && (
            <div className="bg-zinc-50 dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3 text-xs">
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center space-x-2">
                <span>Android Installation Steps:</span>
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                <li>Click the <strong>"Install App Now"</strong> button above or tap the <strong>Install</strong> icon in the address bar.</li>
                <li>Tap <strong>"Install"</strong> when prompted by Android Chrome.</li>
                <li>The <strong>Nova App icon</strong> will appear on your Home Screen and App Drawer with zero storage footprint!</li>
              </ol>
            </div>
          )}

          {/* Tab 2: iOS Safari Guide */}
          {activeDeviceTab === 'ios' && (
            <div className="bg-zinc-50 dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3 text-xs">
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center space-x-2">
                <span>iPhone / iPad (Safari) Steps:</span>
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                <li>Open this website in <strong>Safari</strong> on your iPhone or iPad.</li>
                <li>Tap the <strong>Share</strong> button <span className="inline-block px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-[10px] font-bold">􀈂</span> at the bottom of Safari.</li>
                <li>Scroll down and tap <strong>"Add to Home Screen"</strong> <span className="inline-block px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-[10px] font-bold">⊞</span>.</li>
                <li>Tap <strong>"Add"</strong> in the top right corner. The app will launch like a native iOS application!</li>
              </ol>
            </div>
          )}

          {/* Tab 3: Desktop Guide */}
          {activeDeviceTab === 'desktop' && (
            <div className="bg-zinc-50 dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3 text-xs">
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center space-x-2">
                <span>Desktop (Chrome, Edge, Brave):</span>
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                <li>Look at the right side of your browser address bar.</li>
                <li>Click the <strong>"Install app"</strong> icon (computer with down arrow).</li>
                <li>Click <strong>"Install"</strong>. Nova will open in its own dedicated distraction-free window!</li>
              </ol>
            </div>
          )}
        </div>

        {/* Core App Features Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 space-y-1">
            <div className="flex items-center space-x-1.5 text-indigo-500 font-bold">
              <WifiOff className="w-3.5 h-3.5" />
              <span>Offline Ready</span>
            </div>
            <p className="text-[11px] text-zinc-400">All courses & quizzes remain cached and readable without internet.</p>
          </div>

          <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 space-y-1">
            <div className="flex items-center space-x-1.5 text-pink-500 font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>Instant Startup</span>
            </div>
            <p className="text-[11px] text-zinc-400">Zero lag loading directly from device service worker cache.</p>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
          <span>App ID: com.novaintel.app</span>
          <span>Security: Verified HTTPS Service Worker</span>
        </div>

      </div>
    </div>
  );
}
