/**
 * @jest-environment node
 */

import {
  InitiateAuthCommand,
  NotAuthorizedException,
  TooManyRequestsException,
  UserNotFoundException,
} from "@aws-sdk/client-cognito-identity-provider";
import { authClient } from "logics/aws";
import { POST } from "./route";
jest.mock("logics/parseJwt", () => async () => {
  return { sub: "testuser" };
});

describe("/api/auth/token test", () => {
  const refreshTokenFunction = (input: InitiateAuthCommand) => {
    const errorConstructorValue = {
      $metadata: {},
      message: "",
    };

    const {
      input: { AuthParameters },
    } = input;
    if (!AuthParameters) return Promise.reject();
    const { REFRESH_TOKEN } = AuthParameters;
    switch (REFRESH_TOKEN) {
      case "Bearer testRefreshToken":
        return Promise.resolve({
          AuthenticationResult: {
            AccessToken: "AccessToken",
            IdToken: "IdToken",
            TokenType: "Bearer",
          },
        });
      case "Bearer tooManyRequestToken":
        return Promise.reject(new TooManyRequestsException(errorConstructorValue));
      case "Bearer hackedToken":
        return Promise.reject(new NotAuthorizedException(errorConstructorValue));
      default:
        return Promise.reject(new UserNotFoundException(errorConstructorValue));
    }
  };

  authClient.send = jest.fn().mockImplementation(refreshTokenFunction);

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe("POST method test", () => {
    it("201 response", async () => {
      const request = new Request(`http://localhost:3000/api/auth/token`, {
        method: "POST",
        body: JSON.stringify({
          refreshToken: "Bearer testRefreshToken",
        }),
      });
      const result = await POST(request);
      expect(result.status).toBe(200);
      const body = await result.json();
      expect(body).toEqual({
        accessToken: "AccessToken",
        id: "testuser",
        idToken: "IdToken",
        refreshToken: "Bearer testRefreshToken",
        type: "Bearer",
      });
    });

    it("401 response", async () => {
      const requestOne = new Request(`http://localhost:3000/api/auth/token`, {
        method: "POST",
        body: JSON.stringify({
          refreshToken: "Bearer hackedToken",
        }),
      });
      const { status: statusOne } = await POST(requestOne);
      expect(statusOne).toBe(401);

      const requestTwo = new Request(`http://localhost:3000/api/auth/token`, {
        method: "POST",
        body: JSON.stringify({
          refreshToken: "Bearer mollu",
        }),
      });
      const { status: statusTwo } = await POST(requestTwo);
      expect(statusTwo).toBe(401);
    });

    it("429 response", async () => {
      const request = new Request(`http://localhost:3000/api/auth/token`, {
        method: "POST",
        body: JSON.stringify({
          refreshToken: "Bearer tooManyRequestToken",
        }),
      });
      const { status } = await POST(request);
      expect(status).toBe(429);
    });
  });
});
