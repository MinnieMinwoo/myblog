/**
 * @jest-environment jest-environment-jsdom
 */
import "@testing-library/jest-dom";
import { cleanup, render, screen, waitFor } from "@testing-library/react";

const setStateMockFunction = jest.fn(() => {});
import React from "react";
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  onsubmit: jest.fn(() => ({ status: 406 })),
  useState: jest.fn((input: string | boolean) => [input, setStateMockFunction]),
  Suspense: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock("@tanstack/react-query", () => {
  return {
    useQuery: () => ({
      data: { nickname: "testuser" },
      status: "success",
    }),
    QueryClient: {},
  };
});
import AboutView from "./AboutView";
import userEvent from "@testing-library/user-event";

// eslint-disable-next-line react/display-name
jest.mock("./AboutReader", () => () => <p>Hello</p>);

// eslint-disable-next-line react/display-name
jest.mock("./AboutEdit", () => () => <>Edit</>);

// eslint-disable-next-line react/display-name
jest.mock("components/CategorySideBar", () => () => <>About Edit</>);

describe("AboutView", () => {
  const alertMockFunction = jest.fn();
  beforeAll(() => {
    Object.defineProperty(window, "alert", {
      value: alertMockFunction,
    });

    Object.defineProperty(window, "location", {
      configurable: true,
      value: { reload: jest.fn() },
    });
  });

  afterEach(() => cleanup());

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("render test when edit unavailable", () => {
    render(<AboutView about={"TestText"} nickname={"mollu"} />);
    const title = screen.getByText("About");
    expect(title).toBeInTheDocument();

    const detail = screen.getByText("Hello");
    expect(detail).toBeInTheDocument();

    const editButton = screen.queryByText("Edit");
    expect(editButton).not.toBeInTheDocument();
  });

  it("render test when edit available", () => {
    render(<AboutView about={"TestText"} nickname={"testuser"} />);

    const editButton = screen.getByText("Edit");
    expect(editButton).toBeInTheDocument();
  });

  it("render test when edit", () => {
    // change mock logic due to test edit function
    React.useState = jest
      .fn()
      .mockImplementation((input: string | boolean) => [typeof input === "boolean" ? true : input, jest.fn()]);
    render(<AboutView about={"TestText"} nickname={"testuser"} />);

    const completeButton = screen.getByText("Complete");
    expect(completeButton).toBeInTheDocument();

    const EditPart = screen.getByText("About Edit");
    expect(EditPart).toBeInTheDocument();
  });

  it("edit success logic", async () => {
    const fetchMockFunction = jest.fn(() => ({
      status: 201,
      ok: true,
    }));
    (global as any).fetch = fetchMockFunction;

    render(<AboutView about={"TestText"} nickname={"testuser"} />);

    const completeButton = screen.getByText("Complete");
    userEvent.click(completeButton);
    await waitFor(() => expect(alertMockFunction).toBeCalledTimes(1));
  });

  it("edit fail logic", async () => {
    const fetchMockFunction = jest.fn(() => ({
      status: 400,
      ok: false,
    }));
    (global as any).fetch = fetchMockFunction;

    render(<AboutView about={"TestText"} nickname={"testuser"} />);

    const completeButton = screen.getByText("Complete");
    userEvent.click(completeButton);
    await waitFor(() => expect(alertMockFunction).toBeCalledTimes(2));
  });
});
