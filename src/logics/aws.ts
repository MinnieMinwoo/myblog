import { CognitoUserPool } from "amazon-cognito-identity-js";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const userPool = new CognitoUserPool({
  UserPoolId: process.env.COGNITO_USER_POOL_ID!,
  ClientId: process.env.COGNITO_CLIENT_WEB_ID!,
});

const ddbClient = new DynamoDBClient({
  credentials: {
    accessKeyId: process.env.AMPLIFY_ACCESS_KEY!,
    secretAccessKey: process.env.AMPLIFY_SECRET_ACCESS_KEY!,
  },
  region: "ap-northeast-2",
});

export const dbClient = DynamoDBDocumentClient.from(ddbClient);

export const storageClient = new S3Client({
  credentials: {
    accessKeyId: process.env.AMPLIFY_ACCESS_KEY!,
    secretAccessKey: process.env.AMPLIFY_SECRET_ACCESS_KEY!,
  },
  region: "ap-northeast-2",
});
