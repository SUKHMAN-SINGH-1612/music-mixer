"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PlusCircle, Trash, Play } from "lucide-react";

export default function RoomPage() {
  const { roomId } = useParams(); // Get room ID from URL
  const [roomName, setRoomName] = useState("");
  const [songs, setSongs] = useState([]);

  // Simulate fetching room data (Replace with API call later)
  useEffect(() => {
    setRoomName(`Room ${roomId}`);
    setSongs([
      { id: 1, title: "Blinding Lights", artist: "The Weeknd" },
      { id: 2, title: "Shape of You", artist: "Ed Sheeran" },
    ]);
  }, [roomId]);

  const addSong = () => {
    const newSong = { id: Date.now(), title: "New Song", artist: "Unknown" };
    setSongs([...songs, newSong]);
  };

  const removeSong = (id) => {
    setSongs(songs.filter((song) => song.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-4">{roomName}</h1>
      <p className="text-gray-300 mb-6">Room Code: <span className="font-semibold">{roomId}</span></p>

      {/* Playlist Section */}
      <div className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-2">Playlist</h2>

        <ul className="space-y-4">
          {songs.map((song) => (
            <li key={song.id} className="bg-gray-900 p-3 rounded flex justify-between items-center">
              <div>
                <p className="text-white font-semibold">{song.title}</p>
                <p className="text-gray-400 text-sm">{song.artist}</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-green-400 hover:text-green-600">
                  <Play className="w-5 h-5" />
                </button>
                <button onClick={() => removeSong(song.id)} className="text-red-400 hover:text-red-600">
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Add Song Button */}
        <button
          onClick={addSong}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center"
        >
          <PlusCircle className="mr-2" /> Add Song
        </button>
      </div>

      {/* Room Chat (Placeholder) */}
      <div className="mt-6 bg-white bg-opacity-20 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-2">Live Chat</h2>
        <p className="text-gray-300">Chat feature coming soon...</p>
      </div>
    </div>
  );
}
