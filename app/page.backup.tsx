import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import PropertySearch from "../components/PropertySearch";
import PopularCities from "../components/PopularCities";
import FeaturedProjects from "../components/FeaturedProjects";
import TopBuilders from "../components/TopBuilders";
import PropertyCategories from "../components/PropertyCategories";
import PropertyComparison from "../components/PropertyComparison";
import FeaturedProperties from "../components/FeaturedProperties";
import WhyChooseUs from "../components/WhyChooseUs";
import LatestProjects from "../components/LatestProjects";
import Testimonials from "../components/Testimonials";
import HomeLoan from "../components/HomeLoan";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <PropertyCategories />
      <PropertySearch />
<FeaturedProjects />
      <TopBuilders />
      <PopularCities />
      <FeaturedProperties />
      <PropertyComparison />
      <HomeLoan />
      <WhyChooseUs />
      <LatestProjects />
      <Testimonials />
    </main>
  );
}