import HeroSection from "../components/HeroSection";
import CategoriesSection from "../components/CategoriesSection";
import PopularServices from "../components/PopularServices";
import TopFreelancers from "../components/TopFreelancers";
import TalentSection from "../components/TalentSection";



export default function Home() {
  return (
    <>
      {/* 1. Hero */}
      <HeroSection />



      {/* 3. Popular Services (tabs) */}
      <PopularServices />

      {/* 4. Top Rated Freelancers */}
      <TopFreelancers />

      {/* 5. Talent at Fingertips */}
      <TalentSection />

      {/* 6. Top Categories */}
      <CategoriesSection />
    </>
  );
}
