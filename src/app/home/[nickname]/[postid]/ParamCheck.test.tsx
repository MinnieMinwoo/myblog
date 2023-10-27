/**
 * @jest-environment jest-environment-jsdom
 */

import { cleanup, render } from "@testing-library/react";
import ParamCheck from "./ParamCheck";

const routerMockFunction = jest.fn(() => {});
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useParams: jest.fn(() => ({
    nickname: "testuser",
    postid: "12345",
  })),
  useRouter: jest.fn(() => ({
    push: routerMockFunction,
  })),
}));

describe("/home/[nickname]/[postid] ParamCheck test", () => {
  afterAll(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("correct param test", () => {
    render(<ParamCheck userName="testuser" postID="12345" />);
    expect(routerMockFunction).not.toBeCalled();
  });

  it("wrong param test", () => {
    render(<ParamCheck userName="mollu" postID="12345" />);
    expect(routerMockFunction).toBeCalledTimes(1);
    cleanup();

    render(<ParamCheck userName="testuser" postID="23456" />);
    expect(routerMockFunction).toBeCalledTimes(2);
  });
});
