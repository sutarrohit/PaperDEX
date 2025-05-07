import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authClient } from "@/lib/authClient";
import { SignInSchema } from "@/components/form/sign-in/schema";

export const useAuthSignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    mode: "onChange",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authClient.signIn.email(
        {
          email,
          password,
        },
        {
          onResponse: () => {
            reset();
            toast("success");
          },
        },
      ),
  });

  const signInWithEmail = handleSubmit(async (values) => {
    mutate({ email: values.email, password: values.password });
  });

  return {
    signInWithEmail,
    isPending,
    register,
    errors,
  };
};
