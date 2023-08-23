/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_MYBLOGUSER_ARN
	STORAGE_MYBLOGUSER_NAME
	STORAGE_MYBLOGUSER_STREAMARN
Amplify Params - DO NOT EDIT */
const awsServerlessExpress = require("aws-serverless-express");
const express = require("express");
const app = express();

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const ddbClient = new DynamoDBClient({ region: "ap-northeast-2" });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
 * Return category list by user.
 */
app.get("/category/:nickname", async (req, res) => {
  // set cors policy
  res.setHeader("Access-Control-Allow-origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // cloudwatch log
  console.log(req);

  const {
    params: { nickname },
  } = req;

  try {
    const categoryQueryCommand = new QueryCommand({
      TableName: "myblogUser-myblog",
      IndexName: "NicknameSort",
      KeyConditionExpression: "nickname = :nickname",
      ExpressionAttributeValues: {
        ":nickname": nickname,
      },
      ProjectionExpression: "id, nickname, category",
    });

    const { Count, Items } = await ddbDocClient.send(categoryQueryCommand);
    console.log(Items);

    // Throw error code when post not exists
    if (Count === 0) {
      res.status(400).json({
        message: "User not exists in database.",
      });
    } else res.json(Items[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send();
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
