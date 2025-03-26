"use client";

import Link from "next/link";
import { Home, Folder, PlusCircle, Key, Search, MessageCircle, LogOut } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Folder, label: "My Rooms", href: "/dashboard/rooms" },
  { icon: PlusCircle, label: "Create Room", href: "/dashboard/create-room" },
  { icon: Key, label: "Join Room", href: "/dashboard/join-room" },
  { icon: Search, label: "Search Songs", href: "/dashboard/search" },
];

export default function Sidebar() {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-primary bg-opacity-90 backdrop-blur-sm">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <span className="text-primary-foreground text-2xl font-semibold">Music Collab</span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-primary-foreground hover:bg-white hover:bg-opacity-10 transition-colors duration-150"
                >
                  <item.icon className="mr-3 flex-shrink-0 h-6 w-6" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex bg-primary-foreground bg-opacity-10 p-4">
            <Link href="/logout" className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <LogOut className="inline-block h-9 w-9 rounded-full text-primary-foreground" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-primary-foreground">Logout</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
