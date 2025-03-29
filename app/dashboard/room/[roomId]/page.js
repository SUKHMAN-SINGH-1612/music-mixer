"use client";
import { useState, useEffect, useRef } from "react"; // Import useRef
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // Import useSession
import { supabase } from "../../../supabase/client";
import { PlusCircle, Trash, Play, Search } from "lucide-react";
import { searchSongs } from "../../../api/spotify/search/route";

export default function RoomPage() {
  const { roomId } = useParams(); // Get room ID from URL
  const router = useRouter();
  const { data: session } = useSession(); // Retrieve session data
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);
  const [songs, setSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [members, setMembers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal
  const [showLeaveModal, setShowLeaveModal] = useState(false); // State for leave confirmation modal
  const searchBarRef = useRef(null); // Ref for the search bar

  useEffect(() => {
    if (!roomId || !session) return; // Ensure roomId and session are available

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
        } else {
          console.log("No songs found in the playlist.");
          setSongs([]); // Ensure songs is an empty array if no data is found
        }
      } catch (error) {
        console.error("Error fetching playlist:", error);
      }
    };

    const fetchMembers = async () => {
      try {
        const { data: roomMembers, error: roomError } = await supabase
          .from("room_members")
          .select("members")
          .eq("room_code", roomId)
          .single();

        if (roomError) {
          console.error("Error fetching room members:", roomError);
          return;
        }

        if (roomMembers && roomMembers.members) {
          const { data: users, error: usersError } = await supabase
            .from("users")
            .select("google_id, name")
            .in("google_id", roomMembers.members);

          if (usersError) {
            console.error("Error fetching user data:", usersError);
          } else {
            setMembers(users);
          }
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchRoomData();
    fetchPlaylist();
    fetchMembers();
  }, [roomId, session]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setSearchQuery(""); // Reset search query
        setSearchResults([]); // Clear search results
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const handleLeaveRoom = async () => {
    if (!session) {
      console.error("User is not authenticated");
      return;
    }

    try {
      const response = await fetch("/api/supabase/leave-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room_code: roomId, google_id: session.user.id }),
      });

      if (response.ok) {
        router.push("/dashboard/rooms"); // Redirect to rooms page
      } else {
        console.error("Error leaving room");
      }
    } catch (error) {
      console.error("Error leaving room:", error);
    }
  };

  const handleDeleteRoom = async () => {
    if (!session) {
      console.error("User is not authenticated");
      return;
    }

    try {
      const response = await fetch("/api/supabase/delete-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room_code: roomId, google_id: session.user.id }),
      });

      if (response.ok) {
        router.push("/dashboard/rooms"); // Redirect to rooms page
      } else {
        console.error("Error deleting room");
      }
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!room) {
    return <div className="text-gray-300">Loading...</div>;
  }

  return (
    <div className="min-h-screen h-full text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{room.room_name}</h1>
          <p className="text-white">Code: {room.room_code}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Playlist Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                <h2 className="text-lg leading-6 font-medium">Playlist</h2>
                <div className="relative w-full sm:w-64" ref={searchBarRef}>
                  <input
                    type="text"
                    placeholder="Search songs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white bg-opacity-20 text-white placeholder-gray-300"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-300" />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery(""); // Reset search query
                        setSearchResults([]); // Clear search results
                      }}
                      className="absolute right-3 top-2.5 h-5 w-5 text-gray-300 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
              <ul className="divide-y divide-gray-200 divide-opacity-20">
                {songs.map((song, index) => (
                  <li
                    key={song.id || index} // Ensure unique key for each song
                    className="px-4 py-4 flex items-center justify-between hover:bg-white hover:bg-opacity-10 transition-colors duration-150"
                  >
                    <div>
                      <p className="text-sm font-medium">{song.title}</p>
                      <p className="text-sm text-white">{song.artist}</p>
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
                  <div className="max-h-64 overflow-y-auto divide-y divide-gray-200 divide-opacity-20">
                    {searchResults.map((song, index) => (
                      <div
                        key={song.id || index} // Ensure unique key for each search result
                        className="px-4 py-4 flex items-center justify-between hover:bg-white hover:bg-opacity-10 transition-colors duration-150"
                      >
                        <div>
                          <p className="text-sm font-medium">{song.name}</p>
                          <p className="text-sm text-white">{song.artists}</p>
                        </div>
                        <button
                          onClick={() => addSongToPlaylist(song)}
                          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors duration-150"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
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
                <p className="text-white">Chat feature coming soon...</p>
              </div>
              <div className="px-4 py-3 bg-white bg-opacity-10 flex">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary bg-white bg-opacity-20 text-white placeholder-gray-300"
                />
                <button className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-opacity-80 transition-colors duration-150 flex items-center justify-center">
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
                      d="M14.752 11.168l-9.6-5.6a1 1 0 00-1.5.866v11.132a1 1 0 001.5.866l9.6-5.6a1 1 0 000-1.732z"
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
              <ul className="divide-y divide-gray-200 divide-opacity-20 max-h-64 overflow-y-auto">
                {members.map((member, index) => (
                  <li
                    key={member.google_id || index} // Ensure unique key for each member
                    className="px-4 py-4 flex items-center hover:bg-white hover:bg-opacity-10 transition-colors duration-150"
                  >
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary overflow-hidden">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-sm text-white">Online</p>
                    </div>
                  </li>
                ))}
              </ul>
              {/* Fixed Buttons */}
              <div className="px-4 py-3 bg-white bg-opacity-10 flex flex-col sm:flex-row justify-center items-center gap-2">
                <button
                  onClick={() => setShowLeaveModal(true)} // Show leave confirmation modal
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-3/4 sm:w-auto max-w-xs"
                >
                  Leave Room
                </button>
                {room.google_id === session.user.id && (
                  <button
                    onClick={() => setShowDeleteModal(true)} // Show delete confirmation modal
                    className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 w-3/4 sm:w-auto max-w-xs"
                  >
                    Delete Room
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Leave Confirmation Modal */}
        {showLeaveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-96 shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4">Confirm Leave</h2>
              <p className="text-gray-300 mb-6">
                Are you sure you want to leave this room? You will no longer be a member of this room.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowLeaveModal(false)} // Close modal
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLeaveModal(false);
                    handleLeaveRoom();
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Leave
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-96 shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4">Confirm Delete</h2>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this room? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)} // Close modal
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    handleDeleteRoom();
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}