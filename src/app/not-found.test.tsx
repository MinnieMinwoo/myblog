/**
 * @jest-environment jest-environment-jsdom
 */

import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import NotFound from "./not-found";

jest.mock(
  "next/image",
  jest.fn().mockImplementation(() => ({
    __esModule: true,
    default: (props: any) => {
      return <img {...props} />;
    },
  }))
);

describe("/ NotFound test", () => {
  beforeEach(() => {
    render(<NotFound />);
  });

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("render test", () => {
    const image = screen.getByAltText("Not found");
    expect(image).toBeInTheDocument();

    const title = screen.getByText("Page Not Found");
    expect(title).toBeInTheDocument();

    const button = screen.getByText("Go Home");
    expect(button).toBeInTheDocument();
  });

  it("href test", () => {
    const { href }: HTMLAnchorElement = screen.getByText("Go Home");
    expect(href).toBe("http://localhost/");
  });
});
