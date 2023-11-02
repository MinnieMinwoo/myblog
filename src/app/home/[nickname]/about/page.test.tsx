/**
 * @jest-environment jest-environment-jsdom
 */

import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import AboutPage from "./page";

// eslint-disable-next-line react/display-name
jest.mock("./AboutView", () => ({ about, nickname }: { about: string; nickname: string }) => {
  return (
    <>
      <p>{about}</p>
      <p>{nickname}</p>
    </>
  );
});

describe("/home/about page test", () => {
  beforeAll(() => {
    const fetchMockFunction = jest.fn((url: string) => {
      return url.includes("testuser")
        ? {
            json: () =>
              Promise.resolve({
                about: "testtext",
              }),
          }
        : {
            json: () =>
              Promise.resolve({
                id: "test",
              }),
          };
    });
    (global as any).fetch = fetchMockFunction;
  });

  afterEach(() => cleanup());

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("render test", async () => {
    render(await AboutPage({ params: { nickname: "testuser" } }));

    expect(screen.getByText("testtext")).toBeInTheDocument();
    expect(screen.getByText("testuser")).toBeInTheDocument();
  });
});
