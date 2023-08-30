import revalidateToken from "./revalidateToken";

export default async function getCurrentUserToken() {
  try {
    await revalidateToken();
    const accessToken = localStorage.getItem("accessToken");
    return accessToken ?? "";
  } catch (error) {
    console.log(error);
    return "";
  }
}
