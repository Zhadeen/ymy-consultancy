import Hero from '../components/home/Hero';
import HowItWorks from '../components/home/HowItWorks';
import FeaturedGuides from '../components/home/FeaturedGuides';
import TrustBar from '../components/home/TrustBar';
import FloatingContact from '../components/common/FloatingContact';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <FeaturedGuides />
      <TrustBar />
      <FloatingContact />
    </main>
  );
}
