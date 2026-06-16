import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Marquee from "@/components/sections/Marquee";
import Work from "@/components/sections/Work";
import Process from "@/components/sections/Process";
import Studio from "@/components/sections/Studio";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Marquee />
      <Work />
      <Process />
      <Studio />
      <FinalCTA />
    </>
  );
}
