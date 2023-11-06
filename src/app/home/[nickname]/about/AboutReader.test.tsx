/**
 * @jest-environment jest-environment-jsdom
 */

import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import AboutReader from "./AboutReader";

// this brings error if not mocking
jest.mock("hast-util-sanitize", () => ({
  __esModule: true,
  hastUtilSanitize: {},
  defaultSchema: { attributes: {} },
}));

jest.mock("react-markdown", () => ({
  __esModule: true,
  commands: {},
  default: ({ children }: { children: React.ReactNode }) => {
    return (
      <>
        <p>{children}</p>
      </>
    );
  },
}));

jest.mock("../[postid]/SyntaxHIghlightProvider", () => <></>);

describe("/home/[nickname]/about AboutReader test", () => {
  beforeEach(() => {});

  afterAll(() => {
    cleanup();
  });

  it("prop test", () => {
    render(<AboutReader about={"test1"} />);
    const testTextOne = screen.getByText("test1");
    expect(testTextOne).toBeInTheDocument();

    render(<AboutReader about={"test2"} />);
    const testTextTwo = screen.getByText("test2");
    expect(testTextTwo).toBeInTheDocument();
  });
});
