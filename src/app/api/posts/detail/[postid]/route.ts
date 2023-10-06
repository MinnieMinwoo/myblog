import { NextResponse } from "next/server";
import { DeleteCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { dbClient } from "logics/aws";
import { revalidatePath } from "next/cache";
import verifyToken from "logics/verifyToken";
import { ErrorMessage } from "enum";

/**
 * Get certain posts.
 *
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/GetItemCommand/
 */
export async function GET(request: Request, { params: { postid } }: { params: { postid: string } }) {
  // logging
  console.log(request);

  try {
    const postGetCommand = new GetCommand({
      TableName: process.env.DYNAMODB_POSTS_NAME,
      Key: {
        id: postid,
      },
    });

    const { Item } = await dbClient.send(postGetCommand);
    return NextResponse.json(Item);
  } catch (error) {
    console.log(error);
    if (error instanceof Error && error.name === "ResourceNotFoundException")
      return NextResponse.json({ error: ErrorMessage.POST_NOT_EXISTS }, { status: 404 });
    else return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params: { postid } }: { params: { postid: string } }) {
  // logging
  console.log(request);

  try {
    const userID = await verifyToken(request.headers.get("authorization"));
    const postData = await request.json();

    const postGetCommand = new GetCommand({
      TableName: process.env.DYNAMODB_POSTS_NAME,
      Key: {
        id: postid,
      },
    });

    const { Item } = await dbClient.send(postGetCommand);

    // Throw error code when user does not same
    if (userID !== Item?.createdBy) {
      return NextResponse.json(
        {
          error: ErrorMessage.MODIFY_OTHER_USER,
        },
        { status: 403 }
      );
    }

    const postCommand = new PutCommand({
      TableName: process.env.DYNAMODB_POSTS_NAME,
      Item: {
        ...postData,
      },
    });

    await dbClient.send(postCommand);
    revalidatePath(`/home/${Item?.createdNickname}/${postid}`);
    console.log(postData);
    return NextResponse.json({ id: postid }, { status: 201 });
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

export async function DELETE(request: Request, { params: { postid } }: { params: { postid: string } }) {
  // logging
  console.log(request);

  try {
    const userID = await verifyToken(request.headers.get("authorization"));

    const postGetCommand = new GetCommand({
      TableName: process.env.DYNAMODB_POSTS_NAME,
      Key: {
        id: postid,
      },
    });

    const { Item } = await dbClient.send(postGetCommand);

    // Throw error code when user does not same
    if (userID !== Item?.createdBy) {
      return NextResponse.json(
        {
          error: ErrorMessage.MODIFY_OTHER_USER,
        },
        { status: 403 }
      );
    }

    const postDeleteCommand = new DeleteCommand({
      TableName: process.env.DYNAMODB_POSTS_NAME,
      Key: {
        id: postid,
      },
    });
    await dbClient.send(postDeleteCommand);
    return NextResponse.json({ id: postid }, { status: 200 });
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
