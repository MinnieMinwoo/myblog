import { Auth } from "aws-amplify";

interface UserAuth {
  email: string;
  password: string;
}

export default async function signinEmail(userData: UserAuth) {
  const { email, password } = userData;
  const username = email;
  try {
    const user = await Auth.signIn(email, password);
    return user;
  } catch (error) {
    if (error instanceof Error && error.name === "UserNotConfirmedException") await Auth.resendSignUp(email);
    throw error;
  }
}
