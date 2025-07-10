"use client";

import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/authClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

const User = ({ sidebar = false }: { sidebar?: boolean }) => {
  const { useSession, signOut } = authClient;
  const { data } = useSession();

  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {!sidebar ? (
          <Avatar className="h-8 w-8 rounded-lg cursor-pointer">
            <AvatarImage src={data?.user?.image || "./logo-white.png"} alt={data?.user?.name} />
            <AvatarFallback className="rounded-lg bg-orange-500 cursor-pointer">
              {data?.user?.name?.split("")[0]?.toUpperCase() || "PD"}
            </AvatarFallback>
          </Avatar>
        ) : (
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
          >
            <Avatar className="h-8 w-8 rounded-lg cursor-pointer">
              <AvatarImage src={data?.user?.image || "./logo-white.png"} alt={data?.user?.name} />
              <AvatarFallback className="rounded-lg bg-orange-500 cursor-pointer">
                {data?.user?.name?.split("")[0]?.toUpperCase() || "PD"}
              </AvatarFallback>
            </Avatar>

            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{data?.user.name || ""}</span>
              <span className="truncate text-xs">{data?.user.email || ""}</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </SidebarMenuButton>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        // side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={data?.user?.image || "./logo-white.png"} alt={data?.user?.name || ""} />
              <AvatarFallback className="rounded-lg bg-orange-500">
                {data?.user?.name?.split("")[0]?.toUpperCase() || "PD"}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{data?.user?.name || ""}</span>
              <span className="truncate text-xs">{data?.user?.email || ""}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href="/dashboard" className="w-full">
              <div className="flex items-center gap-1 w-full">
                <BadgeCheck />
                Account
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex justify-between gap-1  w-full">
              <p className="flex items-center gap-2">
                <CreditCard />
                Billing
              </p>
              <Badge className="text-[10px] px-1 bg-black/40 text-white">coming soon</Badge>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex justify-between gap-1 w-full">
              <p className="flex items-center gap-2">
                <Bell />
                Notifications
              </p>
              <Badge className="text-[10px] px-1 bg-black/40 text-white">coming soon</Badge>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() =>
            signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.push("/"); // redirect to login page
                },
              },
            })
          }
        >
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default User;
