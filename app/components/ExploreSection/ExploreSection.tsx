'use client'
import React from 'react'

export default function ExploreSection() {
  return (
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
          <h3 className="text-3xl font-bold">Mở khóa hành trình hoàn hảo</h3>
          <p className="mt-2 max-w-lg">
            Tận dụng tối đa các công cụ lập kế hoạch tiên tiến của chúng tôi và khám phá những viên ngọc ẩn với bản đồ thời gian thực.
          </p>
          <button className="mt-6 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
            Khám Phá Thêm
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </section>
  )
}
