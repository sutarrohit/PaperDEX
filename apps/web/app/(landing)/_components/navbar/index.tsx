import GradientText from "@/components/global/gradient-text";

import Image from "next/image";
import React from "react";
import GradientButton from "@/components/global/gradient-button";

const LandingPageNavbar = () => {
  return (
    <div className="container flex justify-between items-center z-50 sticky top-0 px-2 py-2">
      <div className="flex flex-col items-center">
        <Image
          src="/landing/logo-white.png"
          alt="chart"
          className="w-[30px] h-[30px] object-cover"
          width={50}
          height={50}
        />

        <GradientText className="text-center font-bold md:text-[20px]" element="H1">
          PaperDEX
        </GradientText>
      </div>
      <GradientButton name={"Login"} link={"/sign-in"} />
    </div>
  );
};

export default LandingPageNavbar;
