import AkHeroSection from "./ak-hero-section";
import AkContentSections from "./ak-content-sections";

export default function AkHomepage() {
  return (
    <div className="min-h-screen">
      <AkHeroSection />
      <AkContentSections />
    </div>
  );
}