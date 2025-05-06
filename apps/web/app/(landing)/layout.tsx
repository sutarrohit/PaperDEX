import { Spotlight } from "@/components/ui/spotlight-new";
import LandingPageNavbar from "./_components/navbar";

import { getQueryClient } from "@/lib/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTokenPrice } from "./_components/live-tokens/fetch";

const LandingPageLayout = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(getTokenPrice);
  return (
    <div className="flex flex-col items-center justify-center w-full relative">
      <div className="w-full h-screen overflow-hidden absolute inset-0">
        <Spotlight />
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <LandingPageNavbar />
      </HydrationBoundary>
      {children}
    </div>
  );
};

export default LandingPageLayout;
