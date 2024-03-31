import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ErrorMessage } from "enum";
import { dbClient } from "logics/aws";
import verifyToken from "logics/verifyToken";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params: { postid } }: { params: { postid: string } }) {
  // logging
  console.log(request);

  try {
    const postGetCommand = new GetCommand({
      TableName: process.env.DYNAMODB_POSTS_NAME,
      Key: {
        id: postid,
      },
      ProjectionExpression: "likes",
    });

    const { Item } = await dbClient.send(postGetCommand);
    revalidatePath(`/home/${Item?.createdNickname}/${postid}`);
    return NextResponse.json({ id: postid, likes: Item?.likes }, { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof Error && error.name === "ResourceNotFoundException")
      return NextResponse.json({ error: ErrorMessage.POST_NOT_EXISTS }, { status: 404 });
    else return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request, { params: { postid } }: { params: { postid: string } }) {
  // logging
  console.log(request);

  try {
    const userID = await verifyToken(request.headers.get("authorization"));

    const postGetCommand = new GetCommand({
      TableName: process.env.DYNAMODB_POSTS_NAME,
      Key: {
        id: postid,
      },
      ProjectionExpression: "likes, createdNickname",
    });

    const { Item } = await dbClient.send(postGetCommand);
    const newLikes = Item?.likes.includes(userID)
      ? Item?.likes.filter((id: string) => id !== userID)
      : [...(Item?.likes ?? []), userID];

    const postCommand = new UpdateCommand({
      TableName: process.env.DYNAMODB_POSTS_NAME,
      Key: {
        id: postid,
      },
      UpdateExpression: "set likes = :likes",
      ExpressionAttributeValues: {
        ":likes": newLikes,
      },
      ReturnValues: "ALL_NEW",
    });

    const response = await dbClient.send(postCommand);
    console.log(response);
    revalidatePath(`/home/${Item?.createdNickname}/${postid}`);
    return NextResponse.json({ id: postid, likes: newLikes }, { status: 201 });
  } catch (error) {
    console.log(error);
    if (!(error instanceof Error)) return NextResponse.json({ error: "Bad gateway" }, { status: 502 });
    else if (error.name === "ResourceNotFoundException")
      return NextResponse.json({ error: ErrorMessage.POST_NOT_EXISTS }, { status: 404 });
    else
      switch (error.message) {
        case ErrorMessage.INVALID_TOKEN_DATA:
          return NextResponse.json({ error: ErrorMessage.INVALID_TOKEN_DATA }, { status: 400 });
        case ErrorMessage.INVALID_TOKEN_TYPE:
          return NextResponse.json({ error: ErrorMessage.INVALID_TOKEN_TYPE }, { status: 401 });
        case ErrorMessage.CONTAMINATED_TOKEN:
          return NextResponse.json({ error: ErrorMessage.CONTAMINATED_TOKEN }, { status: 401 });
        default:
          return NextResponse.json({ error: ErrorMessage.INTERNAL_SERVER_ERROR }, { status: 500 });
      }
  }
}
