import Header from './components/Header'
import HeroSection from './components/HeroSection/HeroSection';
import UpcomingTrips from './components/UpcomingTrips/UpcomingTrips';
import ExploreSection from './components/ExploreSection/ExploreSection';
import DestinationSuggestions from './components/DestinationSuggestions/DestinationSuggestions';
import FloatingSupport from './components/FloatingSupport/FloatingSupport';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <UpcomingTrips />
          <ExploreSection />
          <DestinationSuggestions />
        </div>
      </main>
      <FloatingSupport />
    </div>
  )
}
