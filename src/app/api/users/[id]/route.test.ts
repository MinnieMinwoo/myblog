/**
 * @jest-environment node
 */

import {
  AdminGetUserCommand,
  DeleteUserCommand,
  ListUsersCommand,
  TooManyRequestsException,
  UpdateUserAttributesCommand,
  UserNotFoundException,
} from "@aws-sdk/client-cognito-identity-provider";
import { ErrorMessage } from "enum";
import { authClient, dbClient } from "logics/aws";
import { DELETE, GET, PUT } from "./route";
jest.mock("logics/verifyToken", () => (token: string) => {
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
});

describe("/users/[id] test", () => {
  beforeAll(() => {
    const userFunction = (
      command: AdminGetUserCommand | ListUsersCommand | UpdateUserAttributesCommand | DeleteUserCommand
    ) => {
      const errorConstructorValue = {
        $metadata: {},
        message: "",
      };

      if (command instanceof AdminGetUserCommand) {
        const {
          input: { Username },
        } = command;
        return Username === "testuser"
          ? Promise.resolve({
              UserAttributes: [
                { Name: "id", Value: "12345" },
                { Name: "email", Value: "test@testmail.com" },
                { Name: "nickname", Value: "testuser" },
                { Name: "picture", Value: "testaddress.com" },
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
            {
              Attributes: [
                { Name: "nickname", Value: "tooManyRequest" },
                { Name: "sub", Value: "99999" },
              ],
            },
          ],
        });
      } else if (command instanceof UpdateUserAttributesCommand) {
        const {
          input: { AccessToken },
        } = command;
        return AccessToken === "tooManyRequest"
          ? Promise.reject(new TooManyRequestsException(errorConstructorValue))
          : Promise.resolve();
      } else if (command instanceof DeleteUserCommand) return Promise.resolve();
      else return Promise.reject();
    };

    authClient.send = jest.fn().mockImplementation(userFunction);

    const deletePostCommand = () => Promise.resolve();
    dbClient.send = jest.fn().mockImplementation(deletePostCommand);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe("GET method test", () => {
    it("200 response", async () => {
      const request = new Request(`http://localhost:3000/api/users`, {
        method: "GET",
      });
      const result = await GET(request, { params: { id: "testuser" } });
      expect(result.status).toBe(200);
      const body = await result.json();
      expect(body).toEqual({
        email: "test@testmail.com",
        nickname: "testuser",
        picture: "testaddress.com",
      });
    });

    it("404 response", async () => {
      const request = new Request(`http://localhost:3000/api/users`, {
        method: "GET",
      });
      const { status } = await GET(request, { params: { id: "mollu" } });
      expect(status).toBe(404);
    });
  });

  describe("PUT method test", () => {
    it("201 response", async () => {
      const requestOne = new Request(`http://localhost:3000/api/users`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer testuser",
        },
        body: JSON.stringify({
          nickname: "changename",
        }),
      });
      const resultOne = await PUT(requestOne, { params: { id: "testuser" } });
      expect(resultOne.status).toBe(201);
      const bodyOne = await resultOne.json();
      expect(bodyOne).toEqual({
        id: "testuser",
        nickname: "changename",
        profileImage: "",
      });

      const requestTwo = new Request(`http://localhost:3000/api/users`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer testuser",
        },
        body: JSON.stringify({
          nickname: "changename",
          profileImage: "newAddress@test.com",
        }),
      });
      const resultTwo = await PUT(requestTwo, { params: { id: "testuser" } });
      expect(resultTwo.status).toBe(201);
      const bodyTwo = await resultTwo.json();
      expect(bodyTwo).toEqual({
        id: "testuser",
        nickname: "changename",
        profileImage: "newAddress@test.com",
      });
    });

    it("400 response", async () => {
      const requestOne = new Request(`http://localhost:3000/api/users`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer testuser",
        },
        body: JSON.stringify({}),
      });
      const resultOne = await PUT(requestOne, { params: { id: "testuser" } });
      expect(resultOne.status).toBe(400);
      const { error: errorOne } = await resultOne.json();
      expect(errorOne).toBe("Invalid fetch data");

      const requestTwo = new Request(`http://localhost:3000/api/users`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer",
        },
        body: JSON.stringify({
          id: "testuser",
          nickname: "changename",
        }),
      });
      const resultTwo = await PUT(requestTwo, { params: { id: "testuser" } });
      expect(resultTwo.status).toBe(400);
      const { error: errorTwo } = await resultTwo.json();
      expect(errorTwo).toBe("Wrong token data");
    });

    it("401 response", async () => {
      const requestOne = new Request(`http://localhost:3000/api/users`, {
        method: "PUT",
        headers: {
          Authorization: "Invalid",
        },
        body: JSON.stringify({}),
      });
      const resultOne = await PUT(requestOne, { params: { id: "testuser" } });
      expect(resultOne.status).toBe(401);
      const { error: errorOne } = await resultOne.json();
      expect(errorOne).toBe("Invalid token type");

      const requestTwo = new Request(`http://localhost:3000/api/users`, {
        method: "PUT",
        headers: {
          Authorization: "Contaminated",
        },
        body: JSON.stringify({}),
      });
      const resultTwo = await PUT(requestTwo, { params: { id: "testuser" } });
      expect(resultTwo.status).toBe(401);
      const { error: errorTwo } = await resultTwo.json();
      expect(errorTwo).toBe("Get contaminated token");
    });

    it("403 response", async () => {
      const request = new Request(`http://localhost:3000/api/users`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer mollu",
        },
        body: JSON.stringify({}),
      });
      const { status } = await PUT(request, { params: { id: "testuser" } });
      expect(status).toBe(403);
    });
  });

  describe("DELETE method test", () => {
    it("204 response", async () => {
      const request = new Request(`http://localhost:3000/api/users`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer testuser",
        },
      });
      const { status } = await DELETE(request, { params: { id: "testuser" } });
      expect(status).toBe(204);
    });
  });

  it("400 response", async () => {
    const request = new Request(`http://localhost:3000/api/users`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer",
      },
    });
    const { status } = await DELETE(request, { params: { id: "testuser" } });
    expect(status).toBe(400);
  });

  it("401 response", async () => {
    const requestOne = new Request(`http://localhost:3000/api/users`, {
      method: "DELETE",
      headers: {
        Authorization: "Invalid",
      },
    });
    const resultOne = await DELETE(requestOne, { params: { id: "testuser" } });
    expect(resultOne.status).toBe(401);
    const { error: errorOne } = await resultOne.json();
    expect(errorOne).toBe("Invalid token type");

    const requestTwo = new Request(`http://localhost:3000/api/users`, {
      method: "DELETE",
      headers: {
        Authorization: "Contaminated",
      },
    });
    const resultTwo = await DELETE(requestTwo, { params: { id: "testuser" } });
    expect(resultTwo.status).toBe(401);
    const { error: errorTwo } = await resultTwo.json();
    expect(errorTwo).toBe("Get contaminated token");
  });

  it("403 response", async () => {
    const request = new Request(`http://localhost:3000/api/users`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer mollu",
      },
    });
    const { status } = await DELETE(request, { params: { id: "testuser" } });
    expect(status).toBe(403);
  });
});
