import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  menuList: { label: string; symbol: string }[];
  onSetSection: <T extends string>(arg: T) => void;
  currentLabel: string;
};

const MenuBar = ({ menuList, onSetSection, currentLabel }: Props) => {
  return (
    <Card className="p-0 border border-[#37372c] rounded-lg">
      <CardContent className="gap-2 items-center p-1.5 bg-[#27272a] bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-60 flex rounded-xl">
        {menuList.map((menuItem, index) => (
          <div
            key={index}
            {...(menuItem.label && {
              onClick: () => onSetSection(menuItem.label),
            })}
            className={cn(
              "rounded-[8px] flex gap-2 py-2 px-4 item-center text-[12px] cursor-pointer transition-all duration-200 ease-in-out border border-transparent ",
              currentLabel == menuItem.label ? "bg-[#09090b] border-[#37372c] items-center" : "",
            )}
          >
            {menuItem.label}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MenuBar;
