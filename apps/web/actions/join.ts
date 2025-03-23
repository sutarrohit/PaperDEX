"use server";

import { prisma } from "@repo/db";

function isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export async function joinWaitlistAction(email: string) {
    if (!email || typeof email !== "string" || !isValidEmail(email)) {
        throw new Error("Invalid email address");
    }

    try {
        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            throw new Error("User is already registered.");
        }

        // Create new user
        await prisma.user.create({
            data: { email }
        });

        return { message: "Email added to waitlist successfully!" };
    } catch (error) {
        console.error("Error storing email:", error);
        throw error;
    }
}
