/**
 * @jest-environment jest-environment-jsdom
 */

import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import Home from "./page";

jest.mock("./StartButton");
jest.mock("components/HeaderSearch");
jest.mock("components/Footer");
jest.mock(
  "next/image",
  jest.fn().mockImplementation(() => ({
    __esModule: true,
    default: (props: any) => {
      return <img {...props} />;
    },
  }))
);

describe("/ page test", () => {
  beforeEach(() => {
    render(<Home />);
  });

  afterAll(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("icon render", async () => {
    const icon = screen.getByAltText("blog logo");
    expect(icon).toBeInTheDocument();
  });

  it("title render", async () => {
    const title = screen.getByText("Publish your stroy, your way");
    expect(title).toBeInTheDocument();
  });

  it("description render", async () => {
    const description = screen.getByText("Create a unique and beautiful blog.");
    expect(description).toBeInTheDocument();
  });
});
