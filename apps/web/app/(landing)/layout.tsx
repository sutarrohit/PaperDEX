import { Spotlight } from "@/components/ui/spotlight-new";
import LandingPageNavbar from "./_components/navbar";

import { getQueryClient } from "@/lib/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getMarketData } from "@/lib/api/market-api";

const LandingPageLayout = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery({
    queryKey: ["market-table", 0, 10],
    queryFn: () => getMarketData(0, 10),
  });

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
