"use client";

import Sidebar from "../components/sidebar";
import MobileNavigation from "../components/mobile-navigation";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white bg-opacity-10 backdrop-blur-sm">
          {children}
        </main>
        <MobileNavigation />
      </div>
    </div>
  );
}
