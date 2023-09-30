import { ChangePasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
import { ErrorMessage } from "enum";
import { authClient } from "logics/aws";
import verifyToken from "logics/verifyToken";
import { NextResponse } from "next/server";

/**
 * Update user password.
 *
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cognito-identity-provider/command/ChangePasswordCommand/
 */
export async function POST(request: Request) {
  try {
    const userID = await verifyToken(request.headers.get("Authorization"));
    const { beforePassword, newPassword } = await request.json();

    if (!beforePassword || !newPassword)
      return NextResponse.json({ error: ErrorMessage.INVALID_FETCH_DATA }, { status: 400 });
    const newPasswordCommand = new ChangePasswordCommand({
      PreviousPassword: beforePassword,
      ProposedPassword: newPassword,
      AccessToken: request.headers.get("Authorization")?.split(" ")[1],
    });

    await authClient.send(newPasswordCommand);
    return NextResponse.json({ id: userID }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: ErrorMessage.INTERNAL_SERVER_ERROR }, { status: 500 });
  }
}
