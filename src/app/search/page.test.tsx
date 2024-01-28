/**
 * @jest-environment jest-environment-jsdom
 */

import "@testing-library/jest-dom";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import Search from "./page";
import userEvent from "@testing-library/user-event";

jest.mock("@tanstack/react-query", () => {
  return {
    useInfiniteQuery: () => {
      return {
        data: {
          pages: [],
        },
        hasNextPage: false,
        isFetching: false,
        isFetchingNextPage: false,
        status: "success",
      };
    },
  };
});

let searchParamsFunction: (input: string) => string | null;
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useSearchParams: jest.fn(() => ({
    get: searchParamsFunction,
  })),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  usePathname: () => "",
  searchParams: () => ({
    query: "asdf",
    user: "testuser",
  }),
}));

const setStateMockFunction = jest.fn(() => {});
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(() => ["test", setStateMockFunction]),
}));

jest.spyOn(URLSearchParams.prototype, "set");

describe("/search page test", () => {
  beforeEach(() => {});

  afterAll(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("render test when search all posts", () => {
    searchParamsFunction = (input: string) => (input === "query" ? "test" : null);
    render(<Search />);

    const queryForm = screen.getByLabelText("Search all posts");
    expect(queryForm).toBeInTheDocument();

    const noPostResult = screen.getByText("No posts.");
    expect(noPostResult).toBeInTheDocument();
  });

  it("render test when search user's posts ", () => {
    searchParamsFunction = (input: string) => (input === "query" ? "test" : input === "user" ? "testuser" : null);
    render(<Search />);

    const queryForm = screen.getByLabelText("Search testuser's posts");
    expect(queryForm).toBeInTheDocument();

    const noPostResult = screen.getByText("No posts.");
    expect(noPostResult).toBeInTheDocument();
  });

  it("form input test", async () => {
    searchParamsFunction = (input: string) => (input === "query" ? "test" : null);
    render(<Search />);

    const queryForm = screen.getByLabelText("Search all posts");
    userEvent.type(queryForm, "123");
    await waitFor(() => expect(setStateMockFunction).toBeCalled());
    await waitFor(() => expect(URLSearchParams.prototype.set).toBeCalled());
  });
});
