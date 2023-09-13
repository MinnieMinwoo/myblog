import { AdminLinkProviderForUserCommand, ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";
import { ErrorMessage } from "enum";
import { authClient } from "logics/aws";
import parseJwt from "logics/parseJwt";
import { NextResponse } from "next/server";

/**
 * Link google account to email
 *
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cognito-identity-provider/command/AdminLinkProviderForUserCommand/
 */
export async function POST(request: Request) {
  //logging
  console.log(request);

  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    token && console.log(parseJwt(token));
    const { idToken, email } = await request.json();
    const data = await parseJwt(idToken);
    console.log(data);
    const {
      sub,
      identities: [{ userId }],
    } = await parseJwt(idToken);

    const userGetCommand = new ListUsersCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
    });

    const { Users } = await authClient.send(userGetCommand);
    // Throw error code when user not exists
    if (!Users)
      return NextResponse.json(
        {
          message: ErrorMessage.USER_NOT_EXISTS,
        },
        { status: 404 }
      );

    const existUser = Users.find(
      ({ Attributes, UserStatus }) =>
        UserStatus === "UNCONFIRMED" && Attributes?.find(({ Name, Value }) => Name === "email" && Value === email)
    );
    const existUserSub = existUser?.Attributes?.find((data) => data.Name === "sub")?.Value;
    console.log(existUser);
    console.log(userId);
    console.log(existUserSub);
    if (existUser) {
      const linkUserCommand = new AdminLinkProviderForUserCommand({
        SourceUser: {
          ProviderAttributeName: "Cognito_Subject",
          ProviderAttributeValue: sub,
          ProviderName: "Google",
        },
        DestinationUser: {
          ProviderAttributeName: "sub",
          ProviderAttributeValue: existUserSub,
          ProviderName: "Cognito",
        },
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
      });

      const result = await authClient.send(linkUserCommand);
      console.log(result);
      return new NextResponse(undefined, { status: 204 });
    } else {
      return NextResponse.json(
        {
          message: ErrorMessage.GATEWAY_ERROR,
        },
        { status: 502 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: ErrorMessage.INTERNAL_SERVER_ERROR }, { status: 500 });
  }
}
