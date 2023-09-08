import { ListUsersCommand, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ErrorMessage } from "enum";
import { authClient, dbClient } from "logics/aws";
import { NextResponse } from "next/server";

/**
 * Sign up user using cognito.
 *
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cognito-identity-provider/command/ListUsersCommand/
 *
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cognito-identity-provider/command/SignUpCommand/
 */
export async function POST(request: Request) {
  try {
    if (!request.body) return NextResponse.json({ error: ErrorMessage.INVALID_FETCH_DATA }, { status: 400 });
    const { email, password, nickname } = await request.json();
    if (!email || !password || !nickname)
      return NextResponse.json({ error: ErrorMessage.INVALID_FETCH_DATA }, { status: 400 });

    const userGetCommand = new ListUsersCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
    });

    const { Users } = await authClient.send(userGetCommand);
    if (
      Users &&
      Users.some(({ Attributes }) => Attributes?.some(({ Name, Value }) => Name === "nickname" && Value === nickname))
    )
      return NextResponse.json({ error: ErrorMessage.DUPLICATED_NICKNAME }, { status: 403 });

    const userSignupCommand = new SignUpCommand({
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: "nickname",
          Value: nickname,
        },
        {
          Name: "picture",
          Value: "",
        },
      ],
      ClientId: process.env.COGNITO_CLIENT_WEB_ID!,
    });
    const { UserSub } = await authClient.send(userSignupCommand);

    const createCategoryCommand = new PutCommand({
      TableName: process.env.DYNAMODB_CATEGORIES_NAME,
      Item: {
        userId: UserSub,
        category: [],
      },
    });
    await dbClient.send(createCategoryCommand);

    const createAboutCommand = new PutCommand({
      TableName: process.env.DYNAMODB_ABOUTS_NAME,
      Item: {
        userId: UserSub,
        about: "",
      },
    });
    await dbClient.send(createAboutCommand);

    return new NextResponse(undefined, { status: 204 });
  } catch (error) {
    console.log(error);
    if (!(error instanceof Error))
      return NextResponse.json({ error: ErrorMessage.INTERNAL_SERVER_ERROR }, { status: 500 });
    switch (error.name) {
      /*
       Username should be an email.
       1 validation error detected: Value at 'password' failed to satisfy constraint: some message
      */
      case "InvalidParameterException":
        return NextResponse.json({ error: error.message }, { status: 400 });
      case "UsernameExistsException":
        return NextResponse.json({ error: ErrorMessage.DUPLICATED_EMAIL }, { status: 403 });
      case "TooManyRequestsException":
        return NextResponse.json({ error: ErrorMessage.TOO_MANY_REQUEST }, { status: 429 });
      default:
        return NextResponse.json({ error: ErrorMessage.GATEWAY_ERROR }, { status: 502 });
    }
  }
}
