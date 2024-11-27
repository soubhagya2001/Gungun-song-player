export interface Song {
  id: string;
  youtubeId: string;
  title: string;
  genre: string;
  language: string;
  sharedBy?: string;
  thumbnail: string;
  addedAt?: string;
}

export interface PlaylistStore {
  songs: Song[];
  currentSongIndex: number;
  isPlaying: boolean;
  isLivePlay: boolean;
  filters: {
    genre: string;
    language: string;
  };
  loadSongsFromStorage: () => void;
  addSong: (song: Song) => void;
  removeSong: (id: string) => void;
  reorderSongs: (songs: Song[]) => void;
  setCurrentSongIndex: (index: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsLivePlay: (isLivePlay: boolean) => void;
  setFilters: (filters: { genre: string; language: string }) => void;
  filteredSongs: () => Song[];
  nextSong: () => void;
}

export interface SongsData {
  songs: Song[];
  version: string;
  lastUpdated: string;
  metadata: {
    description: string;
    format: string;
    encoding: string;
  };
}