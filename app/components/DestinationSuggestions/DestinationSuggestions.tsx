'use client'
import React from 'react'

interface Destination {
  id: string
  name: string
  country: string
  description: string
  image: string
}

const destinations: Destination[] = [
  {
    id: '1',
    name: 'Bali',
    country: 'Indonesia',
    description: 'Thiên đường nhiệt đới',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYl1YlnQglpZ0DKNK-K1rTQkXjTYzp3jjtRgqXmcZubwiGkYnYdr8DqAMFnMm20JTZXCR_pWR0d_s7qQkXaOdEcro1tfJT_LDMq_-sOHcJknSiW-41Y6H_wdYnOSlEv_l43VsXdUjuNWXRQC8_xxxR9NWkmOWHrw_jSBV9kYo3dpWerGQ7A4vSoo7lgGL5cSQn2-QG8bcC6JZyf8WwigxuWksF9CT2RZFCTSni14Y9PtPuP0gzbsEy0R4NxK7hxxIDhD5CSOm41pA'
  },
  {
    id: '2',
    name: 'Kyoto',
    country: 'Nhật Bản',
    description: 'Vẻ đẹp cổ kính',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDa6qFFU_al8DklK488HxuySgBtZQhE7mHm1cyzwSS-I6Uj7HEBHOdOrlNAW-AZjfVAtJMpmqrYeSY8tT4Ig5l-_W3APwth-68BSVzPPXFhjmRyuEg_9YvTa-NsWhaU6hvK4FEjjpzEB_-D0X1o1vF4CvZ_wOuYpjy2VyRIe7nUtZ5kgYutSc7qJTNiIfwmjdR7U7ltrXzUNrThyteTyinLOv1nS2D9NvdNdoGG7OTzrPNXTEcVNlvA9WmX4Gi7fofjRksNvU5XMS4'
  },
  {
    id: '3',
    name: 'Santorini',
    country: 'Hy Lạp',
    description: 'Hoàng hôn huyền diệu',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCD3c_v2SEwMD8Tewef1aQNXpKOaYMiFCjqtJdVyAVddrJL5CyOeDwDLSw3_LjP2kiAv6-eBEXXg5n_dgf-7c8QBzbdPCY6eTfkswGUi1NXHlnivW4YrjurhOBk0K-o-Ylc3UnvayROFN0sghGoBXsBqlkeBAvOyyjPLfzSfkWbw6HVt4CL60bAyzQdvNFMspsZ_7M3_hE8xrxDmrf0vcY9n603YbmKwR5zYEo_Y4_6eTFDamP3Wybq-aTyw7jrx9XRw7neSGu1UsY'
  },
  {
    id: '4',
    name: 'Rome',
    country: 'Ý',
    description: 'Thành phố vĩnh hằng',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyDavwP1AJg0j7D8Y19v9_dJn_C9mgQI8Ct5ezEA72UYdFYOrXrHDMvtd-skVd7bfE2iur_y2PT1q2V_BTxux3INk7KIPLz98izwUtdBSEqciUySjyANZXY96i-o4l6ioBJ38PWp1u7iT_0uNMZ1BMmbUybpGkEPu8pUNPwqocvH3Begr1iXrFrdTK_N3qN0Jj4KMLiFA5aN-iMRmve7rSX8D6MV_PqUZOoeUiF68GteufY59s23TkaIbN-lV6sZ5ITTUV8cDPEFA'
  }
]

export default function DestinationSuggestions() {
  return (
    <section className="mt-16">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Gợi ý điểm đến
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {destinations.map((destination) => (
          <div key={destination.id} className="relative group rounded-xl overflow-hidden">
            <img 
              alt={destination.name} 
              className="w-full h-72 object-cover transform group-hover:scale-110 transition-transform duration-300" 
              src={destination.image}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4">
              <h4 className="text-lg font-bold text-white">
                {destination.name}, {destination.country}
              </h4>
              <p className="text-white/80 text-sm">
                {destination.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
