import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CityBar from "../components/CityBar";
import PropertyCategories from "../components/PropertyCategories";
import PopularCities from "../components/PopularCities";
import FeaturedProjects from "../components/FeaturedProjects";
import TopBuilders from "../components/TopBuilders";
import PropertyDealers from "../components/PropertyDealers";
import PropertyComparison from "../components/PropertyComparison";
import FeaturedProperties from "../components/FeaturedProperties";
import WhyChooseUs from "../components/WhyChooseUs";
import LatestProjects from "../components/LatestProjects";
import Testimonials from "../components/Testimonials";
import HomeLoan from "../components/HomeLoan";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />
      <Hero />
      <CityBar />
      <PropertyCategories />
      <FeaturedProjects />
      <TopBuilders />
      <PropertyDealers />
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
