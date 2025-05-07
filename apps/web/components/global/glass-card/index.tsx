import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const GlassCard = ({ children, className }: Props) => {
  return (
    <Card
      className={cn(
        "rounded-2xl bg-[#27272A]/20 border border-[#27272A] backdrop-filter backdrop-blur-3xl  backdrop-saturate-150 supports-[backdrop-filter]:backdrop-blur-3xl",
        className,
      )}
    >
      {children}
    </Card>
  );
};

export default GlassCard;
