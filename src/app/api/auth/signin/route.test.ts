/**
 * @jest-environment node
 */

import {
  InitiateAuthCommand,
  NotAuthorizedException,
  TooManyRequestsException,
  UserNotConfirmedException,
  UserNotFoundException,
} from "@aws-sdk/client-cognito-identity-provider";
import { authClient } from "logics/aws";
import { POST } from "./route";

describe("/signin test", () => {
  const signInFunction = (input: InitiateAuthCommand) => {
    const errorConstructorValue = {
      $metadata: {},
      message: "",
    };
    if (!input.input.AuthParameters) return Promise.reject();
    const {
      input: {
        AuthParameters: { USERNAME: email, PASSWORD: password },
      },
    } = input;
    switch (email) {
      case "testuser@test.com":
        return password === "12345678"
          ? Promise.resolve({
              AuthenticationResult: {
                TokenType: "Bearer",
                /*
                IdToken: {
                  "email_verified": true,
                  "nickname": "mollu",
                  "sub": "abc"
                }
              */
                IdToken:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmlja25hbWUiOiJtb2xsdSIsInN1YiI6ImFiYyJ9.14Mj2mx9OhKXbtBAonMYdP3hJsRmleqRBuzAFJjezcI",
                AccessToken: "456",
                RefreshToken: "789",
              },
            })
          : Promise.reject(new NotAuthorizedException(errorConstructorValue));
      case "notVerified@test.com":
        return Promise.reject(new UserNotConfirmedException(errorConstructorValue));
      case "toomanyFails@test.com":
        return Promise.reject(new TooManyRequestsException(errorConstructorValue));
      default:
        return Promise.reject(new UserNotFoundException(errorConstructorValue));
    }
  };

  authClient.send = jest.fn().mockImplementation(signInFunction);

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe("POST method test", () => {
    it("200 response", async () => {
      const request = new Request(`http://localhost:3000/api/auth`, {
        method: "POST",
        body: JSON.stringify({
          email: "testuser@test.com",
          password: "12345678",
        }),
      });
      const result = await POST(request);
      expect(result.status).toBe(200);
      const body = await result.json();
      expect(body).toEqual({
        type: "Bearer",
        id: "abc",
        nickname: "mollu",
        isVerified: true,
        idToken:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmlja25hbWUiOiJtb2xsdSIsInN1YiI6ImFiYyJ9.14Mj2mx9OhKXbtBAonMYdP3hJsRmleqRBuzAFJjezcI",
        accessToken: "456",
        refreshToken: "789",
      });
    });

    it("400 response", async () => {
      const requestOne = new Request(`http://localhost:3000/api/auth/signin`, {
        method: "POST",
        body: JSON.stringify({
          email: "testuser@test.com",
        }),
      });
      const { status: statusOne } = await POST(requestOne);
      expect(statusOne).toBe(400);

      const requestTwo = new Request(`http://localhost:3000/api/auth/signin`, {
        method: "POST",
      });
      const { status: statusTwo } = await POST(requestTwo);
      expect(statusTwo).toBe(400);
    });

    it("401 response", async () => {
      const request = new Request(`http://localhost:3000/api/auth/signin`, {
        method: "POST",
        body: JSON.stringify({
          email: "testuser@test.com",
          password: "234567",
        }),
      });
      const { status } = await POST(request);
      expect(status).toBe(401);
    });

    it("403 response", async () => {
      const request = new Request(`http://localhost:3000/api/auth/signin`, {
        method: "POST",
        body: JSON.stringify({
          email: "notVerified@test.com",
          password: "12345678",
        }),
      });
      const { status } = await POST(request);
      expect(status).toBe(403);
    });

    it("404 response", async () => {
      const request = new Request(`http://localhost:3000/api/auth/signin`, {
        method: "POST",
        body: JSON.stringify({
          email: "mollu@test.com",
          password: "123456",
        }),
      });
      const { status } = await POST(request);
      expect(status).toBe(404);
    });

    it("429 response", async () => {
      const request = new Request(`http://localhost:3000/api/auth/signin`, {
        method: "POST",
        body: JSON.stringify({
          email: "toomanyFails@test.com",
          password: "12345678",
        }),
      });
      const { status } = await POST(request);
      expect(status).toBe(429);
    });
  });
});
