/**
 * @jest-environment jest-environment-jsdom
 */
import "@testing-library/jest-dom";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import LikeButton from "./LikeButton";
import userEvent from "@testing-library/user-event";

const mutateMockFunction = jest.fn(() => {});
jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useQuery: jest.fn().mockImplementation(({ queryKey }) => ({
    data: queryKey.includes("likes") ? [] : null,
    status: "success",
  })),
  useMutation: jest.fn().mockImplementation(() => ({
    mutate: mutateMockFunction,
  })),
  useQueryClient: () => {},
}));
jest.mock("logics/getCurrentUserToken");

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useParams: jest.fn(() => ({
    postid: "testpost",
  })),
}));

describe("/home/[nickname]/[postid] LikeButton test", () => {
  beforeEach(() => render(<LikeButton />));
  afterAll(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("render test", () => {
    const likeSpan = screen.getByText("♡", { exact: false });
    expect(likeSpan).toBeInTheDocument();
  });

  it("like button click test", async () => {
    const likeSpan = screen.getByText("♡", { exact: false });
    userEvent.click(likeSpan);
    await waitFor(() => expect(mutateMockFunction).toHaveBeenCalled());
  });
});
