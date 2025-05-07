import { z } from "zod";

export const SignInSchema = z.object({
  email: z.string().email("You must give a valid email"),
  password: z.string().min(8, { message: "Your password must be atleast 8 characters long" }).max(64, {
    message: "Your password can not be longer then 64 characters long",
  }),
  // .refine(
  //   (value) =>
  //     /[A-Z]/.test(value) && // At least one uppercase letter
  //     /[0-9]/.test(value) && // At least one number
  //     /[^a-zA-Z0-9]/.test(value), // At least one special character
  //   {
  //     message: "Password must include at least one uppercase letter, one number, and one special character",
  //   },
  // ),
});
