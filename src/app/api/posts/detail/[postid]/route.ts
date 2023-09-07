import { NextResponse } from "next/server";
import { DeleteCommand, PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { dbClient } from "logics/aws";
import { revalidatePath } from "next/cache";
import verifyToken from "logics/verifyToken";
import { ErrorMessage } from "enum";

export async function GET(request: Request, { params: { postid } }: { params: { postid: string } }) {
  // logging
  console.log(request);

  try {
    const postGetCommand = new QueryCommand({
      TableName: process.env.DYNAMODB_POSTS_NAME,
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": postid,
      },
    });

    const { Count, Items } = await dbClient.send(postGetCommand);
    // Throw error code when post not exists
    if (Count === 0 || !Items) {
      return NextResponse.json(
        {
          error: ErrorMessage.POST_NOT_EXISTS,
        },
        { status: 404 }
      );
    } else return NextResponse.json(Items[0]);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params: { postid } }: { params: { postid: string } }) {
  // logging
  console.log(request);

  try {
    const userID = await verifyToken(request.headers.get("authorization"));
    const postData = await request.json();

    const postGetCommand = new QueryCommand({
      TableName: process.env.DYNAMODB_CATEGORIES_NAME,
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": postid,
      },
    });

    const { Count, Items } = await dbClient.send(postGetCommand);
    console.log(Items);
    // Throw error code when post not exists
    if (Count === 0 || !Items) {
      return NextResponse.json(
        {
          error: ErrorMessage.POST_NOT_EXISTS,
        },
        { status: 404 }
      );
    }

    // Throw error code when user does not same
    if (userID !== Items[0].createdBy) {
      return NextResponse.json(
        {
          error: ErrorMessage.MODIFY_OTHER_USER,
        },
        { status: 403 }
      );
    }

    const postCommand = new PutCommand({
      TableName: "myblogPosts-myblog",
      Item: {
        ...postData,
      },
    });

    await dbClient.send(postCommand);
    revalidatePath(`/home/[nickname]/[postid]`);
    return NextResponse.json({ postID: postData.id }, { status: 201 });
  } catch (error) {
    console.log(error);
    if (!(error instanceof Error)) return NextResponse.json({ error: "Bad gateway" }, { status: 502 });
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

    const postGetCommand = new QueryCommand({
      TableName: "myblogPosts-myblog",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": postid,
      },
    });

    const { Count, Items } = await dbClient.send(postGetCommand);
    console.log(Items);
    // Throw error code when post not exists
    if (Count === 0 || !Items) {
      return NextResponse.json(
        {
          error: ErrorMessage.POST_NOT_EXISTS,
        },
        { status: 404 }
      );
    }

    // Throw error code when user does not same
    if (userID !== Items[0].createdBy) {
      return NextResponse.json(
        {
          error: ErrorMessage.MODIFY_OTHER_USER,
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
    return NextResponse.json({ id: postid }, { status: 200 });
  } catch (error) {
    if (!(error instanceof Error)) return NextResponse.json({ error: "Bad gateway" }, { status: 502 });
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
