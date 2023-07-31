import { Auth } from "aws-amplify";

const verifyEmail = async (email: string, code: string) => {
  try {
    await Auth.confirmSignUp(email, code);
  } catch (error) {
    throw error;
  }
};

export default verifyEmail;
