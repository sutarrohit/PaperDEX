import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@paperdex/db";
import { sendEmail, verifyEmailTemplate, resetPasswordTemplate } from "@paperdex/lib";
import { openAPI } from "better-auth/plugins";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const NEXT_PUBLIC_CLIENT_SERVICE = process.env.NEXT_PUBLIC_CLIENT_SERVICE!;
const NEXT_PUBLIC_USER_SERVICE = process.env.NEXT_PUBLIC_USER_SERVICE!;

export const auth: ReturnType<typeof betterAuth> = betterAuth({
    appName: "PaperDEX",

    baseURL: `${NEXT_PUBLIC_USER_SERVICE}/api/auth`,
    trustedOrigins: [NEXT_PUBLIC_CLIENT_SERVICE],

    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),

    advanced: {
        generateId: false
    },

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

    plugins: [openAPI()],

    // user: {
    //     modelName: "User", // Must match your Prisma model name
    //     createUser: async (db: any, userData: any) => {
    //         return await db.user.create({
    //             data: {
    //                 ...userData,
    //                 wallet: {
    //                     create: {
    //                         id: uuidv4(),
    //                         // Add any default balances if needed
    //                         balances: {
    //                             create: [
    //                                 {
    //                                     id: uuidv4(),
    //                                     name: "USDT",
    //                                     symbol: "USDT",
    //                                     balance: 0,
    //                                     icon: "/icons/usdt.svg"
    //                                 }
    //                             ]
    //                         }
    //                     }
    //                 }
    //             }
    //         });
    //     },
    //     fields: {
    //         email: "email",
    //         name: "name"
    //     }
    // },

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,

        sendResetPassword: async ({ user, url }) => {
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
            redirectURI: `${NEXT_PUBLIC_USER_SERVICE}/api/auth/callback/google`
        }
    }
});

export type Session = typeof auth.$Infer.Session;
