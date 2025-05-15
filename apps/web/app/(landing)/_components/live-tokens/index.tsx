import BackdropGradient from "@/components/global/backdrop-gradient";
import GradientText from "@/components/global/gradient-text";

import MarketTable from "@/components/global/MarketTable";

const LiveToken = () => {
  return (
    <div className="flex flex-col w-[95%] md:w-full h-full items-center justify-center py-4 md:py-10">
      <GradientText className="text-[40px] sm:text-[45px] md:text-[50px] font-bold text-center leading-tight">
        Track Real-Time Crypto <br className="hidden md:block" /> Prices Instantly
      </GradientText>
      <p className="text-center text-muted-foreground mt-5 px-2">
        Get a clear view of the crypto market with our dynamic token table. Compare prices, 24h changes,
        <br className="hidden md:block" /> volumes, and more all updated in real-time to help you analyze and act with
        confidence.
      </p>

      <div className="w-full md:w-[90%] lg:w-[80%] xl:w-[72%]">
        <BackdropGradient className="w-full h-full opacity-20 mx-0 items-center md:top-[-40px] md:left-[-250px] bg-[#143b91]/80">
          <MarketTable isLandingPage={true} />
        </BackdropGradient>
      </div>
    </div>
  );
};

export default LiveToken;
