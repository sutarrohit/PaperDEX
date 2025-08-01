import BackdropGradient from "@/components/global/backdrop-gradient";
import GradientText from "@/components/global/gradient-text";
import { Button } from "@/components/ui/button";
import { BadgePlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const LandingHero = async () => {
  const headersList = await headers();
  const cookie = headersList.get("cookie");

  // Parse cookie string into an object
  let cookieMap;
  if (cookie) {
    cookieMap = Object.fromEntries(
      cookie.split("; ").map((c) => {
        const [key, ...v] = c.split("=");
        return [key, v.join("=")];
      }),
    );
  }
  const sessionToken = cookieMap ? cookieMap["better-auth.session_token"] : "";

  return (
    <div className="flex flex-col justify-center items-center text-center mt-10 md:mt-20 w-full">
      <BackdropGradient className="w-8/12 h-full opacity-40 flex flex-col items-center md:mx-20">
        <GradientText className="text-[40px] sm:text-[45px] md:text-[50px] xl:text-[60px] font-bold text-center leading-tight">
          Master Crypto Trading Without <br className="hidden md:block" /> Real Money
        </GradientText>

        <p className="text-center text-muted-foreground mt-5 px-2">
          Trade Bitcoin, Ethereum, and 100+ cryptos in real-time without spending a dime.
          <br className="hidden md:block" /> Sign up, get demo money, and start your risk-free trading journey today!
        </p>
      </BackdropGradient>

      <div className="flex md:justify-center gap-5 mt-8">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="rounded-xl">
              Watch Demo
            </Button>
          </TooltipTrigger>
          <TooltipContent className="py-2">Coming Soon</TooltipContent>
        </Tooltip>

        {/* <Button variant="outline" className="rounded-xl bg-transparent text-[14px] cursor-pointer">
              Watch Demo
            </Button> */}

        <Link href={`${!sessionToken ? "/market?redirect=market" : "/market"}`}>
          <Button className="rounded-xl text-[14px] flex gap-2 w-full cursor-pointer">
            <BadgePlus /> Go to Market
          </Button>
        </Link>
      </div>

      <div className="relative py-20 w-[100%] md:w-[90%] xl:w-[80%]">
        <div className="w-full h-3/6 absolute rounded-[50%] radial--blur bg-[#877874] opacity-70" />
        <div className="w-full aspect-video relative">
          <Image
            priority
            src="/landing/dashboard-snippet.png"
            className="opacity-[0.95] w-full h-full"
            alt="snippet"
            sizes="100vw"
            objectFit="contain"
            fill
          />
        </div>
      </div>
    </div>
  );
};

export default LandingHero;
