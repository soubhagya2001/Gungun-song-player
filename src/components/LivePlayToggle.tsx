import React from 'react';
import { Radio } from 'lucide-react';
import { usePlaylistStore } from '../store';

export function LivePlayToggle() {
  const { isLivePlay, setIsLivePlay } = usePlaylistStore();

  return (
    <button
      onClick={() => setIsLivePlay(!isLivePlay)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
        isLivePlay 
          ? 'bg-red-500 text-white hover:bg-red-600' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Radio className="w-4 h-4" />
      <span className="text-sm font-medium">Live Play</span>
    </button>
  );
}