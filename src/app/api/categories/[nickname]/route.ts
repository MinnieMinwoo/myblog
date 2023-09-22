import { AdminGetUserCommand, ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";
import { QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ErrorMessage } from "enum";
import { authClient, dbClient } from "logics/aws";
import verifyToken from "logics/verifyToken";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params: { nickname } }: { params: { nickname: string } }) {
  //logging
  console.log(request);

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

    const categoryQueryCommand = new QueryCommand({
      TableName: process.env.DYNAMODB_CATEGORIES_NAME,
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
      ProjectionExpression: "userId, category",
    });

    const { Count, Items } = await dbClient.send(categoryQueryCommand);

    // Throw error code when user not exists
    if (Count === 0 || !Items) {
      return NextResponse.json(
        {
          message: ErrorMessage.USER_NOT_EXISTS,
        },
        { status: 404 }
      );
    } else return NextResponse.json(Items[0], { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: ErrorMessage.INTERNAL_SERVER_ERROR }, { status: 500 });
  }
}

/**
 * Update user category data
 *
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-dynamodb/Class/UpdateCommand/
 */
export async function PUT(request: Request, { params: { nickname } }: { params: { nickname: string } }) {
  //logging
  console.log(request);
  const { category: categoryData } = await request.json();

  try {
    const userID = await verifyToken(request.headers.get("authorization"));

    const userGetCommand = new AdminGetUserCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: userID,
    });

    const { UserAttributes } = await authClient.send(userGetCommand);
    const serverNickname = UserAttributes?.find(({ Name, Value }) => Name === "nickname" && Value === nickname)?.Value;

    // Throw error code when user not exists
    if (!serverNickname)
      return NextResponse.json(
        {
          message: ErrorMessage.USER_NOT_EXISTS,
        },
        { status: 404 }
      );

    // Throw error code when try to modify other user
    if (nickname !== serverNickname) {
      return NextResponse.json(
        {
          message: ErrorMessage.MODIFY_OTHER_USER,
        },
        { status: 403 }
      );
    }

    const categoryPutCommand = new UpdateCommand({
      TableName: process.env.DYNAMODB_CATEGORIES_NAME,
      Key: {
        id: userID,
      },
      UpdateExpression: "set category = :category",
      ExpressionAttributeValues: {
        ":category": categoryData,
      },
      ReturnValues: "ALL_NEW",
    });

    const { Attributes } = await dbClient.send(categoryPutCommand);
    if (!Attributes) return NextResponse.json({ error: ErrorMessage.DB_CONNECTION_ERROR }, { status: 502 });
    return NextResponse.json(
      {
        id: Attributes.id,
        nickname: Attributes.nickname,
        category: Attributes.category,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    if (!(error instanceof Error)) return NextResponse.json({ error: ErrorMessage.GATEWAY_ERROR }, { status: 502 });
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
