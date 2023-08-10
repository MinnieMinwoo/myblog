import { Auth } from "aws-amplify";

export default async function getCurrentUsetData() {
  try {
    const {
      attributes: { email, nickname },
      username,
    } = await Auth.currentUserInfo();
    const userData: UserInfo = { email: email, nickname: nickname, id: username };
    return userData;
  } catch (error) {
    console.log(error);
    return null;
  }
}
