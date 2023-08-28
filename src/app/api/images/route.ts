import { PutObjectCommand } from "@aws-sdk/client-s3";
import { storageClient } from "logics/aws";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function POST(request: Request) {
  const formData = await request.formData();
  const image = formData.get("image") as File;
  if (!image || !("arrayBuffer" in image)) {
    return NextResponse.json(
      {
        message: "No image data",
      },
      { status: 400 }
    );
  }

  try {
    const imageArrayBuffer = await image.arrayBuffer();
    const imageBuffer = Buffer.from(imageArrayBuffer);
    const fileNameList = image.name.split(".");
    const imageName = `${uuid()}.${fileNameList[fileNameList.length - 1]}`;
    const command = new PutObjectCommand({
      Bucket: "mybloguserpostimage153228-myblog",
      Key: imageName,
      Body: imageBuffer,
    });

    const response = await storageClient.send(command);
    console.log(response);

    return NextResponse.json(
      {
        imageURL: `${process.env.NEXT_PUBLIC_S3_DOMAIN}/${imageName}`,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
