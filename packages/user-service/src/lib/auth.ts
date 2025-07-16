import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@paperdex/db";
import { verifyEmailTemplate, resetPasswordTemplate } from "@paperdex/lib/template";
import { sendEmail } from "@paperdex/lib/sendEmail";
// import { openAPI } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js"; // Important for Next.js environments
import dotenv from "dotenv";

dotenv.config();

const NEXT_PUBLIC_CLIENT_SERVICE = process.env.NEXT_PUBLIC_CLIENT_SERVICE!;
const NEXT_PUBLIC_USER_SERVICE = process.env.NEXT_PUBLIC_USER_SERVICE!;
const NEXT_PUBLIC_ORDER_SERVICE = process.env.NEXT_PUBLIC_ORDER_SERVICE!;

// Dynamically extract the root domain from your client service URL
// This ensures the cookie domain is always correct, even if base domain changes.
const rootDomain = new URL(NEXT_PUBLIC_CLIENT_SERVICE).hostname.split(".").slice(-2).join(".");

export const auth: ReturnType<typeof betterAuth> = betterAuth({
  appName: "PaperDEX",

  baseURL: `${NEXT_PUBLIC_USER_SERVICE}/api/auth`,
  trustedOrigins: [
    NEXT_PUBLIC_CLIENT_SERVICE,
    NEXT_PUBLIC_USER_SERVICE,
    NEXT_PUBLIC_ORDER_SERVICE, // Include all origins that interact with this service
  ],

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  advanced: {
    generateId: false,

    crossSubDomainCookies: {
      enabled: true,
      domain: `.${rootDomain}`, // Use the dynamically extracted root domain
    },
    defaultCookieAttributes: {
      secure: true, // Absolutely essential for HTTPS environments
      httpOnly: true, // Prevents client-side JavaScript access for security
      sameSite: "None", // Crucial for sending cookies across different subdomains (cross-site)
      // Requires 'secure: true' to be effective.
    },
    useSecureCookies: true, // Explicitly tells better-auth to set 'Secure' flag on cookies
  },
  // --- END OF CORRECTED 'advanced' OBJECT STRUCTURE ---

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 4, // Update session after 4 hours of inactivity
    cookieCache: {
      maxAge: 5 * 60, // Cache cookies for 5 minutes
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "email-password"],
      allowDifferentEmails: false,
    },
  },

  // Ensure nextCookies() is applied correctly here.
  // If this config is strictly for the backend (Express), you'd typically NOT include nextCookies() here.
  plugins: [
    // openAPI(),
    nextCookies(), // Important for Next.js environments to handle cookies correctly
  ],

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,

    sendResetPassword: async ({ user, token }) => {
      const resetPasswordUrl = `${process.env.NEXT_PUBLIC_CLIENT_SERVICE}/reset-password?token=${token}`;
      const html = resetPasswordTemplate(resetPasswordUrl, user.name);
      const subject = "Reset your password";

      sendEmail(user.email, subject, html);
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ url, user }) => {
      const html = verifyEmailTemplate(url, user.name);
      const subject = "Verify your email address";
      sendEmail(user.email, subject, html);
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600, // 1 hour
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectURI: `${NEXT_PUBLIC_USER_SERVICE}/api/auth/callback/google`,
    },
  },
});

export type Session = typeof auth.$Infer.Session;
