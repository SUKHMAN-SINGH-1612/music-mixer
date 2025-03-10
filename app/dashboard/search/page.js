"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { searchSongs } from "../../api/spotify/search/route";

export default function SearchSongs() {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const results = await searchSongs(query);
    setSongs(results);
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
          <li key={song.id} className="bg-white bg-opacity-20 p-4 rounded-lg flex items-center space-x-4">
            <img src={song.image} alt={song.name} className="w-16 h-16 rounded object-cover" />
            <div className="flex-1">
              <p className="text-white font-semibold text-lg">{song.name}</p>
              <p className="text-gray-300">{song.artists}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}