/**
 * @jest-environment jest-environment-jsdom
 */

import "@testing-library/jest-dom";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VerificationPage from "./page";
import React from "react";

const routerMockFunction = jest.fn();
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useRouter: jest.fn().mockImplementation(() => ({
    push: routerMockFunction,
  })),
}));

const setStateMockFunction = jest.fn();
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  onsubmit: jest.fn(() => ({ status: 406 })),
  useState: jest.fn(() => ["123", setStateMockFunction]),
  useEffect: jest.fn(),
}));

const alertMockFunction = jest.fn();
jest.spyOn(window, "alert").mockImplementation(alertMockFunction);

describe("/auth/verification page test", () => {
  beforeEach(() => render(<VerificationPage />));
  afterAll(() => {
    cleanup();
    jest.resetAllMocks();
    jest.restoreAllMocks(); // restore spy function
  });

  it("verification code label render", () => {
    const verifyLabel = screen.getByLabelText("Enter verification code");
    expect(verifyLabel).toBeInTheDocument();
  });

  it("Verify button render", () => {
    const button = screen.getByText("Verify");
    expect(button).toBeInTheDocument();
  });

  it("resend button render", () => {
    const button = screen.getByText("Resend code");
    expect(button).toBeInTheDocument();
  });

  it("back button render", () => {
    const button = screen.getByText("Back");
    expect(button).toBeInTheDocument();
  });

  it("onchange logic", async () => {
    const verifyLabel = screen.getByLabelText("Enter verification code");
    userEvent.type(verifyLabel, "1");
    await waitFor(() => expect(setStateMockFunction).toBeCalledTimes(1));
  });

  it("submit success logic", async () => {
    const fetchMockFunction = jest.fn(() => ({
      status: 204,
      ok: true,
    }));
    (global as any).fetch = fetchMockFunction;

    const button = screen.getByText("Verify");
    userEvent.click(button);
    await waitFor(() => expect(routerMockFunction).toBeCalled());
    await waitFor(() => expect(alertMockFunction).toBeCalledTimes(1));
  });

  it("submit error logic", async () => {
    const fetchMockFunction = jest.fn(() => ({
      status: 401,
    }));
    (global as any).fetch = fetchMockFunction;

    const button = screen.getByText("Verify");
    userEvent.click(button);
    await waitFor(() => expect(alertMockFunction).toBeCalledTimes(2));
  });

  it("resend success logic", async () => {
    const fetchMockFunction = jest.fn(() => ({
      status: 204,
      ok: true,
    }));
    (global as any).fetch = fetchMockFunction;

    const button = screen.getByText("Resend code");
    userEvent.click(button);
    await waitFor(() => expect(alertMockFunction).toBeCalledTimes(3));
  });

  it("resend error logic", async () => {
    const fetchMockFunction = jest.fn(() => ({
      status: 500,
    }));
    (global as any).fetch = fetchMockFunction;

    const button = screen.getByText("Resend code");
    userEvent.click(button);
    await waitFor(() => expect(alertMockFunction).toBeCalledTimes(4));
  });
});
