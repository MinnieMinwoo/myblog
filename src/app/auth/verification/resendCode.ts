const resendCode = async (email: string) => {
  const { Auth } = await import("aws-amplify");
  try {
    await Auth.resendSignUp(email);
  } catch (error) {
    throw error;
  }
};

export default resendCode;
