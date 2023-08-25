const verifyEmail = async (email: string, code: string) => {
  const { Auth } = await import("aws-amplify");
  try {
    await Auth.confirmSignUp(email, code);
  } catch (error) {
    throw error;
  }
};

export default verifyEmail;
