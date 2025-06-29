import Sidebar from "@/components/global/sidebar";
// import { getUserStats } from "@/lib/api/user-api";
import { getQueryClient } from "@/lib/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const DashboardLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const queryClient = getQueryClient();

  // void queryClient.prefetchQuery({
  //   queryKey: ["user-stats"],
  //   queryFn: () => getUserStats(),
  // });

  return (
    <Sidebar>
      <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>
    </Sidebar>
  );
};

export default DashboardLayout;
