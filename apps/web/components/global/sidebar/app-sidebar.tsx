"use client";

import * as React from "react";
import { LayoutDashboard, Store, CreditCard, UserSearch, ChartBar, House, ChartCandlestick } from "lucide-react";

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
      name: "MCP HUB",
      url: "/mcp-hub",
      icon: Store,
    },
    {
      name: "User Info",
      url: "/user-info",
      icon: UserSearch,
    },
    {
      name: "User Statistics",
      url: "/user-statistics",
      icon: ChartBar,
    },
    {
      name: "Example Card",
      url: "/example-card",
      icon: CreditCard,
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
