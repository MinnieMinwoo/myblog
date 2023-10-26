import {
  AdminGetUserCommand,
  DeleteUserCommand,
  ListUsersCommand,
  UpdateUserAttributesCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
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
    const returnObject: {
      id?: string;
      email?: string;
      nickname?: string;
      picture?: string;
    } = {};

    UserAttributes?.forEach(({ Name, Value }) => {
      if (Value)
        switch (Name) {
          case "sub":
            returnObject["id"] = Value;
            break;
          case "email":
            returnObject["email"] = Value;
            break;
          case "nickname":
            returnObject["nickname"] = Value;
            break;
          case "picture":
            returnObject["picture"] = Value;
            break;
          default:
            break;
        }
    });

    return NextResponse.json(returnObject, { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof Error && error.name === "UserNotFoundException")
      return NextResponse.json({ error: ErrorMessage.USER_NOT_EXISTS }, { status: 404 });
    else return NextResponse.json({ error: ErrorMessage.INTERNAL_SERVER_ERROR }, { status: 500 });
  }
}

/**
 * Update user data. (nickname, profileImage)
 *
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cognito-identity-provider/command/UpdateUserAttributesCommand/
 */
export async function PUT(request: Request, { params: { id } }: { params: { id: string } }) {
  //logging
  console.log(request);

  try {
    const userID = await verifyToken(request.headers.get("authorization"));

    // Throw error code when user does not same
    if (id !== userID) return NextResponse.json({ error: ErrorMessage.MODIFY_OTHER_USER }, { status: 403 });

    const { nickname, profileImage = "" } = await request.json();
    if (!nickname) {
      return NextResponse.json({ error: ErrorMessage.INVALID_FETCH_DATA }, { status: 400 });
    }

    if (nickname) {
      const userGetCommand = new ListUsersCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
      });

      const { Users } = await authClient.send(userGetCommand);
      // Throw error code when user not exists

      const findUser = Users?.find(({ Attributes }) =>
        Attributes?.find(({ Name, Value }) => Name === "nickname" && Value === nickname)
      );

      const findUserID = findUser?.Attributes?.find(({ Name }) => Name === "sub")?.Value;

      // Throw error code when user not exists
      if (findUserID && findUserID !== userID) {
        return NextResponse.json(
          {
            message: ErrorMessage.DUPLICATED_NICKNAME,
          },
          { status: 403 }
        );
      }
    }

    const attributes = [];
    if (nickname)
      attributes.push({
        Name: "nickname",
        Value: nickname,
      });
    if (profileImage)
      attributes.push({
        Name: "picture",
        Value: profileImage,
      });
    const userUpdateCommand = new UpdateUserAttributesCommand({
      AccessToken: request.headers.get("authorization")!.split(" ")[1],
      UserAttributes: attributes,
    });
    await authClient.send(userUpdateCommand);

    return NextResponse.json(
      {
        id: userID,
        nickname: nickname,
        profileImage: profileImage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    if (!(error instanceof Error))
      return NextResponse.json({ error: ErrorMessage.INTERNAL_SERVER_ERROR }, { status: 500 });
    switch (error.name) {
      case "InvalidParameterException":
        return NextResponse.json({ error: ErrorMessage.INVALID_FETCH_DATA }, { status: 400 });
      default:
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
}

/**
 * delete user data
 *
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/TransactWriteItemsCommand/
 *
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cognito-identity-provider/command/DeleteUserCommand/
 */
export async function DELETE(request: Request, { params: { id } }: { params: { id: string } }) {
  try {
    const userID = await verifyToken(request.headers.get("authorization"));

    // Throw error code when user does not same
    if (id !== userID) {
      return NextResponse.json({ error: ErrorMessage.MODIFY_OTHER_USER }, { status: 403 });
    }

    const userDeleteTransactionCommand = new TransactWriteCommand({
      TransactItems: [
        {
          Delete: {
            Key: {
              id: id,
            },
            TableName: process.env.DYNAMODB_CATEGORIES_NAME,
          },
        },
        {
          Delete: {
            Key: {
              id: id,
            },
            TableName: process.env.DYNAMODB_ABOUTS_NAME,
          },
        },
      ],
    });
    await dbClient.send(userDeleteTransactionCommand);

    const userDeleteCommand = new DeleteUserCommand({
      AccessToken: request.headers.get("authorization")?.split(" ")[1],
    });
    await authClient.send(userDeleteCommand);

    return new NextResponse(undefined, { status: 204 });
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
