import parseJwt from "./parseJwt";
import revalidateToken from "./revalidateToken";

export default async function getCurrentUserData() {
  const date = new Date();

  try {
    await revalidateToken();
    let idToken = localStorage.getItem("idToken");
    if (!idToken) return null;
    const { sub } = await parseJwt(idToken);
    const userData: UserInfo = await (await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/users/${sub}`)).json();
    return userData;
  } catch (error) {
    console.log(error);
    return null;
  }
}
