import dynamic from "next/dynamic";
import LandingHero from "./_components/landing-hero";

// LiveToken is not loaded when the page first renders.
const LiveToken = dynamic(() => import("./_components/live-tokens"));

const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center relative container px-2">
      <LandingHero />
      <LiveToken />
    </div>
  );
};

export default Home;
