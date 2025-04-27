"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState("");
  const [publicRooms, setPublicRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchPublicRooms = async () => {
      try {
        const response = await fetch("/api/supabase/public-rooms");
        if (!response.ok) {
          console.error("Error fetching public rooms:", response.statusText);
          setPublicRooms([]); // Set to an empty array on error
          return;
        }

        const data = await response.json().catch(() => {
          console.error("Invalid JSON response");
          return { rooms: [] }; // Default to an empty array if JSON parsing fails
        });

        setPublicRooms(data.rooms || []);
      } catch (error) {
        console.error("Error fetching public rooms:", error);
        setPublicRooms([]); // Set to an empty array on network error
      }
    };

    fetchPublicRooms();
  }, []);

  const handleJoinRoom = async (roomCode) => {
    if (!roomCode.trim() || !session?.user?.id) return;

    try {
      const response = await fetch("/api/supabase/join-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_code: roomCode,
          google_id: session.user.id,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        router.push(`/dashboard/room/${roomCode}`);
      } else {
        console.error("Error joining room:", data.error);
      }
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  const filteredRooms = publicRooms.filter((room) =>
    room.room_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Join a Room</h1>
        <p className="text-gray-200">Enter a room code or browse public rooms to join</p>
      </div>

      <div className="bg-white bg-opacity-20 backdrop-blur-sm shadow overflow-hidden sm:rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Room Code</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleJoinRoom(roomCode);
          }}
          className="space-y-6"
        >
          <div className="relative">
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="Enter 6-character code (e.g., ABC123)"
              className="pl-4 block w-full rounded-md border-0 py-3 bg-white bg-opacity-20 text-white placeholder-gray-300 focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 rounded-lg shadow-md text-white bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-150"
          >
            Join Room
          </button>
        </form>
      </div>

      <div className="bg-white bg-opacity-20 backdrop-blur-sm shadow overflow-hidden sm:rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Public Rooms</h2>
        <div className="relative mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rooms..."
            className="pl-4 block w-full rounded-md border-0 py-3 bg-white bg-opacity-20 text-white placeholder-gray-300 focus:ring-2 focus:ring-primary"
          />
        </div>
        <ul className="space-y-4">
          {filteredRooms.map((room) => (
            <li
              key={room.room_code}
              className="flex justify-between items-center bg-white bg-opacity-10 p-4 rounded-lg shadow-sm"
            >
              <div>
                <h3 className="text-lg font-semibold text-white">{room.room_name}</h3>
                <p className="text-sm text-gray-300">
                  Room Code: {room.room_code}
                </p>
              </div>
              <button
                onClick={() => handleJoinRoom(room.room_code)}
                className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 text-white py-2 px-4 rounded-lg font-semibold text-sm"
              >
                Join
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
