"use client";

import { Loader } from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { useAuthForgotPassword } from "@/hooks/authentication";

import { ErrorMessage } from "@hookform/error-message";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

const ForgotPasswordForm = () => {
  const { isPending, forgotPassword, register, errors } = useAuthForgotPassword();

  return (
    <form className="flex flex-col gap-4 m-0" onSubmit={forgotPassword}>
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

      <div className="w-full space-y-[18px]">
        <Button type="submit" className="rounded-md cursor-pointer mt-1 w-full">
          <Loader loading={isPending}>Send Reset Link</Loader>
        </Button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
