"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CreateRoom() {
  const [roomName, setRoomName] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!roomName.trim() || !session?.user?.id) return;

    const response = await fetch("/api/supabase/create-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room_name: roomName,
        google_id: session.user.id,
        email: session.user.email,
        name: session.user.name
      }),
    });

    const data = await response.json();
    if (response.ok) {
      router.push(`/dashboard/room/${data.room_code}`);
    } else {
      console.error("Error creating room:", data.error);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Create a Room</h1>
      <form onSubmit={handleCreateRoom} className="space-y-4">
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter room name"
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          required
        />
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">
          Create Room
        </button>
      </form>
    </div>
  );
}
