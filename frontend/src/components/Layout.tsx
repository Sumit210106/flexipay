import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-gray-100 flex flex-col relative overflow-hidden">
      {/* Subtle background ambient gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-900/5 blur-[80px] pointer-events-none" />

      <Navbar />
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12 relative z-10">
        <Outlet />
      </main>
    </div>
  );
};
