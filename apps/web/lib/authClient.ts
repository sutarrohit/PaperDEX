import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@paperdex/auth-service";

const NEXT_PUBLIC_AUTH_SERVICE = process.env.NEXT_PUBLIC_AUTH_SERVICE as string;

export const authClient = createAuthClient({
    plugins: [inferAdditionalFields<typeof auth>()],
    baseURL: `${NEXT_PUBLIC_AUTH_SERVICE}/api/auth`
});
