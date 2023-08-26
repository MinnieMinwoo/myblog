import { QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { dbClient } from "logics/aws";
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

    const { Count, Items } = (await dbClient.send(categoryQueryCommand as any)) as any;

    // Throw error code when post not exists
    if (Count === 0) {
      return NextResponse.json(
        {
          message: "User not exists in database.",
        },
        { status: 400 }
      );
    } else NextResponse.json(Items[0]);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params: { nickname } }: { params: { nickname: string } }) {
  //logging
  console.log(request);
  const { id, category: categoryData } = await request.json();

  try {
    const userQueryCommand = new QueryCommand({
      TableName: "myblogUser-myblog",
      IndexName: "NicknameSort",
      KeyConditionExpression: "nickname = :nickname",
      ExpressionAttributeValues: {
        ":nickname": nickname,
      },
      ProjectionExpression: "id, nickname",
    });

    const { Count, Items } = (await dbClient.send(userQueryCommand as any)) as any;

    // Throw error code when post not exists
    if (Count === 0) {
      return NextResponse.json(
        {
          message: "User not exists in database.",
        },
        { status: 400 }
      );
    }

    const userID = Items[0].id;
    if (id !== userID) {
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

    const { Attributes } = (await dbClient.send(categoryPutCommand as any)) as any;

    NextResponse.json(
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
