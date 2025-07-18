import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email("You must give a valid email"),
});
