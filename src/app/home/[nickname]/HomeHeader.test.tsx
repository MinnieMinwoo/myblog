/**
 * @jest-environment jest-environment-jsdom
 */

import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import HomeHeader from "./HomeHeader";

jest.mock(
  "next/image",
  jest.fn().mockImplementation(() => ({
    __esModule: true,
    default: (props: any) => {
      return <img {...props} />;
    },
  }))
);

jest.mock("./HeaderProfile");
jest.mock("components/HeaderSearch");

describe("/home/[nickname] HomeHeader test", () => {
  beforeEach(() => {
    render(<HomeHeader userName="testuser" />);
  });

  afterAll(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("render test", () => {
    const blogLogo = screen.getByAltText("blog logo");
    expect(blogLogo).toBeInTheDocument();

    const blogName = screen.getByText("testuser's blog");
    expect(blogName).toBeInTheDocument();

    const homeLink = screen.getByText("Home");
    expect(homeLink).toBeInTheDocument();

    const categoryLink = screen.getByText("Category");
    expect(categoryLink).toBeInTheDocument();

    const aboutLink = screen.getByText("About");
    expect(aboutLink).toBeInTheDocument();
  });

  it("href test", () => {
    const homeLink = screen.getByText("Home");
    expect((homeLink as HTMLAnchorElement).href).toContain("/home/testuser");

    const categoryLink = screen.getByText("Category");
    expect((categoryLink as HTMLAnchorElement).href).toContain("/home/testuser/category");

    const aboutLink = screen.getByText("About");
    expect((aboutLink as HTMLAnchorElement).href).toContain("/home/testuser/about");
  });
});
