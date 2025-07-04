import Image from "next/image";
import { cn } from "@/lib/utils";
import { tokenInfo } from "@/utils/tokenData";

const TokenImage = ({
  tokenSymbol,
  className,
  title = true,
}: {
  tokenSymbol: string;
  className?: string;
  title?: boolean;
}) => {
  const [baseToken, quoteToken] = tokenSymbol.split("/");

  const baseTokenURL = tokenInfo.find((token) => token.symbol === baseToken)?.icon || "";
  const quoteTokenURL = tokenInfo.find((token) => token.symbol === quoteToken)?.icon || "";

  return (
    <div className="w-full flex flex-gap-2">
      <div className="relative flex items-center justify-items-start">
        <Image
          src={baseTokenURL}
          alt={baseToken}
          width={40}
          height={40}
          className={cn("w-6 h-6 rounded-full", className)}
        />
        <Image
          src={quoteTokenURL}
          alt={quoteToken}
          width={40}
          height={40}
          className={cn("relative w-6 h-6 right-[6px] rounded-full", className)}
        />
        {title && <p className="text-[12px] text-[#b4b0ae]">{tokenSymbol}</p>}
      </div>
    </div>
  );
};

export default TokenImage;
