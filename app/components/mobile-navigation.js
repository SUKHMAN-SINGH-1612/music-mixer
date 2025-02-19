"use client";

import Link from "next/link";
import { Home, Folder, PlusCircle, Key, Search } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Folder, label: "Rooms", href: "/dashboard/rooms" },
  { icon: PlusCircle, label: "Create", href: "/dashboard/create-room" },
  { icon: Key, label: "Join", href: "/dashboard/join-room" },
  { icon: Search, label: "Search", href: "/dashboard/search" },
];

export default function MobileNavigation() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black bg-opacity-90 backdrop-blur-sm border-t border-primary-foreground border-opacity-20">
      <nav className="flex justify-between">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center justify-center w-full py-2 text-xs font-medium text-primary-foreground hover:bg-white hover:bg-opacity-10 transition-colors duration-150"
          >
            <item.icon className="h-6 w-6" />
            <span className="mt-1">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}