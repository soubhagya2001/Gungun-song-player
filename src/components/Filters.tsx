import React from 'react';
import { usePlaylistStore } from '../store';

export function Filters() {
  const { songs, filters, setFilters } = usePlaylistStore();

  // Get unique genres and languages (case-insensitive)
  const genres = Array.from(new Set(
    songs.map(song => song.genre.toLowerCase())
  )).sort();
  
  const languages = Array.from(new Set(
    songs.map(song => song.language)
  )).sort();

  return (
    <div className="bg-white/90 backdrop-blur rounded-lg shadow-sm p-6 border border-white/20">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
            Genre
          </label>
          <select
            id="genre"
            value={filters.genre}
            onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700">
            Language
          </label>
          <select
            id="language"
            value={filters.language}
            onChange={(e) => setFilters({ ...filters, language: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
          >
            <option value="">All Languages</option>
            {languages.map(language => (
              <option key={language} value={language}>{language}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}