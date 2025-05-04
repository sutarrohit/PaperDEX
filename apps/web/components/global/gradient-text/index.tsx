import { cn } from "@/lib/utils";

type Props = {
  element?: "H1" | "H2";
  children: React.ReactNode;
  className?: string;
};

const GradientText = ({ className, element, children }: Props) => {
  const gradientClass = "bg-gradient-to-r from-[#4a4e58] via-white to-[#716768] text-transparent bg-clip-text";

  switch (element) {
    case "H1":
      return <h1 className={cn(className, gradientClass)}>{children}</h1>;
    case "H2":
      return <h2 className={cn(className, gradientClass)}>{children}</h2>;
    default:
      return <p className={cn(className, gradientClass)}>{children}</p>;
  }
};

export default GradientText;
