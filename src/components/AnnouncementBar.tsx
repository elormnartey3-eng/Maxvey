import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AnnouncementBarProps {
  text?: string;
  enabled?: boolean;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  text = 'FREE SHIPPING IN LAGOS ON ORDERS OVER ₦75,000 · NATIONWIDE EXPRESS DISPATCH',
  enabled = true,
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (!enabled || dismissed) return null;

  return (
    <div className="bg-[#18181b] border-b border-[#27272a] text-zinc-300 text-xs py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 text-center font-medium tracking-wide truncate">
          <span className="text-[#dc2626] font-bold mr-1.5 font-mono">DROP 01</span>
          <span>{text}</span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-zinc-500 hover:text-white p-0.5 rounded transition-colors shrink-0"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
