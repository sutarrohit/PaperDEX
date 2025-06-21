"use client";

import { AppSidebar, dashboardData } from "./app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export default function Sidebar({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathName = usePathname();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <span className="font-semibold">
              {dashboardData.routes.find((route) => route?.url === pathName)?.name || "Dashboard"}
            </span>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
