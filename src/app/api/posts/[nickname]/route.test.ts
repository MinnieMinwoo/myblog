/**
 * @jest-environment node
 */

import {
  AdminGetUserCommand,
  GetUserCommand,
  ResourceNotFoundException,
} from "@aws-sdk/client-cognito-identity-provider";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { authClient, dbClient } from "logics/aws";
import { GET, POST } from "./route";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ErrorMessage } from "enum";

jest.mock("logics/verifyToken", () => (token: string) => {
  const errorConstructorValue = {
    $metadata: {},
    message: "",
  };
  switch (token) {
    case "Bearer testuser":
      return Promise.resolve("testuser");
    case "Bearer mollu":
      return Promise.reject(new ResourceNotFoundException(errorConstructorValue));
    case "Invalid":
      return Promise.reject(new Error(ErrorMessage.INVALID_TOKEN_TYPE));
    case "Contaminated":
      return Promise.reject(new Error(ErrorMessage.CONTAMINATED_TOKEN));
    default:
      return Promise.reject(new Error(ErrorMessage.INVALID_TOKEN_DATA));
  }
});

describe("/posts/[nickname] test", () => {
  const userGetFunction = (input: AdminGetUserCommand | GetUserCommand) => {
    if (input instanceof AdminGetUserCommand) {
      return Promise.resolve({
        Username: "testuser",
        UserAttributes: [
          {
            Name: "sub",
            Value: "testuser-sub",
          },
          {
            Name: "nickname",
            Value: "testuser",
          },
        ],
      });
    } else
      return Promise.resolve({
        Users: [
          {
            Attributes: [
              {
                Name: "sub",
                Value: "testuser-sub",
              },
              {
                Name: "nickname",
                Value: "testuser",
              },
            ],
            Username: "testuser",
          },
        ],
      });
  };
  authClient.send = jest.fn().mockImplementation(userGetFunction);

  const postFunction = async (input: QueryCommand | PutCommand) => {
    if (input instanceof PutCommand)
      return Promise.resolve({
        postID: "test",
      });
    else {
      const errorConstructorValue = {
        $metadata: {},
        message: "",
      };
      const {
        input: { ExpressionAttributeValues, ExclusiveStartKey },
      } = input;
      if (!ExpressionAttributeValues) return Promise.reject();

      const { ":categoryMain": categoryMain, ":categorySub": categorySub } = ExpressionAttributeValues;
      if (categoryMain && categorySub)
        return Promise.resolve({
          Count: 1,
          Items: [{ Test: "CategoryPost" }],
        });

      if (!ExclusiveStartKey) {
        return Promise.resolve({
          Count: 2,
          Items: [{ Test: "Post" }, { Test: "NextPostKey" }],
        });
      }

      const { createdAt, createdBy } = ExclusiveStartKey as any;
      return createdBy === "testuser" && createdAt === 123
        ? Promise.resolve({
            Count: 1,
            Items: [{ Test: "Pagination" }],
          })
        : Promise.reject(new ResourceNotFoundException(errorConstructorValue));
    }
  };
  dbClient.send = jest.fn().mockImplementation(postFunction);

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("GET method test", () => {
    it("200 response", async () => {
      const requestOne = new Request(`http://localhost:3000/api/posts`, {
        method: "GET",
      });
      const resultOne = await GET(requestOne, { params: { nickname: "testuser" } });
      expect(resultOne.status).toBe(200);
      const bodyOne = await resultOne.json();
      expect(bodyOne).toEqual({
        postCount: 2,
        postList: [{ Test: "Post" }, { Test: "NextPostKey" }],
        userData: "testuser-sub",
      });

      const requestTwo = new Request(`http://localhost:3000/api/posts?createdBy=testuser&createdAt=123`, {
        method: "GET",
      });
      const resultTwo = await GET(requestTwo, { params: { nickname: "testuser" } });
      expect(resultTwo.status).toBe(200);
      const bodyTwo = await resultTwo.json();
      expect(bodyTwo).toEqual({
        postCount: 2,
        postList: [{ Test: "Pagination" }],
        userData: "testuser-sub",
      });

      const requestThree = new Request(`http://localhost:3000/api/posts?categoryMain=test1&categorySub=test2`, {
        method: "GET",
      });
      const resultThree = await GET(requestThree, { params: { nickname: "testuser" } });
      expect(resultThree.status).toBe(200);
      const bodyThree = await resultThree.json();
      expect(bodyThree).toEqual({
        postCount: 1,
        postList: [{ Test: "CategoryPost" }],
        userData: "testuser-sub",
      });
    });

    it("404 response", async () => {
      const request = new Request(`http://localhost:3000/api/posts`, {
        method: "GET",
      });
      const result = await GET(request, { params: { nickname: "mollu" } });
      expect(result.status).toBe(404);
    });
  });

  describe("POST method test", () => {
    it("201 response", async () => {
      const request = new Request(`http://localhost:3000/api/posts`, {
        method: "POST",
        headers: {
          Authorization: "Bearer testuser",
        },
        body: JSON.stringify({}),
      });
      const result = await POST(request, { params: { nickname: "testuser" } });
      expect(result.status).toBe(201);
    });

    it("400 response", async () => {
      const request = new Request(`http://localhost:3000/api/posts`, {
        method: "POST",
        headers: {
          Authorization: "Bearer",
        },
        body: JSON.stringify({}),
      });
      const result = await POST(request, { params: { nickname: "testuser" } });
      expect(result.status).toBe(400);
    });

    it("401 response", async () => {
      const requestOne = new Request(`http://localhost:3000/api/posts`, {
        method: "POST",
        headers: {
          Authorization: "Invalid",
        },
        body: JSON.stringify({}),
      });
      const resultOne = await POST(requestOne, { params: { nickname: "testuser" } });
      expect(resultOne.status).toBe(401);
      const { error: errorOne } = await resultOne.json();
      expect(errorOne).toBe("Invalid token type");

      const requestTwo = new Request(`http://localhost:3000/api/posts`, {
        method: "POST",
        headers: {
          Authorization: "Contaminated",
        },
        body: JSON.stringify({}),
      });
      const resultTwo = await POST(requestTwo, { params: { nickname: "testuser" } });
      expect(resultTwo.status).toBe(401);
      const { error: errorTwo } = await resultTwo.json();
      expect(errorTwo).toBe("Get contaminated token");
    });

    it("403 response", async () => {
      const request = new Request(`http://localhost:3000/api/posts`, {
        method: "POST",
        headers: {
          Authorization: "Bearer testuser",
        },
        body: JSON.stringify({}),
      });
      const result = await POST(request, { params: { nickname: "mollu" } });
      expect(result.status).toBe(403);
    });
  });
});
