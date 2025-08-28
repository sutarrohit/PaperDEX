import { authClient } from "../authClient";

export const signInApi = async (email: string, password: string, redirect: string | null) => {
  const { data, error } = await authClient.signIn.email({
    email,
    password,
    callbackURL: `${process.env.NEXT_PUBLIC_WEB_SERVICE}${redirect ? redirect : "/market"}`,
  });

  if (error) throw new Error(error?.message || "failed to sign in");

  return data;
};

export const singUpApi = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  image: string = "",
  redirect: string | null,
) => {
  const { data, error } = await authClient.signUp.email({
    email,
    password,
    name: `${firstName} ${lastName}`,
    image: image,
    callbackURL: `${process.env.NEXT_PUBLIC_WEB_SERVICE}${redirect ? redirect : "/market"}`,
  });

  if (error) throw new Error(error?.message || "failed to sign up");

  return data;
};

export const forgotPasswordApi = async (email: string) => {
  const { data, error } = await authClient.forgetPassword({
    email,
  });

  if (error) throw new Error(error?.message || "failed to forgot password");

  return data;
};

export const resetPasswordApi = async (password: string, token: string) => {
  const { data, error } = await authClient.resetPassword({
    newPassword: password,
    token,
  });

  if (error) throw new Error(error?.message || "failed to reset password");

  return data;
};
