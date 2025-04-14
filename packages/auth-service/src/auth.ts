import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@paperdex/db";
import { sendEmail, verifyEmailTemplate, resetPasswordTemplate } from "@paperdex/lib";
import dotenv from "dotenv";

dotenv.config();

const NEXT_PUBLIC_CLIENT_SERVICE = process.env.NEXT_PUBLIC_CLIENT_SERVICE!;
const NEXT_PUBLIC_AUTH_SERVICE = process.env.NEXT_PUBLIC_AUTH_SERVICE!;

export const auth: ReturnType<typeof betterAuth> = betterAuth({
    baseURL: `${NEXT_PUBLIC_AUTH_SERVICE}/api/auth`,
    trustedOrigins: [NEXT_PUBLIC_CLIENT_SERVICE],

    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),

    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 4,
        cookieCache: {
            maxAge: 5 * 60
        }
    },

    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google", "github", "email-password"],
            allowDifferentEmails: false
        }
    },

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }, request) => {
            // Change callback url to frontend URL
            const parsedUrl = new URL(url);
            const originalCallback = parsedUrl.searchParams.get("callbackURL") || "/reset-password";
            parsedUrl.searchParams.set("callbackURL", `${NEXT_PUBLIC_CLIENT_SERVICE}${originalCallback}`);
            const resetPasswordUrl = parsedUrl.toString();

            const html = resetPasswordTemplate(resetPasswordUrl, user.name);
            const subject = "Reset your password";

            sendEmail(user.email, subject, html);
        }
    },

    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            // Change callback url to frontend URL
            const parsedUrl = new URL(url);
            const originalCallback = parsedUrl.searchParams.get("callbackURL") || "/dashboard";
            parsedUrl.searchParams.set("callbackURL", `${NEXT_PUBLIC_CLIENT_SERVICE}${originalCallback}`);
            const verifyUrl = parsedUrl.toString();

            const html = verifyEmailTemplate(verifyUrl, user.name);
            const subject = "Verify your email address";

            sendEmail(user.email, subject, html);
        },
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        expiresIn: 3600
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            redirectURI: `${NEXT_PUBLIC_AUTH_SERVICE}/api/auth/callback/google`
        }
    }
});

export type Session = typeof auth.$Infer.Session;
