import React, { useEffect, useState } from 'react';
import { Music, Heart } from 'lucide-react';
import { AddSongForm } from './components/AddSongForm';
import { Filters } from './components/Filters';
import { Playlist } from './components/Playlist';
import { Player } from './components/Player';
import { InfoBox } from './components/InfoBox';
import { LivePlayToggle } from './components/LivePlayToggle';
import { usePlaylistStore } from './store';

export default function App() {
  const [showWelcome, setShowWelcome] = useState(false);
  const { loadSongsFromStorage, startPeriodicSync } = usePlaylistStore();

  useEffect(() => {
    // Check if first visit
    const hasVisited = localStorage.getItem('hasVisitedGungun');
    if (!hasVisited) {
      setShowWelcome(true);
    }

    // Initial load
    loadSongsFromStorage();

    // Start periodic sync
    const cleanup = startPeriodicSync();

    return () => cleanup();
  }, [loadSongsFromStorage, startPeriodicSync]);

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    localStorage.setItem('hasVisitedGungun', 'true');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {showWelcome && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-4">Welcome to Gungun!</h2>
            <div className="space-y-3 text-gray-600 mb-6">
              <p>Here's how to use the app:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Add songs by pasting YouTube URLs</li>
                <li>Select genre and language for each song</li>
                <li>Drag and drop to reorder your playlist</li>
                <li>Use filters to find specific songs</li>
                <li>Click play button on any song to start playing</li>
                <li>Enable Live Play to sync music with others</li>
              </ul>
            </div>
            <button
              onClick={handleWelcomeClose}
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Music className="w-8 h-8 sm:w-10 sm:h-10 text-primary-600 animate-bounce-slow" />
                <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 text-transparent bg-clip-text">
                  Gungun
                </h1>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Crafted with</span>
                <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                <span>by</span>
                <a 
                  href="https://www.linkedin.com/in/soubhagya-prusty-5424811b6/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Soubhagya
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <LivePlayToggle />
              <InfoBox />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-6 animate-slide-up">
            <AddSongForm />
            <Playlist />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Filters />
          </div>
        </div>
      </main>

      <Player />
    </div>
  );
}