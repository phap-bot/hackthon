"use client";

import { useState } from "react";

export interface Activity {
  time: string;
  place: string;
  desc: string;
  cost?: number;
  cost_note?: string;
  alternatives?: {
    title: string;
    description: string;
    cost: number;
  }[];
}

export interface DayPlan {
  day: number;
  title: string;
  activities: Activity[];
}

interface ItineraryTimelineProps {
  data: DayPlan[];
  onActivityChange?: (day: number, activityIndex: number, newActivity: Activity) => void;
}

export default function ItineraryTimeline({ data, onActivityChange }: ItineraryTimelineProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemId: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(itemId)) {
      newOpenItems.delete(itemId);
    } else {
      newOpenItems.add(itemId);
    }
    setOpenItems(newOpenItems);
  };

  const getIcon = (index: number) => {
    const icons = [
      "flight_land",
      "park",
      "restaurant",
      "cable_car",
      "hiking",
      "local_florist",
      "train",
      "shopping_bag",
      "flight_takeoff",
    ];
    return icons[index % icons.length];
  };

  return (
    <div className="space-y-8">
      {data.map((day) => (
        <div key={day.day}>
          <h2 className="text-2xl font-bold mb-4 text-primary">
            🗓️ {day.title}
          </h2>
          
          <div className="space-y-6">
            {day.activities.map((activity, idx) => {
              const itemId = `${day.day}-${idx}`;
              const hasAlternatives = activity.alternatives && activity.alternatives.length > 0;

              return (
                <div key={idx} className="flex gap-4">
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-lg">{getIcon(idx)}</span>
                    </div>
                    {idx < day.activities.length - 1 && (
                      <div className="flex-grow w-px bg-gray-300 dark:bg-gray-700 my-2"></div>
                    )}
                  </div>

                  {/* Activity Content */}
                  <div className="flex-grow pb-6">
                    <p className="font-bold text-gray-900 dark:text-gray-100">{activity.time}</p>
                    <div className="flex justify-between items-start gap-2 mt-1">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{activity.place}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{activity.desc}</p>
                      </div>
                      {(activity.cost || activity.cost_note) && (
                        <div className="text-right flex-shrink-0">
                          {activity.cost && (
                            <p className="font-bold text-lg text-gray-900 dark:text-gray-100">
                              {activity.cost.toLocaleString('vi-VN')}đ
                            </p>
                          )}
                          {activity.cost_note && (
                            <p className="text-xs text-gray-500 dark:text-gray-500">{activity.cost_note}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Alternatives */}
                    {hasAlternatives && (
                      <>
                        <button
                          onClick={() => toggleItem(itemId)}
                          className="mt-3 flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                        >
                          <span className="material-symbols-outlined text-base">swap_horiz</span>
                          <span>Xem các lựa chọn thay thế</span>
                        </button>

                        {openItems.has(itemId) && (
                          <div className="mt-4 space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h4 className="font-bold text-sm">Các lựa chọn thay thế:</h4>
                            {activity.alternatives!.map((alt, altIndex) => (
                              <div
                                key={altIndex}
                                className="flex items-start justify-between gap-3 py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                              >
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
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

