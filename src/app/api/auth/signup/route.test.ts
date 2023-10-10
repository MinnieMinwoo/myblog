/**
 * @jest-environment node
 */

import {
  InvalidParameterException,
  ListUsersCommand,
  SignUpCommand,
  TooManyRequestsException,
  UsernameExistsException,
} from "@aws-sdk/client-cognito-identity-provider";
import { authClient, dbClient } from "logics/aws";
import { POST } from "./route";

describe("/auth/signup test", () => {
  const signUpFunction = (input: SignUpCommand | ListUsersCommand) => {
    if (input instanceof SignUpCommand) {
      const errorConstructorValue = {
        $metadata: {},
        message: "",
      };

      const {
        input: { Username, Password },
      } = input;
      if (!Username || !Password) return Promise.reject();
      else if (Username.length < 8)
        return Promise.reject(
          new InvalidParameterException({
            $metadata: {},
            message: "Username should be an email.",
          })
        );
      else if (Password.length < 8)
        return Promise.reject(
          new InvalidParameterException({
            $metadata: {},
            message:
              "1 validation error detected: Value at 'password' failed to satisfy constraint: password must be at least 8 characters long.",
          })
        );
      else
        switch (Username) {
          case "testuser@test.com":
            return Promise.resolve({ UserSub: "" });
          case "existedUser@test.com":
            return Promise.reject(new UsernameExistsException(errorConstructorValue));
          case "toomanyFails@test.com":
            return Promise.reject(new TooManyRequestsException(errorConstructorValue));
          default:
            return Promise.reject();
        }
    } else if (input instanceof ListUsersCommand) {
      return Promise.resolve({ Users: [{ Attributes: [{ Name: "nickname", Value: "existedUser" }] }] });
    }
  };

  authClient.send = jest.fn().mockImplementation(signUpFunction);
  dbClient.send = jest.fn();

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe("POST method test", () => {
    it("204 response", async () => {
      const request = new Request(`http://localhost:3000/api/auth/signup`, {
        method: "POST",
        body: JSON.stringify({
          email: "testuser@test.com",
          password: "12345678",
          nickname: "test",
        }),
      });
      const { status } = await POST(request);
      expect(status).toBe(204);
    });

    it("400 response", async () => {
      const requestOne = new Request(`http://localhost:3000/api/auth/signup`, {
        method: "POST",
        body: JSON.stringify({
          email: "testuser@test.com",
          password: "12345678",
        }),
      });
      const resultOne = await POST(requestOne);
      expect(resultOne.status).toBe(400);
      const { error: textOne } = await resultOne.json();
      expect(textOne).toBe("Invalid fetch data");

      const requestTwo = new Request(`http://localhost:3000/api/auth/signup`, {
        method: "POST",
        body: JSON.stringify({
          email: "mollu",
          password: "12345678",
          nickname: "test",
        }),
      });
      const resultTwo = await POST(requestTwo);
      expect(resultTwo.status).toBe(400);
      const { error: textTwo } = await resultTwo.json();
      expect(textTwo).toBe("Username should be an email.");

      const requestThree = new Request(`http://localhost:3000/api/auth/signup`, {
        method: "POST",
        body: JSON.stringify({
          email: "testuser@testmail.com",
          password: "123",
          nickname: "test",
        }),
      });
      const resultThree = await POST(requestThree);
      expect(resultThree.status).toBe(400);
      const { error: textThree } = await resultThree.json();
      expect(textThree.includes("validation error detected")).toBe(true);
      expect(textThree.includes("password")).toBe(true);
    });

    it("403 response", async () => {
      const requestOne = new Request(`http://localhost:3000/api/auth/signup`, {
        method: "POST",
        body: JSON.stringify({
          email: "existedUser@test.com",
          password: "12345678",
          nickname: "test",
        }),
      });
      const resultOne = await POST(requestOne);
      expect(resultOne.status).toBe(403);
      const { error: textOne } = await resultOne.json();
      expect(textOne).toBe("User already exists in database");

      const requestTwo = new Request(`http://localhost:3000/api/auth/signup`, {
        method: "POST",
        body: JSON.stringify({
          email: "testuser@test.com",
          password: "12345678",
          nickname: "existedUser",
        }),
      });
      const resultTwo = await POST(requestTwo);
      expect(resultTwo.status).toBe(403);
      const { error: textTwo } = await resultTwo.json();
      expect(textTwo).toBe("User nickname duplicated");
    });

    it("429 response", async () => {
      const request = new Request(`http://localhost:3000/api/auth/signup`, {
        method: "POST",
        body: JSON.stringify({
          email: "toomanyFails@test.com",
          password: "12345678",
          nickname: "test",
        }),
      });
      const { status } = await POST(request);
      expect(status).toBe(429);
    });
  });
});
