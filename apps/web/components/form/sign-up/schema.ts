import { z } from "zod";

export const SignUpSchema = z
  .object({
    firstName: z.string().min(1, "Enter first name"),
    lastName: z.string().min(1, "Enter last name"),
    email: z.string().email("Please enter a valid email address"),
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
