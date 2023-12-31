/**
 * @jest-environment jest-environment-jsdom
 */

import "@testing-library/jest-dom";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthWithEmail from "./page";
import React from "react";
const routerMockFunction = jest.fn(() => {});
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useRouter: jest.fn().mockImplementation(() => ({
    push: routerMockFunction,
  })),
}));

const setStateMockFunction = jest.fn(() => {});
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  onsubmit: jest.fn(() => ({ status: 406 })),
  useState: jest.fn(() => ["123", setStateMockFunction]),
}));

describe("/auth/signin page test", () => {
  beforeEach(() => render(<AuthWithEmail />));
  afterAll(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("email render", () => {
    const emailLabel = screen.getByLabelText("Email address");
    expect(emailLabel).toBeInTheDocument();
    const emailInput = screen.getByPlaceholderText("email");
    expect(emailInput).toBeInTheDocument();
  });

  it("password render", () => {
    const passwordLabel = screen.getByLabelText("Password");
    expect(passwordLabel).toBeInTheDocument();
    const passwordInput = screen.getByPlaceholderText("password");
    expect(passwordInput).toBeInTheDocument();
  });

  it("nickname render", () => {
    const nicknameLabel = screen.getByLabelText("Nickname");
    expect(nicknameLabel).toBeInTheDocument();
    const nicknameInput = screen.getByPlaceholderText("password");
    expect(nicknameInput).toBeInTheDocument();
  });

  it("sign up button render", () => {
    const button = screen.getByText("Create Account");
    expect(button).toBeInTheDocument();
  });

  it("sign in button render", () => {
    const button = screen.getByText("Do you have an account?");
    expect(button).toBeInTheDocument();
  });

  it("back button render", () => {
    const button = screen.getByText("Back");
    expect(button).toBeInTheDocument();
  });

  it("onchange logic", async () => {
    const emailLabel = screen.getByLabelText("Email address");
    userEvent.type(emailLabel, "1");
    await waitFor(() => expect(setStateMockFunction).toBeCalledTimes(1));

    const passwordLabel = screen.getByLabelText("Password");
    userEvent.type(passwordLabel, "1");
    await waitFor(() => expect(setStateMockFunction).toBeCalledTimes(2));

    const nicknameLabel = screen.getByLabelText("Nickname");
    userEvent.type(nicknameLabel, "1");
    await waitFor(() => expect(setStateMockFunction).toBeCalledTimes(3));
  });

  it("submit success logic", async () => {
    const fetchMockFunction = jest.fn(() => ({
      status: 200,
      ok: true,
      json: () =>
        Promise.resolve({
          nickname: "test",
          idToken: "test",
          accessToken: "test",
          refreshToken: "test",
        }),
    }));
    (global as any).fetch = fetchMockFunction;

    const button = screen.getByText("Create Account");
    userEvent.click(button);
    await waitFor(() => expect(routerMockFunction).toBeCalled());
  });

  it("submit error logic", async () => {
    const errorMockFunction = jest.fn();
    jest.spyOn(window, "alert").mockImplementationOnce(errorMockFunction);
    const fetchMockFunction = jest.fn(() => ({
      status: 403,
    }));
    (global as any).fetch = fetchMockFunction;
    const button = screen.getByText("Create Account");
    userEvent.click(button);
    await waitFor(() => expect(errorMockFunction).toBeCalled());
  });
});
