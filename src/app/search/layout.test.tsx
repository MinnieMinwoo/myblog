/**
 * @jest-environment jest-environment-jsdom
 */

import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import SearchLayout from "./layout";

jest.mock(
  "next/image",
  jest.fn().mockImplementation(() => ({
    __esModule: true,
    default: (props: any) => {
      return <img {...props} />;
    },
  }))
);

jest.mock("components/Footer");

describe("/search layout test", () => {
  beforeEach(() => {});

  beforeAll(() => {
    // eslint-disable-next-line react/no-children-prop
    render(<SearchLayout children={<></>} />);
  });

  afterAll(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("render test", () => {
    const logo = screen.getByAltText("blog logo");
    expect(logo).toBeInTheDocument();

    const logoWrapLink = logo.parentElement as HTMLAnchorElement | null;
    expect(logoWrapLink?.href.split("").at(-1)).toBe("/");

    const searchSpan = screen.getByText("Search");
    expect(searchSpan).toBeInTheDocument();
  });
});
