'use client'

import React from 'react'
import Header from '../components/Header'
import {
  PaperAirplaneIcon, // For travel_explore
  MagnifyingGlassIcon, // For search
  PlusCircleIcon, // For add_circle
  ArrowRightIcon, // For arrow_forward
  LifebuoyIcon, // For support_agent
  CheckCircleIcon, // For "Đã lên kế hoạch" status
  ClockIcon, // For "Đang chờ xử lý" status
} from '@heroicons/react/24/outline'

// NOTE: The original HTML uses custom colors (primary: #13a4ec) and a custom dark mode setup.
// For simplicity in this standalone React component, I'm using default Tailwind colors
// but respecting the custom color usage when applying the 'primary' class.

const DashboardPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200">
      <Header />

      {/* Main Content */}
      <main className="flex-grow">
        
        {/* Hero Section / Search Bar */}
        <div className="bg-gray-50 dark:bg-gray-900/50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              Chào mừng trở lại, Nhà thám hiểm!
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Hành trình tiếp theo của bạn đang chờ đợi.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-lg mx-auto">
              <div className="relative flex-grow">
                {/* Replacing material-symbols-outlined: search with Heroicon: MagnifyingGlassIcon */}
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Tìm kiếm điểm đến..."
                  type="search"
                />
              </div>
              <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors whitespace-nowrap">
                Lập kế hoạch chuyến đi mới
              </button>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Upcoming Trips Section */}
          <section>
            <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
              Chuyến đi sắp tới
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Trip Card 1 (Planned) */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                <div 
                  className="h-48 bg-cover bg-center" 
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDLlkn6MWAPtIz3u4PBxZ2VZ8PiL6GQbGbWvRM7hTHZ6getLruvhtt-p8_wRhCGExQvhbEVIcawHTE6EdCaGzP_Cqs5pJq3eYCaeXgJlJVA5NIps4mcnZOG7SKAyFSusPjPObOpkloWHDsJJA0QMb-dJpNuD6o8hBSFoCAGO1AKGHXLkAvHH1TmOCmvgJ6bgggwknxdtrLfKA_ZUgV2QMbkZBPeYzCTJb6B0_If48PFh1XaqDka7VPSSEkX2XgSMVm-GJy1HylViss')" }}
                ></div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-800 dark:text-white">
                    Khám phá Paris
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    15 tháng 10 - 22 tháng 10, 2023
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
                        <CheckCircleIcon className="w-4 h-4" />
                        <span>Đã lên kế hoạch</span>
                    </div>
                    <a className="text-primary hover:underline" href="#">
                      Xem chi tiết
                    </a>
                  </div>
                </div>
              </div>

              {/* Trip Card 2 (Pending) */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                <div 
                  className="h-48 bg-cover bg-center" 
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDLlkn6MWAPtIz3u4PBxZ2VZ8PiL6GQbGbWvRM7hTHZ6getLruvhtt-p8_wRhCGExQvhbEVIcawHTE6EdCaGzP_Cqs5pJq3eYCaeXgJlJVA5NIps4mcnZOG7SKAyFSusPjPObOpkloWHDsJJA0QMb-dJpNuD6o8hBSFoCAGO1AKGHXLkAvHH1TmOCmvgJ6bgggwknxdtrLfKA_ZUgV2QMbkZBPeYzCTJb6B0_If48PFh1XaqDka7VPSSEkX2XgSMVm-GJy1HylViss')" }}
                ></div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-800 dark:text-white">
                    Phiêu lưu tại Tokyo
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    5 tháng 11 - 15 tháng 11, 2023
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm font-medium text-yellow-600 dark:text-yellow-400">
                        <ClockIcon className="w-4 h-4" />
                        <span>Đang chờ xử lý</span>
                    </div>
                    <a className="text-primary hover:underline" href="#">
                      Xem chi tiết
                    </a>
                  </div>
                </div>
              </div>

              {/* Add New Trip Card */}
              <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors cursor-pointer p-8">
                <div className="text-center">
                  {/* Replacing material-symbols-outlined: add_circle with Heroicon: PlusCircleIcon */}
                  <PlusCircleIcon className="w-12 h-12 mx-auto" />
                  <p className="mt-2 font-semibold">Tạo Chuyến Đi Mới</p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action Banner */}
          <section className="mt-16">
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="absolute inset-0">
                <img 
                  alt="Explore background" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyDavwP1AJg0j7D8Y19v9_dJn_C9mgQI8Ct5ezEA72UYdFYOrXrHDMvtd-skVd7bfE2iur_y2PT1q2V_BTxux3INk7KIPLz98izwUtdBSEqciUySjyANZXY96i-o4l6ioBJ38PWp1u7iT_0uNMZ1BMmbUybpGkEPu8pUNPwqocvH3Begr1iXrFrdTK_N3qN0Jj4KMLiFA5aN-iMRmve7rSX8D6MV_PqUZOoeUiF68GteufY59s23TkaIbN-lV6sZ5ITTUV8cDPEFA"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20"></div>
              </div>
              <div className="relative p-8 md:p-12 text-white">
                <h3 className="text-3xl font-bold">
                  Mở khóa hành trình hoàn hảo
                </h3>
                <p className="mt-2 max-w-lg">
                  Tận dụng tối đa các công cụ lập kế hoạch tiên tiến của chúng tôi và khám phá những viên ngọc ẩn với bản đồ thời gian thực.
                </p>
                <button className="mt-6 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                  Khám Phá Thêm
                  {/* Replacing material-symbols-outlined: arrow_forward with Heroicon: ArrowRightIcon */}
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </section>

          {/* Destination Suggestions Section */}
          <section className="mt-16">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
              Gợi ý điểm đến
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              
              {/* Destination Card 1 */}
              <div className="relative group rounded-xl overflow-hidden">
                <img 
                  alt="Bali" 
                  className="w-full h-72 object-cover transform group-hover:scale-110 transition-transform duration-300" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYl1YlnQglpZ0DKNK-K1rTQkXjTYzp3jjtRgqXmcZubwiGkYnYdr8DqAMFnMm20JTZXCR_pWR0d_s7qQkXaOdEcro1tfJT_LDMq_-sOHcJknSiW-41Y6H_wdYnOSlEv_l43VsXdUjuNWXRQC8_xxxR9NWkmOWHrw_jSBV9kYo3dpWerGQ7A4vSoo7lgGL5cSQn2-QG8bcC6JZyf8WwigxuWksF9CT2RZFCTSni14Y9PtPuP0gzbsEy0R4NxK7hxxIDhD5CSOm41pA"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h4 className="text-lg font-bold text-white">Bali, Indonesia</h4>
                  <p className="text-white/80 text-sm">Thiên đường nhiệt đới</p>
                </div>
              </div>

              {/* Destination Card 2 */}
              <div className="relative group rounded-xl overflow-hidden">
                <img 
                  alt="Kyoto" 
                  className="w-full h-72 object-cover transform group-hover:scale-110 transition-transform duration-300" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDa6qFFU_al8DklK488HxuySgBtZQhE7mHm1cyzwSS-I6Uj7HEBHOdOrlNAW-AZjfVAtJMpmqrYeSY8tT4Ig5l-_W3APwth-68BSVzPPXFhjmRyuEg_9YvTa-NsWhaU6hvK4FEjjpzEB_-D0X1o1vF4CvZ_wOuYpjy2VyRIe7nUtZ5kgYutSc7qJTNiIfwmjdR7U7ltrXzUNrThyteTyinLOv1nS2D9NvdNdoGG7OTzrPNXTEcVNlvA9WmX4Gi7fofjRksNvU5XMS4"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h4 className="text-lg font-bold text-white">Kyoto, Nhật Bản</h4>
                  <p className="text-white/80 text-sm">Vẻ đẹp cổ kính</p>
                </div>
              </div>

              {/* Destination Card 3 */}
              <div className="relative group rounded-xl overflow-hidden">
                <img 
                  alt="Santorini" 
                  className="w-full h-72 object-cover transform group-hover:scale-110 transition-transform duration-300" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCD3c_v2SEwMD8Tewef1aQNXpKOaYMiFCjqtJdVyAVddrJL5CyOeDwDLSw3_LjP2kiAv6-eBEXXg5n_dgf-7c8QBzbdPCY6eTfkswGUi1NXHlnivW4YrjurhOBk0K-o-Ylc3UnvayROFN0sghGoBXsBqlkeBAvOyyjPLfzSfkWbw6HVt4CL60bAyzQdvNFMspsZ_7M3_hE8xrxDmrf0vcY9n603YbmKwR5zYEo_Y4_6eTFDamP3Wybq-aTyw7jrx9XRw7neSGu1UsY"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h4 className="text-lg font-bold text-white">Santorini, Hy Lạp</h4>
                  <p className="text-white/80 text-sm">Hoàng hôn huyền diệu</p>
                </div>
              </div>

              {/* Destination Card 4 */}
              <div className="relative group rounded-xl overflow-hidden">
                <img 
                  alt="Rome" 
                  className="w-full h-72 object-cover transform group-hover:scale-110 transition-transform duration-300" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyDavwP1AJg0j7D8Y19v9_dJn_C9mgQI8Ct5ezEA72UYdFYOrXrHDMvtd-skVd7bfE2iur_y2PT1q2V_BTxux3INk7KIPLz98izwUtdBSEqciUySjyANZXY96i-o4l6ioBJ38PWp1u7iT_0uNMZ1BMmbUybpGkEPu8pUNPwqocvH3Begr1iXrFrdTK_N3qN0Jj4KMLiFA5aN-iMRmve7rSX8D6MV_PqUZOoeUiF68GteufY59s23TkaIbN-lV6sZ5ITTUV8cDPEFA"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h4 className="text-lg font-bold text-white">Rome, Ý</h4>
                  <p className="text-white/80 text-sm">Thành phố vĩnh hằng</p>
                </div>
              </div>

            </div>
          </section>
        </div>
      </main>

      {/* Fixed Support Button */}
      <button className="fixed bottom-6 right-6 bg-primary text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-90 transition-transform hover:scale-110">
        {/* Replacing material-symbols-outlined: support_agent with Heroicon: LifebuoyIcon */}
        <LifebuoyIcon className="w-8 h-8" />
      </button>

    </div>
  )
}

export default DashboardPage