interface UserAuth {
  email: string;
  password: string;
  name: string;
  nickname: string;
  picture: string;
}

export default async function signupEmail(userData: UserAuth) {
  const { email, password, name, nickname, picture } = userData;
  const username = email;
  try {
    const { Auth } = await import("aws-amplify");
    const { user } = await Auth.signUp({
      username,
      password,
      attributes: {
        name,
        nickname,
        picture,
      },
      autoSignIn: {
        enabled: true,
      },
    });
    return user;
  } catch (error) {
    throw error;
  }
}
