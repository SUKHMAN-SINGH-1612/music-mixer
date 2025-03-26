"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../supabase/client";
import { PlusCircle, Trash, Play, Search } from "lucide-react";
import { searchSongs } from "../../../api/spotify/search/route";

export default function RoomPage() {
  const { roomId } = useParams(); // Get room ID from URL
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);
  const [songs, setSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (!roomId) return; // Ensure roomId is available

    const fetchRoomData = async () => {
      try {
        const { data, error } = await supabase
          .from("rooms")
          .select("*")
          .eq("room_code", roomId)
          .single();

        if (error) {
          setError("Error fetching room data");
          console.error("Error fetching room data:", error);
        } else {
          setRoom(data);
        }
      } catch (error) {
        setError("Error fetching room data");
        console.error("Error fetching room data:", error);
      }
    };

    const fetchPlaylist = async () => {
      try {
        const { data, error } = await supabase
          .from("playlist")
          .select("song_id")
          .eq("room_code", roomId)
          .single();

        if (error) {
          console.error("Error fetching playlist:", error);
        } else if (data && data.song_id) {
          setSongs(data.song_id);
        }
      } catch (error) {
        console.error("Error fetching playlist:", error);
      }
    };

    fetchRoomData();
    fetchPlaylist();
  }, [roomId]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const results = await searchSongs(searchQuery);
    setSearchResults(results);
  };

  const addSongToPlaylist = async (song) => {
    // Check for duplicates
    if (songs.some(existingSong => existingSong.id === song.id)) {
      console.warn("Song already in playlist");
      return;
    }

    const newSong = {
      id: song.id,
      title: song.name,
      artist: song.artists,
      image: song.image,
    };

    const updatedSongs = [...songs, newSong];
    setSongs(updatedSongs);

    // Save to Supabase
    const { error } = await supabase
      .from("playlist")
      .upsert({ room_code: roomId, song_id: updatedSongs });

    if (error) {
      console.error("Error saving playlist:", error);
    }
  };

  const removeSong = async (songId) => {
    const updatedSongs = songs.filter(song => song.id !== songId);
    setSongs(updatedSongs);

    // Save to Supabase
    const { error } = await supabase
      .from("playlist")
      .upsert({ room_code: roomId, song_id: updatedSongs });

    if (error) {
      console.error("Error saving playlist:", error);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!room) {
    return <div className="text-gray-300">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 bg-gradient-to-br from-pink-500 to-purple-500 min-h-screen">
      <h1 className="text-4xl font-bold text-white mb-6">{room.room_name}</h1>
      <p className="text-white text-lg mb-8">
        Code: <span className="font-semibold">{room.room_code}</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Playlist Section */}
        <div className="col-span-2 bg-white bg-opacity-20 backdrop-blur-md p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">Playlist</h2>
          <ul className="space-y-4">
            {songs.map((song) => (
              <li
                key={song.id}
                className="bg-white bg-opacity-10 p-4 rounded flex justify-between items-center"
              >
                <div>
                  <p className="text-white font-semibold">{song.title}</p>
                  <p className="text-gray-300 text-sm">{song.artist}</p>
                </div>
                <div className="flex space-x-3">
                  <button className="text-green-400 hover:text-green-600">
                    <Play className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => removeSong(song.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash className="w-6 h-6" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded flex items-center"
          >
            <PlusCircle className="mr-2" /> Add Song
          </button>

          {showSearch && (
            <div className="mt-6">
              <form onSubmit={handleSearch} className="flex items-center space-x-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for songs..."
                  className="flex-1 p-3 rounded bg-gray-800 text-white border border-gray-600"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded"
                >
                  <Search />
                </button>
              </form>
              <ul className="mt-4 space-y-3">
                {searchResults.map((song) => (
                  <li
                    key={song.id}
                    className="bg-gray-800 p-3 rounded flex justify-between items-center"
                  >
                    <div>
                      <p className="text-white font-semibold">{song.name}</p>
                      <p className="text-gray-400 text-sm">{song.artists}</p>
                    </div>
                    <button
                      onClick={() => addSongToPlaylist(song)}
                      className="text-green-400 hover:text-green-600"
                    >
                      <PlusCircle className="w-6 h-6" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Live Chat Section */}
        <div className="bg-white bg-opacity-20 backdrop-blur-md p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">Live Chat</h2>
          <div className="bg-gray-900 p-4 rounded h-64 overflow-y-auto">
            <p className="text-gray-400">Chat feature coming soon...</p>
          </div>
          <div className="mt-4 flex items-center">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 p-3 rounded bg-gray-800 text-white border border-gray-600"
            />
            <button className="ml-3 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-9.193-5.333A1 1 0 004 6.667v10.666a1 1 0 001.559.832l9.193-5.333a1 1 0 000-1.664z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Members Section */}
        <div className="bg-white bg-opacity-20 backdrop-blur-md p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">Members</h2>
          <ul className="space-y-3">
            <li className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-full"></div>
              <p className="text-white">User 1</p>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-full"></div>
              <p className="text-white">User 2</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}