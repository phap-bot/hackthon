import React from 'react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative h-[65vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      <img alt="Vietnam Landscape" className="absolute inset-0 w-full h-full object-cover object-center scale-105 hover:scale-100 transition-transform duration-10000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwlB3tkJgiOFkwh6fmNIhVzZhl8XNb3lqa7Ef7xfFrHDixBxCHVnW55_JPhAU6wrDJOOdO1UABTM2raMmdHXuUVgi2B-ueru6E8KRWG1km4n8IZKsH3b_5YVNDxjILMhmb2L1JroJAGO5OIw0CtlaHj3lBXrcRPOS1v6Q4DwbrO4Macc4A0LS7_4D5V6rvpeyQ0Uxwlt2Yaqe5qEez6Lk9orgSD7FzgPo8U_sx7f-C5t6MIYuLWYuxfPVv2iAYbmaon7OhSQAifgQ" />
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="font-h1 text-white mb-6 drop-shadow-xl text-5xl md:text-7xl">Discover the Beauty of Vietnam</h1>
        <p className="font-body-lg text-white/90 mb-10 max-w-2xl drop-shadow-md text-lg md:text-xl">Your AI-powered travel companion for crafting the perfect itinerary to Hạ Long Bay, Hội An, and beyond.</p>
        <div className="bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20 flex flex-col sm:flex-row items-center gap-2 max-w-3xl w-full mx-auto shadow-2xl">
          <div className="flex-1 w-full bg-white rounded-full px-6 py-4 flex items-center">
            <span className="material-symbols-outlined text-outline mr-3">pin_drop</span>
            <input className="bg-transparent border-none focus:ring-0 w-full font-body-md text-on-surface outline-none" placeholder="Where to?" type="text" />
          </div>
          <div className="flex-1 w-full bg-white rounded-full px-6 py-4 flex items-center hidden sm:flex">
            <span className="material-symbols-outlined text-outline mr-3">calendar_today</span>
            <input className="bg-transparent border-none focus:ring-0 w-full font-body-md text-on-surface outline-none" placeholder="Dates" type="text" />
          </div>
          <Link href="/planner" className="bg-primary hover:bg-primary/90 text-on-primary font-label-md px-10 py-5 rounded-full transition-all w-full sm:w-auto shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-center whitespace-nowrap">
            Generate Plan
          </Link>
        </div>
      </div>
    </section>
  );
}
