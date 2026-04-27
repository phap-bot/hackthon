'use client'
import React from 'react'

export default function DiscoverPosts() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* Article 1 */}
      <a className="group block bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300" href="#">
        <div className="relative">
          <img alt="Vịnh Hạ Long" className="w-full h-48 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIsiIZwyIGammpDtlwvti5ki1CZY83-NeURJ50c77xoZQQ3pw_E106fjhhhES8hqeeC2AK17Lq7vp5_h2ohq4eIxsgtMrmWLNku7d0Auvwdq8LqPE7oQIbDGflxMXJHnBnNbMQ5ulOKTVY7-GmmhNOS9iQwW3FsvQvrxHzLWOl1ex2Yzb8A7VkguPmYwvXEnRpi1zp2dazKJeSaTZWGjC34zUfZW9oIeZVesomUDP4ebvfriQPoQCAnJoZuce1sCL-MGypFft3wxI"/>
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
        </div>
        <div className="p-4">
          <h4 className="font-bold text-lg text-gray-800 dark:text-white group-hover:text-primary transition-colors">Vẻ đẹp kỳ vĩ của Vịnh Hạ Long</h4>
        </div>
      </a>

      {/* Article 2 */}
      <a className="group block bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300" href="#">
        <div className="relative">
          <img alt="Ruộng bậc thang Sapa" className="w-full h-48 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwlB3tkJgiOFkwh6fmNIhVzZhl8XNb3lqa7Ef7xfFrHDixBxCHVnW55_JPhAU6wrDJOOdO1UABTM2raMmdHXuUVgi2B-ueru6E8KRWG1km4n8IZKsH3b_5YVNDxjILMhmb2L1JroJAGO5OIw0CtlaHj3lBXrcRPOS1v6Q4DwbrO4Macc4A0LS7_4D5V6rvpeyQ0Uxwlt2Yaqe5qEez6Lk9orgSD7FzgPo8U_sx7f-C5t6MIYuLWYuxfPVv2iAYbmaon7OhSQAifgQ"/>
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
        </div>
        <div className="p-4">
          <h4 className="font-bold text-lg text-gray-800 dark:text-white group-hover:text-primary transition-colors">Sapa mùa lúa chín - bức tranh vàng óng</h4>
        </div>
      </a>

      {/* Article 3 */}
      <a className="group block bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300" href="#">
        <div className="relative">
          <img alt="Phố cổ Hội An" className="w-full h-48 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxCwCrKsA5hDbnXXHKQvx_Qb3oiZkiqeHkENtW1JpqNL6R-XSwt5s1kK06T7yTxdpcv2MmZXNeBX-Q17ZRypjww2h0LU2IM6T4mV0RwOyOnN7Pio9weKbLw9vhIPwutXWTCodAMtKA01vfyGA1mnK8RCMqz9r8wiWvAjuEtqWSnYb_6cmfZ1oHoNpSn3CDJHDiZPH-U_dYxN--kVfoAwRmJl1gfLuHp0I2Qjnc1EoCPhVGCRZqZ984yiPa-FooKs9Vj3JPVKebmA0"/>
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
        </div>
        <div className="p-4">
          <h4 className="font-bold text-lg text-gray-800 dark:text-white group-hover:text-primary transition-colors">Hội An - nét duyên dáng vượt thời gian</h4>
        </div>
      </a>

      {/* Article 4 */}
      <a className="group block bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300" href="#">
        <div className="relative">
          <img alt="Hang Sơn Đoòng" className="w-full h-48 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKEdXi_RIYzk6iJhSnFy8M6M3_4y7eLq7gOuazpsH1QeJhXkyj-oK-l4TBhdp-NrUkMaDoJd_gt7gtjAqdu46bEpT85hc4J40-KrLRMp0RxM5pMzRz6V9V4W_tJNYlsdo2U9dFSGS0yLa5SoOOu0BPEz7UVNhGqoL8mlWXEmLM0AcjvxC-sONfOjSTKMEvVa4MTIiTUy5TU9RKpJfG0VEqXXhhd0-4B3GKQAbRYY0QukXTpWnD1DLOLkH3O1wiADE__J_RBWfO1iE"/>
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
        </div>
        <div className="p-4">
          <h4 className="font-bold text-lg text-gray-800 dark:text-white group-hover:text-primary transition-colors">Kỳ quan Hang Sơn Đoòng hùng vĩ</h4>
        </div>
      </a>
    </div>
  )
}