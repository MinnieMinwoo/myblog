import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

export const authClient = new CognitoIdentityProviderClient({
  credentials: {
    accessKeyId: process.env.AMPLIFY_ACCESS_KEY!,
    secretAccessKey: process.env.AMPLIFY_SECRET_ACCESS_KEY!,
  },
  region: "ap-northeast-2",
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
