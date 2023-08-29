import { NextResponse } from "next/server";
import { DeleteCommand, PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { dbClient } from "logics/aws";
import { revalidatePath } from "next/cache";
import verifyToken from "logics/verifyToken";

export async function GET(request: Request, { params: { postid } }: { params: { postid: string } }) {
  // logging
  console.log(request);

  try {
    const postGetCommand = new QueryCommand({
      TableName: "myblogPosts-myblog",
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

export async function PUT(request: Request, { params: { postid } }: { params: { postid: string } }) {
  // logging
  console.log(request);

  try {
    const userID = await verifyToken(request.headers.get("authorization"));
    const postData = await request.json();

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
          message: "Post not exists in database.",
        },
        { status: 400 }
      );
    }

    // Throw error code when user does not same
    if (userID !== Items[0].createdBy) {
      return NextResponse.json(
        {
          message: "Attempting to modify other people's information.",
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
      case "Invalid token type":
        return NextResponse.json({ error: "Invalid token type." }, { status: 401 });
      case "Get contaminated token":
        return NextResponse.json({ error: "Get contaminated token." }, { status: 403 });
      default:
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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
          message: "Post not exists in database.",
        },
        { status: 400 }
      );
    }

    // Throw error code when user does not same
    if (userID !== Items[0].createdBy) {
      return NextResponse.json(
        {
          message: "Attempting to modify other people's information.",
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
    return NextResponse.json({ id: postid }, { status: 201 });
  } catch (error) {
    if (!(error instanceof Error)) return NextResponse.json({ error: "Bad gateway" }, { status: 502 });
    switch (error.message) {
      case "Invalid token type":
        return NextResponse.json({ error: "Invalid token type." }, { status: 401 });
      case "Get contaminated token":
        return NextResponse.json({ error: "Get contaminated token." }, { status: 403 });
      default:
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
}
