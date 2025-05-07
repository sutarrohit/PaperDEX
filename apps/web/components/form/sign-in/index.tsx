"use client";

import { Loader } from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { useAuthSignIn } from "@/hooks/authentication";
import LoginWithGoogle from "@/components/global/google-login";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

import { ErrorMessage } from "@hookform/error-message";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

const SignInForm = () => {
  const { isPending, signInWithEmail, register, errors } = useAuthSignIn();

  return (
    <form className="flex flex-col gap-4 m-0" onSubmit={signInWithEmail}>
      <div className="space-y-2">
        <Label className="flex " htmlFor={`input-email`}>
          Email
        </Label>
        <Input
          id={`input-email`}
          type="email"
          placeholder={"m@example.com"}
          className="bg-themeBlack border-themeGray text-themeTextGray"
          {...register("email")}
        />
        <ErrorMessage
          errors={errors}
          name={"email"}
          render={({ message }) => (
            <p className="text-red-400 w-full break-words text-[12px]">{message === "Required" ? "" : message}</p>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label className="flex " htmlFor={`input-password`}>
          Password
        </Label>
        <Input
          id={`input-password`}
          type="password"
          placeholder={"password"}
          className="bg-themeBlack border-themeGray text-themeTextGray"
          {...register("password")}
        />
        <ErrorMessage
          errors={errors}
          name={"password"}
          render={({ message }) => (
            <p className="text-red-400 w-full break-words text-[12px]">{message === "Required" ? "" : message}</p>
          )}
        />
      </div>

      <div className="w-full space-y-[18px]">
        <Button type="submit" className="rounded-md cursor-pointer mt-1 w-full">
          <Loader loading={isPending}>Login</Loader>
        </Button>

        <LoginWithGoogle />

        <Separator orientation="horizontal" className="bg-[#27272a]" />
        <Link href="/sign-up">
          <Button className="cursor-pointer w-full rounded-md">Create an Account</Button>
        </Link>
      </div>
    </form>
  );
};

export default SignInForm;
