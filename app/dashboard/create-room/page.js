"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FaMusic } from "react-icons/fa"; // Correct icon import

export default function CreateRoom() {
  const [roomName, setRoomName] = useState("");
  const [visibility, setVisibility] = useState(true); // Default to private room
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!roomName.trim() || !session?.user?.id) return;

    setIsLoading(true);
    const response = await fetch("/api/supabase/create-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room_name: roomName,
        google_id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        visibility: visibility ? "private" : "public", // Send "private" or "public" for visibility
      }),
    });

    const data = await response.json();
    setIsLoading(false);
    if (response.ok) {
      router.push(`/dashboard/room/${data.room_code}`);
    } else {
      console.error("Error creating room:", data.error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Create a New Room</h1>
        <p className="text-gray-200">Create a collaborative music room and invite your friends</p>
      </div>

      <div className="bg-white bg-opacity-20 backdrop-blur-sm shadow overflow-hidden sm:rounded-lg p-6">
        <form onSubmit={handleCreateRoom} className="space-y-6">
          <div>
            <label htmlFor="roomName" className="block text-sm font-medium text-white mb-1">
              Room Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMusic className="h-5 w-5 text-gray-300" />
              </div>
              <input
                type="text"
                id="roomName"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
                placeholder="My Awesome Playlist"
                className="pl-10 block w-full rounded-md border-0 py-3 bg-white bg-opacity-20 text-white placeholder-gray-300 focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading || !roomName}
              className={`w-full flex justify-center py-3 px-4 rounded-lg shadow-md text-white bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-150 ${
                isLoading || !roomName ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Create Room"
              )}
            </button>
          </div>

          {/* Room Visibility Selection */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-white mb-2">Room Privacy</h3>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setVisibility(true)}
                className={`flex-1 py-3 px-4 rounded-lg text-center ${
                  visibility
                    ? "bg-black text-white"
                    : "bg-white bg-opacity-20 text-gray-300 hover:bg-opacity-30"
                }`}
              >
                Private
                <p className="text-xs">Only people with code can join</p>
              </button>
              <button
                type="button"
                onClick={() => setVisibility(false)}
                className={`flex-1 py-3 px-4 rounded-lg text-center ${
                  !visibility
                    ? "bg-black text-white"
                    : "bg-white bg-opacity-20 text-gray-300 hover:bg-opacity-30"
                }`}
              >
                Public
                <p className="text-xs">Anyone can search and join</p>
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="mt-6 bg-white bg-opacity-20 backdrop-blur-sm shadow overflow-hidden sm:rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">What happens next?</h2>
        <ul className="space-y-3 text-white">
          <li className="flex items-start">
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-black text-white mr-3">1</span>
            <span>Your room will be created with a unique code</span>
          </li>
          <li className="flex items-start">
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-black text-white mr-3">2</span>
            <span>Share this code with friends to let them join</span>
          </li>
          <li className="flex items-start">
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-black text-white mr-3">3</span>
            <span>Start adding songs to your collaborative playlist</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
