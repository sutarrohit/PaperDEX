"use client";

import * as React from "react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function Heading({
  heading,
}: {
  heading: {
    name: string;
    logo: string;
  }[];
}) {
  const router = useRouter();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
          onClick={() => {
            router.push("/");
          }}
        >
          <div className="text-sidebar-primary-foreground bg-orange-500 flex aspect-square size-8 p-1 border items-center justify-center rounded-lg">
            <Image src={heading[0].logo} alt="icon" width={100} height={100} className="" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{heading[0].name}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
