/**
 * @jest-environment jest-environment-jsdom
 */

import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import Loading from "./loading";

describe("/setting loading test", () => {
  beforeEach(() => {
    render(<Loading />);
  });

  afterEach(() => {
    cleanup();
  });

  it("render test", () => {
    const loadingSpan = screen.getByText("Loading...");
    expect(loadingSpan).toBeInTheDocument();
  });
});
