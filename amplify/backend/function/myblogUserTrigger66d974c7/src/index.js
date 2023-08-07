/* Amplify Params - DO NOT EDIT
	AUTH_MYBLOG804BAEC8_USERPOOLID
	ENV
	REGION
	STORAGE_MYBLOGUSER_ARN
	STORAGE_MYBLOGUSER_NAME
	STORAGE_MYBLOGUSER_STREAMARN
Amplify Params - DO NOT EDIT */ const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const ddbDocClient = new DynamoDBClient({ region: "ap-northeast-2" });

exports.handler = async (event, context) => {
  console.log(event);

  // If the required parameters are present, proceed
  if (event.request.userAttributes.sub) {
    const {
      request: {
        userAttributes: { sub: id, name, nickname, email },
      },
    } = event;
    const params = {
      TableName: "myblogUser-dev",

      Item: {
        id: { S: id },
        name: { S: name },
        nickname: { S: nickname },
        email: { S: email },
        profileImage: { S: "" },
        description: { S: "Hello my blog Page!" },
      },
    };

    // write params to dynamoDB
    try {
      await ddbDocClient.send(new PutItemCommand(params));
      console.log("Success");
    } catch (error) {
      console.log("Error", error);
    }

    context.done(null, event);
  } else {
    // Nothing to do, the user's email ID is unknown
    console.log("Error: Nothing was written to DDB or SQS");
    context.done(null, event);
  }
};
