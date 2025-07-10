import ResetPasswordForm from "@/components/form/reset-password";
import { Suspense } from "react";

function SearchBarFallback() {
  return <>Loading.........</>;
}

const ResetPassword = async () => {
  return (
    <>
      <Suspense fallback={<SearchBarFallback />}>
        <ResetPasswordForm />
      </Suspense>
    </>
  );
};

export default ResetPassword;
