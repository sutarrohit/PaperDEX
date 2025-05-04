import BackdropGradient from "@/components/global/backdrop-gradient";

import GlassCard from "@/components/global/glass-card";

import GradientText from "@/components/global/gradient-text";

export default function Home() {
  return (
    <div className="w-full flex justify-center items-center h-dvh">
      <div className="w-full flex  flex-col gap-10 justify-center items-center">
        <GradientText className="text-[50px] font-bold" element="H1">
          PAPER-DEX
        </GradientText>

        <BackdropGradient className="w-4/12 h-2/6 opacity-40" container="flex flex-col items-center">
          <GlassCard>
            <div className="w-[400px] h-[400px] flex justify-center items-center">
              <GradientText className="text-[50px] font-bold text-center" element="H1">
                Hello
                <br />
                PAPER-DEX
              </GradientText>
            </div>
          </GlassCard>
        </BackdropGradient>
      </div>
    </div>
  );
}
