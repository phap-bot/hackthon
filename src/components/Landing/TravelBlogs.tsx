import React from 'react';

const blogs = [
  {
    id: 1,
    title: 'A Culinary Journey Through Hue',
    author: 'Minh Nguyen',
    readTime: '5 min read',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2yG0tN9sA6bM1wZ3cH5kH0nL2vB5oN8hF1sD7tJ4eX3zQ6lK0fP8mV2bI5oJ8rC1aY9xW5jB7rM4mH0kL2qN3jV7cG1tE5wI3zQ8mF0hL2nV6pT4cU4aT1oJ5yM8bE3fK7nV0pW9sI2xQ6'
  },
  {
    id: 2,
    title: 'Hidden Waterfalls in Da Lat',
    author: 'Sarah Chen',
    readTime: '8 min read',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuE9aV4hR1eW5zT3vP6bC7xY0mN3uF8qO5qA1sJ6hZ9yQ2fN0lD4wU7eM3jC6aX9vT5rI8cW1oB4hF2qN9uK5mX7yJ0pE3sW2vG4aT8cY1hN5jP6sM9rL0kV7wX4qJ2gM5nH8vF3uY1hR9xK6aT2'
  },
  {
    id: 3,
    title: 'Motorbike Guide to Ha Giang',
    author: 'Alex Traveler',
    readTime: '12 min read',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8hS3yG6tX9jP1mN4bH5wK0lV2vD4oM7rU1sH8tF9eA3zR5lJ0vT4mV2bI5oJ8rC1aY9xW5jB7rM4mH0kL2qN3jV7cG1tE5wI3zQ8mF0hL2nV6pS3aT1oJ5yM8bE3fK7nV0pW9sI2xQ6'
  }
];

export default function TravelBlogs() {
  return (
    <section className="py-16 bg-surface">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-h2 text-on-surface mb-2">Travel Blogs</h2>
            <p className="font-body-md text-on-surface-variant">Insights and guides from fellow travelers</p>
          </div>
          <button className="text-primary font-label-md hover:underline">View all posts</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map(blog => (
            <div key={blog.id} className="group cursor-pointer">
              <div className="relative h-48 md:h-60 rounded-3xl overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-all">
                <img alt={blog.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={blog.image} />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-label-md text-slate-800">Tips</div>
              </div>
              <h3 className="font-h3 text-xl text-on-surface mb-2 group-hover:text-primary transition-colors line-clamp-2">{blog.title}</h3>
              <p className="font-body-md text-on-surface-variant text-sm flex items-center gap-2">
                <span>{blog.author}</span>
                <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                <span>{blog.readTime}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
