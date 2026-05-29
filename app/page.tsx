import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import Editorial from "@/components/Editorial";
import MethodPillars from "@/components/MethodPillars";
import DemoWorkspace from "@/components/DemoWorkspace";
import Colophon from "@/components/Colophon";
import Roadmap from "@/components/Roadmap";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <Hero />
      <Editorial />
      <MethodPillars />
      <DemoWorkspace />
      <Colophon />
      <Roadmap />
      <Footer />
    </main>
  );
}
