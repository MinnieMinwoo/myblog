import { NextResponse } from "next/server";
import { DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dbClient } from "logics/aws";

export async function GET(request: Request, { params: { postid } }: { params: { postid: string } }) {
  // logging
  console.log(request);

  try {
    const postGetCommand = new QueryCommand({
      TableName: "myblogPosts-myblog",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": postid,
      },
      ProjectionExpression:
        "id, title, categoryMain, categorySub, createdAt, createdBy, createdNickname, thumbnailImageURL, postDetail, tag, likes",
    });

    const { Count, Items } = await dbClient.send(postGetCommand);
    console.log(Items);
    // Throw error code when post not exists
    if (Count === 0 || !Items) {
      return NextResponse.json(
        {
          message: "Post not exists in database.",
        },
        { status: 400 }
      );
    } else return NextResponse.json(Items[0]);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params: { postid } }: { params: { postid: string } }) {
  // logging
  console.log(request);

  try {
    const { id: userID, nickname } = await request.json();

    const userGetCommand = new QueryCommand({
      TableName: "myblogUser-myblog",
      IndexName: "NicknameSort",
      KeyConditionExpression: "nickname = :nickname",
      ExpressionAttributeValues: {
        ":nickname": nickname,
      },
      ProjectionExpression: "id",
    });
    const { Count: userCount, Items: userIDList } = await dbClient.send(userGetCommand);
    // Throw error code when user not exists
    if (userCount === 0 || !userIDList) {
      console.log("invalid querystring");
      return NextResponse.json(
        {
          message: "User not exists in database.",
        },
        { status: 400 }
      );
    }

    const { id } = userIDList[0];
    // Throw error code when client id is not same
    if (userID !== id) {
      console.log("invalid querystring");
      return NextResponse.json(
        {
          message: "Attempting to modify other people's information.",
        },
        { status: 403 }
      );
    }

    const postDeleteCommand = new DeleteCommand({
      TableName: "myblogPosts-myblog",
      Key: {
        id: postid,
      },
    });
    await dbClient.send(postDeleteCommand);
    return NextResponse.json({ id: postid }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
