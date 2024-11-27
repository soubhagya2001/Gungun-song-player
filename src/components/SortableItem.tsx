import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Play, Pause, Trash2, Edit2, Check, X } from 'lucide-react';
import { Song } from '../types';
import { usePlaylistStore } from '../store';

interface Props {
  song: Song;
}

export function SortableItem({ song }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSong, setEditedSong] = useState(song);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: song.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { 
    currentSongIndex, 
    setCurrentSongIndex, 
    filteredSongs, 
    isLivePlay, 
    isPlaying,
    setIsPlaying,
    removeSong,
    reorderSongs 
  } = usePlaylistStore();

  const songs = filteredSongs();
  const isCurrentSong = songs[currentSongIndex]?.id === song.id;

  const handlePlay = () => {
    const index = songs.findIndex((s) => s.id === song.id);
    if (isCurrentSong) {
      setIsPlaying(!isPlaying);
      const player = document.querySelector('iframe');
      if (player) {
        const playerWindow = player.contentWindow;
        if (playerWindow) {
          playerWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
      }
    } else {
      setCurrentSongIndex(index);
      setIsPlaying(true);
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this song?')) {
      removeSong(song.id);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedSongs = songs.map(s => 
      s.id === song.id ? editedSong : s
    );
    reorderSongs(updatedSongs);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedSong(song);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg space-y-4"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Song Title
            </label>
            <input
              type="text"
              value={editedSong.title}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Genre
            </label>
            <input
              type="text"
              value={editedSong.genre}
              onChange={(e) => setEditedSong({...editedSong, genre: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <input
              type="text"
              value={editedSong.language}
              onChange={(e) => setEditedSong({...editedSong, language: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shared By
            </label>
            <input
              type="text"
              value={editedSong.sharedBy || ''}
              onChange={(e) => setEditedSong({...editedSong, sharedBy: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleCancel}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
          >
            <Check className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white/80 backdrop-blur rounded-xl p-4 sm:p-6 flex items-center gap-4 transition-all text-base sm:text-lg ${
        isDragging ? 'shadow-2xl scale-105 rotate-2' : 'shadow-lg hover:shadow-xl'
      } ${
        isCurrentSong ? 'ring-2 ring-primary-500 ring-offset-2' : ''
      }`}
    >
      <button
        className="touch-none p-2 hover:bg-gray-100 rounded-lg transition-colors"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
      </button>

      <div className="relative group">
        <img
          src={song.thumbnail}
          alt={song.title}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover transition-transform group-hover:scale-105"
        />
        {isCurrentSong && isPlaying && (
          <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="w-2 h-2 bg-white rounded-full animate-bounce mx-1" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate text-base sm:text-xl">{song.title}</h3>
        <p className="text-sm sm:text-base text-gray-500">
          {song.genre} • {song.language}
        </p>
        {song.sharedBy && (
          <p className="text-xs sm:text-sm text-gray-400">
            Shared by {song.sharedBy}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handlePlay}
          className="p-3 rounded-full hover:bg-primary-50 transition-colors group"
        >
          {isCurrentSong && isPlaying ? (
            <Pause className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
          ) : (
            <Play className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-primary-600" />
          )}
        </button>
        <button
          onClick={handleEdit}
          className="p-3 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Edit2 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
        </button>
        <button
          onClick={handleDelete}
          className="p-3 rounded-full hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
        </button>
      </div>
    </div>
  );
}