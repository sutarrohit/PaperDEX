import { AuthFormProps, SIGN_IN_FORM, SIGN_UP_FORM } from "./form";

type NexoraConstantsProps = {
  signUpForm: AuthFormProps[];
  signInForm: AuthFormProps[];
};

export const PAPERDEX_CONSTANTS: NexoraConstantsProps = {
  signUpForm: SIGN_UP_FORM,
  signInForm: SIGN_IN_FORM,
};
