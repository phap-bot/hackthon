import Header from '../components/Header'
import RegisterForm from './components/RegisterForm'

export default function RegisterPage() {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `bg.jpg`
      }}
    >
      {/* Overlay để tăng độ tương phản */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Header */}
      <div className="relative z-10">
        <Header />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
