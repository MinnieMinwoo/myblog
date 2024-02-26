/**
 * @jest-environment node
 */

import { ResourceNotFoundException } from "@aws-sdk/client-cognito-identity-provider";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ErrorMessage } from "enum";
import { dbClient } from "logics/aws";
import { GET, POST } from "./route";

jest.mock("next/cache");
jest.mock(
  "logics/verifyToken",
  jest.fn().mockImplementation(() => (token: string) => {
    const errorConstructorValue = {
      $metadata: {},
      message: "",
    };
    switch (token) {
      case "Bearer testuser":
        return Promise.resolve("testuser");
      case "Bearer mollu":
        return Promise.resolve("mollu");
      case "Invalid":
        return Promise.reject(new Error(ErrorMessage.INVALID_TOKEN_TYPE));
      case "Contaminated":
        return Promise.reject(new Error(ErrorMessage.CONTAMINATED_TOKEN));
      default:
        return Promise.reject(new Error(ErrorMessage.INVALID_TOKEN_DATA));
    }
  })
);

afterAll(() => {
  jest.resetAllMocks();
});

describe("/posts/[nickname] test", () => {
  const postFunction = (input: GetCommand | UpdateCommand) => {
    const errorConstructorValue = {
      $metadata: {},
      message: "",
    };
    if (input instanceof GetCommand) {
      const {
        input: { Key },
      } = input;
      return Key?.id === "testpost"
        ? Promise.resolve({
            Item: {
              likes: ["testuser"],
            },
          })
        : Promise.reject(new ResourceNotFoundException(errorConstructorValue));
    } else return Promise.resolve();
  };
  dbClient.send = jest.fn().mockImplementation(postFunction);

  describe("GET test", () => {
    it("200 test", async () => {
      const request = new Request(`http://localhost:3000/api/posts`, {
        method: "GET",
      });
      const result = await GET(request, { params: { postid: "testpost" } });
      expect(result.status).toBe(200);
      const body = await result.json();
      expect(body).toEqual({
        id: "testpost",
        likes: ["testuser"],
      });
    });

    it("404 test", async () => {
      const request = new Request(`http://localhost:3000/api/posts`, {
        method: "GET",
      });
      const { status } = await GET(request, { params: { postid: "mollu" } });
      expect(status).toBe(404);
    });
  });

  describe("POST test", () => {
    it("201 test when a user likes", async () => {
      const request = new Request(`http://localhost:3000/api/posts`, {
        method: "POST",
        headers: {
          Authorization: "Bearer mollu",
        },
        body: JSON.stringify({
          postid: "testpost",
        }),
      });
      const result = await POST(request, { params: { postid: "testpost" } });
      expect(result.status).toBe(201);
      const body = await result.json();
      console.log(body);
      expect(body).toEqual({
        id: "testpost",
        likes: ["testuser", "mollu"],
      });
    });

    it("201 test when a user cancels likes", async () => {
      const request = new Request(`http://localhost:3000/api/posts`, {
        method: "POST",
        headers: {
          Authorization: "Bearer testuser",
        },
        body: JSON.stringify({
          postid: "testpost",
        }),
      });
      const result = await POST(request, { params: { postid: "testpost" } });
      expect(result.status).toBe(201);
      const body = await result.json();
      console.log(body);
      expect(body).toEqual({
        id: "testpost",
        likes: [],
      });
    });

    it("400 response", async () => {
      const request = new Request(`http://localhost:3000/api/posts`, {
        method: "POST",
        headers: {
          Authorization: "Bearer",
        },
        body: JSON.stringify({}),
      });
      const result = await POST(request, { params: { postid: "testpost" } });
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
      const resultOne = await POST(requestOne, { params: { postid: "testpost" } });
      expect(resultOne.status).toBe(401);
      const { error: errorOne } = await resultOne.json();
      expect(errorOne).toBe("Invalid token type");

      const requestTwo = new Request(`http://localhost:3000/api/posts`, {
        method: "PUT",
        headers: {
          Authorization: "Contaminated",
        },
        body: JSON.stringify({}),
      });
      const resultTwo = await POST(requestTwo, { params: { postid: "testpost" } });
      expect(resultTwo.status).toBe(401);
      const { error: errorTwo } = await resultTwo.json();
      expect(errorTwo).toBe("Get contaminated token");
    });

    it("404 response", async () => {
      const request = new Request(`http://localhost:3000/api/posts`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer testuser",
        },
        body: JSON.stringify({
          createdBy: "testuser",
        }),
      });
      const result = await POST(request, { params: { postid: "mollu" } });
      expect(result.status).toBe(404);
    });
  });
});
