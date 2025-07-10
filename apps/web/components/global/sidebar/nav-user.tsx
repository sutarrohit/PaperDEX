"use client";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import User from "../user-card";

export function NavUser() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <User sidebar={true} />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
