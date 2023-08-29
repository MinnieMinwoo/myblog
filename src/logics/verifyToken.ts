import { CognitoJwtVerifier } from "aws-jwt-verify";

export default async function verifyToken(tokenString: string | null) {
  const [tokenType, tokenText] = tokenString?.split(" ") ?? ["", ""];
  if (tokenType !== "Bearer") {
    throw new Error("Invalid token type");
  }
  const verifier = CognitoJwtVerifier.create({
    userPoolId: "ap-northeast-2_8KKDIr52H",
    tokenUse: "access",
    clientId: null,
  });

  try {
    const { username: userID } = await verifier.verify(
      tokenText // the JWT as string
    );
    return userID;
  } catch (error) {
    console.log(error);
    throw new Error("Get contaminated token");
  }
}
