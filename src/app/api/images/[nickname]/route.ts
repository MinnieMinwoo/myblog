import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ErrorMessage } from "enum";
import { dbClient } from "logics/aws";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params: { nickname } }: { params: { nickname: string } }) {
  const imageGetCommand = new QueryCommand({
    TableName: "myblogUser-myblog",
    IndexName: "NicknameSort",
    KeyConditionExpression: "nickname = :nickname",
    ExpressionAttributeValues: {
      ":nickname": nickname,
    },
    ProjectionExpression: "id, nickname, profileImage",
  });
  try {
    const { Count: userCount, Items: userIDList } = await dbClient.send(imageGetCommand);
    // Throw error code when user not exists
    if (userCount === 0 || !userIDList) {
      return NextResponse.json(
        {
          message: ErrorMessage.USER_NOT_EXISTS,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(userIDList[0], { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: ErrorMessage.INTERNAL_SERVER_ERROR }, { status: 500 });
  }
}
