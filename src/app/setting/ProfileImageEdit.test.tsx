/**
 * @jest-environment jest-environment-jsdom
 */

import "@testing-library/jest-dom";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import ProfileImageEdit from "./ProfileImageEdit";
import userEvent from "@testing-library/user-event";
import React from "react";

const updateMockFunction = jest.fn();

jest.mock("@tanstack/react-query", () => {
  return {
    useQuery: () => ({
      data: {},
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
    render(<ProfileImageEdit />);
  });

  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("render test", () => {
    const profileImage = screen.getByAltText("Profile");
    expect(profileImage).toBeInTheDocument();

    const uploadButton = screen.getByText("Upload Image");
    expect(uploadButton).toBeInTheDocument();

    const deleteButton = screen.getByText("Delete Image");
    expect(deleteButton).toBeInTheDocument();
  });

  it("image delete test", async () => {
    const deleteButton = screen.getByText("Delete Image");
    userEvent.click(deleteButton);

    await waitFor(() => {
      expect(updateMockFunction).toHaveBeenCalled();
    });
  });
});
