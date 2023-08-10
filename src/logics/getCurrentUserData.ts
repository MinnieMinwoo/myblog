import { Auth } from "aws-amplify";

export default async function getCurrentUsetData() {
  try {
    const {
      attributes: { email, nickname },
      username,
    } = await Auth.currentUserInfo();
    return { email, nickname, username };
  } catch (error) {
    console.log(error);
    return null;
  }
}
