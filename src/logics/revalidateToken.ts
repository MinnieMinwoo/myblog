import parseJwt from "./parseJwt";

export default async function revalidateToken() {
  const date = new Date();

  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  try {
    if (!accessToken || !refreshToken) throw new Error("No token data");
    const accessTokenExpireTime = await parseJwt(accessToken);
    if (accessToken && accessTokenExpireTime.exp > date.getTime() / 1000) return;
  } catch (error) {
    console.log(error);
    localStorage.removeItem("idToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return;
  }

  try {
    const result = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refreshToken: refreshToken,
      }),
    });
    if (!result.ok) throw new Error(result.statusText);
    const { idToken, accessToken: newAccessToken, refreshToken: newRefreshToken } = await result.json();
    localStorage.setItem("idToken", idToken);
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
  } catch (error) {
    console.log(error);
  }
}
