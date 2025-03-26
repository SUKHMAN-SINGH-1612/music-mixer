"use client";

import Link from "next/link";
import { Home, Folder, PlusCircle, Key, Search, MessageCircle, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const navItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Folder, label: "My Rooms", href: "/dashboard/rooms" }, // Folder-based routing
  { icon: PlusCircle, label: "Create Room", href: "/dashboard/create-room" },
  { icon: Key, label: "Join Room", href: "/dashboard/join-room" },
  { icon: Search, label: "Search Songs", href: "/dashboard/search" }
];

export default function Sidebar() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 bg-black h-screen"> {/* Changed bg-primary to bg-black */}
        {/* Sidebar Header */}
        <div className="flex items-center justify-center py-5">
          <h2 className="text-white text-2xl font-semibold">Music Collab</h2> {/* Font color remains white */}
        </div>

        {/* Navigation Links */}
        <nav className="mt-5 flex-1 px-2 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center px-4 py-3 text-white text-sm font-medium rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors duration-150"
            >
              <item.icon className="mr-3 h-6 w-6" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="px-4 py-4 mt-auto">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full text-white text-sm font-medium bg-red-600 px-4 py-3 rounded-lg hover:bg-red-700 transition"
          >
            <LogOut className="mr-3 h-6 w-6" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
