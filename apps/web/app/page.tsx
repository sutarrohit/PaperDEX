/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { joinWaitlistAction } from "@/actions/join";

function isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export default function Home() {
    const [email, setEmail] = useState<null | string>(null);
    const [loading, setLoading] = useState(false);

    async function joinWaitlist(email: string | null) {
        try {
            if (!email) return;

            if (!isValidEmail(email)) {
                toast.error("Please enter valid Email", {
                    style: {
                        background: "#ff0000", // Red background for errors
                        color: "#ffffff" // White text
                    },
                    position: "top-right"
                });
                return;
            }
            setLoading(true);
            const response = await joinWaitlistAction(email);

            if (response) {
                setEmail(null);
                setLoading(false);
                toast.success(response.message || "Successfully joined the waitlist!", {
                    position: "top-right",
                    style: {
                        background: "#00ff00",
                        color: "#000000"
                    }
                });
            }
        } catch (error: any) {
            toast.error(error?.message || "failed", {
                style: {
                    background: "#ff0000", // Red background for errors
                    color: "#ffffff" // White text
                },
                position: "top-right"
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='w-full min-h-screen flex flex-col items-center'>
            <div className='h-[80px] flex items-center justify-between w-full sm:px-6 px-4'>
                <div className='flex flex-col items-center'>
                    <Image src='/logo-white.png' alt='chart' className='w-[35px] h-[35px] object-cover' width={50} height={50} />
                    <p className='text-center bottom-[-20px] font-bold  text-[14px] text-[#cecaca]'>PaperDEX</p>
                </div>

                <Button className='border'>Contact us</Button>
            </div>

            <div className='w-full mt-10 flex flex-col gap-3 items-center'>
                <h1 className='text-white text-[50px] md:text-[60px] font-bold sm:w-[80%] text-center px-2'>The Future of Crypto Trading is Here</h1>

                <div className='w-full flex justify-center'>
                    <p className='text-[18px] sm:text-[22px] text-[#A1A1A1] font-[400px] w-[90%] text-center px-2 sm:w-[70%] xl:w-[50%]'>
                        Experience seamless crypto trading with our demo platform. Trade risk-free, explore real-time markets, and refine your
                        strategies with confidence.
                    </p>
                </div>

                <div className='flex justify-center gap-3 w-[90%]'>
                    <Input
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                        className='sm:w-[300px]'
                        type='email'
                        placeholder='you@example.com'
                    />
                    <Button
                        disabled={loading}
                        onClick={() => {
                            joinWaitlist(email);
                        }}
                        className='cursor-pointer'
                    >
                        Join Waitlist
                    </Button>
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
