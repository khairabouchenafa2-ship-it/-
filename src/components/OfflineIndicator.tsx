import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-2xl bg-amber-600 px-4 py-2 text-xs font-black text-white shadow-xl border-2 border-amber-300 print:hidden animate-fadeIn">
      <WifiOff size={15} className="flex-shrink-0" />
      <span>وَضْعُ عَدَمِ الِاتِّصَالِ — التَّطْبِيقُ يَعْمَلُ بِالبَيَانَاتِ المَحْفُوظَةِ</span>
    </div>
  );
};
