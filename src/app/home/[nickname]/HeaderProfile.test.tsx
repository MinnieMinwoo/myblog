/**
 * @jest-environment jest-environment-jsdom
 */

import "@testing-library/jest-dom";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HeaderProfile from "./HeaderProfile";

jest.mock("@tanstack/react-query", () => {
  return {
    useQuery: () => ({
      data: {
        id: "12345",
        nickname: "testuser",
      },
      status: "success",
    }),
  };
});

// open state
let isOpen = false;
const setStateMockFunction = jest.fn(() => {});
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(() => [isOpen, setStateMockFunction]),
}));

jest.mock(
  "next/image",
  jest.fn().mockImplementation(() => ({
    __esModule: true,
    default: (props: any) => {
      return <img {...props} />;
    },
  }))
);

const routerMockFunction = jest.fn();
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useParams: jest.fn(() => ({
    nickname: "testuser",
  })),
  useRouter: jest.fn(() => ({
    push: routerMockFunction,
  })),
}));

describe("/home/[nickname] HeaderProfile test", () => {
  afterAll(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("render test when initial state", () => {
    isOpen = false;
    render(<HeaderProfile />);

    const image = screen.getByAltText("Profile");
    expect(image).toBeInTheDocument();
  });

  it("render test when image click state", () => {
    isOpen = true;
    render(<HeaderProfile />);

    const image = screen.getByAltText("Profile");
    expect(image).toBeInTheDocument();

    const postButton = screen.getByText("Post");
    expect(postButton).toBeInTheDocument();

    const settingButton = screen.getByText("Setting");
    expect(settingButton).toBeInTheDocument();

    const signOutButton = screen.getByText("Sign Out");
    expect(signOutButton).toBeInTheDocument();
  });

  it("Image Click test", async () => {
    isOpen = false;
    render(<HeaderProfile />);

    const image = screen.getByAltText("Profile");
    userEvent.click(image);
    await waitFor(() => expect(setStateMockFunction).toBeCalled());
  });

  it("route test", async () => {
    isOpen = true;
    render(<HeaderProfile />);

    const postButton = screen.getByText("Post");
    userEvent.click(postButton);
    await waitFor(() => expect(routerMockFunction).toBeCalledTimes(1));

    const settingButton = screen.getByText("Setting");
    userEvent.click(settingButton);
    await waitFor(() => expect(routerMockFunction).toBeCalledTimes(2));

    const signOutButton = screen.getByText("Sign Out");
    userEvent.click(signOutButton);
    await waitFor(() => expect(routerMockFunction).toBeCalledTimes(3));
  });
});
