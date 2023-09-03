/**
 * @jest-environment jest-environment-jsdom
 */

import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import SignInPage from "./page";

describe("/auth/signin page test", () => {
  beforeEach(() => render(<SignInPage />));
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

  it("sign up method href check", () => {
    const [googleLink, facebookLink, emailLink]: HTMLAnchorElement[] = screen.getAllByRole("link");
    expect(googleLink.href.includes("/auth/signin/google")).toBe(true);
    expect(facebookLink.href.includes("/auth/signin/facebook")).toBe(true);
    expect(emailLink.href.includes("/auth/signin/email")).toBe(true);
  });

  it("create account button render", () => {
    const button: HTMLAnchorElement = screen.getByText("Create Account");
    expect(button).toBeInTheDocument();
    expect(button.href.includes("/auth/signup")).toBe(true);
  });
});
