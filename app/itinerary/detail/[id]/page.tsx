"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  description: string;
  cost: number;
  costNote: string;
  icon: string;
  alternatives?: {
    title: string;
    description: string;
    cost: number;
  }[];
}

interface ItineraryDay {
  day: number;
  items: ItineraryItem[];
}

interface Itinerary {
  id: string;
  title: string;
  duration: string;
  people: number;
  budget: number;
  days: ItineraryDay[];
  totalCost: number;
}

export default function ItineraryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const itineraryId = params.id as string;
  
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(1);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load itinerary from localStorage or backend
    const loadItinerary = async () => {
      try {
        // Check if this is a temp itinerary from localStorage
        if (itineraryId === 'temp') {
          const stored = localStorage.getItem('currentItinerary');
          if (stored) {
            const data = JSON.parse(stored);
            // Transform AI response to UI format
            const transformed = {
              id: 'temp',
              title: 'Chuyến đi demo của bạn',
              duration: `${data.schedule.length} Ngày ${data.schedule.length - 1} Đêm`,
              people: 2,
              budget: 5000000,
              totalCost: 4850000,
              days: data.schedule.map((day: any) => ({
                day: day.day,
                items: day.activities.map((act: any) => ({
                  id: `${day.day}-${act.time}`,
                  time: act.time,
                  title: act.place,
                  description: act.desc || '',
                  cost: act.cost || 0,
                  costNote: act.cost_note || '',
                  icon: 'pin_drop',
                }))
              })),
            };
            setItinerary(transformed);
            setLoading(false);
            return;
          }
        }
        
        // Try to load from backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/itinerary/${itineraryId}`);
        if (!response.ok) throw new Error("Failed to load itinerary");
        
        const data = await response.json();
        setItinerary(data);
      } catch (error) {
        console.error("Error loading itinerary:", error);
        // For demo, create sample data
        setItinerary(createSampleItinerary());
      } finally {
        setLoading(false);
      }
    };

    loadItinerary();
  }, [itineraryId]);

  const toggleItem = (itemId: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(itemId)) {
      newOpenItems.delete(itemId);
    } else {
      newOpenItems.add(itemId);
    }
    setOpenItems(newOpenItems);
  };

  const handleSave = async () => {
    if (!itinerary) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/itinerary/${itineraryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itinerary),
      });

      if (response.ok) {
        alert("✅ Lịch trình đã được lưu!");
      }
    } catch (error) {
      console.error("Error saving itinerary:", error);
      alert("❌ Không thể lưu lịch trình");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!itinerary) return null;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="bg-white dark:bg-card-dark/50 backdrop-blur-sm sticky top-0 z-20 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => router.back()} className="text-primary">
                <span className="material-symbols-outlined text-2xl">arrow_back</span>
              </button>
              <h1 className="text-xl font-bold">Wanderlust</h1>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined text-xl">save</span>
                <span>Lưu lịch trình</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Itinerary Details */}
          <div className="lg:w-2/3">
            {/* Trip Info Card */}
            <div className="bg-white dark:bg-card-dark p-6 rounded-xl shadow-lg mb-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight">{itinerary.title}</h2>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">
                    {itinerary.duration} | {itinerary.people} người | Ngân sách: {(itinerary.budget / 1000000).toFixed(0)}.000.000đ
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                    <span className="material-symbols-outlined text-xl">edit</span>
                    <span className="text-sm font-medium">Chỉnh sửa</span>
                  </button>
                  <button className="flex items-center gap-2 py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                    <span className="material-symbols-outlined text-xl">share</span>
                    <span className="text-sm font-medium">Chia sẻ</span>
                  </button>
                </div>
              </div>
              
              {/* Total Cost */}
              <div className="mt-4 p-4 rounded-lg bg-primary/10 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-primary">Tổng chi phí ước tính</h3>
                  <p className="text-2xl font-extrabold text-primary">{(itinerary.totalCost).toLocaleString('vi-VN')}đ</p>
                </div>
                <span className="material-symbols-outlined text-4xl text-primary/50">account_balance_wallet</span>
              </div>
            </div>

            {/* Days Tabs */}
            <div className="space-y-8" x-data={`{ activeDay: ${activeDay} }`}>
              {/* Day Selector */}
              <div className="flex items-center border-b border-gray-200 dark:border-gray-700">
                {itinerary.days.map((day) => (
                  <button
                    key={day.day}
                    onClick={() => setActiveDay(day.day)}
                    className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
                      activeDay === day.day
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    Ngày {day.day}
                  </button>
                ))}
              </div>

              {/* Day Content */}
              {itinerary.days.map((day) => (
                <div key={day.day} style={{ display: activeDay === day.day ? 'block' : 'none' }}>
                  <div className="space-y-6">
                    {day.items.map((item, index) => (
                      <div key={item.id} className="flex gap-4">
                        {/* Timeline */}
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined">{item.icon}</span>
                          </div>
                          {index < day.items.length - 1 && (
                            <div className="flex-grow w-px bg-gray-300 dark:bg-gray-700 my-2"></div>
                          )}
                        </div>

                        {/* Item Content */}
                        <div className="flex-grow pb-6">
                          <p className="font-bold">{item.time}</p>
                          <div className="flex justify-between items-start gap-2 mt-1">
                            <div>
                              <h3 className="text-lg font-semibold">{item.title}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-bold text-lg">{item.cost.toLocaleString('vi-VN')}đ</p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">{item.costNote}</p>
                            </div>
                          </div>

                          {/* Alternatives */}
                          {item.alternatives && (
                            <>
                              <button
                                onClick={() => toggleItem(item.id)}
                                className="mt-3 flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                              >
                                <span className="material-symbols-outlined text-base">swap_horiz</span>
                                <span>Xem các lựa chọn thay thế</span>
                              </button>
                              
                              {openItems.has(item.id) && (
                                <div className="mt-4 space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                  <h4 className="font-bold text-sm">Các lựa chọn thay thế:</h4>
                                  {item.alternatives.map((alt, altIndex) => (
                                    <div key={altIndex} className="flex items-start justify-between gap-3 py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                                      <div className="flex-1">
                                        <p className="font-semibold">{alt.title}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">{alt.description}</p>
                                        <p className="font-semibold text-primary text-sm mt-1">
                                          {alt.cost.toLocaleString('vi-VN')}đ
                                        </p>
                                      </div>
                                      <button className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary hover:bg-primary/20 shrink-0">
                                        Chọn
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-24 space-y-6">
              {/* Map */}
              <div className="bg-white dark:bg-card-dark p-6 rounded-xl shadow-lg space-y-4">
                <h3 className="text-xl font-bold">Bản đồ tuyến đường Ngày {activeDay}</h3>
                <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <img 
                    alt={`Bản đồ tuyến đường ngày ${activeDay}`} 
                    className="w-full h-full object-cover" 
                    src="/placeholder-map.png" 
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Tổng quãng đường: <strong>15 km</strong></span>
                  <span>Thời gian di chuyển: <strong>45 phút</strong></span>
                </div>
              </div>

              {/* Nearby Suggestions */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-3xl text-primary">explore</span>
                  <h3 className="text-2xl font-bold">Đề xuất Địa điểm Lân cận</h3>
                </div>
                <div className="space-y-4">
                  {/* Sample nearby places - sẽ được load từ backend */}
                  <div className="bg-white dark:bg-card-dark rounded-xl shadow-lg p-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-800"></div>
                    <div className="flex-1">
                      <h4 className="font-bold">Địa điểm gần đó</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">500m</p>
                      <div className="flex items-center mt-1">
                        <span className="material-symbols-outlined text-yellow-500 text-base">star</span>
                        <span className="text-sm ml-1">4.5 (1,234)</span>
                      </div>
                    </div>
                    <button className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors">
                      <span className="material-symbols-outlined text-xl">add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper function to create sample itinerary
function createSampleItinerary(): Itinerary {
  return {
    id: "sample-1",
    title: "Chuyến đi demo của bạn",
    duration: "3 Ngày 2 Đêm",
    people: 2,
    budget: 5000000,
    totalCost: 4850000,
    days: [
      {
        day: 1,
        items: [
          {
            id: "1-1",
            time: "8:00 - 9:00",
            title: "Đến Đà Lạt, nhận phòng khách sạn",
            description: "Ổn định và chuẩn bị cho ngày đầu tiên khám phá.",
            cost: 1500000,
            costNote: "2 đêm",
            icon: "flight_land",
          },
          {
            id: "1-2",
            time: "9:30 - 11:30",
            title: "Vườn Hoa Thành Phố",
            description: "Tham quan và chụp ảnh tại vườn hoa lớn nhất Đà Lạt.",
            cost: 100000,
            costNote: "2 vé",
            icon: "park",
            alternatives: [
              {
                title: "Vườn hoa Cẩm Tú Cầu",
                description: "Cánh đồng hoa cẩm tú cầu rộng lớn",
                cost: 60000,
              },
              {
                title: "Fresh Garden Dalat",
                description: "Khu du lịch tích hợp nhiều tiểu cảnh",
                cost: 200000,
              },
            ],
          },
          // Add more items...
        ],
      },
      // Add more days...
    ],
  };
}

