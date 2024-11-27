import React, { useState } from "react";
import { usePlaylistStore } from "../store";
import { Music, Plus, AlertCircle, ExternalLink } from "lucide-react";

export function AddSongForm() {
  const [url, setUrl] = useState("");
  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState("");
  const [sharedBy, setSharedBy] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { songs, addSong } = usePlaylistStore();

  const extractYoutubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
      /^([^"&?\/\s]{11})$/i,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const validateYoutubeId = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${id}`
      );
      const data = await response.json();
      return !!data.title;
    } catch {
      return false;
    }
  };

  const fetchVideoDetails = async (youtubeId: string) => {
    try {
      const response = await fetch(
        `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${youtubeId}`
      );
      if (!response.ok) throw new Error("Failed to fetch video details");

      const data = await response.json();
      if (!data.title) throw new Error("Video not found or unavailable");

      return {
        title: data.title,
        thumbnail: `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`,
      };
    } catch (error) {
      throw new Error(
        "Could not fetch video details. Please check the URL and try again."
      );
    }
  };

  const resetForm = () => {
    setUrl("");
    setGenre("");
    setLanguage("");
    setSharedBy("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const youtubeId = extractYoutubeId(url);
      if (!youtubeId) {
        throw new Error(
          "Invalid YouTube URL. Please check the URL and try again."
        );
      }

      // Check if song already exists
      const songExists = songs.some((song) => song.youtubeId === youtubeId);
      if (songExists) {
        throw new Error("This song already exists in the playlist!");
      }

      const isValid = await validateYoutubeId(youtubeId);
      if (!isValid) {
        throw new Error("This video does not exist or is unavailable.");
      }

      const { title, thumbnail } = await fetchVideoDetails(youtubeId);

      addSong({
        id: crypto.randomUUID(),
        youtubeId,
        title,
        genre: genre.trim(),
        language: language.trim(),
        sharedBy: sharedBy.trim() || undefined,
        thumbnail,
        addedAt: new Date().toISOString(),
      });

      resetForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <Music className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Add a Song</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="group">
            <label
              htmlFor="url"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              YouTube URL
            </label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              disabled={isLoading}
              className="block w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              placeholder="https://youtube.com/watch?v=... or video ID"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="genre"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Genre
              </label>
              <input
                type="text"
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                required
                disabled={isLoading}
                className="block w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label
                htmlFor="language"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Language
              </label>
              <input
                type="text"
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                required
                disabled={isLoading}
                className="block w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="sharedBy"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Shared By (optional)
            </label>
            <input
              type="text"
              id="sharedBy"
              value={sharedBy}
              onChange={(e) => setSharedBy(e.target.value)}
              disabled={isLoading}
              className="block w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white py-3 px-6 rounded-lg font-medium hover:from-primary-700 hover:to-accent-700 focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Plus
              className={`w-5 h-5 ${
                isLoading ? "animate-spin" : "group-hover:rotate-180"
              } transition-transform`}
            />
            {isLoading ? "Adding Song..." : "Add Song"}
          </button>
        </div>
      </form>

      <div className="flex gap-4 justify-center">
        <a
          href=""
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 bg-white rounded-lg shadow hover:shadow-md transition-all text-primary-600 font-medium"
        >
          Axcend English Songs
          <ExternalLink className="w-4 h-4" />
        </a>
        <a
          href=""
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 bg-white rounded-lg shadow hover:shadow-md transition-all text-primary-600 font-medium"
        >
          Axcend Hindi Songs
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
