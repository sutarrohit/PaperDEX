import React from "react";

type Props = {
  menuList: { name: string; symbol: string }[];
  actionFn: <T extends string>(arg: T) => void;
};

const MenuBar = ({ menuList, actionFn }: Props) => {
  return (
    <div className="p-1.5 flex gap-2 rounded-md border border-[#b4b0ae] bg-[#27272a] w-fit">
      {menuList?.map((menu, index) => {
        return (
          <div key={index} className="bg-[#09090b] border border-[#b4b0ae] px-4 py-1.5 rounded-md text-[12px]">
            {menu.name}
          </div>
        );
      })}
    </div>
  );
};

export default MenuBar;
