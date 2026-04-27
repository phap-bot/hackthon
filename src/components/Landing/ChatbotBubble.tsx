export default function ChatbotBubble() {
  return (
    <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50">
      <button className="bg-primary text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-110 transition-transform duration-300">
        <span className="material-symbols-outlined text-3xl">smart_toy</span>
      </button>
      <div className="absolute right-0 bottom-[120%] w-max bg-white text-sm text-slate-700 px-4 py-2 rounded-2xl rounded-br-none shadow-md border border-slate-100 opacity-0 md:opacity-100 transition-opacity">
        Need itinerary help?
      </div>
    </div>
  );
}
