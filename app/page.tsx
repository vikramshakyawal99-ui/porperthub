import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import PopularCities from "../components/PopularCities";
import FeaturedProperties from "../components/FeaturedProperties";
import WhyChooseUs from "../components/WhyChooseUs";
import LatestProjects from "../components/LatestProjects";
import Testimonials from "../components/Testimonials";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <PopularCities />
      <FeaturedProperties />
      <WhyChooseUs />
      <LatestProjects />
      <Testimonials />
    </main>
  );
}