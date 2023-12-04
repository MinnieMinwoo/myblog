/**
 * @jest-environment jest-environment-jsdom
 */

import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import HomePage from "./page";

jest.mock("@tanstack/react-query", () => {
  return {
    useQuery: () => ({
      data: {
        id: "12345",
        nickname: "testuser",
      },
      status: "success",
    }),
    useInfiniteQuery: () => {
      return {
        data: {
          pages: [
            {
              postCount: 2,
            },
          ],
        },
        hasNextPage: false,
        isFetching: false,
        isFetchingNextPage: false,
        status: "success",
      };
    },
  };
});

let nickname = "";
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useParams: jest.fn(() => ({
    nickname: nickname,
  })),
}));

jest.mock("components/PostPagination");
jest.mock("../../../components/CategorySideBar");
jest.mock("components/PostThumbnailBox");
jest.mock("logics/getCurrentUserToken");

describe("/home/[nickname] page test", () => {
  afterAll(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("render test when user is not owner", () => {
    nickname = "asdf";
    render(<HomePage />);

    const title = screen.getByText("Posts");
    expect(title).toBeInTheDocument();
    const count = screen.getByText("(2)");
    expect(count).toBeInTheDocument();

    const writeButton = screen.queryByText("Write");
    expect(writeButton).not.toBeInTheDocument();
  });

  it("render test when user is owner", () => {
    nickname = "testuser";
    render(<HomePage />);

    const title = screen.getByText("Posts");
    expect(title).toBeInTheDocument();
    const count = screen.getByText("(2)");
    expect(count).toBeInTheDocument();

    const writeButton = screen.getByText("Write");
    expect(writeButton).toBeInTheDocument();
  });

  it("href test", () => {
    nickname = "testuser";
    render(<HomePage />);
    const writeButton = screen.getByText("Write");
    expect((writeButton as HTMLAnchorElement).href).toContain("/write");
  });
});
