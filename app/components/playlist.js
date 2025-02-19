"use client";

import { useState } from "react";
import { Play, Trash } from "lucide-react";

export default function Playlist() {
  const [songs, setSongs] = useState([
    { id: 1, title: "Song 1", artist: "Artist 1" },
    { id: 2, title: "Song 2", artist: "Artist 2" },
    { id: 3, title: "Song 3", artist: "Artist 3" },
  ]);

  const removeSong = (id) => {
    setSongs(songs.filter((song) => song.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-xl font-bold mb-4">Playlist</h3>
      <ul className="space-y-2 max-h-64 overflow-y-auto">
        {songs.map((song) => (
          <li key={song.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
            <div>
              <p className="font-semibold">{song.title}</p>
              <p className="text-sm text-gray-600">{song.artist}</p>
            </div>
            <div className="flex space-x-2">
              <button className="text-green-600 hover:text-green-800">
                <Play className="h-5 w-5" />
              </button>
              <button className="text-red-600 hover:text-red-800" onClick={() => removeSong(song.id)}>
                <Trash className="h-5 w-5" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
