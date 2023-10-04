/**
 * @jest-environment node
 */

import { QueryCommand, ResourceNotFoundException } from "@aws-sdk/client-dynamodb";
import { authClient, dbClient } from "logics/aws";
import { GET, PUT } from "./route";
import { AdminGetUserCommand, GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
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

describe("/categories/[nickname] test", () => {
  const userGetFunction = (input: AdminGetUserCommand | GetUserCommand) => {
    const errorConstructorValue = {
      $metadata: {},
      message: "",
    };
    if (input instanceof AdminGetUserCommand) {
      return Promise.resolve({
        Username: "testuser",
        UserAttributes: [
          {
            Name: "sub",
            Value: "eaad0219-2117-439f-8d46-4db20e59268f",
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
                Value: "eaad0219-2117-439f-8d46-4db20e59268f",
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

  const categoryGetFunction = (input: UpdateCommand | QueryCommand) => {
    const errorConstructorValue = {
      $metadata: {},
      message: "",
    };
    if (input instanceof UpdateCommand) {
      return Promise.resolve({
        Attributes: {
          id: "testID",
          nickname: "testNickname",
          category: "testCategory",
        },
      });
    } else {
      if (!(input.input.ExpressionAttributeValues && input.input.ExpressionAttributeValues[":id"]))
        return Promise.reject(new ResourceNotFoundException(errorConstructorValue));
      else
        return Promise.resolve({
          Count: 1,
          Items: [
            {
              Title: "Dummy",
            },
          ],
        });
    }
  };

  dbClient.send = jest.fn().mockImplementation(categoryGetFunction);

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("GET method test", () => {
    it("200 response", async () => {
      const request = new Request(`http://localhost:3000/api/categories`, {
        method: "GET",
      });
      const result = await GET(request, { params: { nickname: "testuser" } });
      expect(result.status).toBe(200);
      const body = await result.json();
      expect(body).toEqual({ Title: "Dummy" });
    });

    it("404 response", async () => {
      const request = new Request(`http://localhost:3000/api/categories`, {
        method: "GET",
      });
      const result = await GET(request, { params: { nickname: "mollu" } });
      expect(result.status).toBe(404);
    });
  });

  describe("PUT method test", () => {
    it("201 response", async () => {
      const request = new Request(`http://localhost:3000/api/categories`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer testuser",
        },
        body: JSON.stringify({
          category: "",
        }),
      });
      const result = await PUT(request, { params: { nickname: "testuser" } });
      expect(result.status).toBe(201);
      const body = await result.json();
      expect(body).toEqual({ id: "testID", nickname: "testNickname", category: "testCategory" });
    });

    it("400 response", async () => {
      const request = new Request(`http://localhost:3000/api/categories`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer",
        },
        body: JSON.stringify({
          category: "",
        }),
      });
      const result = await PUT(request, { params: { nickname: "testuser" } });
      expect(result.status).toBe(400);
    });

    it("401 response", async () => {
      const requestOne = new Request(`http://localhost:3000/api/categories`, {
        method: "PUT",
        headers: {
          Authorization: "Invalid",
        },
        body: JSON.stringify({
          category: "",
        }),
      });
      const resultOne = await PUT(requestOne, { params: { nickname: "testuser" } });
      expect(resultOne.status).toBe(401);
      const { error: errorOne } = await resultOne.json();
      expect(errorOne).toBe("Invalid token type");

      const requestTwo = new Request(`http://localhost:3000/api/categories`, {
        method: "PUT",
        headers: {
          Authorization: "Contaminated",
        },
        body: JSON.stringify({
          category: "",
        }),
      });
      const resultTwo = await PUT(requestTwo, { params: { nickname: "testuser" } });
      expect(resultTwo.status).toBe(401);
      const { error: errorTwo } = await resultTwo.json();
      expect(errorTwo).toBe("Get contaminated token");
    });

    it("403 response", async () => {
      const request = new Request(`http://localhost:3000/api/categories`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer testuser",
        },
        body: JSON.stringify({
          category: "",
        }),
      });
      const result = await PUT(request, { params: { nickname: "unknown" } });
      expect(result.status).toBe(403);
    });
  });

  it("404 response", async () => {
    const request = new Request(`http://localhost:3000/api/categories`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer mollu",
      },
      body: JSON.stringify({
        category: "",
      }),
    });
    const result = await PUT(request, { params: { nickname: "mollu" } });
    expect(result.status).toBe(404);
  });
});
