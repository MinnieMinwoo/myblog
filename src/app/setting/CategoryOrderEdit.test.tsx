/**
 * @jest-environment jest-environment-jsdom
 */

import "@testing-library/jest-dom";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoryOrderEdit from "./CategoryOrderEdit";
import React from "react";

jest.mock("@tanstack/react-query", () => {
  return {
    useQuery: () => ({
      data: {},
      status: "success",
    }),
    useMutation: () => ({
      mutate: jest.fn(),
    }),
    QueryClient: jest.fn().mockImplementation(() => {
      return {
        cancelQueries: jest.fn(),
        setQueryData: jest.fn(),
        invalidateQueries: jest.fn(),
      };
    }),
  };
});

const setStateMockFunction = jest.fn(() => {});
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(() => [false, setStateMockFunction]),
}));

describe("/setting CategoryOrderEdit test", () => {
  beforeEach(() => {
    render(<CategoryOrderEdit />);
  });

  afterAll(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("render test", () => {
    const title = screen.getByText("Category order");
    expect(title).toBeInTheDocument();

    const editButton = screen.getByText("Edit");
    expect(editButton).toBeInTheDocument();

    const describeSpan = screen.getByText("Adjust the order of categories shown.");
    expect(describeSpan).toBeInTheDocument();
  });

  it("state change test", async () => {
    const editButton = screen.getByText("Edit");
    userEvent.click(editButton);

    await waitFor(() => {
      expect(setStateMockFunction).toBeCalled();
    });
  });
});
