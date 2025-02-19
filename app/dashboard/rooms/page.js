"use client";

import { useState } from "react";
import Link from "next/link";
import { DoorOpen } from "lucide-react";

export default function MyRooms() {
  // Simulated room data (replace with API fetch later)
  const [rooms] = useState([
    { id: "abc123", name: "Chill Vibes", members: 5 },
    { id: "xyz789", name: "Rock Classics", members: 8 },
    { id: "mno456", name: "Jazz Lounge", members: 3 },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">My Rooms</h1>

      {rooms.length === 0 ? (
        <p className="text-gray-300">You're not part of any rooms yet.</p>
      ) : (
        <ul className="space-y-4">
          {rooms.map((room) => (
            <li key={room.id} className="bg-white bg-opacity-20 p-4 rounded-lg flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-white">{room.name}</h2>
                <p className="text-gray-200">{room.members} members</p>
              </div>
              <Link
                href={`/dashboard/room/${room.id}`}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
              >
                <DoorOpen className="mr-2" /> Enter Room
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
