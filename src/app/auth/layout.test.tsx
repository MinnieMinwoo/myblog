/**
 * @jest-environment jest-environment-jsdom
 */

import "@testing-library/jest-dom";

import { cleanup, render, screen } from "@testing-library/react";
import AuthLayout from "./layout";

describe("/auth layout test", () => {
  beforeEach(() => render(<AuthLayout>{}</AuthLayout>));
  afterAll(() => cleanup());

  it("title render", () => {
    const title = screen.getByText("myBlog");
    expect(title).toBeInTheDocument();
  });
});
