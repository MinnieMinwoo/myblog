/**
 * @jest-environment jest-environment-jsdom
 */

import "@testing-library/jest-dom";
import EditSpan from "./EditSpan";
import React from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";

jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useQuery: jest.fn(() => ({
    data: null,
  })),
}));
jest.mock("logics/getCurrentUserToken");

const routerMockFunction = jest.fn(() => {});
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useParams: jest.fn(() => ({
    postid: null,
  })),
  useRouter: jest.fn(() => ({
    push: routerMockFunction,
  })),
}));

const alertMockFunction = jest.fn();
jest.spyOn(window, "alert").mockImplementation(alertMockFunction);
jest.spyOn(window, "confirm").mockImplementation(() => true);

describe("/home/[nickname]/[postid] EditSpan test", () => {
  beforeEach(() => render(<EditSpan createdBy="12345" />));
  afterAll(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("render test", () => {
    const editSpan = screen.getByText("∙ Edit");
    expect(editSpan).toBeInTheDocument();

    const deleteSpan = screen.getByText("∙ Delete");
    expect(deleteSpan).toBeInTheDocument();
  });

  it("edit test", async () => {
    const editSpan = screen.getByText("∙ Edit");
    editSpan.click();
    await waitFor(() => expect(routerMockFunction).toHaveBeenCalledTimes(1));
  });

  it("edit success test", async () => {
    const fetchMockFunction = jest.fn(() => ({
      status: 200,
      ok: true,
      json: () =>
        Promise.resolve({
          id: "test",
        }),
    }));
    (global as any).fetch = fetchMockFunction;

    const deleteSpan = screen.getByText("∙ Delete");
    deleteSpan.click();
    await waitFor(() => expect(routerMockFunction).toHaveBeenCalledTimes(2));
  });

  it("edit fail test", async () => {
    const fetchMockFunction = jest.fn(() => ({
      status: 400,
      ok: true,
      json: () =>
        Promise.resolve({
          id: "test",
        }),
    }));
    (global as any).fetch = fetchMockFunction;

    const deleteSpan = screen.getByText("∙ Delete");
    deleteSpan.click();
    await waitFor(() => expect(alertMockFunction).toHaveBeenCalled());
  });
});
