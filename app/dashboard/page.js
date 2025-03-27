"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, Key } from "lucide-react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [rooms, setRooms] = useState([]);
  const router = useRouter();

  // Redirect to home if user is not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

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
          }
        } catch (error) {
          console.error("Error fetching rooms:", error);
        }
      };

      fetchRooms();
    }
  }, [session]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  if (status === "loading") {
    return <p className="text-white text-center">Loading...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20">
      <h1 className="text-3xl font-bold text-white mb-6">
        Welcome, {session?.user?.name}!
      </h1>
      <p className="text-gray-200 mb-6">Signed in as {session?.user?.email}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link
          href="/dashboard/create-room"
          className="flex items-center justify-center p-6 bg-primary bg-opacity-80 text-white rounded-lg hover:bg-opacity-90 transition duration-150"
        >
          <PlusCircle className="mr-2" />
          Create New Room
        </Link>
        <Link
          href="/dashboard/join-room"
          className="flex items-center justify-center p-6 bg-secondary bg-opacity-80 text-white rounded-lg hover:bg-opacity-90 transition duration-150"
        >
          <Key className="mr-2" />
          Join a Room
        </Link>
      </div>

      <div className="bg-white bg-opacity-20 backdrop-blur-sm shadow overflow-hidden sm:rounded-lg p-4">
        <h2 className="text-lg font-medium text-white mb-2">My Rooms</h2>
        <p className="text-sm text-gray-200 mb-4">Your recently active rooms</p>

        {rooms.length === 0 ? (
        <p className="text-gray-300">No rooms available.</p>
      ) : (
      <ul className="divide-y divide-gray-200 divide-opacity-20">
          {rooms.slice(0, 3).map((room) => (
            <li key={room.room_code} className="px-4 py-4 sm:px-6 hover:bg-white hover:bg-opacity-10 transition-colors duration-150">
            <Link href={`/dashboard/room/${room.room_code}`}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white truncate">{room.room_name}</p>
                <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Active
                </span>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <p className="text-sm text-gray-200">{room.members_count} Members</p>
                  <p className="text-sm text-gray-200">Last active: 3 hours ago</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      </div>

      <button
        onClick={handleSignOut}
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Sign Out
      </button>
    </div>
  );
}
