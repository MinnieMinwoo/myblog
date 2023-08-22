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

const { v4: uuid } = require("uuid");

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const ddbClient = new DynamoDBClient({ region: "ap-northeast-2" });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
 * Return post list if user with the nickname provided in the query exists.
 */
app.get("/postlists/:nickname", async (req, res) => {
  // set cors policy
  res.setHeader("Access-Control-Allow-origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // cloudwatch log
  console.log(req);

  // querystring = last index key
  const {
    query,
    params: { nickname },
  } = req;
  // change querystring data to number
  if (query.createdAt) query.createdAt = Number(query.createdAt);

  try {
    const userGetCommand = new QueryCommand({
      TableName: "myblogUser-myblog",
      IndexName: "NicknameSort",
      KeyConditionExpression: "nickname = :nickname",
      ExpressionAttributeValues: {
        ":nickname": nickname,
      },
      ProjectionExpression: "id",
    });
    const { Count: userCount, Items: userIDList } = await ddbDocClient.send(userGetCommand);
    console.log(userIDList);
    // Throw error code when user not exists
    if (userCount === 0) {
      res.sendStatus(406);
      return;
    }
    const { id: idString } = userIDList[0];

    const countCommand = new QueryCommand({
      TableName: "myblogPosts-myblog",
      IndexName: "NicknameAndTimeIndex",
      KeyConditionExpression: "createdBy = :createdBy",
      ExpressionAttributeValues: {
        ":createdBy": idString,
      },
      ProjectionExpression: "id",
      ScanIndexForward: false,
    });
    const { Count: postCount } = await ddbDocClient.send(countCommand);

    const userPostCommand = new QueryCommand({
      TableName: "myblogPosts-myblog",
      IndexName: "NicknameAndTimeIndex",
      KeyConditionExpression: "createdBy = :createdBy",
      ExpressionAttributeValues: {
        ":createdBy": idString,
      },
      ProjectionExpression: "id, title, createdBy, createdNickname, createdAt, thumbnailImageURL, thumbnailData, tag",
      ScanIndexForward: false,
      Limit: 10,
      // ExclusiveStartKey = LastEvaluatedKey
      ExclusiveStartKey: Object.keys(query).length > 0 ? query : undefined,
    });

    // LastEvaluatedKey : {id, createdBy, createdAt}
    const { Items: postItems, LastEvaluatedKey } = await ddbDocClient.send(userPostCommand);
    res.json({ userData: idString, postCount: postCount, postList: postItems, LastEvaluatedKey });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return;
  }
});

/*
 * Post data on dynamoDB & S3.
 */
app.post("/postlists/:nickname", async (req, res) => {
  // set cors policy
  res.setHeader("Access-Control-Allow-origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // cloudwatch log
  console.log(req);

  const {
    params: { nickname },
    body: postData,
  } = req;

  try {
    const userGetCommand = new QueryCommand({
      TableName: "myblogUser-myblog",
      IndexName: "NicknameSort",
      KeyConditionExpression: "nickname = :nickname",
      ExpressionAttributeValues: {
        ":nickname": nickname,
      },
      ProjectionExpression: "id",
    });
    const { Count: userCount, Items: userIDList } = await ddbDocClient.send(userGetCommand);

    // Throw error code when user not exists
    if (userCount === 0) {
      console.log("invalid querystring");
      res.sendStatus(406);
      return;
    }

    const { id } = userIDList[0];
    // Throw error code when client id is not same
    if (postData.createdBy !== id) {
      console.log("invalid querystring");
      res.sendStatus(406);
      return;
    }

    const date = new Date();
    const postID = uuid();
    const postCommand = new PutCommand({
      TableName: "myblogPosts-myblog",
      Item: {
        ...postData,
        id: postID,
        createdAt: date.getTime(),
      },
    });

    await ddbDocClient.send(postCommand);
    res.json({ postID: postID });
    return;
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return;
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
