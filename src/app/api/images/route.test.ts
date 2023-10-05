/**
 * @jest-environment node
 */

import { ResourceNotFoundException } from "@aws-sdk/client-cognito-identity-provider";
import { ErrorMessage } from "enum";
import { storageClient } from "logics/aws";
import { POST } from "./route";

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

describe("/images test", () => {
  storageClient.send = jest.fn();

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("POST method test", () => {
    const formData = new FormData();
    formData.append("image", new File([JSON.stringify({ test: "test" }, null, 2)], "dummyImage"));

    it("201 response", async () => {
      const request = new Request(`http://localhost:3000/api/images`, {
        method: "POST",
        headers: {
          Authorization: "Bearer testuser",
        },
        body: formData,
      });
      const result = await POST(request);
      expect(result.status).toBe(201);
      const { imageURL } = await result.json();
      expect(imageURL.includes(process.env.NEXT_PUBLIC_S3_DOMAIN) && imageURL.includes("dummyImage")).toBe(true);
    });

    it("400 response", async () => {
      const requestOne = new Request(`http://localhost:3000/api/images`, {
        method: "POST",
        headers: {
          Authorization: "Bearer testuser",
        },
        body: new FormData(),
      });
      const { status: statusOne } = await POST(requestOne);
      expect(statusOne).toBe(400);

      const requestTwo = new Request(`http://localhost:3000/api/images`, {
        method: "POST",
        headers: {
          Authorization: "Bearer",
        },
        body: formData,
      });
      const { status: statusTwo } = await POST(requestTwo);
      expect(statusTwo).toBe(400);
    });

    it("401 response", async () => {
      const requestOne = new Request(`http://localhost:3000/api/images`, {
        method: "POST",
        headers: {
          Authorization: "Invalid",
        },
        body: formData,
      });
      const { status: statusOne } = await POST(requestOne);
      expect(statusOne).toBe(401);

      const requestTwo = new Request(`http://localhost:3000/api/images`, {
        method: "POST",
        headers: {
          Authorization: "Contaminated",
        },
        body: formData,
      });
      const { status: statusTwo } = await POST(requestTwo);
      expect(statusTwo).toBe(401);
    });
  });
});
