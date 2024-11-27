import { create } from 'zustand';
import { Song, PlaylistStore } from './types';

const broadcastChannel = new BroadcastChannel('gungun_music_app');
const liveStatusChannel = new BroadcastChannel('gungun_live_status');

liveStatusChannel.onmessage = (event) => {
  if (event.data.type === 'CHECK_LIVE_STATUS') {
    const state = usePlaylistStore.getState();
    if (state.isLivePlay && state.isPlaying) {
      liveStatusChannel.postMessage({
        type: 'LIVE_STATUS_RESPONSE',
        isPlaying: state.isPlaying,
        currentSongIndex: state.currentSongIndex
      });
    }
  }
};

const fetchSongs = async () => {
  try {
    const response = await fetch('/api/songs');
    if (!response.ok) throw new Error('Failed to fetch songs');
    const data = await response.json();
    return data.songs;
  } catch (error) {
    console.error('Error fetching songs:', error);
    return [];
  }
};

const saveSongs = async (songs: Song[]) => {
  try {
    const response = await fetch('/api/songs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ songs })
    });
    if (!response.ok) throw new Error('Failed to save songs');
  } catch (error) {
    console.error('Error saving songs:', error);
  }
};

export const usePlaylistStore = create<PlaylistStore>((set, get) => ({
  songs: [],
  currentSongIndex: 0,
  isPlaying: false,
  isLivePlay: false,
  filters: {
    genre: '',
    language: '',
  },

  loadSongsFromStorage: async () => {
    const songs = await fetchSongs();
    set({ songs });
  },

  startPeriodicSync: () => {
    const syncInterval = setInterval(async () => {
      const songs = await fetchSongs();
      set({ songs });
    }, 600000); // 10 minutes

    return () => clearInterval(syncInterval);
  },

  addSong: async (song) => {
    const newSongs = [...get().songs, song];
    await saveSongs(newSongs);
    set({ songs: newSongs });
    broadcastChannel.postMessage({ type: 'SONGS_UPDATED', songs: newSongs });
  },
  
  removeSong: async (id) => {
    const newSongs = get().songs.filter((song) => song.id !== id);
    await saveSongs(newSongs);
    set({ songs: newSongs });
    broadcastChannel.postMessage({ type: 'SONGS_UPDATED', songs: newSongs });
  },

  reorderSongs: async (songs) => {
    await saveSongs(songs);
    set({ songs });
    broadcastChannel.postMessage({ type: 'SONGS_UPDATED', songs });
  },

  setCurrentSongIndex: (index) => {
    set({ currentSongIndex: index });
    if (get().isLivePlay) {
      broadcastChannel.postMessage({ type: 'CURRENT_SONG_CHANGED', index });
    }
  },

  setIsPlaying: (isPlaying) => {
    set({ isPlaying });
    if (get().isLivePlay) {
      broadcastChannel.postMessage({ type: 'PLAYBACK_STATE_CHANGED', isPlaying });
    }
  },

  setIsLivePlay: (isLivePlay) => {
    if (isLivePlay) {
      liveStatusChannel.postMessage({ type: 'CHECK_LIVE_STATUS' });
    }
    set({ isLivePlay });
  },

  setFilters: (filters) => set({ filters }),

  filteredSongs: () => {
    const { songs, filters } = get();
    return songs.filter((song) => {
      const genreMatch = !filters.genre || song.genre.toLowerCase() === filters.genre.toLowerCase();
      const languageMatch = !filters.language || song.language === filters.language;
      return genreMatch && languageMatch;
    });
  },

  nextSong: () => {
    const { currentSongIndex, filteredSongs, isLivePlay } = get();
    const songs = filteredSongs();
    if (currentSongIndex < songs.length - 1) {
      const newIndex = currentSongIndex + 1;
      set({ currentSongIndex: newIndex });
      if (isLivePlay) {
        broadcastChannel.postMessage({ type: 'CURRENT_SONG_CHANGED', index: newIndex });
      }
    }
  },
}));