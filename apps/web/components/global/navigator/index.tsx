"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type MenuProps = {
  orientation: "desktop" | "mobile";
};

export const LANDING_PAGE_MENU = [
  {
    id: 3,
    label: "Home",
    path: "/",
  },
  {
    id: 0,
    label: "Dashboard",
    path: "/dashboard",
    section: true,
  },
  {
    id: 1,
    label: "Market",
    path: "/market",
    section: true,
  },
  {
    id: 2,
    label: "Trade",
    path: "/trade/BNB_USDT?mode=spot",
  },
];

const getBasePath = (path: string) => "/" + path.split("/")[1];

const Navigator = ({ orientation }: MenuProps) => {
  const pathname = usePathname();
  const [section, setSection] = useState(getBasePath(pathname));

  switch (orientation) {
    case "desktop":
      return (
        <Card className="bg-clip-padding backdrop-blur__safari bg-opacity-20 p-1 sm:flex hidden rounded-lg  bg-[#27272A]/20 border backdrop-filter backdrop-blur-3xl backdrop-saturate-150 supports-[backdrop-filter]:backdrop-blur-3xl">
          <CardContent className="px-0 flex gap-0 sm:gap-1 items-center">
            {LANDING_PAGE_MENU.map((menuItem) => (
              <Link
                href={menuItem.path}
                key={menuItem.id}
                {...(menuItem.section && {
                  onClick: () => setSection(getBasePath(menuItem.path)),
                })}
                className={cn(
                  "rounded-lg flex gap-2 py-1 px-4 item-center text-[12px] transition-all duration-300 ease-in-out border",
                  section === getBasePath(menuItem.path) ? "border-gray-300" : "border-transparent",
                )}
              >
                {menuItem.label}
              </Link>
            ))}
          </CardContent>
        </Card>
      );

    default:
      return <div></div>;
  }
};

export default Navigator;
