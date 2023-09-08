import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { ErrorMessage } from "enum";
import { dbClient } from "logics/aws";
import { NextResponse } from "next/server";

/**
 * Get user about page data
 *
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-dynamodb/Class/GetCommand/
 */
export async function GET(request: Request, { params: { id } }: { params: { id: string } }) {
  const userGetCommand = new GetCommand({
    TableName: process.env.DYNAMODB_ABOUTS_NAME,
    Key: {
      id: id,
    },
  });

  try {
    const { Item } = await dbClient.send(userGetCommand);
    if (Item) return NextResponse.json(Item, { status: 200 });
    else return NextResponse.json({ error: ErrorMessage.USER_NOT_EXISTS }, { status: 404 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: ErrorMessage.INTERNAL_SERVER_ERROR }, { status: 500 });
  }
}
