/**
 * @jest-environment node
 */

import {
  AdminGetUserCommand,
  ListUsersCommand,
  UserNotFoundException,
} from "@aws-sdk/client-cognito-identity-provider";
import { ErrorMessage } from "enum";
import { authClient, dbClient } from "logics/aws";
import { GET, PUT } from "./route";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
jest.mock("logics/verifyToken", () => (token: string) => {
  switch (token) {
    case "Bearer testuser":
      return Promise.resolve("12345");
    case "Invalid":
      return Promise.reject(new Error(ErrorMessage.INVALID_TOKEN_TYPE));
    case "Contaminated":
      return Promise.reject(new Error(ErrorMessage.CONTAMINATED_TOKEN));
    default:
      return Promise.reject(new Error(ErrorMessage.INVALID_TOKEN_DATA));
  }
});
jest.mock("next/cache");

describe("/users/[id] test", () => {
  beforeAll(() => {
    const userFunction = (command: AdminGetUserCommand | ListUsersCommand) => {
      const errorConstructorValue = {
        $metadata: {},
        message: "",
      };

      if (command instanceof AdminGetUserCommand) {
        const {
          input: { Username },
        } = command;
        return Username === "12345"
          ? Promise.resolve({
              UserAttributes: [
                { Name: "id", Value: "12345" },
                { Name: "nickname", Value: "testuser" },
              ],
            })
          : Promise.reject(new UserNotFoundException(errorConstructorValue));
      } else if (command instanceof ListUsersCommand) {
        return Promise.resolve({
          Users: [
            {
              Attributes: [
                { Name: "nickname", Value: "testuser" },
                { Name: "sub", Value: "12345" },
              ],
            },
          ],
        });
      } else return Promise.reject();
    };
    authClient.send = jest.fn().mockImplementation(userFunction);

    const aboutPostCommand = (input: GetCommand | UpdateCommand) => {
      if (input instanceof GetCommand) {
        const {
          input: { Key },
        } = input;

        return Key?.id === "12345"
          ? Promise.resolve({
              Item: {
                id: "12345",
                about: "about test",
              },
            })
          : Promise.reject();
      } else if (input instanceof UpdateCommand) {
        const {
          input: { Key, ExpressionAttributeValues },
        } = input;

        return Key?.id === "12345"
          ? Promise.resolve({
              Attributes: {
                id: "12345",
                about: ExpressionAttributeValues ? ExpressionAttributeValues[":about"] : "",
              },
            })
          : Promise.reject();
      } else return Promise.reject();
    };
    dbClient.send = jest.fn().mockImplementation(aboutPostCommand);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe("GET method test", () => {
    it("200 response", async () => {
      const request = new Request(`http://localhost:3000/api/users/about`, {
        method: "GET",
      });
      const result = await GET(request, { params: { nickname: "testuser" } });
      expect(result.status).toBe(200);
      const body = await result.json();
      expect(body).toEqual({
        id: "12345",
        about: "about test",
      });
    });

    it("404 response", async () => {
      const request = new Request(`http://localhost:3000/api/users/about`, {
        method: "GET",
      });
      const { status } = await GET(request, { params: { nickname: "mollu" } });
      expect(status).toBe(404);
    });
  });

  describe("PUT method test", () => {
    it("201 response", async () => {
      const request = new Request(`http://localhost:3000/api/users/about`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer testuser",
        },
        body: JSON.stringify({
          about: "new about",
        }),
      });
      const result = await PUT(request, { params: { nickname: "testuser" } });
      expect(result.status).toBe(201);
      const body = await result.json();
      expect(body).toEqual({
        id: "12345",
        about: "new about",
      });
    });

    it("400 response", async () => {
      const requestOne = new Request(`http://localhost:3000/api/users/about`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer testuser",
        },
        body: JSON.stringify({}),
      });
      const resultOne = await PUT(requestOne, { params: { nickname: "testuser" } });
      expect(resultOne.status).toBe(400);
      const { error: errorOne } = await resultOne.json();
      expect(errorOne).toBe("Invalid fetch data");

      const requestTwo = new Request(`http://localhost:3000/api/users/about`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer",
        },
        body: JSON.stringify({
          about: "new about",
        }),
      });
      const resultTwo = await PUT(requestTwo, { params: { nickname: "testuser" } });
      expect(resultTwo.status).toBe(400);
      const { error: errorTwo } = await resultTwo.json();
      expect(errorTwo).toBe("Wrong token data");
    });

    it("401 response", async () => {
      const requestOne = new Request(`http://localhost:3000/api/users/about`, {
        method: "PUT",
        headers: {
          Authorization: "Invalid",
        },
        body: JSON.stringify({
          about: "new about",
        }),
      });
      const resultOne = await PUT(requestOne, { params: { nickname: "testuser" } });
      expect(resultOne.status).toBe(401);
      const { error: errorOne } = await resultOne.json();
      expect(errorOne).toBe("Invalid token type");

      const requestTwo = new Request(`http://localhost:3000/api/users/about`, {
        method: "PUT",
        headers: {
          Authorization: "Contaminated",
        },
        body: JSON.stringify({
          about: "new about",
        }),
      });
      const resultTwo = await PUT(requestTwo, { params: { nickname: "testuser" } });
      expect(resultTwo.status).toBe(401);
      const { error: errorTwo } = await resultTwo.json();
      expect(errorTwo).toBe("Get contaminated token");
    });

    it("403 response", async () => {
      const request = new Request(`http://localhost:3000/api/users/about`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer testuser",
        },
        body: JSON.stringify({
          about: "new about",
        }),
      });
      const { status } = await PUT(request, { params: { nickname: "mollu" } });
      expect(status).toBe(403);
    });
  });
});
