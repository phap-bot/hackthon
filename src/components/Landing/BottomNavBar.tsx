'use client'
import React from 'react';
import Link from 'next/link';

export default function BottomNavBar() {
  return (
    <nav className="fixed bottom-0 w-full z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:hidden">
      <div className="flex justify-around items-center h-20 px-2 pb-2">
        <Link href="/" className="flex flex-col items-center gap-1 p-2 text-primary">
          <div className="relative">
            <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>explore</span>
          </div>
          <span className="text-[10px] font-label-md">Home</span>
        </Link>
        <Link href="/planner" className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-2xl">card_travel</span>
          <span className="text-[10px] font-label-md">Plan</span>
        </Link>
        <Link href="/dashboard" className="flex items-center justify-center -mt-6">
          <div className="bg-primary text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-primary/40 border-4 border-white">
            <span className="material-symbols-outlined text-2xl">add</span>
          </div>
        </Link>
        <Link href="/maps" className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-2xl">map</span>
          <span className="text-[10px] font-label-md">Map</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-2xl">person</span>
          <span className="text-[10px] font-label-md">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
