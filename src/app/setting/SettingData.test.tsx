/**
 * @jest-environment jest-environment-jsdom
 */

import "@testing-library/jest-dom";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import SettingData from "./SettingData";
import userEvent from "@testing-library/user-event";

describe("/setting SettingData test", () => {
  const callbackMockFunction = jest.fn();

  beforeEach(() => {
    render(
      <SettingData
        title="Test title"
        description="Test description"
        buttonMessage="Test button"
        onClick={callbackMockFunction}
      />
    );
  });

  afterAll(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("render test", () => {
    const title = screen.getByText("Test title");
    expect(title).toBeInTheDocument();

    const description = screen.getByText("Test description");
    expect(description).toBeInTheDocument();

    const button = screen.getByText("Test button");
    expect(button).toBeInTheDocument();
  });

  it("callback test", async () => {
    const button = screen.getByText("Test button");
    userEvent.click(button);

    await waitFor(() => {
      expect(callbackMockFunction).toBeCalled();
    });
  });
});
