/**
 * @jest-environment jest-environment-jsdom
 */

import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import SignUpPage from "./page";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: (props: any) => {
    return <a {...props} />;
  },
}));

describe("/auth/signin page test", () => {
  beforeEach(() => render(<SignUpPage />));
  afterAll(() => cleanup());

  it("google login render", () => {
    const image = screen.getByAltText("Google");
    expect(image).toBeInTheDocument();
  });

  it("facebook login render", () => {
    const image = screen.getByAltText("Facebook");
    expect(image).toBeInTheDocument();
  });

  it("email login render", () => {
    const image = screen.getByAltText("Email");
    expect(image).toBeInTheDocument();
  });

  it("login method href check", () => {
    const [googleLink, facebookLink, emailLink]: HTMLAnchorElement[] = screen.getAllByRole("link");
    expect(googleLink.href.includes("/auth/signup/google")).toBe(true);
    expect(facebookLink.href.includes("/auth/signup/facebook")).toBe(true);
    expect(emailLink.href.includes("/auth/signup/email")).toBe(true);
  });

  it("sign in button render", () => {
    const button: HTMLAnchorElement = screen.getByText("Sign in");
    expect(button).toBeInTheDocument();
    expect(button.href.includes("/auth/signin")).toBe(true);
  });
});
