import { AdminGetUserCommand, ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ErrorMessage } from "enum";
import { authClient, dbClient } from "logics/aws";
import verifyToken from "logics/verifyToken";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Get user about page data
 *
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-dynamodb/Class/GetCommand/
 */
export async function GET(request: Request, { params: { nickname } }: { params: { nickname: string } }) {
  //logging
  console.log(request);

  try {
    const userGetCommand = new ListUsersCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
    });

    const { Users } = await authClient.send(userGetCommand);

    const user = Users?.find(({ Attributes }) =>
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
    else return NextResponse.json({ error: ErrorMessage.GATEWAY_ERROR }, { status: 502 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: ErrorMessage.INTERNAL_SERVER_ERROR }, { status: 500 });
  }
}

/**
 * Update user about page data
 *
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/UpdateItemCommand/
 *
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-dynamodb/Class/UpdateCommand/
 */
export async function PUT(request: Request, { params: { nickname } }: { params: { nickname: string } }) {
  //logging
  console.log(request);

  try {
    const { about } = await request.json();
    if (!about)
      return NextResponse.json(
        {
          error: ErrorMessage.INVALID_FETCH_DATA,
        },
        { status: 400 }
      );

    const userID = await verifyToken(request.headers.get("authorization"));

    const userGetCommand = new AdminGetUserCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: userID,
    });

    const { UserAttributes } = await authClient.send(userGetCommand);
    const serverNickname = UserAttributes?.find(({ Name, Value }) => Name === "nickname" && Value === nickname)?.Value;

    // Throw error code when try to modify other user
    if (nickname !== serverNickname) {
      return NextResponse.json(
        {
          error: ErrorMessage.MODIFY_OTHER_USER,
        },
        { status: 403 }
      );
    }

    const aboutUpdateCommand = new UpdateCommand({
      TableName: process.env.DYNAMODB_ABOUTS_NAME,
      Key: {
        id: userID,
      },
      UpdateExpression: "set about = :about",
      ExpressionAttributeValues: {
        ":about": about,
      },
      ReturnValues: "ALL_NEW",
    });

    const { Attributes } = await dbClient.send(aboutUpdateCommand);
    if (!Attributes) return NextResponse.json({ error: ErrorMessage.DB_CONNECTION_ERROR }, { status: 502 });
    revalidatePath(`/home/${nickname}/about`);

    return NextResponse.json(
      {
        id: Attributes.id,
        about: Attributes.about,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    if (!(error instanceof Error))
      return NextResponse.json({ error: ErrorMessage.INTERNAL_SERVER_ERROR }, { status: 500 });

    switch (error.message) {
      case ErrorMessage.INVALID_TOKEN_DATA:
        return NextResponse.json({ error: ErrorMessage.INVALID_TOKEN_DATA }, { status: 400 });
      case ErrorMessage.INVALID_TOKEN_TYPE:
        return NextResponse.json({ error: ErrorMessage.INVALID_TOKEN_TYPE }, { status: 401 });
      case ErrorMessage.CONTAMINATED_TOKEN:
        return NextResponse.json({ error: ErrorMessage.CONTAMINATED_TOKEN }, { status: 401 });
      default:
        return NextResponse.json({ error: ErrorMessage.GATEWAY_ERROR }, { status: 502 });
    }
  }
}
