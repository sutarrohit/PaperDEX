import { NextResponse } from "next/server";
import { prisma } from "@/prisma/src/index";

function isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export async function POST(req: Request) {
    try {
        // Parse the request body
        const { email } = await req.json();

        // Validate the email
        if (!email || typeof email !== "string" || !isValidEmail(email)) {
            return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: "User is already registered." }, { status: 409 });
        }

        // Create new user
        await prisma.user.create({
            data: { email }
        });

        return NextResponse.json({ message: "Email added to waitlist successfully!" }, { status: 201 });
    } catch (error) {
        console.error("Error storing email:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
