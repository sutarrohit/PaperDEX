import { cn } from "@/lib/utils";
import Link from "next/link";

type GradientButton = {
  name: string;
  link: string;
  className?: string;
  container?: string;
};

const GradientButton = ({ name, link, className, container }: GradientButton) => {
  console.log("link", link);
  return (
    <Link href={link}>
      <div
        className={cn(
          "rounded-[26px] flex justify-center items-center text-[12px] font-bold h-[35px] p-[1px] w-[90px] md:w-[110px] bg-gradient-to-r  from-orange-500 to-[#6513b7] ",
          className,
        )}
      >
        <div className={cn("rounded-[24px] relative w-full h-full bg-[#212224]", container)}>
          <div className="absolute inset-0 flex justify-center items-center">{name}</div>
        </div>
      </div>
    </Link>
  );
};

export default GradientButton;
