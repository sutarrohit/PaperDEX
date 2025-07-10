"use client";

import GradientText from "@/components/global/gradient-text";
import Image from "next/image";
import React from "react";
import GradientButton from "@/components/global/gradient-button";
import Link from "next/link";
import User from "@/components/global/user-card";
import { authClient } from "@/lib/authClient";
import Navigator from "@/components/global/navigator";

const LandingPageNavbar = () => {
  const { useSession } = authClient;

  const session = useSession();
  if (session.isPending) return null;

  return (
    <div className="container flex justify-between items-center z-50 sticky top-0 px-2 py-4">
      <Link href="/">
        <div className="flex gap-2 items-center">
          <div className="text-sidebar-primary-foreground bg-orange-500 flex aspect-square size-8 p-1 border items-center justify-center rounded-lg">
            <Image src="/landing/logo-white.png" alt="icon" width={100} height={100} className="" />
          </div>

          <GradientText className="text-center font-bold md:text-[18px]" element="H1">
            PaperDEX
          </GradientText>
        </div>
      </Link>

      <Navigator orientation={"desktop"} />

      {session?.data ? <User /> : <GradientButton name={"Login"} link={"/sign-in"} />}
    </div>
  );
};

export default LandingPageNavbar;
