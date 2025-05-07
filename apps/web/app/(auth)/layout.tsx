import BackdropGradient from "@/components/global/backdrop-gradient";
import GlassCard from "@/components/global/glass-card";
import GradientText from "@/components/global/gradient-text";
// import { redirect } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

const AuthLayout = async ({ children }: Props) => {
  return (
    <div className="w-full flex justify-center">
      <div className="container h-screen flex justify-center items-center">
        <div className="flex flex-col w-full items-center py-24">
          <GradientText className="text-4xl font-bold" element="H1">
            PaperDEX
          </GradientText>
          <BackdropGradient className="w-full md:w-4/12 h-2/6 opacity-50" container="flex flex-col items-center">
            <GlassCard className="w-19/20 md:w-7/12 lg:w-5/12 xl:w-4/15 p-5 mt-16 bg-[#09090B]/20 border border-[#27272A]">
              {children}
            </GlassCard>
          </BackdropGradient>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
