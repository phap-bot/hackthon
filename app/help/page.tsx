'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '../components/Layout'
import { 
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  BookOpenIcon,
  LightBulbIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export default function HelpPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Tất cả', icon: BookOpenIcon },
    { id: 'getting-started', name: 'Bắt đầu', icon: LightBulbIcon },
    { id: 'account', name: 'Tài khoản', icon: QuestionMarkCircleIcon },
    { id: 'features', name: 'Tính năng', icon: LightBulbIcon },
    { id: 'billing', name: 'Thanh toán', icon: ExclamationTriangleIcon },
    { id: 'technical', name: 'Kỹ thuật', icon: ExclamationTriangleIcon }
  ]

  const faqs = [
    {
      id: 1,
      category: 'getting-started',
      question: 'Làm thế nào để tạo lịch trình đầu tiên?',
      answer: 'Để tạo lịch trình đầu tiên, hãy làm theo các bước sau:\n1. Đăng nhập vào tài khoản của bạn\n2. Nhấn vào "Tạo lịch trình" trên dashboard\n3. Chọn điểm đến và ngày tháng\n4. Hoàn thành khảo sát sở thích\n5. AI sẽ tạo lịch trình phù hợp cho bạn'
    },
    {
      id: 2,
      category: 'account',
      question: 'Làm thế nào để đổi mật khẩu?',
      answer: 'Để đổi mật khẩu:\n1. Vào Cài đặt > Bảo mật\n2. Nhấn "Đổi mật khẩu"\n3. Nhập mật khẩu hiện tại\n4. Nhập mật khẩu mới\n5. Xác nhận mật khẩu mới'
    },
    {
      id: 3,
      category: 'features',
      question: 'Tính năng AI recommendations hoạt động như thế nào?',
      answer: 'AI recommendations sử dụng dữ liệu từ khảo sát sở thích của bạn để:\n- Phân tích loại hình du lịch yêu thích\n- Gợi ý điểm đến phù hợp\n- Đề xuất hoạt động dựa trên sở thích\n- Ước tính ngân sách phù hợp\n- Tạo lịch trình tối ưu'
    },
    {
      id: 4,
      category: 'billing',
      question: 'Làm thế nào để hủy gói Premium?',
      answer: 'Để hủy gói Premium:\n1. Vào Cài đặt > Tài khoản\n2. Nhấn "Quản lý gói"\n3. Chọn "Hủy gói"\n4. Xác nhận hủy\nBạn sẽ tiếp tục sử dụng tính năng Premium cho đến hết chu kỳ thanh toán.'
    },
    {
      id: 5,
      category: 'technical',
      question: 'Tại sao tôi không thể đăng nhập?',
      answer: 'Nếu không thể đăng nhập, hãy thử:\n1. Kiểm tra email và mật khẩu\n2. Xóa cache trình duyệt\n3. Thử trình duyệt khác\n4. Kiểm tra kết nối internet\n5. Liên hệ hỗ trợ nếu vấn đề vẫn tiếp diễn'
    },
    {
      id: 6,
      category: 'features',
      question: 'Làm thế nào để chia sẻ lịch trình?',
      answer: 'Để chia sẻ lịch trình:\n1. Mở lịch trình bạn muốn chia sẻ\n2. Nhấn nút "Chia sẻ"\n3. Chọn phương thức chia sẻ (link, email, social media)\n4. Gửi cho bạn bè hoặc gia đình'
    }
  ]

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const contactMethods = [
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Chat trực tuyến',
      description: 'Hỗ trợ 24/7 qua chat',
      action: 'Bắt đầu chat',
      available: true
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      description: 'support@wanderlust.com',
      action: 'Gửi email',
      available: true
    },
    {
      icon: PhoneIcon,
      title: 'Điện thoại',
      description: 'Hotline: 1900-xxxx',
      action: 'Gọi ngay',
      available: false
    }
  ]

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trung tâm trợ giúp</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Tìm câu trả lời cho các câu hỏi của bạn</p>
              </div>
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Quay lại
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Search Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Tìm kiếm trợ giúp
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Tìm câu trả lời nhanh cho các câu hỏi của bạn
                </p>
              </div>
              
              <div className="relative max-w-2xl mx-auto">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nhập câu hỏi của bạn..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Categories Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Danh mục</h3>
                  <nav className="space-y-2">
                    {categories.map((category) => {
                      const IconComponent = category.icon
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                            selectedCategory === category.id
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                          <span className="font-medium">{category.name}</span>
                        </button>
                      )
                    })}
                  </nav>
                </div>
              </div>

              {/* FAQ Content */}
              <div className="lg:col-span-3">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Câu hỏi thường gặp
                    {selectedCategory !== 'all' && (
                      <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
                        ({filteredFaqs.length} câu hỏi)
                      </span>
                    )}
                  </h3>

                  {filteredFaqs.length === 0 ? (
                    <div className="text-center py-12">
                      <QuestionMarkCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Không tìm thấy câu hỏi
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        Thử tìm kiếm với từ khóa khác hoặc liên hệ hỗ trợ
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredFaqs.map((faq) => (
                        <div key={faq.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            {faq.question}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="mt-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Vẫn cần trợ giúp?
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Liên hệ với đội ngũ hỗ trợ của chúng tôi
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {contactMethods.map((method, index) => {
                  const IconComponent = method.icon
                  return (
                    <div
                      key={index}
                      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center ${
                        !method.available ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {method.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {method.description}
                      </p>
                      <button
                        disabled={!method.available}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          method.available
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {method.action}
                        {!method.available && ' (Sắp có)'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                Liên kết nhanh
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <BookOpenIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Hướng dẫn</span>
                </button>
                <button className="p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <LightBulbIcon className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Mẹo sử dụng</span>
                </button>
                <button className="p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <ExclamationTriangleIcon className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Báo lỗi</span>
                </button>
                <button className="p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <ChatBubbleLeftRightIcon className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Phản hồi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
