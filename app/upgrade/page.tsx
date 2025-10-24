'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '../components/Layout'
import { 
  CheckIcon,
  SparklesIcon,
  StarIcon,
  CrownIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export default function UpgradePage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState('premium')
  const [billingCycle, setBillingCycle] = useState('monthly')

  const plans = [
    {
      id: 'free',
      name: 'Miễn phí',
      price: { monthly: 0, yearly: 0 },
      description: 'Dành cho người dùng mới bắt đầu',
      features: [
        'Tạo tối đa 3 lịch trình',
        'Gợi ý cơ bản',
        'Hỗ trợ email',
        'Truy cập bản đồ cơ bản'
      ],
      limitations: [
        'Không có AI recommendations nâng cao',
        'Không có ưu tiên hỗ trợ',
        'Quảng cáo hiển thị'
      ],
      popular: false,
      icon: StarIcon
    },
    {
      id: 'premium',
      name: 'Premium',
      price: { monthly: 199000, yearly: 1990000 },
      description: 'Dành cho người yêu du lịch',
      features: [
        'Tạo không giới hạn lịch trình',
        'AI recommendations nâng cao',
        'Gợi ý cá nhân hóa',
        'Hỗ trợ ưu tiên 24/7',
        'Truy cập bản đồ nâng cao',
        'Xuất lịch trình PDF',
        'Chia sẻ lịch trình',
        'Không quảng cáo'
      ],
      limitations: [],
      popular: true,
      icon: SparklesIcon
    },
    {
      id: 'pro',
      name: 'Pro',
      price: { monthly: 399000, yearly: 3990000 },
      description: 'Dành cho chuyên gia du lịch',
      features: [
        'Tất cả tính năng Premium',
        'AI travel advisor riêng',
        'Booking tích hợp',
        'Theo dõi ngân sách thông minh',
        'API access',
        'White-label solution',
        'Hỗ trợ qua điện thoại',
        'Tùy chỉnh giao diện'
      ],
      limitations: [],
      popular: false,
      icon: CrownIcon
    }
  ]

  const handleUpgrade = (planId: string) => {
    // TODO: Implement upgrade logic
    console.log('Upgrading to:', planId, 'Billing:', billingCycle)
    // Redirect to payment page or process payment
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const getCurrentPlan = () => {
    // TODO: Get current plan from user data
    return 'free'
  }

  const currentPlan = getCurrentPlan()

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Nâng cấp gói của bạn</h1>
              <p className="text-xl text-blue-100 mb-8">
                Mở khóa tất cả tính năng và trải nghiệm du lịch tốt nhất
              </p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    billingCycle === 'monthly'
                      ? 'bg-white text-blue-600'
                      : 'bg-blue-500 text-white hover:bg-blue-400'
                  }`}
                >
                  Hàng tháng
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    billingCycle === 'yearly'
                      ? 'bg-white text-blue-600'
                      : 'bg-blue-500 text-white hover:bg-blue-400'
                  }`}
                >
                  Hàng năm
                  <span className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                    Tiết kiệm 20%
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {plans.map((plan) => {
                const IconComponent = plan.icon
                const isCurrentPlan = currentPlan === plan.id
                const isSelected = selectedPlan === plan.id
                
                return (
                  <div
                    key={plan.id}
                    className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-all duration-300 ${
                      plan.popular
                        ? 'ring-2 ring-blue-500 scale-105'
                        : 'hover:shadow-xl'
                    } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    {/* Popular Badge */}
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                          Phổ biến nhất
                        </span>
                      </div>
                    )}

                    {/* Current Plan Badge */}
                    {isCurrentPlan && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                          Gói hiện tại
                        </span>
                      </div>
                    )}

                    {/* Plan Header */}
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {plan.description}
                      </p>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                          {formatPrice(plan.price[billingCycle as keyof typeof plan.price])}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          /{billingCycle === 'monthly' ? 'tháng' : 'năm'}
                        </span>
                      </div>
                      {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                        <p className="text-sm text-green-600 dark:text-green-400">
                          Tiết kiệm {formatPrice(plan.price.monthly * 12 - plan.price.yearly)}/năm
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <div className="space-y-4 mb-8">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Tính năng bao gồm:</h4>
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Limitations */}
                    {plan.limitations.length > 0 && (
                      <div className="space-y-2 mb-8">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Hạn chế:</h4>
                        {plan.limitations.map((limitation, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center flex-shrink-0">
                              <span className="text-red-500 text-xs">×</span>
                            </div>
                            <span className="text-gray-500 dark:text-gray-400 text-sm">{limitation}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Button */}
                    <button
                      onClick={() => isCurrentPlan ? null : handleUpgrade(plan.id)}
                      disabled={isCurrentPlan}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                        isCurrentPlan
                          ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          : plan.popular
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
                          : 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200'
                      }`}
                    >
                      {isCurrentPlan ? (
                        'Gói hiện tại'
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          Nâng cấp ngay
                          <ArrowRightIcon className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Features Comparison */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                So sánh các gói
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">
                        Tính năng
                      </th>
                      {plans.map((plan) => (
                        <th key={plan.id} className="text-center py-4 px-4 font-semibold text-gray-900 dark:text-white">
                          {plan.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: 'Tạo lịch trình', free: '3', premium: 'Không giới hạn', pro: 'Không giới hạn' },
                      { feature: 'AI Recommendations', free: 'Cơ bản', premium: 'Nâng cao', pro: 'Cá nhân hóa' },
                      { feature: 'Hỗ trợ khách hàng', free: 'Email', premium: '24/7', pro: 'Điện thoại' },
                      { feature: 'Quảng cáo', free: 'Có', premium: 'Không', pro: 'Không' },
                      { feature: 'Xuất PDF', free: 'Không', premium: 'Có', pro: 'Có' },
                      { feature: 'API Access', free: 'Không', premium: 'Không', pro: 'Có' }
                    ].map((row, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                          {row.feature}
                        </td>
                        <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">
                          {row.free}
                        </td>
                        <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">
                          {row.premium}
                        </td>
                        <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">
                          {row.pro}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Câu hỏi thường gặp
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Tôi có thể hủy gói bất kỳ lúc nào không?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Có, bạn có thể hủy gói Premium hoặc Pro bất kỳ lúc nào. Bạn sẽ tiếp tục sử dụng các tính năng cao cấp cho đến hết chu kỳ thanh toán.
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Có dùng thử miễn phí không?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Có! Bạn có thể dùng thử Premium miễn phí trong 7 ngày. Không cần thẻ tín dụng để bắt đầu.
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Tôi có thể thay đổi gói không?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Có, bạn có thể nâng cấp hoặc hạ cấp gói bất kỳ lúc nào. Thay đổi sẽ có hiệu lực ngay lập tức.
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Có hoàn tiền không?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Chúng tôi cung cấp bảo đảm hoàn tiền 30 ngày cho tất cả các gói trả phí.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
