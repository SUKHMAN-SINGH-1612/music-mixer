"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateRoom() {
  const [roomName, setRoomName] = useState("");
  const router = useRouter();

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    // Simulated room creation (replace with API call later)
    const newRoomId = Math.random().toString(36).substr(2, 6);
    router.push(`/dashboard/room/${newRoomId}`);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Create a Room</h1>

      <form onSubmit={handleCreateRoom} className="space-y-4">
        <div>
          <label className="block text-gray-300">Room Name</label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name"
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">
          Create Room
        </button>
      </form>
    </div>
  );
}
