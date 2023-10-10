import { UpdateUserAttributesCommand, VerifyUserAttributeCommand } from "@aws-sdk/client-cognito-identity-provider";
import { ErrorMessage } from "enum";
import { authClient } from "logics/aws";
import verifyToken from "logics/verifyToken";
import { NextResponse } from "next/server";

/**
 * Verify code when update email.
 *
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cognito-identity-provider/command/VerifyUserAttributeCommand/
 */
export async function POST(request: Request) {
  //logging
  console.log(request);

  const { code } = await request.json();
  if (!code) {
    return NextResponse.json({ error: ErrorMessage.INVALID_FETCH_DATA }, { status: 400 });
  }

  try {
    const userID = await verifyToken(request.headers.get("authorization"));

    const userUpdateCommand = new VerifyUserAttributeCommand({
      AccessToken: request.headers.get("authorization")!.split(" ")[1],
      AttributeName: "email",
      Code: code,
    });
    await authClient.send(userUpdateCommand);

    return NextResponse.json(
      {
        id: userID,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    if (!(error instanceof Error)) return NextResponse.json({ error: ErrorMessage.GATEWAY_ERROR }, { status: 502 });
    switch (error.name) {
      case "CodeMismatchException":
        return NextResponse.json({ error: ErrorMessage.INVALID_VERIFICATION_CODE }, { status: 401 });
      case "ExpiredCodeException":
        return NextResponse.json({ error: ErrorMessage.EXPIRED_VERIFICATION_CODE }, { status: 403 });
      case "TooManyRequestsException":
        return NextResponse.json({ error: ErrorMessage.TOO_MANY_REQUEST }, { status: 429 });
      default:
        switch (error.message) {
          case ErrorMessage.INVALID_TOKEN_DATA:
            return NextResponse.json({ error: ErrorMessage.INVALID_TOKEN_DATA }, { status: 400 });
          case ErrorMessage.INVALID_TOKEN_TYPE:
            return NextResponse.json({ error: ErrorMessage.INVALID_TOKEN_TYPE }, { status: 401 });
          case ErrorMessage.CONTAMINATED_TOKEN:
            return NextResponse.json({ error: ErrorMessage.CONTAMINATED_TOKEN }, { status: 401 });
          default:
            return NextResponse.json({ error: ErrorMessage.INTERNAL_SERVER_ERROR }, { status: 500 });
        }
    }
  }
}

/**
 * Update user email.
 *
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cognito-identity-provider/command/UpdateUserAttributesCommand/
 */
export async function PUT(request: Request) {
  //logging
  console.log(request);
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: ErrorMessage.INVALID_FETCH_DATA }, { status: 400 });
  }

  try {
    const userID = await verifyToken(request.headers.get("authorization"));

    const userUpdateCommand = new UpdateUserAttributesCommand({
      AccessToken: request.headers.get("authorization")!.split(" ")[1],
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
      ],
    });
    await authClient.send(userUpdateCommand);

    return NextResponse.json(
      {
        id: userID,
        email: email,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    if (!(error instanceof Error)) return NextResponse.json({ error: ErrorMessage.GATEWAY_ERROR }, { status: 502 });
    switch (error.name) {
      case "AliasExistsException":
        return NextResponse.json({ error: ErrorMessage.DUPLICATED_EMAIL }, { status: 403 });
      case "TooManyRequestsException":
        return NextResponse.json({ error: ErrorMessage.TOO_MANY_REQUEST }, { status: 429 });
      case "CodeDeliveryFailureException":
        return NextResponse.json({ error: ErrorMessage.GATEWAY_ERROR }, { status: 502 });
      default:
        switch (error.message) {
          case ErrorMessage.INVALID_TOKEN_DATA:
            return NextResponse.json({ error: ErrorMessage.INVALID_TOKEN_DATA }, { status: 400 });
          case ErrorMessage.INVALID_TOKEN_TYPE:
            return NextResponse.json({ error: ErrorMessage.INVALID_TOKEN_TYPE }, { status: 401 });
          case ErrorMessage.CONTAMINATED_TOKEN:
            return NextResponse.json({ error: ErrorMessage.CONTAMINATED_TOKEN }, { status: 401 });
          default:
            return NextResponse.json({ error: ErrorMessage.INTERNAL_SERVER_ERROR }, { status: 500 });
        }
    }
  }
}
