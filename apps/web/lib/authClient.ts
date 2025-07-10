import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@paperdex/user-service";

const NEXT_PUBLIC_USER_SERVICE = process.env.NEXT_PUBLIC_USER_SERVICE as string;

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
  baseURL: `${NEXT_PUBLIC_USER_SERVICE}/api/auth`,
});
