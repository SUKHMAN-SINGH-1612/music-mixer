"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { DoorOpen } from "lucide-react";

export default function UserRooms() {
  const { data: session } = useSession();
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session?.user?.id) {
      const fetchRooms = async () => {
        try {
          const response = await fetch(`/api/supabase/get-user-rooms?google_id=${session.user.id}`);
          const data = await response.json();

          if (response.ok) {
            setRooms(data);
          } else {
            console.error("Error fetching rooms:", data.error);
            setError(data.error);
          }
        } catch (error) {
          console.error("Error fetching rooms:", error);
          setError("An error occurred while fetching rooms.");
        }
      };

      fetchRooms();
    }
  }, [session]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">My Rooms</h1>

      {rooms.length === 0 ? (
        <p className="text-gray-300">No rooms available.</p>
      ) : (
        <ul className="space-y-4">
          {rooms.map((room) => (
            <li key={room.room_code} className="bg-white bg-opacity-20 p-4 rounded-lg flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-white">{room.room_name}</h2>
                <p className="text-gray-200">Room Code: {room.room_code}</p>
              </div>
              <Link
                href={`/dashboard/room/${room.room_code}`}
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
