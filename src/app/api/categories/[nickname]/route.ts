import { QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { dbClient } from "logics/aws";
import verifyToken from "logics/verifyToken";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params: { nickname } }: { params: { nickname: string } }) {
  //logging
  console.log(request);

  try {
    const categoryQueryCommand = new QueryCommand({
      TableName: "myblogUser-myblog",
      IndexName: "NicknameSort",
      KeyConditionExpression: "nickname = :nickname",
      ExpressionAttributeValues: {
        ":nickname": nickname,
      },
      ProjectionExpression: "id, nickname, category",
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

export async function PUT(request: Request, { params: { nickname } }: { params: { nickname: string } }) {
  //logging
  console.log(request);
  const { category: categoryData } = await request.json();

  try {
    const userID = await verifyToken(request.headers.get("authorization"));

    const userQueryCommand = new QueryCommand({
      TableName: "myblogUser-myblog",
      IndexName: "NicknameSort",
      KeyConditionExpression: "nickname = :nickname",
      ExpressionAttributeValues: {
        ":nickname": nickname,
      },
      ProjectionExpression: "id, nickname",
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
      case ErrorMessage.TOKEN_CONTAMINATED:
        return NextResponse.json({ error: ErrorMessage.TOKEN_CONTAMINATED }, { status: 401 });
      default:
        return NextResponse.json({ error: ErrorMessage.INTERNAL_SERVER_ERROR }, { status: 500 });
    }
  }
}
