import Header from '../components/Header'
import RegisterForm from './components/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
