/**
 * @jest-environment node
 */

import {
  CodeMismatchException,
  ConfirmSignUpCommand,
  ExpiredCodeException,
  ResendConfirmationCodeCommand,
  TooManyFailedAttemptsException,
  TooManyRequestsException,
  UserNotFoundException,
} from "@aws-sdk/client-cognito-identity-provider";
import { GET, POST } from "./route";
import { authClient } from "logics/aws";

describe("/confirm test", () => {
  const VerifyFunction = (input: ResendConfirmationCodeCommand | ConfirmSignUpCommand): Promise<void> => {
    const errorConstructorValue = {
      $metadata: {},
      message: "",
    };
    if (input instanceof ResendConfirmationCodeCommand) {
      const {
        input: { Username },
      } = input;
      switch (Username) {
        case "testuser@test.com":
          return Promise.resolve();
        case "hacked@test.com":
          return Promise.reject(new TooManyRequestsException(errorConstructorValue));
        case "toomanyFails@test.com":
          return Promise.reject(new TooManyFailedAttemptsException(errorConstructorValue));
        default:
          return Promise.reject(new UserNotFoundException(errorConstructorValue));
      }
    } else if (input instanceof ConfirmSignUpCommand) {
      const {
        input: { Username, ConfirmationCode },
      } = input;
      switch (Username) {
        case "testuser@test.com":
          return ConfirmationCode === "123456"
            ? Promise.resolve()
            : ConfirmationCode === "234567"
            ? Promise.reject(new ExpiredCodeException(errorConstructorValue))
            : Promise.reject(new CodeMismatchException(errorConstructorValue));
        case "hacked@test.com":
          return Promise.reject(new TooManyRequestsException(errorConstructorValue));
        case "toomanyFails@test.com":
          return Promise.reject(new TooManyFailedAttemptsException(errorConstructorValue));
        default:
          return Promise.reject(new UserNotFoundException(errorConstructorValue));
      }
    } else return Promise.reject();
  };

  authClient.send = jest.fn().mockImplementation(VerifyFunction);

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("GET method test", () => {
    it("204 response", async () => {
      const request = new Request(`http://localhost:3000/api/auth/confirm?${"email=testuser@test.com"}`);
      const { status } = await GET(request);
      expect(status).toBe(204);
    });

    it("400 response", async () => {
      const request = new Request(`http://localhost:3000/api/auth/confirm?${"몰루"}`);
      const { status } = await GET(request);
      expect(status).toBe(400);
    });

    it("404 response", async () => {
      const request = new Request(`http://localhost:3000/api/auth/confirm?${"email=asdf"}`);
      const { status } = await GET(request);
      expect(status).toBe(404);
    });

    it("429 response", async () => {
      const requestOne = new Request(`http://localhost:3000/api/auth/confirm?${"email=hacked@test.com"}`);
      const { status: statusOne } = await GET(requestOne);
      expect(statusOne).toBe(429);

      const requestTwo = new Request(`http://localhost:3000/api/auth/confirm?${"email=toomanyFails@test.com"}`);
      const { status: statusTwo } = await GET(requestTwo);
      expect(statusTwo).toBe(429);
    });
  });

  describe("POST method test", () => {
    it("204 response", async () => {
      const request = new Request(`http://localhost:3000/api/auth/confirm`, {
        method: "POST",
        body: JSON.stringify({
          email: "testuser@test.com",
          verificationCode: "123456",
        }),
      });
      const { status } = await POST(request);
      expect(status).toBe(204);
    });

    it("400 response", async () => {
      const requestOne = new Request(`http://localhost:3000/api/auth/confirm`, {
        method: "POST",
        body: JSON.stringify({
          email: "testuser@test.com",
        }),
      });
      const { status: statusOne } = await POST(requestOne);
      expect(statusOne).toBe(400);

      const requestTwo = new Request(`http://localhost:3000/api/auth/confirm`, {
        method: "POST",
      });
      const { status: statusTwo } = await POST(requestTwo);
      expect(statusTwo).toBe(400);
    });

    it("401 response", async () => {
      const request = new Request(`http://localhost:3000/api/auth/confirm`, {
        method: "POST",
        body: JSON.stringify({
          email: "testuser@test.com",
          verificationCode: "135790",
        }),
      });
      const { status } = await POST(request);
      expect(status).toBe(401);
    });

    it("403 response", async () => {
      const request = new Request(`http://localhost:3000/api/auth/confirm`, {
        method: "POST",
        body: JSON.stringify({
          email: "testuser@test.com",
          verificationCode: "234567",
        }),
      });
      const { status } = await POST(request);
      expect(status).toBe(403);
    });

    it("404 response", async () => {
      const request = new Request(`http://localhost:3000/api/auth/confirm`, {
        method: "POST",
        body: JSON.stringify({
          email: "몰루",
          verificationCode: "123456",
        }),
      });
      const { status } = await POST(request);
      expect(status).toBe(404);
    });

    it("429 response", async () => {
      const requestOne = new Request(`http://localhost:3000/api/auth/confirm`, {
        method: "POST",
        body: JSON.stringify({
          email: "hacked@test.com",
          verificationCode: "123456",
        }),
      });
      const { status: statusOne } = await POST(requestOne);
      expect(statusOne).toBe(429);

      const requestTwo = new Request(`http://localhost:3000/api/auth/confirm`, {
        method: "POST",
        body: JSON.stringify({
          email: "toomanyFails@test.com",
          verificationCode: "123456",
        }),
      });
      const { status: statusTwo } = await POST(requestTwo);
      expect(statusTwo).toBe(429);
    });
  });
});
