import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({
  credentials: {
    accessKeyId: process.env.AMPLIFY_ACCESS_KEY!,
    secretAccessKey: process.env.AMPLIFY_SECRET_ACCESS_KEY!,
  },
  region: "ap-northeast-2",
});

export const dbClient = DynamoDBDocumentClient.from(ddbClient);
