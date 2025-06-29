"use client";

import * as React from "react";
import { LayoutDashboard, Store, UserSearch, History, House, ChartCandlestick } from "lucide-react";

import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { Heading } from "./heading";
import { NavPages } from "./nav-pages";

// This is sample data.
export const dashboardData = {
  heading: [
    {
      name: "PaperDEX",
      logo: "/landing/logo-white.png",
    },
  ],

  routes: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Tx History",
      url: "/history",
      icon: History,
    },
    {
      name: "User Info",
      url: "/user-info",
      icon: UserSearch,
    },
  ],

  pages: [
    {
      name: "Home",
      url: "/",
      icon: House,
    },
    {
      name: "Market",
      url: "/market",
      icon: Store,
    },
    {
      name: "Trade",
      url: "/trade/BNB_USDT?mode=spot",
      icon: ChartCandlestick,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} variant="inset" className="">
      <SidebarHeader>
        <Heading heading={dashboardData.heading} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={dashboardData.routes} />
        <NavPages projects={dashboardData.pages} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
