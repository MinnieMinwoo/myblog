import { NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({
  accessKeyId: process.env.AMPLIFY_ACCESS_KEY,
  secretAccessKey: process.env.AMPLIFY_SECRET_ACCESS_KEY,
  region: "ap-northeast-2",
} as any);

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id: postID } = params;

  try {
    const postGetCommand = new QueryCommand({
      TableName: "myblogPosts-myblog",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": postID,
      },
      ProjectionExpression:
        "id, title, categoryMain, categorySub, createdAt, createdBy, createdNickname, thumbnailImageURL, postDetail, tag, likes",
    });

    const { Count, Items } = (await ddbDocClient.send(postGetCommand as any)) as any;
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
