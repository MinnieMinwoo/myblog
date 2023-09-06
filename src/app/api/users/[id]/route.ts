import { AdminGetUserCommand, UpdateUserAttributesCommand } from "@aws-sdk/client-cognito-identity-provider";
import { QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ErrorMessage } from "enum";
import { authClient, dbClient } from "logics/aws";
import verifyToken from "logics/verifyToken";
import { NextResponse } from "next/server";

/**
 * get current user info
 *
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-cognito-identity-provider/Class/AdminGetUserCommand/
 */
export async function GET(request: Request, { params: { id } }: { params: { id: string } }) {
  const userGetCommand = new AdminGetUserCommand({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: id,
  });

  try {
    const { UserAttributes } = await authClient.send(userGetCommand);
    const returnObject: { [key in string]: string } = {};
    UserAttributes?.forEach(({ Name, Value }) => Name && Value && Object.defineProperty(returnObject, Name, Value));

    return NextResponse.json(returnObject, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: ErrorMessage.INTERNAL_SERVER_ERROR }, { status: 500 });
  }
}

/**
 * Update user data. (nickname, profileImage)
 *
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-dynamodb/Class/UpdateCommand/
 */
export async function PUT(request: Request, { params: { id } }: { params: { id: string } }) {
  //logging
  console.log(request);
  const { nickname, profileImage = "" } = await request.json();
  if (!nickname) {
    return NextResponse.json({ error: ErrorMessage.INVALID_FETCH_DATA }, { status: 400 });
  }

  try {
    const userID = await verifyToken(request.headers.get("authorization"));

    const userQueryCommand = new QueryCommand({
      TableName: "myblogUser-myblog",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
      ProjectionExpression: "id",
    });

    const { Count, Items } = await dbClient.send(userQueryCommand);
    // Throw error code when user not exists
    if (Count === 0 || !Items) {
      return NextResponse.json(
        {
          message: ErrorMessage.USER_NOT_EXISTS,
        },
        { status: 404 }
      );
    }

    if (nickname) {
      const nicknameQueryCommand = new QueryCommand({
        TableName: "myblogUser-myblog",
        IndexName: "NicknameSort",
        KeyConditionExpression: "nickname = :nickname",
        ExpressionAttributeValues: {
          ":nickname": nickname,
        },
        ProjectionExpression: "id, nickname",
      });

      const { Count: nicknameCheckCount, Items: nicknameCheckItems } = await dbClient.send(nicknameQueryCommand);

      // Throw error code when user not exists
      if (nicknameCheckCount !== 0 && nicknameCheckItems && nicknameCheckItems[0].id !== id) {
        return NextResponse.json(
          {
            message: ErrorMessage.DUPLICATED_NICKNAME,
          },
          { status: 403 }
        );
      }
    }

    if (userID !== Items[0].id) {
      return NextResponse.json(
        {
          message: ErrorMessage.MODIFY_OTHER_USER,
        },
        { status: 403 }
      );
    }

    const categoryPutCommand = new UpdateCommand({
      TableName: "myblogUser-myblog",
      Key: {
        id: userID,
      },
      UpdateExpression: `set${" nickname = :nickname, profileImage = :profileImage"}`,
      ExpressionAttributeValues: {
        ":nickname": nickname,
        ":profileImage": profileImage,
      },
      ReturnValues: "ALL_NEW",
    });

    const { Attributes } = await dbClient.send(categoryPutCommand);
    if (!Attributes) return NextResponse.json({ error: ErrorMessage.DB_CONNECTION_ERROR }, { status: 502 });

    const userUpdateCommand = new UpdateUserAttributesCommand({
      AccessToken: request.headers.get("authorization")!.split(" ")[1],
      UserAttributes: [
        {
          Name: "nickname",
          Value: nickname,
        },
      ],
    });
    await authClient.send(userUpdateCommand);

    return NextResponse.json(
      {
        id: Attributes.id,
        email: Attributes.email,
        nickname: Attributes.nickname,
        profileImage: Attributes.profileImage,
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
