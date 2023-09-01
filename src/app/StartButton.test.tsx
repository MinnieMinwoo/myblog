/**
 * @jest-environment jest-environment-jsdom
 */

import "@testing-library/jest-dom";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import StartButton from "./StartButton";

const mockFunction = jest.fn(() => {});
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useRouter: () => ({
    push: mockFunction,
  }),
}));

jest.mock("logics/revalidateToken");

describe("/ start button test", () => {
  beforeEach(() => {
    render(<StartButton />);
    window.localStorage.getItem = jest.fn();
  });

  afterAll(() => {
    cleanup();
    jest.restoreAllMocks();
  });

  it("button render", () => {
    const button = screen.getByText("Start");
    expect(button).toBeInTheDocument();
  });

  it("button click", async () => {
    const button = screen.getByText("Start");
    button.click();
    await waitFor(() => expect(mockFunction).toBeCalled());
  });
});
