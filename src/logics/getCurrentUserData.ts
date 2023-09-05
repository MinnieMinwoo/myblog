import parseJwt from "./parseJwt";
import revalidateToken from "./revalidateToken";

export default async function getCurrentUserData() {
  const date = new Date();

  try {
    await revalidateToken();
    let idToken = localStorage.getItem("idToken");
    if (!idToken) return null;
    const { email, nickname, sub: username } = await parseJwt(idToken);
    const { profileImage } = await (await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/images/${nickname}`)).json();
    const userData: UserInfo = { email: email, nickname, id: username, profileImage };
    return userData;
  } catch (error) {
    console.log(error);
    return null;
  }
}
