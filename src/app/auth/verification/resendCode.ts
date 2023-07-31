import { Auth } from "aws-amplify";

const resendCode = async (email: string) => {
  try {
    await Auth.resendSignUp(email);
  } catch (error) {
    throw error;
  }
};

export default resendCode;
