import SignInForm from "@/components/form/sign-in";
import { Suspense } from "react";

const SignIn = async () => {
  return (
    <>
      <div>
        <h5 className="text-lg md:text-xl font-bold">Sign In</h5>

        <p className="text-xs md:text-sm text-[#B4B0AE] mt-1">Enter your email below to login to your account</p>
      </div>

      <Suspense fallback={<div>Loading form...</div>}>
        <SignInForm />
      </Suspense>
    </>
  );
};

export default SignIn;
