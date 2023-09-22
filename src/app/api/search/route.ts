import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ErrorMessage } from "enum";
import { dbClient } from "logics/aws";
import { NextResponse } from "next/server";

/**
 * Search user posts.
 *
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/ScanCommand/
 */
export async function GET(request: Request) {
  //logging
  console.log(request);

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const user = searchParams.get("user");
  if (!query) return NextResponse.json({ error: ErrorMessage.INVALID_FETCH_DATA }, { status: 400 });

  const userPostCommand = new ScanCommand({
    TableName: process.env.DYNAMODB_POSTS_NAME,
    IndexName: "time-title-index",
    FilterExpression: user
      ? "(contains(title, :query) OR contains(thumbnailData, :query)) AND createdNickname = :createdNickname"
      : "contains(title, :query) OR contains(thumbnailData, :query)",
    ExpressionAttributeValues: user
      ? {
          ":query": query,
          ":createdNickname": user,
        }
      : {
          ":query": query,
        },
    ProjectionExpression: "id, title, createdBy, createdNickname, createdAt, thumbnailImageURL, thumbnailData, tag",
    Limit: 10,
    ExclusiveStartKey: undefined,
  });
  try {
    // LastEvaluatedKey : {id, createdBy, createdAt}
    const { Items: postItems, LastEvaluatedKey } = await dbClient.send(userPostCommand);
    return NextResponse.json({ postList: postItems, LastEvaluatedKey }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
