/**
 * @jest-environment jest-environment-jsdom
 */

import "@testing-library/jest-dom";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import ProfileInfoEdit from "./ProfileInfoEdit";

const setStateMockFunction = jest.fn(() => {});

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn((init: any) => [init, setStateMockFunction]),
}));

const updateMockFunction = jest.fn();
jest.mock("@tanstack/react-query", () => {
  return {
    useQuery: () => ({
      data: { id: "test" },
      status: "success",
    }),
    useMutation: () => ({
      mutate: updateMockFunction,
    }),
    useQueryClient: jest.fn().mockImplementation(() => {
      return {
        cancelQueries: jest.fn(),
        setQueryData: jest.fn(),
        invalidateQueries: jest.fn(),
      };
    }),
  };
});

describe("/setting ProfileImageEdit test", () => {
  beforeAll(() => {
    Object.defineProperty(window, "structuredClone", {
      value: (object: any) => ({ ...object }),
    });
  });

  beforeEach(() => {
    render(<ProfileInfoEdit />);
  });

  afterAll(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("render test", () => {
    const editButton = screen.getByText("Edit");
    expect(editButton).toBeInTheDocument();

    const nicknameInput = screen.getByPlaceholderText(
      "Nicknames must be written in 4-20 digits using only English, numbers, and special characters."
    );
    expect(nicknameInput).toBeInTheDocument();

    const saveButton = screen.getByText("Save");
    expect(saveButton).toBeInTheDocument();
  });

  it("edit button test", async () => {
    const editButton = screen.getByText("Edit");
    userEvent.click(editButton);

    await waitFor(() => {
      expect(setStateMockFunction).toBeCalled();
    });
  });

  it("input state change test", async () => {
    const nicknameInput = screen.getByPlaceholderText(
      "Nicknames must be written in 4-20 digits using only English, numbers, and special characters."
    );
    userEvent.type(nicknameInput, "a");

    await waitFor(() => {
      expect(setStateMockFunction).toBeCalledWith("a");
    });
  });
});
