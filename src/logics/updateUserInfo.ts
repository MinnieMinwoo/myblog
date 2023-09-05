import getCurrentUserToken from "./getCurrentUserToken";

export default async function updateUserInfo(userData: UserInfo) {
  console.log(userData);
  try {
    const token = await getCurrentUserToken();
    const newUserData: UserInfo = await (
      await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/users/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nickname: userData.nickname,
          profileImage: userData.profileImage,
        }),
      })
    ).json();

    //refresh data
    const refreshToken = localStorage.getItem("refreshToken");
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

    return newUserData;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
