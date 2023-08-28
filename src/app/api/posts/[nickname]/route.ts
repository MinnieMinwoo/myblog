import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dbClient } from "logics/aws";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function GET(request: Request, { params: { nickname } }: { params: { nickname: string } }) {
  //logging
  console.log(request);

  const { searchParams } = new URL(request.url);
  const queryString = {
    createdAt: Number(searchParams.get("createdAt")),
    createdBy: searchParams.get("createdBy"),
  };

  try {
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
      return NextResponse.json(
        {
          message: "User not exists in database.",
        },
        { status: 400 }
      );
    }
    const { id: idString } = userIDList[0];

    const countCommand = new QueryCommand({
      TableName: "myblogPosts-myblog",
      IndexName: "NicknameAndTimeIndex",
      KeyConditionExpression: "createdBy = :createdBy",
      ExpressionAttributeValues: {
        ":createdBy": idString,
      },
      ProjectionExpression: "id",
      ScanIndexForward: false,
    });
    const { Count: postCount } = await dbClient.send(countCommand);

    const userPostCommand = new QueryCommand({
      TableName: "myblogPosts-myblog",
      IndexName: "NicknameAndTimeIndex",
      KeyConditionExpression: "createdBy = :createdBy",
      ExpressionAttributeValues: {
        ":createdBy": idString,
      },
      ProjectionExpression: "id, title, createdBy, createdNickname, createdAt, thumbnailImageURL, thumbnailData, tag",
      ScanIndexForward: false,
      Limit: 10,
      // ExclusiveStartKey = LastEvaluatedKey
      ExclusiveStartKey: queryString.createdAt && queryString.createdBy ? queryString : undefined,
    });

    // LastEvaluatedKey : {id, createdBy, createdAt}
    const { Items: postItems, LastEvaluatedKey } = await dbClient.send(userPostCommand);
    return NextResponse.json(
      { userData: idString, postCount: postCount, postList: postItems, LastEvaluatedKey },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request, { params: { nickname } }: { params: { nickname: string } }) {
  //logging
  console.log(request);
  const postData = await request.json();

  try {
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
    if (postData.createdBy !== id) {
      console.log("invalid querystring");
      return NextResponse.json(
        {
          message: "Attempting to modify other people's information.",
        },
        { status: 403 }
      );
    }

    const date = new Date();
    const postID = uuid();
    const postCommand = new PutCommand({
      TableName: "myblogPosts-myblog",
      Item: {
        ...postData,
        id: postID,
        createdAt: date.getTime(),
      },
    });

    await dbClient.send(postCommand);
    return NextResponse.json({ postID: postID }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
