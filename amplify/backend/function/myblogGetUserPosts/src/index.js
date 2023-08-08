/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_MYBLOGPOSTS_ARN
	STORAGE_MYBLOGPOSTS_NAME
	STORAGE_MYBLOGPOSTS_STREAMARN
	STORAGE_MYBLOGUSER_ARN
	STORAGE_MYBLOGUSER_NAME
	STORAGE_MYBLOGUSER_STREAMARN
Amplify Params - DO NOT EDIT */
const awsServerlessExpress = require("aws-serverless-express");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");

const express = require("express");
const app = express();

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");
const ddbClient = new DynamoDBClient({ region: "ap-northeast-2" });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/posts/:nickname", async (req, res) => {
  // set cors policy
  res.setHeader("Access-Control-Allow-origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  const {
    params: { nickname },
  } = req;
  try {
    const userGetCommand = new ScanCommand({
      TableName: "myblogUser-dev",
      FilterExpression: "nickname = :nickname",
      ExpressionAttributeValues: {
        ":nickname": nickname,
      },
      ProjectionExpression: "id",
    });
    const { Count: userCount, Items: userIDList } = await ddbDocClient.send(userGetCommand);
    if (userCount === 0) {
      return res.statusCode(406);
    }
    const { id: idString } = userIDList[0];

    const userPostCommand = new ScanCommand({
      TableName: "myblogPosts-dev",
      FilterExpression: "createdBy = :createdBy",
      ExpressionAttributeValues: {
        ":createdBy": idString,
      },
      ProjectionExpression: "title, thumbnailImageURL, thumbnailData, tag, createdBy",
    });
    const { Count: postCount, Items: postItems } = await ddbDocClient.send(userPostCommand);
    res.json({ userData: idString, postCount: postCount, postList: postItems });
  } catch (error) {
    console.log(error);
    res.statusCode(500);
  }
});

/**
 * @type {import('http').Server}
 */
const server = awsServerlessExpress.createServer(app);

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  return awsServerlessExpress.proxy(server, event, context, "PROMISE").promise;
};
