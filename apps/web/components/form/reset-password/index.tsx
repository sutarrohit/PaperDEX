"use client";

import { Loader } from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { useAuthResetPassword } from "@/hooks/authentication";
import { useSearchParams } from "next/navigation";

import { ErrorMessage } from "@hookform/error-message";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const token = searchParams.get("token");

  const { isPending, resetPassword, register, errors } = useAuthResetPassword(token as string);

  if (error === "invalid_token") {
    return (
      <div className="flex justify-center items-center">
        <div className="space-y-4">
          <p className="text-center text-[#B4B0AE] text-[14px]">This password reset link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <h5 className="text-lg md:text-xl font-bold">Reset Password</h5>
        <p className="text-xs md:text-sm text-[#B4B0AE] mt-1">
          Enter your new password and confirm it to complete the reset process.
        </p>
      </div>
      <form className="flex flex-col gap-4 m-0" onSubmit={resetPassword}>
        <div className="space-y-2">
          <Label className="flex " htmlFor={`input-password`}>
            New Password
          </Label>
          <Input
            id={`input-password`}
            type="password"
            placeholder={"Enter you new password"}
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

        <div className="space-y-2">
          <Label className="flex " htmlFor={`input-confirm-password`}>
            Confirm Password
          </Label>
          <Input
            id={`input-confirm-password`}
            type="password"
            placeholder={"Confirm your new password"}
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
            <Loader loading={isPending}>Reset Password</Loader>
          </Button>
        </div>
      </form>
    </>
  );
};

export default ResetPasswordForm;
