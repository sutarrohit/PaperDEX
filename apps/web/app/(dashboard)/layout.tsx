import Sidebar from "@/components/global/sidebar";

import { getQueryClient } from "@/lib/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const DashboardLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const queryClient = getQueryClient();

  return (
    <Sidebar>
      <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>
    </Sidebar>
  );
};

export default DashboardLayout;
