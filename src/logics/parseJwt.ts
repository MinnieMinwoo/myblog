export default function parseJwt(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      resolve(JSON.parse(jsonPayload));
    } catch (error) {
      reject(error);
    }
  });
}
