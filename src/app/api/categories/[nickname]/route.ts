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

    // Throw error code when post not exists
    if (Count === 0 || !Items) {
      return NextResponse.json(
        {
          message: "User not exists in database.",
        },
        { status: 400 }
      );
    } else return NextResponse.json(Items[0]);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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

    // Throw error code when post not exists
    if (Count === 0 || !Items) {
      return NextResponse.json(
        {
          message: "User not exists in database.",
        },
        { status: 400 }
      );
    }

    if (userID !== Items[0].id) {
      return NextResponse.json(
        {
          message: "Attempting to modify other people's information.",
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
    if (!Attributes) return NextResponse.json({ error: "Connection error to database" }, { status: 502 });
    return NextResponse.json(
      {
        id: Attributes.id,
        category: Attributes.category,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
