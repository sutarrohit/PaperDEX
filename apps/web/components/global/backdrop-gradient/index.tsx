import { cn } from "@/lib/utils";
type Props = {
  children: React.ReactNode;
  className?: string;
  container?: string;
};

const BackdropGradient = ({ children, className, container }: Props) => {
  return (
    <div className={cn("relative w-full flex flex-col", container)}>
      <div className={cn("absolute backdrop-blur-[50px] blur-[100px] bg-primary rounded-[50%]", className)} />
      {children}
    </div>
  );
};

export default BackdropGradient;
