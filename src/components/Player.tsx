import React, { useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { Play, Pause, SkipForward, Radio,SkipBack } from 'lucide-react';
import { usePlaylistStore } from '../store';

export function Player() {
  const playerRef = useRef<any>(null);
  const { 
    filteredSongs,
    currentSongIndex,
    isPlaying,
    isLivePlay,
    setIsPlaying,
    nextSong,
    previousSong,
    setCurrentSongIndex
  } = usePlaylistStore();


  const songs = filteredSongs();
  const currentSong = songs[currentSongIndex];

  useEffect(() => {
    if (playerRef.current && isPlaying) {
      playerRef.current.internalPlayer.playVideo();
    }
  }, [currentSongIndex, isPlaying]);

  const handleStateChange = (event: { target: any; data: number }) => {
    switch (event.data) {
      case -1: // unstarted
        if (isPlaying) {
          event.target.playVideo();
        }
        break;
      case 0: // ended
        nextSong();
        break;
      case 1: // playing
        setIsPlaying(true);
        break;
      case 2: // paused
        setIsPlaying(false);
        break;
    }
  };

  const togglePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.internalPlayer.pauseVideo();
      } else {
        playerRef.current.internalPlayer.playVideo();
      }
    }
  };

  const handleNext = () => {
    nextSong();
  };

  const handlePrevious = () => {
    previousSong();
  };

  if (!currentSong) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur border-t border-gray-200 p-4 sm:p-6 shadow-lg">
        <div className="text-center text-gray-500 text-base sm:text-lg">
          No songs in playlist
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur border-t border-gray-200 p-4 sm:p-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <img
              src={currentSong.thumbnail}
              alt={currentSong.title}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover transition-transform group-hover:scale-105"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                <div
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "0s" }}
                />
                <div
                  className="w-2 h-2 bg-white rounded-full animate-bounce mx-1"
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 text-base sm:text-xl">
              {currentSong.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-500">
              {currentSong.genre} • {currentSong.language}
            </p>
            {isLivePlay && (
              <p className="text-xs sm:text-sm flex items-center gap-1 text-accent-600">
                <Radio className="w-3 h-3 animate-pulse" /> Live Playing
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handlePrevious}
            className="p-3 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
            disabled={currentSongIndex === 0}
          >
            <SkipBack className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
          </button>
          <button
            onClick={togglePlayPause}
            className="p-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
            ) : (
              <Play className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
            )}
          </button>
          <button
            onClick={handleNext}
            className="p-3 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
            disabled={currentSongIndex === songs.length - 1}
          >
            <SkipForward className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
          </button>
        </div>

        <div className="hidden">
          <YouTube
            videoId={currentSong.youtubeId}
            ref={playerRef}
            opts={{
              height: "0",
              width: "0",
              playerVars: {
                autoplay: isPlaying ? 1 : 0,
                controls: 0,
                playsinline: 1,
                rel: 0,
                showinfo: 0,
                modestbranding: 1,
                origin: window.location.origin,
              },
            }}
            onStateChange={handleStateChange}
            onError={(error) => {
              console.error("YouTube Player Error:", error);
              nextSong(); // Skip to next song on error
            }}
          />
        </div>
      </div>
    </div>
  );
}