"use client";

import { Loader } from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { useAuthSignUp } from "@/hooks/authentication";
import LoginWithGoogle from "@/components/global/google-login";
import Link from "next/link";

import { ErrorMessage } from "@hookform/error-message";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { useSearchParams } from "next/navigation";

const SignUpForm = () => {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || null;

  const { isPending, signUpWithEmail, register, errors } = useAuthSignUp(redirect);

  return (
    <form className="flex flex-col gap-4 m-0" onSubmit={signUpWithEmail}>
      {/* FirstName & lastName */}
      <div className="w-full flex gap-4">
        <div className="space-y-2">
          <Label className="flex " htmlFor={`input-firstName`}>
            First Name
          </Label>
          <Input
            id={`input-firstName`}
            type="text"
            placeholder={"Max"}
            className="bg-themeBlack border-themeGray text-themeTextGray"
            {...register("firstName")}
          />
          <ErrorMessage
            errors={errors}
            name={"firstName"}
            render={({ message }) => (
              <p className="text-red-400 w-full break-words text-[12px]">{message === "Required" ? "" : message}</p>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex " htmlFor={`input-lastName`}>
            Last Name
          </Label>
          <Input
            id={`input-lastName`}
            type="text"
            placeholder={"Robinson"}
            className="bg-themeBlack border-themeGray text-themeTextGray"
            {...register("lastName")}
          />
          <ErrorMessage
            errors={errors}
            name={"lastName"}
            render={({ message }) => (
              <p className="text-red-400 w-full break-words text-[12px]">{message === "Required" ? "" : message}</p>
            )}
          />
        </div>
      </div>

      {/* Email */}
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

      {/* Password */}
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

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label className="flex " htmlFor={`input-confirmPassword`}>
          Confirm Password
        </Label>
        <Input
          id={`input-confirmPassword`}
          type="password"
          placeholder={"confirm password"}
          className="bg-themeBlack border-themeGray text-themeTextGray"
          {...register("confirmPassword")}
        />
        <ErrorMessage
          errors={errors}
          name={"confirmPassword"}
          render={({ message }) => (
            <p className="text-red-400 w-full break-words text-[12px]">{message === "Required" ? "" : message}</p>
          )}
        />
      </div>

      <div className="w-full space-y-[18px]">
        <Button
          type="submit"
          className="rounded-md cursor-pointer mt-1 w-full bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Loader loading={isPending}>Create an account</Loader>
        </Button>

        <LoginWithGoogle redirect={redirect} />

        <div className="w-full flex justify-center gap-1 text-[12px]">
          <span>Already have and account?</span>
          <Link href="/sign-in" className="text-[#007bff]/80 underline cursor-pointer">
            Sign in
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
