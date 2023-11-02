/**
 * @jest-environment jest-environment-jsdom
 */

import "@testing-library/jest-dom";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import AboutEdit from "./AboutEdit";
import userEvent from "@testing-library/user-event";

const changeFunction = jest.fn();
jest.mock("@uiw/react-md-editor", () => ({
  __esModule: true,
  commands: {},
  default: ({ value }: { value: string }) => {
    return (
      <>
        <p>test</p>
        <label htmlFor="editor">Edit your data</label>
        <input
          id="editor"
          name="editor"
          type="text"
          placeholder="Edit your data"
          value={value}
          onChange={changeFunction}
        />
      </>
    );
  },
}));

describe("/home/[nickname]/about AboutEdit test", () => {
  beforeEach(() => {
    render(<AboutEdit aboutData={"test"} setAboutData={() => {}} />);
  });

  afterAll(() => {
    cleanup();
  });

  it("render test", () => {
    const content = screen.getByText("test");
    expect(content).toBeInTheDocument();
  });

  it("onchange logic", async () => {
    const content = screen.getByLabelText("Edit your data");
    userEvent.type(content, "1");
    await waitFor(() => expect(changeFunction).toBeCalledTimes(1));
  });
});
