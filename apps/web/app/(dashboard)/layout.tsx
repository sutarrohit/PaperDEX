import Sidebar from "@/components/global/sidebar";
import React from "react";

const DashboardLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <Sidebar>{children}</Sidebar>;
};

export default DashboardLayout;
