import { z } from "zod";

export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(64, { message: "Password cannot exceed 64 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and Confirm Password must match",
    path: ["confirmPassword"],
  });
