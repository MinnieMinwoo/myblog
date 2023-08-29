export default async function getCurrentUserToken() {
  try {
    const { Auth } = await import("aws-amplify");
    const currentSession = await Auth.currentSession();
    const accessToken = currentSession.getAccessToken();
    const jwt = accessToken.getJwtToken();
    return jwt;
  } catch (error) {
    console.log(error);
    return "";
  }
}
