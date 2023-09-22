import { ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { ErrorMessage } from "enum";
import { authClient, dbClient } from "logics/aws";
import { NextResponse } from "next/server";

/**
 * Get user about page data
 *
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-dynamodb/Class/GetCommand/
 */
export async function GET(request: Request, { params: { nickname } }: { params: { nickname: string } }) {
  try {
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

    const user = Users.find(({ Attributes }) =>
      Attributes?.find(({ Name, Value }) => Name === "nickname" && Value === nickname)
    );

    // Throw error code when user not exists
    if (!user)
      return NextResponse.json(
        {
          message: ErrorMessage.USER_NOT_EXISTS,
        },
        { status: 404 }
      );

    const id = user.Attributes?.find(({ Name }) => Name === "sub")?.Value;

    const aboutGetCommand = new GetCommand({
      TableName: process.env.DYNAMODB_ABOUTS_NAME,
      Key: {
        id: id,
      },
    });

    const { Item } = await dbClient.send(aboutGetCommand);
    if (Item) return NextResponse.json(Item, { status: 200 });
    else return NextResponse.json({ error: ErrorMessage.USER_NOT_EXISTS }, { status: 404 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: ErrorMessage.INTERNAL_SERVER_ERROR }, { status: 500 });
  }
}
