"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/authClient";
import { Loader2 } from "lucide-react";

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    console.log("searchParams", searchParams.get("token"));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Simple validation
        setPasswordError("");
        setConfirmPasswordError("");

        if (!password) {
            setPasswordError("Password is required");
            return;
        }

        if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters");
            return;
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
            return;
        }

        setIsPending(true);
        const { error } = await authClient.resetPassword({
            newPassword: password,
            token: searchParams.get("token") as string
        });

        if (error) {
            alert(error.message);
        } else {
            alert("Password reset successful. Login to continue.");
            router.push("/sign-in");
        }
        setIsPending(false);
    };

    if (error === "invalid_token") {
        return (
            <div className='w-full min-h-screen flex justify-center items-center'>
                <Card className='w-full max-w-md'>
                    <CardHeader>
                        <CardTitle className='text-3xl font-bold text-center'>Invalid Reset Link</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-4'>
                            <p className='text-center text-gray-600'>
                                This password reset link is invalid or has expired.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className='w-full min-h-screen flex justify-center items-center'>
            <Card className='w-full max-w-md'>
                <CardHeader>
                    <CardTitle className='text-3xl font-bold text-center'>Reset Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div className='space-y-2'>
                            <Label htmlFor='password'>New Password</Label>
                            <Input
                                id='password'
                                type='password'
                                placeholder='Enter your new password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {passwordError && <p className='text-sm font-medium text-destructive'>{passwordError}</p>}
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='confirmPassword'>Confirm Password</Label>
                            <Input
                                id='confirmPassword'
                                type='password'
                                placeholder='Confirm your new password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            {confirmPasswordError && (
                                <p className='text-sm font-medium text-destructive'>{confirmPasswordError}</p>
                            )}
                        </div>

                        <Button type='submit' className='w-full' disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Resetting...
                                </>
                            ) : (
                                "Reset Password"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default function ResetPassword() {
    return (
        <Suspense>
            <ResetPasswordContent />
        </Suspense>
    );
}
