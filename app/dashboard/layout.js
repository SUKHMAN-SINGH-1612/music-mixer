"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import MobileNavigation from "../components/mobile-navigation";

export default function DashboardLayout({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Prevent rendering on the server
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-800 via-pink-900 to-red-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white bg-opacity-10 backdrop-blur-sm pb-16">
          {children}
        </main>
        <MobileNavigation />
      </div>
    </div>
  );
}
