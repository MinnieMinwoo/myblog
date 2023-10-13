/**
 * @jest-environment node
 */

import {
  ChangePasswordCommand,
  InvalidPasswordException,
  LimitExceededException,
  TooManyRequestsException,
} from "@aws-sdk/client-cognito-identity-provider";
import { ErrorMessage } from "enum";
import { authClient } from "logics/aws";
import { POST } from "./route";

jest.mock("logics/verifyToken", () => (token: string) => {
  switch (token) {
    case "Bearer testuser":
      return Promise.resolve("testuser");
    case "Bearer LimitExceed":
      return Promise.resolve("testuser");
    case "Bearer TooManyRequest":
      return Promise.resolve("testuser");
    case "Invalid":
      return Promise.reject(new Error(ErrorMessage.INVALID_TOKEN_TYPE));
    case "Contaminated":
      return Promise.reject(new Error(ErrorMessage.CONTAMINATED_TOKEN));
    default:
      return Promise.reject(new Error(ErrorMessage.INVALID_TOKEN_DATA));
  }
});

describe("/api/auth/password test", () => {
  const passwordChangeFunction = (input: ChangePasswordCommand) => {
    const errorConstructorValue = {
      $metadata: {},
      message: "",
    };

    const {
      input: { PreviousPassword, ProposedPassword, AccessToken },
    } = input;

    if (AccessToken === "LimitExceed") return Promise.reject(new LimitExceededException(errorConstructorValue));
    else if (AccessToken === "TooManyRequest")
      return Promise.reject(new TooManyRequestsException(errorConstructorValue));
    else if (PreviousPassword !== "12345" || ProposedPassword !== "23456")
      return Promise.reject(new InvalidPasswordException(errorConstructorValue));
    else return Promise.resolve();
  };

  authClient.send = jest.fn().mockImplementation(passwordChangeFunction);

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe("POST method test", () => {
    it("201 response", async () => {
      const request = new Request(`http://localhost:3000/api/auth/password`, {
        method: "POST",
        headers: {
          Authorization: "Bearer testuser",
        },
        body: JSON.stringify({
          beforePassword: "12345",
          newPassword: "23456",
        }),
      });
      const result = await POST(request);
      expect(result.status).toBe(201);
      const body = await result.json();
      expect(body).toEqual({
        id: "testuser",
      });
    });

    it("400 response", async () => {
      const requestOne = new Request(`http://localhost:3000/api/auth/password`, {
        method: "POST",
        headers: {
          Authorization: "mollu",
        },
        body: JSON.stringify({
          beforePassword: "12345",
          newPassword: "23456",
        }),
      });
      const resultOne = await POST(requestOne);
      expect(resultOne.status).toBe(400);
      const { error: errorOne } = await resultOne.json();
      expect(errorOne).toBe("Wrong token data");

      const requestTwo = new Request(`http://localhost:3000/api/auth/password`, {
        method: "POST",
        headers: {
          Authorization: "Bearer testuser",
        },
        body: JSON.stringify({}),
      });
      const resultTwo = await POST(requestTwo);
      expect(resultTwo.status).toBe(400);
      const { error: errorTwo } = await resultTwo.json();
      expect(errorTwo).toBe("Invalid fetch data");

      const requestThree = new Request(`http://localhost:3000/api/auth/password`, {
        method: "POST",
        headers: {
          Authorization: "Bearer testuser",
        },
        body: JSON.stringify({
          beforePassword: "23456",
          newPassword: "34567",
        }),
      });
      const resultThree = await POST(requestThree);
      expect(resultThree.status).toBe(400);
      const { error: errorThree } = await resultThree.json();
      expect(errorThree).toBe("Invalid fetch data");
    });

    it("401 response", async () => {
      const requestOne = new Request(`http://localhost:3000/api/auth/password`, {
        method: "POST",
        headers: {
          Authorization: "Invalid",
        },
        body: JSON.stringify({
          beforePassword: "12345",
          newPassword: "23456",
        }),
      });
      const resultOne = await POST(requestOne);
      expect(resultOne.status).toBe(401);
      const { error: errorOne } = await resultOne.json();
      expect(errorOne).toBe("Invalid token type");

      const requestTwo = new Request(`http://localhost:3000/api/auth/password`, {
        method: "POST",
        headers: {
          Authorization: "Contaminated",
        },
        body: JSON.stringify({
          beforePassword: "12345",
          newPassword: "23456",
        }),
      });
      const resultTwo = await POST(requestTwo);
      expect(resultTwo.status).toBe(401);
      const { error: errorTwo } = await resultTwo.json();
      expect(errorTwo).toBe("Get contaminated token");
    });

    it("429 response", async () => {
      const requestOne = new Request(`http://localhost:3000/api/auth/password`, {
        method: "POST",
        headers: {
          Authorization: "Bearer TooManyRequest",
        },
        body: JSON.stringify({
          beforePassword: "12345",
          newPassword: "23456",
        }),
      });
      const { status: statusOne } = await POST(requestOne);
      expect(statusOne).toBe(429);

      const requestTwo = new Request(`http://localhost:3000/api/auth/password`, {
        method: "POST",
        headers: {
          Authorization: "Bearer LimitExceed",
        },
        body: JSON.stringify({
          beforePassword: "12345",
          newPassword: "23456",
        }),
      });
      const { status: statusTwo } = await POST(requestTwo);
      expect(statusTwo).toBe(429);
    });
  });
});
