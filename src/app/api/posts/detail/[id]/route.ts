import { NextResponse } from "next/server";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dbClient } from "logics/aws";

export async function GET(request: Request, { params: { id } }: { params: { id: string } }) {
  // logging
  console.log(request);

  try {
    const postGetCommand = new QueryCommand({
      TableName: "myblogPosts-myblog",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
      ProjectionExpression:
        "id, title, categoryMain, categorySub, createdAt, createdBy, createdNickname, thumbnailImageURL, postDetail, tag, likes",
    });

    const { Count, Items } = (await dbClient.send(postGetCommand as any)) as any;
    console.log(Items);
    // Throw error code when post not exists
    if (Count === 0) {
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
