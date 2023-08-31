import { CognitoJwtVerifier } from "aws-jwt-verify";
import { ErrorMessage } from "enum";

export default async function verifyToken(tokenString: string | null) {
  if (!tokenString || tokenString.split(" ").length !== 2) throw new Error(ErrorMessage.INVALID_TOKEN_DATA);

  const [tokenType, tokenText] = tokenString.split(" ");
  if (tokenType !== "Bearer") {
    throw new Error(ErrorMessage.INVALID_TOKEN_TYPE);
  }
  const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.COGNITO_USER_POOL_ID!,
    tokenUse: "access",
    clientId: [process.env.COGNITO_CLIENT_WEB_ID!, process.env.COGNITO_CLIENT_APP_ID!],
  });

  try {
    const { username: userID } = await verifier.verify(tokenText);
    return userID;
  } catch (error) {
    console.log(error);
    throw new Error(ErrorMessage.CONTAMINATED_TOKEN);
  }
}
