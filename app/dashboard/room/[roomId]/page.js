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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-4">{room.room_name}</h1>
      <p className="text-gray-300 mb-6">
        Room Code: <span className="font-semibold">{room.room_code}</span>
      </p>

      {/* Playlist Section */}
      <div className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-2">Playlist</h2>

        <ul className="space-y-4">
          {songs.map((song) => (
            <li
              key={song.id}
              className="bg-gray-900 p-3 rounded flex justify-between items-center"
            >
              <div>
                <p className="text-white font-semibold">{song.title}</p>
                <p className="text-gray-400 text-sm">{song.artist}</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-green-400 hover:text-green-600">
                  <Play className="w-5 h-5" />
                </button>
                <button
                  onClick={() => removeSong(song.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Add Song Button */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center"
        >
          <PlusCircle className="mr-2" /> Add Song
        </button>

        {showSearch && (
          <div className="mt-4">
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a song..."
                className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-600"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
              >
                <Search />
              </button>
            </form>

            {/* Search Results */}
            <ul className="mt-4 space-y-2">
              {searchResults.map((song) => (
                <li
                  key={song.id}
                  className="bg-gray-800 p-2 rounded flex justify-between items-center"
                >
                  <div>
                    <p className="text-white font-semibold">{song.name}</p>
                    <p className="text-gray-400 text-sm">{song.artists}</p>
                  </div>
                  <button
                    onClick={() => addSongToPlaylist(song)}
                    className="text-green-400 hover:text-green-600"
                  >
                    <PlusCircle className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Room Chat (Placeholder) */}
      <div className="mt-6 bg-white bg-opacity-20 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-2">Live Chat</h2>
        <p className="text-gray-300">Chat feature coming soon...</p>
      </div>
    </div>
  );
}