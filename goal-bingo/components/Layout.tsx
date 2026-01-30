
import React from 'react';
import { Home, Calendar, LayoutGrid, Heart, Bell, Settings, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-full bg-[#E6F0F3] p-4 lg:p-8 overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col items-center justify-between w-20 bg-white/70 backdrop-blur-md rounded-3xl py-8 shadow-sm mr-8">
        <div className="flex flex-col items-center space-y-8">
          <div className="bg-[#4FD1C5]/20 p-3 rounded-2xl">
            <LayoutGrid className="text-[#38B2AC] w-6 h-6" />
          </div>
          <nav className="flex flex-col items-center space-y-6">
            <Home className="text-gray-400 w-6 h-6 cursor-pointer hover:text-[#38B2AC]" />
            <Calendar className="text-gray-400 w-6 h-6 cursor-pointer hover:text-[#38B2AC]" />
            <Heart className="text-gray-400 w-6 h-6 cursor-pointer hover:text-[#38B2AC]" />
            <Bell className="text-gray-400 w-6 h-6 cursor-pointer hover:text-[#38B2AC]" />
          </nav>
        </div>
        <div className="flex flex-col items-center space-y-6">
          <Settings className="text-gray-400 w-6 h-6 cursor-pointer hover:text-[#38B2AC]" />
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm cursor-pointer">
             <img src="https://picsum.photos/seed/user1/100/100" alt="Avatar" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative bg-white/40 rounded-[2.5rem] shadow-xl p-6 lg:p-10 border border-white/60">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
