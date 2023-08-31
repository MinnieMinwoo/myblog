import { ConfirmSignUpCommand, ResendConfirmationCodeCommand } from "@aws-sdk/client-cognito-identity-provider";
import { ErrorMessage } from "enum";
import { authClient } from "logics/aws";
import { NextResponse } from "next/server";

/**
 * resend verification email code.
 *
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cognito-identity-provider/command/ResendConfirmationCodeCommand/
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    if (!email) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    const confirmCommand = new ResendConfirmationCodeCommand({
      Username: email,
      ClientId: process.env.COGNITO_CLIENT_WEB_ID!,
    });
    await authClient.send(confirmCommand);
    return new NextResponse(undefined, { status: 204 });
  } catch (error) {
    console.log(error);
    if (!(error instanceof Error))
      return NextResponse.json({ error: ErrorMessage.INTERNAL_SERVER_ERROR }, { status: 500 });
    switch (error.name) {
      case "UserNotFoundException":
        return NextResponse.json({ error: ErrorMessage.USER_NOT_EXISTS }, { status: 404 });
      case "TooManyFailedAttemptsException":
        return NextResponse.json({ error: ErrorMessage.TOO_MANY_REQUEST }, { status: 429 });
      case "TooManyRequestsException":
        return NextResponse.json({ error: ErrorMessage.TOO_MANY_REQUEST }, { status: 429 });
      default:
        return NextResponse.json({ error: ErrorMessage.GATEWAY_ERROR }, { status: 502 });
    }
  }
}

/**
 * resend verification email code.
 *
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cognito-identity-provider/command/ConfirmSignUpCommand/
 *
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cognito-identity-provider/command/AdminGetUserCommand/
 */
export async function POST(request: Request) {
  try {
    const { email, verificationCode } = await request.json();
    if (!email || !verificationCode) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    const confirmCommand = new ConfirmSignUpCommand({
      Username: email,
      ConfirmationCode: verificationCode,
      ClientId: process.env.COGNITO_CLIENT_WEB_ID!,
    });
    await authClient.send(confirmCommand);

    return new NextResponse(undefined, { status: 204 });
  } catch (error) {
    console.log(error);
    if (!(error instanceof Error))
      return NextResponse.json({ error: ErrorMessage.INTERNAL_SERVER_ERROR }, { status: 500 });
    switch (error.name) {
      case "CodeMismatchException":
        return NextResponse.json({ error: ErrorMessage.INVALID_VERIFICATION_CODE }, { status: 403 });
      case "UserNotFoundException":
        return NextResponse.json({ error: ErrorMessage.USER_NOT_EXISTS }, { status: 404 });
      case "ExpiredCodeException":
        return NextResponse.json({ error: ErrorMessage.VERIFICATION_CODE_EXPIRED }, { status: 406 });
      case "TooManyFailedAttemptsException":
        return NextResponse.json({ error: ErrorMessage.TOO_MANY_REQUEST }, { status: 429 });
      case "TooManyRequestsException":
        return NextResponse.json({ error: ErrorMessage.TOO_MANY_REQUEST }, { status: 429 });
      default:
        return NextResponse.json({ error: ErrorMessage.GATEWAY_ERROR }, { status: 500 });
    }
  }
}
