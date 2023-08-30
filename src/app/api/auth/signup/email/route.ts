import { SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { ErrorMessage } from "enum";
import { authClient, dbClient } from "logics/aws";
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const ddbClient = new DynamoDBClient({ region: "ap-northeast-2" });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
import { NextResponse } from "next/server";

/**
 * Sign up user using cognito.
 *
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cognito-identity-provider/command/SignUpCommand/
 */
export async function POST(request: Request) {
  try {
    const { email, password, name, nickname, picture } = await request.json();

    const userGetCommand = new QueryCommand({
      TableName: "myblogUser-myblog",
      IndexName: "NicknameSort",
      KeyConditionExpression: "nickname = :nickname",
      ExpressionAttributeValues: {
        ":nickname": nickname,
      },
      ProjectionExpression: "id",
    });

    const { Count } = await ddbDocClient.send(userGetCommand);

    if (Count > 0) return NextResponse.json({ error: ErrorMessage.NICKNAME_DUPLICATED }, { status: 406 });

    const userSignupCommand = new SignUpCommand({
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: "name",
          Value: name,
        },
        {
          Name: "name",
          Value: nickname,
        },
        {
          Name: "picture",
          Value: picture,
        },
      ],
      ClientId: process.env.COGNITO_CLIENT_WEB_ID!,
    });
    const { UserSub } = await authClient.send(userSignupCommand);

    const userPutCommand = new PutItemCommand({
      TableName: "myblogUser-myblog",
      Item: {
        id: { S: UserSub ?? "" },
        name: { S: name ?? "" },
        nickname: { S: nickname ?? "" },
        email: { S: email },
        profileImage: { S: "" },
        description: { S: "Hello my blog Page!" },
        category: { L: [] },
      },
    });
    await dbClient.send(userPutCommand);

    return new NextResponse(undefined, { status: 204 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: ErrorMessage.INTERNAL_SERVER_ERROR }, { status: 500 });
  }
}
