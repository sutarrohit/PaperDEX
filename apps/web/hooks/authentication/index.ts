import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SignInSchema } from "@/components/form/sign-in/schema";
import { SignUpSchema } from "@/components/form/sign-up/schema";
import { ResetPasswordSchema } from "@/components/form/reset-password/schema";
import { forgotPasswordSchema } from "@/components/form/forgot-password/schema";
import { forgotPasswordApi, resetPasswordApi, signInApi, singUpApi } from "@/lib/api/auth-api";

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
    mutationKey: ["sign-in"],
    mutationFn: async ({ email, password }: { email: string; password: string }) => signInApi(email, password),

    onError: (error: Error) => {
      toast.error(error.message || "Failed to sign in");
    },
    onSuccess: () => {
      reset();
      toast.success("Signed in successfully");
    },
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

export const useAuthSignUp = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    mode: "onChange",
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: ({
      firstName,
      lastName,
      email,
      password,
    }: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }) => singUpApi(firstName, lastName, email, password),

    onError: (error: Error) => {
      toast.error(error.message || "Failed to sign up");
    },
    onSuccess: () => {
      reset();
      toast.success("Signed up successfully", { duration: 5000 });
      router.push("/sign-in");
    },
  });

  const signUpWithEmail = handleSubmit(async (values) => {
    mutate({ firstName: values.firstName, lastName: values.lastName, email: values.email, password: values.password });
  });

  return {
    signUpWithEmail,
    isPending,
    register,
    errors,
  };
};

export const useAuthForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: ({ email }: { email: string }) => forgotPasswordApi(email),

    onError: (error: Error) => {
      toast.error(error.message || "Failed to send reset email");
    },
    onSuccess: () => {
      reset();
      toast.success("If an account exists, a reset link has been sent to your email.", { duration: 5000 });
    },
  });

  const forgotPassword = handleSubmit(async (values) => {
    mutate({ email: values.email });
  });

  return {
    forgotPassword,
    isPending,
    register,
    errors,
  };
};

export const useAuthResetPassword = (token: string) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    mode: "onChange",
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["reset-password"],
    mutationFn: ({ password }: { password: string }) => resetPasswordApi(password, token),

    onError: (error: Error) => {
      toast.error(error.message || "Failed to reset password");
    },
    onSuccess: () => {
      reset();
      toast.success("Password reset successfully");
      router.push("/sign-in");
    },
  });

  const resetPassword = handleSubmit(async (values) => {
    mutate({ password: values.password });
  });

  return {
    resetPassword,
    isPending,
    register,
    errors,
  };
};
