'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function TopNavBar() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2 text-gray-800 dark:text-white">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="material-symbols-outlined text-blue-500 text-3xl group-hover:scale-110 transition-transform">travel_explore</span>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">Wanderlust</h1>
            </Link>
            <nav className="hidden md:flex flex-1 items-center gap-6 ml-8">
              <Link href="/" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors border-b-2 border-transparent hover:border-blue-500 pb-1">Trang chủ</Link>
              <Link href="/planner" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors border-b-2 border-transparent hover:border-blue-500 pb-1">Lên lịch</Link>
              <Link href="/maps" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors border-b-2 border-transparent hover:border-blue-500 pb-1">Bản đồ</Link>
              <Link href="/discover" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors border-b-2 border-transparent hover:border-blue-500 pb-1">Khám phá</Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-500 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
            </button>
            
            {user ? (
              <div className="relative group" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <img alt="User Avatar" className="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-600 shadow-sm" src={user.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuCyDavwP1AJg0j7D8Y19v9_dJn_C9mgQI8Ct5ezEA72UYdFYOrXrHDMvtd-skVd7bfE2iur_y2PT1q2V_BTxux3INk7KIPLz98izwUtdBSEqciUySjyANZXY96i-o4l6ioBJ38PWp1u7iT_0uNMZ1BMmbUybpGkEPu8pUNPwqocvH3Begr1iXrFrdTK_N3qN0Jj4KMLiFA5aN-iMRmve7rSX8D6MV_PqUZOoeUiF68GteufY59s23TkaIbN-lV6sZ5ITTUV8cDPEFA"}/>
                  <div className="text-left hidden sm:block">
                    <p className="font-semibold text-sm text-gray-800 dark:text-white line-clamp-1">{user.full_name || user.username || 'Nhà thám hiểm'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">{user.email}</p>
                  </div>
                  <span className={`material-symbols-outlined text-gray-500 dark:text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
                
                <div className={`absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl transition-all duration-300 transform border border-gray-100 dark:border-gray-700 ${isDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                  <div className="py-2">
                    <Link className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors w-full" href="/profile" onClick={() => setIsDropdownOpen(false)}>
                      <span className="material-symbols-outlined mr-3 !text-xl text-blue-500">person</span>
                      Hồ sơ của tôi
                    </Link>
                    <Link className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors w-full" href="/dashboard" onClick={() => setIsDropdownOpen(false)}>
                      <span className="material-symbols-outlined mr-3 !text-xl text-green-500">bookmark</span>
                      Lịch trình đã lưu
                    </Link>
                    <Link className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors w-full" href="/settings" onClick={() => setIsDropdownOpen(false)}>
                      <span className="material-symbols-outlined mr-3 !text-xl text-gray-500">settings</span>
                      Cài đặt
                    </Link>
                    <Link className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors w-full" href="/help" onClick={() => setIsDropdownOpen(false)}>
                      <span className="material-symbols-outlined mr-3 !text-xl text-indigo-500">help_center</span>
                      Trung tâm trợ giúp
                    </Link>
                    <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>
                    <button onClick={() => { setIsDropdownOpen(false); logout(); }} className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <span className="material-symbols-outlined mr-3 !text-xl">logout</span>
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors">
                  Đăng nhập
                </Link>
                <Link href="/register" className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
