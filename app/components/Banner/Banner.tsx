'use client'

import React from 'react'
import { ArrowRightIcon, MapPinIcon } from '@heroicons/react/24/solid'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'

const Banner = () => {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 overflow-hidden min-h-screen" style={{ zIndex: 1 }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full opacity-60 blur-xl animate-pulse" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-pink-300 to-purple-400 rounded-full opacity-50 blur-lg animate-bounce" />
        <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-gradient-to-r from-green-300 to-blue-400 rounded-full opacity-40 blur-md animate-ping" />
        <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-gradient-to-r from-red-300 to-pink-400 rounded-full opacity-30 blur-sm animate-pulse" />
        
        {/* Moving Clouds */}
        <div className="absolute top-10 left-1/2 w-32 h-16 bg-white/20 rounded-full blur-sm animate-float-slow" />
        <div className="absolute top-32 right-1/4 w-24 h-12 bg-white/15 rounded-full blur-sm animate-float-reverse" />
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/3 left-1/6 w-40 h-40 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/6 w-32 h-32 bg-gradient-to-r from-accent/20 to-sky/20 rounded-full blur-2xl animate-float-reverse" />
      </div>

      {/* Hero Content with Staggered Animation */}
      <div className="max-w-4xl z-10 relative">
        {/* Main Title with Typewriter Effect */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-primary via-ocean to-secondary bg-clip-text text-transparent animate-gradient-x">
              Plan Your Next
            </span>
            <br />
            <span className="bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent animate-gradient-x-reverse">
              Adventure with AI
            </span>
          </h1>
        </div>

        {/* Subtitle with Fade In */}
        <div className="mb-12 animate-fade-in-up">
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Hãy để <span className="font-bold bg-gradient-to-r from-primary to-ocean bg-clip-text text-transparent">AI Travel Planner </span> 
            giúp bạn tạo lịch trình hoàn hảo – phù hợp với ngân sách, sở thích, và thời gian của bạn. 🌏
          </p>
        </div>

        {/* Action Buttons with Hover Effects */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
          <a
            href="/planner"
            className="group relative px-8 py-4 bg-gradient-to-r from-primary to-ocean text-white rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-ocean to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center justify-center gap-3">
              <PaperAirplaneIcon className="w-6 h-6 group-hover:animate-bounce" />
              <span>Tạo lịch trình ngay</span>
            </div>
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </a>

          <a
            href="#about"
            className="group relative px-8 py-4 border-2 border-primary text-primary rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            <div className="relative flex items-center justify-center gap-3">
              <MapPinIcon className="w-6 h-6 group-hover:animate-pulse" />
              <span>Khám phá thêm</span>
            </div>
          </a>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="group p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/80 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <div className="text-4xl mb-3 group-hover:animate-bounce">🤖</div>
            <h3 className="font-semibold text-gray-800 mb-2">AI Thông Minh</h3>
            <p className="text-sm text-gray-600">Tạo lịch trình tối ưu với công nghệ AI tiên tiến</p>
          </div>
          <div className="group p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/80 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <div className="text-4xl mb-3 group-hover:animate-bounce">⚡</div>
            <h3 className="font-semibold text-gray-800 mb-2">Nhanh Chóng</h3>
            <p className="text-sm text-gray-600">Tạo lịch trình trong vài phút thay vì vài giờ</p>
          </div>
          <div className="group p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/80 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <div className="text-4xl mb-3 group-hover:animate-bounce">🎯</div>
            <h3 className="font-semibold text-gray-800 mb-2">Cá Nhân Hóa</h3>
            <p className="text-sm text-gray-600">Phù hợp với sở thích và ngân sách của bạn</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center text-primary">
          <span className="text-sm font-medium mb-2">Khám phá thêm</span>
          <ArrowRightIcon className="w-6 h-6 rotate-90" />
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-5deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          33% { transform: translateX(30px) translateY(-10px); }
          66% { transform: translateX(-20px) translateY(10px); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes gradient-x-reverse {
          0%, 100% { background-position: 100% 50%; }
          50% { background-position: 0% 50%; }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-reverse { animation: float-reverse 8s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
        .animate-gradient-x { 
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .animate-gradient-x-reverse { 
          background-size: 200% 200%;
          animation: gradient-x-reverse 3s ease infinite;
        }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out; }
      `}</style>
    </section>
  )
}

export default Banner