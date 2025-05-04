"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { authClient } from "@/lib/authClient";
import { Loader2 } from "lucide-react";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);

        const { error } = await authClient.forgetPassword({
            email: email,
            redirectTo: "/reset-password"
        });

        if (error) {
            alert(error.message);
        } else {
            alert("If an account exists with this email, you will receive a password reset link.");
        }
        setIsPending(false);
    };

    return (
        <div className='w-full min-h-screen flex justify-center items-center'>
            <Card className='w-full max-w-md'>
                <CardHeader>
                    <CardTitle className='text-3xl font-bold text-center'>Forgot Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div className='space-y-2'>
                            <Label htmlFor='email'>Email</Label>
                            <Input
                                id='email'
                                type='email'
                                placeholder='Enter your email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete='email'
                                required
                            />
                        </div>
                        <Button type='submit' className='w-full' disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Sending...
                                </>
                            ) : (
                                "Send Reset Link"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
