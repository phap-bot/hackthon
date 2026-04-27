import React from 'react';

export default function ActiveDashboard() {
  return (
    <section className="py-12 bg-surface">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="font-h2 text-on-surface mb-2">Welcome back, Nguyen!</h2>
            <p className="font-body-md text-on-surface-variant">Here's your upcoming trip to Central Vietnam.</p>
          </div>
          <button className="text-primary font-label-md hover:underline hidden sm:block">View all trips</button>
        </div>

        <div className="bg-surface-container-low border border-outline-variant rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-outline-variant p-6 bg-primary-fixed/20">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-full">card_travel</span>
                <span className="font-label-md text-primary">UPCOMING TRIP</span>
              </div>
              <h3 className="font-h3 text-on-surface mb-2">Hue - Da Nang - Hoi An</h3>
              <p className="font-body-md text-on-surface-variant flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-lg">calendar_month</span>
                15 Oct - 22 Oct, 2023
              </p>
              
              <div className="space-y-4">
                <div className="bg-surface p-4 rounded-xl shadow-sm border border-outline-variant">
                  <div className="flex items-start gap-4">
                    <div className="bg-tertiary-container text-on-tertiary-container w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-label-md">D1</div>
                    <div>
                      <p className="font-label-md text-on-surface mb-1">Flight to Hue (HUI)</p>
                      <p className="font-body-md text-on-surface-variant text-sm border-l-2 border-tertiary pl-3 ml-1 mt-2">10:30 AM - VN1543</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-6 bg-surface border border-outline text-on-surface font-label-md py-3 rounded-full hover:bg-surface-container transition-colors">Manage Itinerary</button>
            </div>
            
            <div className="md:col-span-2 relative h-[300px] md:h-auto overflow-hidden bg-slate-100">
              {/* Map placeholder or live map component could go here */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                <span className="material-symbols-outlined text-5xl mb-2">map</span>
                <p className="font-label-md">Interactive Map View</p>
                <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-primary rounded-full shadow-lg shadow-primary/50 animate-pulse"></div>
                <div className="absolute top-1/3 left-1/2 w-4 h-4 bg-tertiary rounded-full shadow-lg shadow-tertiary/50 animate-pulse delay-700"></div>
                <div className="absolute top-2/3 right-1/4 w-4 h-4 bg-secondary rounded-full shadow-lg shadow-secondary/50 animate-pulse delay-300"></div>
                
                <svg className="absolute inset-0 w-full h-full stroke-primary stroke-2 fill-none" style={{strokeDasharray: '5,5', opacity: 0.3}}>
                  <path d="M 25% 50% Q 37% 33% 50% 33% T 75% 66%"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
