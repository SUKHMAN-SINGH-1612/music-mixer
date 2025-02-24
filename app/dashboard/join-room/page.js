"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  const handleJoinRoom = async (e) => {
    e.preventDefault();
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

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Join a Room</h1>

      <form onSubmit={handleJoinRoom} className="space-y-4">
        <div>
          <label className="block text-gray-300">Room Code</label>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="Enter room code"
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">
          Join Room
        </button>
      </form>
    </div>
  );
}
