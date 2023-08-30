import { NextResponse } from "next/server";
import { ErrorMessage } from "enum";
import { authClient } from "logics/aws";
import { InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import parseJwt from "logics/parseJwt";

/**
 * Refresh old tokens.
 *
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cognito-identity-provider/command/InitiateAuthCommand/
 */
export async function POST(request: Request) {
  try {
    const { refreshToken } = await request.json();
    const signInCommand = new InitiateAuthCommand({
      AuthFlow: "REFRESH_TOKEN_AUTH",
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
      ClientId: process.env.COGNITO_CLIENT_WEB_ID!,
    });
    const result = await authClient.send(signInCommand);
    if (!result || !result.AuthenticationResult)
      return NextResponse.json({ error: ErrorMessage.GATEWAY_ERROR }, { status: 502 });
    const {
      AuthenticationResult: { AccessToken, IdToken, TokenType },
    } = result;
    if (!IdToken) return NextResponse.json({ error: ErrorMessage.GATEWAY_ERROR }, { status: 500 });
    const { sub }: IdTokenPayload = await parseJwt(IdToken);

    return NextResponse.json(
      {
        type: TokenType,
        id: sub,
        idToken: IdToken,
        accessToken: AccessToken,
        refreshToken: refreshToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: ErrorMessage.INTERNAL_SERVER_ERROR }, { status: 500 });
  }
}
