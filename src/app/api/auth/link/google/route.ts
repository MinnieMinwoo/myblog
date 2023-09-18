import {
  AdminDisableProviderForUserCommand,
  AdminLinkProviderForUserCommand,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { ErrorMessage } from "enum";
import { authClient } from "logics/aws";
import parseJwt from "logics/parseJwt";
import verifyToken from "logics/verifyToken";
import { NextResponse } from "next/server";

/**
 * link google account to exist user
 *
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cognito-identity-provider/command/AdminLinkProviderForUserCommand/
 */
export async function PATCH(request: Request) {
  try {
    const userID = await verifyToken(request.headers.get("authorization"));
    const { idToken, nonce: clientNonce } = await request.json();
    const { sub, nonce: tokenNonce } = await parseJwt(idToken.split(" ")[1]);

    // Nonce value error
    if (clientNonce !== tokenNonce) {
      return NextResponse.json({ error: ErrorMessage.CONTAMINATED_TOKEN }, { status: 403 });
    }
    const linkUserCommand = new AdminLinkProviderForUserCommand({
      SourceUser: {
        ProviderAttributeName: "Cognito_Subject",
        ProviderAttributeValue: sub,
        ProviderName: "Google",
      },
      DestinationUser: {
        ProviderAttributeName: "sub",
        ProviderAttributeValue: userID,
        ProviderName: "Cognito",
      },
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
    });

    const result = await authClient.send(linkUserCommand);
    console.log(result);
    return new NextResponse(undefined, { status: 204 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: ErrorMessage.INTERNAL_SERVER_ERROR }, { status: 500 });
  }
}

/**
 * unlink google account to exist user
 *
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cognito-identity-provider/command/AdminDisableProviderForUserCommand/
 */
export async function DELETE(request: Request) {
  try {
    const accessToken = request.headers.get("authorization")?.split(" ")[1];
    if (!accessToken) {
      return NextResponse.json({ error: ErrorMessage.INVALID_FETCH_DATA }, { status: 403 });
    }

    const userGetCommand = new GetUserCommand({
      AccessToken: accessToken,
    });
    const { UserAttributes } = await authClient.send(userGetCommand);

    const googleId = JSON.parse(
      UserAttributes?.find((attribute) => attribute.Name === "identities")?.Value ?? ""
    )?.find(
      (identity: { userId: string; providerName: string; providerType: string; issuer?: string; primary: boolean }) =>
        identity.providerName === "Google"
    ).userId;

    console.log(googleId);

    const googleLinkDeleteCommand = new AdminDisableProviderForUserCommand({
      User: {
        ProviderAttributeName: "Cognito_Subject",
        ProviderAttributeValue: googleId,
        ProviderName: "Google",
      },
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
    });
    await authClient.send(googleLinkDeleteCommand);
    return new NextResponse(undefined, { status: 204 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: ErrorMessage.INTERNAL_SERVER_ERROR }, { status: 500 });
  }
}
