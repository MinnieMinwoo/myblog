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

const express = require("express");
const app = express();

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const ddbClient = new DynamoDBClient({ region: "ap-northeast-2" });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
 * Return post list if user with the nickname provided in the query exists.
 */
app.get("/posts/:id", async (req, res) => {
  // set cors policy
  res.setHeader("Access-Control-Allow-origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // cloudwatch log
  console.log(req);

  const {
    params: { id: postID },
  } = req;

  try {
    const postGetCommand = new QueryCommand({
      TableName: "myblogPosts-myblog",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": postID,
      },
      ProjectionExpression:
        "id, title, categoryMain, categorySub, createdAt, createdBy, createdNickname, thumbnailImageURL, postDetail, tag, likes",
    });

    const { Count, Items } = await ddbDocClient.send(postGetCommand);
    console.log(Items);
    // Throw error code when post not exists
    if (Count === 0) {
      res.status(404).json({
        message: "Post not exists in database.",
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
