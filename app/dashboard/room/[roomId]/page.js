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
    <div className="min-h-screen h-full bg-gradient-to-br from-pink-500 to-purple-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{room.room_name}</h1>
          <p className="text-gray-200">Code: {room.room_code}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Playlist Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                <h2 className="text-lg leading-6 font-medium">Playlist</h2>
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search songs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white bg-opacity-20 text-white placeholder-gray-300"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-300" />
                </div>
              </div>
              <ul className="divide-y divide-gray-200 divide-opacity-20">
                {songs.map((song) => (
                  <li
                    key={song.id}
                    className="px-4 py-4 flex items-center justify-between hover:bg-white hover:bg-opacity-10 transition-colors duration-150"
                  >
                    <div>
                      <p className="text-sm font-medium">{song.title}</p>
                      <p className="text-sm text-gray-300">{song.artist}</p>
                    </div>
                    <button
                      onClick={() => removeSong(song.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors duration-150"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white bg-opacity-20 backdrop-blur-sm shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg leading-6 font-medium mb-4">Search & Add Songs</h2>
                <form onSubmit={handleSearch} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Search for songs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white bg-opacity-20 text-white placeholder-gray-300"
                  />
                  <ul className="divide-y divide-gray-200 divide-opacity-20">
                    {searchResults.map((song) => (
                      <li
                        key={song.id}
                        className="px-4 py-4 flex items-center justify-between hover:bg-white hover:bg-opacity-10 transition-colors duration-150"
                      >
                        <div>
                          <p className="text-sm font-medium">{song.name}</p>
                          <p className="text-sm text-gray-300">{song.artists}</p>
                        </div>
                        <button
                          onClick={() => addSongToPlaylist(song)}
                          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors duration-150"
                        >
                          Add
                        </button>
                      </li>
                    ))}
                  </ul>
                </form>
              </div>
            </div>
          </div>

          {/* Live Chat Section */}
          <div className="space-y-6">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-medium">Live Chat</h2>
              </div>
              <div className="px-4 py-5 sm:p-6 h-64 overflow-y-auto">
                <p className="text-gray-300">Chat feature coming soon...</p>
              </div>
              <div className="px-4 py-3 bg-white bg-opacity-10 flex">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary bg-white bg-opacity-20 text-white placeholder-gray-300"
                />
                <button className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-opacity-80 transition-colors duration-150">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Members Section */}
            <div className="bg-white bg-opacity-20 backdrop-blur-sm shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-medium">Members</h2>
              </div>
              <ul className="divide-y divide-gray-200 divide-opacity-20">
                {[1, 2, 3].map((member) => (
                  <li
                    key={member}
                    className="px-4 py-4 flex items-center hover:bg-white hover:bg-opacity-10 transition-colors duration-150"
                  >
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary"></div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">User {member}</p>
                      <p className="text-sm text-gray-300">Online</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}