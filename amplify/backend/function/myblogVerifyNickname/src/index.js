/* Amplify Params - DO NOT EDIT
	AUTH_MYBLOG3F0A7747_USERPOOLID
	ENV
	REGION
	STORAGE_MYBLOGUSER_ARN
	STORAGE_MYBLOGUSER_NAME
	STORAGE_MYBLOGUSER_STREAMARN
Amplify Params - DO NOT EDIT */

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const ddbClient = new DynamoDBClient({ region: "ap-northeast-2" });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

exports.handler = async (event, context, callback) => {
  const {
    request: {
      userAttributes: { nickname },
    },
  } = event;
  console.log(event);

  const userGetCommand = new QueryCommand({
    TableName: "myblogUser-myblog",
    IndexName: "NicknameSort",
    KeyConditionExpression: "nickname = :nickname",
    ExpressionAttributeValues: {
      ":nickname": nickname,
    },
    ProjectionExpression: "id",
  });

  const { Count } = await ddbDocClient.send(userGetCommand);

  if (Count > 0) {
    const error = new Error("User nickname duplicated");
    callback(error, event);
  } else {
    callback(null, event);
  }
};
