"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { DoorOpen } from "lucide-react";
import { supabase } from "../../supabase/client";

export default function UserRooms() {
  const { data: session } = useSession();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchRooms = async () => {
      try {
        const response = await fetch(`/api/supabase/get-user-rooms?google_id=${session.user.id}`);
        const data = await response.json();

        if (response.ok) {
          setRooms(data);
          setFilteredRooms(data);
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

    // Subscribe to real-time changes in rooms
    const roomsSubscription = supabase
      .channel('rooms-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rooms' },
        async (payload) => {
          // Refetch rooms when any change occurs
          const response = await fetch(`/api/supabase/get-user-rooms?google_id=${session.user.id}`);
          const data = await response.json();
          
          if (response.ok) {
            setRooms(data);
            setFilteredRooms(data);
          }
        }
      )
      .subscribe();

    // Subscribe to real-time changes in room_members
    const roomMembersSubscription = supabase
      .channel('room-members-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'room_members' },
        async (payload) => {
          // Check if the change affects the current user
          if (payload.new && payload.new.members && 
              (payload.new.members.includes(session.user.id) || 
               payload.old?.members?.includes(session.user.id))) {
            // Refetch rooms when membership changes
            const response = await fetch(`/api/supabase/get-user-rooms?google_id=${session.user.id}`);
            const data = await response.json();
            
            if (response.ok) {
              setRooms(data);
              setFilteredRooms(data);
            }
          }
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(roomsSubscription);
      supabase.removeChannel(roomMembersSubscription);
    };
  }, [session]);

  useEffect(() => {
    let updatedRooms = [...rooms];

    if (searchQuery) {
      updatedRooms = updatedRooms.filter((room) =>
        room.room_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortOption === "Name") {
      updatedRooms.sort((a, b) => a.room_name.localeCompare(b.room_name));
    } else if (sortOption === "Last Active") {
      updatedRooms.sort((a, b) => new Date(b.last_active) - new Date(a.last_active));
    }

    setFilteredRooms(updatedRooms);
  }, [searchQuery, sortOption, rooms]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">My Rooms</h1>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
        <input
          type="text"
          placeholder="Search rooms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 w-full sm:w-auto"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 w-full sm:w-auto"
        >
          <option value="">Sort by</option>
          <option value="Name">Name</option>
          <option value="Last Active">Last Active</option>
        </select>
      </div>
      {filteredRooms.length === 0 ? (
        <p className="text-gray-300">No rooms available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <div
              key={room.room_code}
              className="bg-white bg-opacity-20 p-6 rounded-lg shadow-md flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">{room.room_name}</h2>
                <p className="text-gray-200">Members: {room.members_count}</p>
                <p className="text-gray-200">Last active: {room.last_active}</p>
              </div>
              <Link
                href={`/dashboard/room/${room.room_code}`}
                className="mt-4 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded text-center"
              >
                Enter Room
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
