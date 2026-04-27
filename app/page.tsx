import TopNavBar from '@/components/Landing/TopNavBar';
import HeroSection from '@/components/Landing/HeroSection';
import ActiveDashboard from '@/components/Landing/ActiveDashboard';
import FeaturedDestinations from '@/components/Landing/FeaturedDestinations';
import TravelBlogs from '@/components/Landing/TravelBlogs';
import BottomNavBar from '@/components/Landing/BottomNavBar';
import ChatbotBubble from '@/components/Landing/ChatbotBubble';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      <TopNavBar />
      
      <main className="flex-grow pt-20">
        <HeroSection />
        <ActiveDashboard />
        <FeaturedDestinations />
        <TravelBlogs />
      </main>

      <Footer />
      <BottomNavBar />
      <ChatbotBubble />
    </div>
  );
}
