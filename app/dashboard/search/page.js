"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchSongs() {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Simulated API call (replace with real API)
    const mockResults = [
      { id: 1, title: "Blinding Lights", artist: "The Weeknd" },
      { id: 2, title: "Shape of You", artist: "Ed Sheeran" },
      { id: 3, title: "Levitating", artist: "Dua Lipa" },
    ];
    setSongs(mockResults);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Search Songs</h1>

      <form onSubmit={handleSearch} className="flex items-center space-x-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a song..."
          className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-600"
          required
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded">
          <Search />
        </button>
      </form>

      {/* Results */}
      <ul className="mt-6 space-y-4">
        {songs.map((song) => (
          <li key={song.id} className="bg-white bg-opacity-20 p-4 rounded-lg">
            <p className="text-white font-semibold">{song.title}</p>
            <p className="text-gray-300">{song.artist}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
