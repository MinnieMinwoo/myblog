/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_MYBLOGIMAGES_BUCKETNAME
Amplify Params - DO NOT EDIT */

const awsServerlessExpress = require("aws-serverless-express");

const express = require("express");
const app = express();

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const storageClient = new S3Client({ region: "ap-northeast-2" });

const multer = require("multer");
const multerS3 = require("multer-s3");

const { v4: uuid } = require("uuid");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// multer setting
const upload = multer({
  storage: multerS3({
    s3: storageClient,
    bucket: "mybloguserpostimage153228-myblog",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      console.log(file);
      const fileNameList = file.originalname.split(".");
      cb(null, `${uuid()}.${fileNameList[fileNameList.length - 1]}`);
    },
  }),
});

/*
 * Post images in s3 bucket.
 */
app.post("/images", upload.single("image"), async (req, res) => {
  // set cors policy
  res.setHeader("Access-Control-Allow-origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // cloudwatch log
  console.log(req);

  res.status(201).json({
    imageURL: req.file.location,
  });
  return;
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
