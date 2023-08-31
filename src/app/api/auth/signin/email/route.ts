import {
  InitiateAuthCommand,
  NotAuthorizedException,
  TooManyRequestsException,
  UserNotConfirmedException,
  UserNotFoundException,
} from "@aws-sdk/client-cognito-identity-provider";
import { ErrorMessage } from "enum";
import { authClient } from "logics/aws";
import parseJwt from "logics/parseJwt";
import { NextResponse } from "next/server";

/**
 * Sign up user by email
 *
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cognito-identity-provider/command/InitiateAuthCommand/
 */

export async function POST(request: Request) {
  try {
    if (!request.body) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    const { email, password } = await request.json();
    if (!email || !password) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    const signInCommand = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
      ClientId: process.env.COGNITO_CLIENT_WEB_ID!,
    });

    const result = await authClient.send(signInCommand);
    if (!result || !result.AuthenticationResult)
      return NextResponse.json({ error: ErrorMessage.GATEWAY_ERROR }, { status: 502 });
    const {
      AuthenticationResult: { AccessToken, RefreshToken, IdToken, TokenType },
    } = result;
    if (!IdToken) return NextResponse.json({ error: ErrorMessage.GATEWAY_ERROR }, { status: 502 });
    const { nickname, email_verified, sub }: IdTokenPayload = await parseJwt(IdToken);

    return NextResponse.json(
      {
        type: TokenType,
        id: sub,
        nickname: nickname,
        isVerified: email_verified,
        idToken: IdToken,
        accessToken: AccessToken,
        refreshToken: RefreshToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    if (!(error instanceof Error))
      return NextResponse.json({ error: ErrorMessage.INTERNAL_SERVER_ERROR }, { status: 500 });
    switch (error.name) {
      case "NotAuthorizedException":
        return NextResponse.json({ error: ErrorMessage.USER_NOT_VERIFIED }, { status: 401 });
      case "UserNotConfirmedException":
        return NextResponse.json({ error: ErrorMessage.USER_VERIFICATION_REQUIRED }, { status: 403 });
      case "UserNotFoundException":
        return NextResponse.json({ error: ErrorMessage.USER_NOT_EXISTS }, { status: 404 });
      case "TooManyRequestsException":
        return NextResponse.json({ error: ErrorMessage.TOO_MANY_REQUEST }, { status: 429 });
      default:
        return NextResponse.json({ error: ErrorMessage.GATEWAY_ERROR }, { status: 502 });
    }
  }
}
