'use client'
import { useRouter } from 'next/navigation'
import { useAuth } from './hooks/useAuth'
import Footer from './components/Footer'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  const handleLogin = () => {
    router.push('/login')
  }

  const handleRegister = () => {
    router.push('/register')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 text-gray-800 dark:text-white">
              <span className="material-symbols-outlined text-primary text-3xl">travel_explore</span>
              <h1 className="text-2xl font-bold">Wanderlust</h1>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-4">
                <a className="font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors" href="#">
                  Tính năng
                </a>
                <a className="font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors" href="#">
                  Điểm đến
                </a>
                <a className="font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors" href="#">
                  Blog
                </a>
              </div>

              {/* Auth Buttons */}
              {!user && (
                <div className="flex items-center gap-2 pl-4 ml-2 border-l border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleLogin}
                    className="px-4 py-2 rounded-lg font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={handleRegister}
                    className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-opacity-90 transition-opacity"
                  >
                    Đăng ký
                  </button>
                </div>
              )}

              {user && (
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-opacity-90 transition-opacity"
                >
                  Dashboard
                </Link>
              )}

              {/* Mobile Menu */}
              <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50">
                <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">menu</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
          <img 
            alt="Cảnh đẹp Việt Nam" 
            className="absolute inset-0 w-full h-full object-cover object-center" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwlB3tkJgiOFkwh6fmNIhVzZhl8XNb3lqa7Ef7xfFrHDixBxCHVnW55_JPhAU6wrDJOOdO1UABTM2raMmdHXuUVgi2B-ueru6E8KRWG1km4n8IZKsH3b_5YVNDxjILMhmb2L1JroJAGO5OIw0CtlaHj3lBXrcRPOS1v6Q4DwbrO4Macc4A0LS7_4D5V6rvpeyQ0Uxwlt2Yaqe5qEez6Lk9orgSD7FzgPo8U_sx7f-C5t6MIYuLWYuxfPVv2iAYbmaon7OhSQAifgQ"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight shadow-lg">
              Lên Kế Hoạch, Tối Ưu Lịch Trình, <br className="hidden md:block"/> Khám Phá Việt Nam
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-white/90 shadow-lg">
              Wanderlust giúp bạn tạo ra những chuyến đi đáng nhớ với công cụ lập kế hoạch thông minh và bản đồ thời gian thực. Bắt đầu hành trình của bạn ngay hôm nay!
            </p>
            
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={user ? () => router.push('/dashboard') : handleRegister}
                className="px-8 py-3 rounded-full bg-primary text-white font-bold text-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Bắt đầu ngay
              </button>
              <button
                onClick={() => router.push('/planner')}
                className="px-8 py-3 rounded-full bg-white/20 backdrop-blur-sm text-white font-bold text-lg hover:bg-white/30 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Xem Demo
              </button>
            </div>
          </div>
        </div>

        {/* Why Choose Section */}
        <div className="bg-background-light dark:bg-background-dark py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <section className="mb-16 text-center">
              <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                Tại sao chọn Wanderlust?
              </h2>
              <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
                Chúng tôi mang đến những công cụ mạnh mẽ để biến chuyến đi trong mơ của bạn thành hiện thực, dễ dàng và hiệu quả hơn bao giờ hết.
              </p>
            </section>

            {/* Feature 1: Smart Itinerary */}
            <section className="mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <span className="inline-block bg-primary/10 text-primary font-semibold px-3 py-1 rounded-full mb-3 text-sm">
                    Tối ưu hóa lịch trình
                  </span>
                  <h3 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                    Tạo lịch trình thông minh trong vài phút
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Chỉ cần nhập điểm đến và sở thích của bạn, AI của chúng tôi sẽ tự động tạo một lịch trình chi tiết, tối ưu hóa thời gian và quãng đường di chuyển. Dễ dàng tùy chỉnh, thêm bớt hoạt động và chia sẻ với bạn bè.
                  </p>
                  <button
                    onClick={() => router.push('/planner')}
                    className="font-semibold text-primary hover:underline flex items-center gap-2"
                  >
                    Tìm hiểu thêm
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
                <div className="order-1 lg:order-2">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl">
                    <img 
                      alt="Demo tạo lịch trình" 
                      className="rounded-lg w-full" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxCwCrKsA5hDbnXXHKQvx_Qb3oiZkiqeHkENtW1JpqNL6R-XSwt5s1kK06T7yTxdpcv2MmZXNeBX-Q17ZRypjww2h0LU2IM6T4mV0RwOyOnN7Pio9weKbLw9vhIPwutXWTCodAMtKA01vfyGA1mnK8RCMqz9r8wiWvAjuEtqWSnYb_6cmfZ1oHoNpSn3CDJHDiZPH-U_dYxN--kVfoAwRmJl1gfLuHp0I2Qjnc1EoCPhVGCRZqZ984yiPa-FooKs9Vj3JPVKebmA0"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Feature 2: Real-time Map */}
            <section className="py-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl">
                    <img 
                      alt="Demo bản đồ giao thông" 
                      className="rounded-lg w-full" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxCwCrKsA5hDbnXXHKQvx_Qb3oiZkiqeHkENtW1JpqNL6R-XSwt5s1kK06T7yTxdpcv2MmZXNeBX-Q17ZRypjww2h0LU2IM6T4mV0RwOyOnN7Pio9weKbLw9vhIPwutXWTCodAMtKA01vfyGA1mnK8RCMqz9r8wiWvAjuEtqWSnYb_6cmfZ1oHoNpSn3CDJHDiZPH-U_dYxN--kVfoAwRmJl1gfLuHp0I2Qjnc1EoCPhVGCRZqZ984yiPa-FooKs9Vj3JPVKebmA0"
                    />
                  </div>
                </div>
                <div>
                  <span className="inline-block bg-primary/10 text-primary font-semibold px-3 py-1 rounded-full mb-3 text-sm">
                    Bản đồ thời gian thực
                  </span>
                  <h3 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                    Điều hướng dễ dàng và khám phá xung quanh
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Bản đồ tương tác của chúng tôi không chỉ dẫn đường mà còn hiển thị các điểm tham quan, nhà hàng, và các dịch vụ tiện ích gần bạn. Nhận thông tin giao thông cập nhật để di chuyển thuận lợi nhất.
                  </p>
                  <button
                    onClick={() => router.push('/map-demo')}
                    className="font-semibold text-primary hover:underline flex items-center gap-2"
                  >
                    Tìm hiểu thêm
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white dark:bg-gray-800/50 py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              Sẵn sàng để bắt đầu cuộc phiêu lưu?
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              Tạo tài khoản miễn phí để lưu lại những kế hoạch, khám phá các tính năng độc quyền và bắt đầu hành trình khám phá Việt Nam của bạn.
            </p>
            <div className="mt-8">
              <button
                onClick={user ? () => router.push('/dashboard') : handleRegister}
                className="px-8 py-3 rounded-full bg-primary text-white font-bold text-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Đăng ký ngay
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
