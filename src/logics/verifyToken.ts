import { CognitoJwtVerifier } from "aws-jwt-verify";

export default async function verifyToken(tokenString: string | null) {
  if (!tokenString || tokenString.split(" ").length !== 2) throw new Error(ErrorMessage.INVALID_TOKEN_DATA);

  const [tokenType, tokenText] = tokenString.split(" ");
  if (tokenType !== "Bearer") {
    throw new Error(ErrorMessage.INVALID_TOKEN_TYPE);
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
    throw new Error(ErrorMessage.TOKEN_CONTAMINATED);
  }
}
