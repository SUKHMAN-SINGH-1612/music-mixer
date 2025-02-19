"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState("");
  const router = useRouter();

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!roomCode.trim()) return;

    // Simulated room join (replace with API call later)
    router.push(`/dashboard/room/${roomCode}`);
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
        <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded">
          Join Room
        </button>
      </form>
    </div>
  );
}
