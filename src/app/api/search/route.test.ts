/**
 * @jest-environment node
 */

import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dbClient } from "logics/aws";
import { GET } from "./route";

describe("/search test", () => {
  const postFunction = async (input: ScanCommand) => {
    const {
      input: { ExpressionAttributeValues, ExclusiveStartKey },
    } = input;
    if (!ExpressionAttributeValues) return Promise.reject();

    const { ":query": query, ":createdNickname": user } = ExpressionAttributeValues;
    const { createdAt, createdBy } = ExclusiveStartKey ?? { createdAt: undefined, createdBy: undefined };

    return query === "test"
      ? user === "testuser" && createdAt === "12345678" && createdBy === "testuser"
        ? { Items: [{ title: "test3", createdAt: "23456789", createdBy: "testuser" }], LastEvaluatedKey: undefined }
        : user === "testuser"
        ? {
            Items: [
              { title: "test2", createdAt: "12345678", createdBy: "testuser" },
              { title: "test3", createdAt: "23456789", createdBy: "testuser" },
            ],
            LastEvaluatedKey: undefined,
          }
        : {
            Items: [
              { title: "test1", createdAt: "11111111", createdBy: "mollu" },
              { title: "test2", createdAt: "12345678", createdBy: "testuser" },
            ],
            LastEvaluatedKey: { createdAt: "12345678", createdBy: "testuser" },
          }
      : { Items: [], LastEvaluatedKey: undefined };
  };

  dbClient.send = jest.fn().mockImplementation(postFunction);

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe("GET method test", () => {
    it("200 response", async () => {
      const requestOne = new Request(`http://localhost:3000/api/search?query=test`, {
        method: "GET",
      });
      const resultOne = await GET(requestOne);
      expect(resultOne.status).toBe(200);
      const bodyOne = await resultOne.json();
      expect(bodyOne).toEqual({
        postList: [
          { title: "test1", createdAt: "11111111", createdBy: "mollu" },
          { title: "test2", createdAt: "12345678", createdBy: "testuser" },
        ],
        LastEvaluatedKey: { createdAt: "12345678", createdBy: "testuser" },
      });

      const requestTwo = new Request(`http://localhost:3000/api/search?query=test&user=testuser`, {
        method: "GET",
      });
      const resultTwo = await GET(requestTwo);
      expect(resultTwo.status).toBe(200);
      const bodyTwo = await resultTwo.json();
      expect(bodyTwo).toEqual({
        postList: [
          { title: "test2", createdAt: "12345678", createdBy: "testuser" },
          { title: "test3", createdAt: "23456789", createdBy: "testuser" },
        ],
        LastEvaluatedKey: undefined,
      });

      const requestThree = new Request(
        `http://localhost:3000/api/search?query=test&user=testuser&createdAt=12345678&createdBy=testuser`,
        {
          method: "GET",
        }
      );
      const resultThree = await GET(requestThree);
      expect(resultThree.status).toBe(200);
      const bodyThree = await resultThree.json();
      expect(bodyThree).toEqual({
        postList: [{ title: "test3", createdAt: "23456789", createdBy: "testuser" }],
        LastEvaluatedKey: undefined,
      });
    });

    it("400 response", async () => {
      const requestOne = new Request(`http://localhost:3000/api/search`, {
        method: "GET",
      });
      const { status } = await GET(requestOne);
      expect(status).toBe(400);
    });
  });
});
