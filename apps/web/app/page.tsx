import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
    return (
        <div className='w-full min-h-screen flex flex-col items-center'>
            <div className='h-[60px] flex items-center justify-between p-4 w-full'>
                <p className='font-bold text-xl sm:text-2xl lg:text-3xl text-[#A1A1A1]'>DeTr</p>
                <Button className='border px-4 sm:px-8'>Contact us</Button>
            </div>

            <div className='w-full mt-10 flex flex-col gap-3 items-center'>
                <h1 className='text-white text-[50px] md:text-[60px] font-bold sm:w-[80%] text-center px-2'>The Future of Crypto Trading is Here</h1>

                <div className='w-full flex justify-center'>
                    <p className='text-[18px] sm:text-[22px] text-[#A1A1A1] font-[400px] w-[90%] text-center px-2 sm:w-[70%] xl:w-[50%]'>
                        Experience seamless crypto trading with our demo platform. Trade risk-free, explore real-time markets, and refine your
                        strategies with confidence.
                    </p>
                </div>
            </div>

            <div className='relative pt-20 pb-10 w-[90%] sm:w-[70%]'>
                <div className='w-full h-3/6 absolute rounded-[50%] radial--blur opacity-80 mx-10 border border-amber-300' />
                <div className='w-full aspect-video relative'>
                    <Image src='/chart.jpg' alt='chart' className='w-full object-cover ' width={2000} height={2000} />
                </div>
            </div>
        </div>
    );
}
