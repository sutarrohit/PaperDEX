import ForgotPasswordForm from "@/components/form/forgot-password";

const ForgotPassword = async () => {
  return (
    <>
      <div>
        <h5 className="text-lg md:text-xl font-bold">Forgot Password</h5>
        <p className="text-xs md:text-sm text-[#B4B0AE] mt-1">
          Enter your email below to receive password reset instructions.
        </p>
      </div>

      <ForgotPasswordForm />
    </>
  );
};

export default ForgotPassword;
