import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { usePlaylistStore } from '../store';

export function Playlist() {
  const { filteredSongs, reorderSongs } = usePlaylistStore();
  const songs = filteredSongs();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = songs.findIndex((song) => song.id === active.id);
      const newIndex = songs.findIndex((song) => song.id === over.id);
      const newSongs = arrayMove(songs, oldIndex, newIndex);
      reorderSongs(newSongs);
    }
  };

  if (songs.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <p className="text-gray-500">No songs in playlist</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={songs.map(song => song.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {songs.map((song) => (
            <SortableItem key={song.id} song={song} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}