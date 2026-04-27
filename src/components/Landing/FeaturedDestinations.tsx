import React from 'react';

const destinations = [
  {
    id: 1,
    title: 'Hạ Long Bay',
    subtitle: 'UNESCO Heritage Site',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCiMow0GqQ6IqH1z9X-p4bI_t9ZRbA_L9_Xj4eX8Z2V3oFm5X7E9qR_tW5Yl8_QZ-_9Z5o_2fG9_H9zH0k9_R_X_L8T9_V_p5_N8s9_Q9_H_t_Z4eY_z9_T_V_F_H_n9_Z8_m_C_L_a9_Y_j_R6_n_U_L_x_T5_A',
    tags: ['Nature', 'Cruise']
  },
  {
    id: 2,
    title: 'Hội An Ancient Town',
    subtitle: 'Timeless Charm',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2kL9jP-X5zT6vN1sW7cG0rQ4oE8bM3iJ6uD9hY2xH5wK8lU1fT4gN7mV0sR3oI6cY9xZ2aB5vF8dE1qP4jL7nI0oX3uK6mH9wU2yT5sA8vM1jB4hN7rD0fE3pY6uI9sW2kM5jX8oA1vF4cP7sG0',
    tags: ['Culture', 'Food']
  },
  {
    id: 3,
    title: 'Sapa Terrace Fields',
    subtitle: 'Mountain Wonder',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9fT5yP3eX8rM1wJ4cH6kG0nL2vB5oN8mU1sD7tF9hY3zQ6lK0fT4mV2bI5oJ8nR1eC9aX6wU3yT5rP8mH0kL2xN4jV7sG1qE5wI3zQ8mF0hL2nV6rX9cU4aT1oJ5yM8bE3fK7nV0pW9sI2xQ6',
    tags: ['Trekking', 'Culture']
  },
  {
    id: 4,
    title: 'Phú Quốc Island',
    subtitle: 'Tropical Paradise',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuE8cW2oL9kY1jG5nF7bT4xR0pM3uV8rQ5qA1sJ6hZ9yP2fN0lD4wU7eM3jC6aX9vT5rI8cW1oB4hG2qN9uK5mX7yJ0pE3sW2vF4aT8cY1hN5jP6sM9rL0kV7wX4qJ2gM5nH8vF3uY1hR9xK6aT2',
    tags: ['Beach', 'Resort']
  }
];

export default function FeaturedDestinations() {
  return (
    <section className="py-16 bg-surface-container-low">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-h2 text-on-surface mb-2">Featured Destinations</h2>
            <p className="font-body-md text-on-surface-variant">Explore the most beloved places in Vietnam</p>
          </div>
          <div className="flex gap-2 hidden sm:flex">
            <button className="w-10 h-10 rounded-full border border-outline flex items-center justify-center hover:bg-surface-container transition-colors"><span className="material-symbols-outlined text-on-surface">arrow_back</span></button>
            <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors shadow-md"><span className="material-symbols-outlined text-on-primary">arrow_forward</span></button>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-6 snap-x hide-scrollbar">
          {destinations.map((dest) => (
            <div key={dest.id} className="min-w-[280px] md:min-w-[320px] bg-surface rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group snap-start cursor-pointer">
              <div className="relative h-64 overflow-hidden">
                <img alt={dest.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={dest.image} />
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center border border-white/30 text-white hover:bg-white/40 transition-colors">
                  <span className="material-symbols-outlined">favorite</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-h3 text-white mb-1">{dest.title}</h3>
                  <p className="font-body-md text-white/80 text-sm">{dest.subtitle}</p>
                </div>
              </div>
              <div className="p-5">
                <div className="flex gap-2 mb-4">
                  {dest.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-surface-container rounded-full text-xs font-label-md text-on-surface flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">local_offer</span> {tag}
                    </span>
                  ))}
                </div>
                <button className="w-full py-2.5 rounded-full border border-primary text-primary font-label-md hover:bg-primary-fixed hover:border-transparent transition-all">Explore Plans</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
