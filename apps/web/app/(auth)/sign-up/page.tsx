import SignUpForm from "@/components/form/sign-up";

const SignUp = async () => {
  return (
    <>
      <div>
        <h5 className="text-lg md:text-xl font-bold">Sign Up</h5>
        <p className="text-xs md:text-sm text-[#B4B0AE] mt-1">Enter your information to create an account</p>
      </div>

      <SignUpForm />
    </>
  );
};

export default SignUp;
