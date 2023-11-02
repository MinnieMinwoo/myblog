/**
 * @jest-environment node
 */

import {
  AliasExistsException,
  CodeMismatchException,
  ExpiredCodeException,
  TooManyRequestsException,
  UpdateUserAttributesCommand,
  VerifyUserAttributeCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { ErrorMessage } from "enum";
import { authClient } from "logics/aws";
import { POST, PUT } from "./route";

jest.mock("logics/verifyToken", () => (token: string) => {
  switch (token) {
    case "Bearer testuser":
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

describe("/api/auth/email test", () => {
  const userUpdateFunction = (input: VerifyUserAttributeCommand | UpdateUserAttributesCommand) => {
    const errorConstructorValue = {
      $metadata: {},
      message: "",
    };

    if (input instanceof VerifyUserAttributeCommand) {
      const {
        input: { AccessToken, Code },
      } = input;

      return AccessToken === "TooManyRequest"
        ? Promise.reject(new TooManyRequestsException(errorConstructorValue))
        : Code === "12345"
        ? Promise.resolve()
        : Code === "23456"
        ? Promise.reject(new ExpiredCodeException(errorConstructorValue))
        : Promise.reject(new CodeMismatchException(errorConstructorValue));
    } else {
      const {
        input: { AccessToken, UserAttributes },
      } = input;
      if (AccessToken === "TooManyRequest") return Promise.reject(new TooManyRequestsException(errorConstructorValue));
      if (!UserAttributes) return Promise.reject();
      const [{ Value }] = UserAttributes;
      return Value === "existmail@test.com"
        ? Promise.reject(new AliasExistsException(errorConstructorValue))
        : Promise.resolve();
    }
  };
  authClient.send = jest.fn().mockImplementation(userUpdateFunction);

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe("POST method test", () => {
    it("201 response", async () => {
      const request = new Request(`http://localhost:3000/api/auth/email`, {
        method: "POST",
        headers: {
          Authorization: "Bearer testuser",
        },
        body: JSON.stringify({
          code: "12345",
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
      const requestOne = new Request(`http://localhost:3000/api/auth/email`, {
        method: "POST",
        headers: {
          Authorization: "mollu",
        },
        body: JSON.stringify({
          code: "12345",
        }),
      });
      const resultOne = await POST(requestOne);
      expect(resultOne.status).toBe(400);
      const { error: errorOne } = await resultOne.json();
      expect(errorOne).toBe("Wrong token data");

      const requestTwo = new Request(`http://localhost:3000/api/auth/email`, {
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
    });

    it("401 response", async () => {
      const requestOne = new Request(`http://localhost:3000/api/auth/email`, {
        method: "POST",
        headers: {
          Authorization: "Invalid",
        },
        body: JSON.stringify({
          code: "12345",
        }),
      });
      const resultOne = await POST(requestOne);
      expect(resultOne.status).toBe(401);
      const { error: errorOne } = await resultOne.json();
      expect(errorOne).toBe("Invalid token type");

      const requestTwo = new Request(`http://localhost:3000/api/auth/email`, {
        method: "POST",
        headers: {
          Authorization: "Contaminated",
        },
        body: JSON.stringify({
          code: "12345",
        }),
      });
      const resultTwo = await POST(requestTwo);
      expect(resultTwo.status).toBe(401);
      const { error: errorTwo } = await resultTwo.json();
      expect(errorTwo).toBe("Get contaminated token");

      const requestThree = new Request(`http://localhost:3000/api/auth/email`, {
        method: "POST",
        headers: {
          Authorization: "Bearer testuser",
        },
        body: JSON.stringify({
          code: "123456789",
        }),
      });
      const resultThree = await POST(requestThree);
      expect(resultThree.status).toBe(401);
      const { error: errorThree } = await resultThree.json();
      expect(errorThree).toBe("Verification code does not correct");
    });

    it("403 response", async () => {
      const request = new Request(`http://localhost:3000/api/auth/email`, {
        method: "POST",
        headers: {
          Authorization: "Bearer testuser",
        },
        body: JSON.stringify({
          code: "23456",
        }),
      });
      const { status } = await POST(request);
      expect(status).toBe(403);
    });

    it("429 response", async () => {
      const request = new Request(`http://localhost:3000/api/auth/email`, {
        method: "POST",
        headers: {
          Authorization: "Bearer TooManyRequest",
        },
        body: JSON.stringify({
          code: "12345",
        }),
      });
      const { status } = await POST(request);
      expect(status).toBe(429);
    });
  });

  describe("PUT method test", () => {
    it("201 response", async () => {
      const request = new Request(`http://localhost:3000/api/auth/email`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer testuser",
        },
        body: JSON.stringify({
          email: "newemail@test.com",
        }),
      });
      const result = await PUT(request);
      expect(result.status).toBe(201);
      const body = await result.json();
      expect(body).toEqual({
        id: "testuser",
        email: "newemail@test.com",
      });
    });

    it("400 response", async () => {
      const requestOne = new Request(`http://localhost:3000/api/auth/email`, {
        method: "PUT",
        headers: {
          Authorization: "mollu",
        },
        body: JSON.stringify({
          email: "newemail@test.com",
        }),
      });
      const resultOne = await PUT(requestOne);
      expect(resultOne.status).toBe(400);
      const { error: errorOne } = await resultOne.json();
      expect(errorOne).toBe("Wrong token data");

      const requestTwo = new Request(`http://localhost:3000/api/auth/email`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer testuser",
        },
        body: JSON.stringify({}),
      });
      const resultTwo = await PUT(requestTwo);
      expect(resultTwo.status).toBe(400);
      const { error: errorTwo } = await resultTwo.json();
      expect(errorTwo).toBe("Invalid fetch data");
    });

    it("401 response", async () => {
      const requestOne = new Request(`http://localhost:3000/api/auth/email`, {
        method: "PUT",
        headers: {
          Authorization: "Invalid",
        },
        body: JSON.stringify({
          email: "newemail@test.com",
        }),
      });
      const resultOne = await PUT(requestOne);
      expect(resultOne.status).toBe(401);
      const { error: errorOne } = await resultOne.json();
      expect(errorOne).toBe("Invalid token type");

      const requestTwo = new Request(`http://localhost:3000/api/auth/email`, {
        method: "PUT",
        headers: {
          Authorization: "Contaminated",
        },
        body: JSON.stringify({
          email: "newemail@test.com",
        }),
      });
      const resultTwo = await PUT(requestTwo);
      expect(resultTwo.status).toBe(401);
      const { error: errorTwo } = await resultTwo.json();
      expect(errorTwo).toBe("Get contaminated token");
    });

    it("403 response", async () => {
      const request = new Request(`http://localhost:3000/api/auth/email`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer testuser",
        },
        body: JSON.stringify({
          email: "existmail@test.com",
        }),
      });
      const { status } = await PUT(request);
      expect(status).toBe(403);
    });

    it("429 response", async () => {
      const request = new Request(`http://localhost:3000/api/auth/email`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer TooManyRequest",
        },
        body: JSON.stringify({
          email: "newemail@test.com",
        }),
      });
      const { status } = await PUT(request);
      expect(status).toBe(429);
    });
  });
});
