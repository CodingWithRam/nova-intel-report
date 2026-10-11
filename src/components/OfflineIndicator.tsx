import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export default function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500 text-white px-4 py-2 text-xs font-bold shadow-xl animate-bounce">
      <WifiOff className="w-4 h-4" />
      <span>Offline Mode — Cached study content is active</span>
    </div>
  );
}
