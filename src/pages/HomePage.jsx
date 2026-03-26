import Hero from '../components/home/Hero';
import HowItWorks from '../components/home/HowItWorks';
import FeaturedGuides from '../components/home/FeaturedGuides';
import TrustBar from '../components/home/TrustBar';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <FeaturedGuides />
      <TrustBar />
    </main>
  );
}
