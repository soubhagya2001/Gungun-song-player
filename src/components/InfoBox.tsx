import React from 'react';
import { Info } from 'lucide-react';

export function InfoBox() {
  return (
    <div className="relative group">
      <button className="p-2 rounded-full hover:bg-gray-100">
        <Info className="w-6 h-6 text-gray-600" />
      </button>
      
      <div className="absolute right-0 w-80 p-4 mt-2 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <h3 className="font-semibold text-gray-900 mb-2">How to use Gungun:</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Add songs by pasting YouTube URLs</li>
          <li>• Select genre and language for each song</li>
          <li>• Drag and drop to reorder your playlist</li>
          <li>• Use filters to find specific songs</li>
          <li>• Click play button on any song to start playing</li>
          <li>• Enable Live Play to sync music with others</li>
        </ul>
      </div>
    </div>
  );
}