import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { XMarkIcon, EyeIcon, EyeSlashIcon, UserIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import { useModal } from '../../contexts/ModalContext'

const Register = () => {
    let [isOpen, setIsOpen] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const { setIsModalOpen } = useModal()

    const closeModal = () => {
        setIsOpen(false)
        setIsModalOpen(false)
    }

    const openModal = () => {
        setIsOpen(true)
        setIsModalOpen(true)
    }

    return (
        <>
            <button
                type="button"
                onClick={openModal}
                className="px-6 py-2 bg-primary text-white rounded-full hover:bg-ocean transition-all duration-200 font-medium"
            >
                Đăng ký
            </button>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[10000]" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
                                    {/* Header */}
                                    <div className="relative bg-gradient-to-r from-secondary to-forest px-8 py-6">
                                        <button
                                            onClick={closeModal}
                                            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                                        >
                                            <XMarkIcon className="w-6 h-6" />
                                        </button>
                                        <div className="text-center">
                                            <h2 className="text-2xl font-bold text-white">Tham gia cùng chúng tôi!</h2>
                                            <p className="text-green-100 mt-1">Tạo tài khoản để bắt đầu hành trình</p>
                                        </div>
                                    </div>

                                    {/* Form */}
                                    <div className="px-8 py-8">
                                        <form className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Họ và tên
                                                </label>
                                                <div className="relative">
                                                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        required
                                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                                                        placeholder="Nhập họ và tên"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Email
                                                </label>
                                                <div className="relative">
                                                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="email"
                                                        required
                                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                                                        placeholder="Nhập email của bạn"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Mật khẩu
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        required
                                                        className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                                                        placeholder="Tạo mật khẩu mạnh"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showPassword ? (
                                                            <EyeSlashIcon className="w-5 h-5" />
                                                        ) : (
                                                            <EyeIcon className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Xác nhận mật khẩu
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        required
                                                        className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                                                        placeholder="Nhập lại mật khẩu"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showConfirmPassword ? (
                                                            <EyeSlashIcon className="w-5 h-5" />
                                                        ) : (
                                                            <EyeIcon className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    required
                                                    className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary"
                                                />
                                                <label className="ml-2 text-sm text-gray-600">
                                                    Tôi đồng ý với{' '}
                                                    <a href="#" className="text-secondary hover:text-forest font-medium">
                                                        Điều khoản sử dụng
                                                    </a>{' '}
                                                    và{' '}
                                                    <a href="#" className="text-secondary hover:text-forest font-medium">
                                                        Chính sách bảo mật
                                                    </a>
                                                </label>
                                            </div>

                                            <button
                                                type="submit"
                                                className="w-full bg-gradient-to-r from-secondary to-forest text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                                            >
                                                Tạo tài khoản
                                            </button>
                                        </form>

                                        <div className="mt-6 text-center">
                                            <p className="text-gray-600">
                                                Đã có tài khoản?{' '}
                                                <button className="text-secondary hover:text-forest font-medium transition-colors">
                                                    Đăng nhập ngay
                                                </button>
                                            </p>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default Register;
