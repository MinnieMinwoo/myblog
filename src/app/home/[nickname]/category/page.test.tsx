/**
 * @jest-environment jest-environment-jsdom
 */

import "@testing-library/jest-dom";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoryPage from "./page";

const mutateMockFunction = jest.fn();
jest.mock("@tanstack/react-query", () => {
  return {
    useQuery: ({ queryKey }: { queryKey: string[] }) => {
      const [queryID] = queryKey;

      return {
        data:
          queryID === "currentUser"
            ? {
                id: "12345",
                nickname: "testuser",
              }
            : queryID === "CategoryLists"
            ? [
                {
                  name: "testMainCategoryOne",
                },
                {
                  name: "testMainCategoryTwo",
                  subCategory: [],
                },
              ]
            : {},
        status: "success",
      };
    },
    QueryClient: {},
    useQueryClient: () => {},
    useMutation: jest.fn(() => ({
      mutate: mutateMockFunction,
    })),
  };
});

jest.mock("./CategorySection");
jest.mock("../../../../components/CategorySideBar");

let isEdit = false;
const setStateMockFunction = jest.fn(() => {});
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  onsubmit: jest.fn(() => ({ status: 406 })),
  useState: jest.fn(() => [isEdit, setStateMockFunction]),
}));

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

describe("/home/[nickname]/category/ page test", () => {
  beforeAll(() => {
    Object.defineProperty(window, "prompt", {
      value: () => "test",
    });

    // copy value does not use after modification
    Object.defineProperty(global, "structuredClone", {
      value: (object: any) => object,
    });
  });

  afterAll(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("render test when does not edit state", () => {
    isEdit = false;
    render(<CategoryPage params={{ nickname: "testuser" }} />);

    const title = screen.getByText("Categories");
    expect(title).toBeInTheDocument();
    const categoryNumber = screen.getByText("(2)");
    expect(categoryNumber).toBeInTheDocument();

    const editButton = screen.getByText("Edit");
    expect(editButton).toBeInTheDocument();

    const addButton = screen.queryByText("Add");
    expect(addButton).not.toBeInTheDocument();

    const completeButton = screen.queryByText("Complete");
    expect(completeButton).not.toBeInTheDocument();
  });

  it("render test when edit state", () => {
    isEdit = true;
    render(<CategoryPage params={{ nickname: "testuser" }} />);

    const title = screen.getByText("Categories");
    expect(title).toBeInTheDocument();
    const categoryNumber = screen.getByText("(2)");
    expect(categoryNumber).toBeInTheDocument();

    const editButton = screen.queryByText("Edit");
    expect(editButton).not.toBeInTheDocument();

    const addButton = screen.getByText("Add");
    expect(addButton).toBeInTheDocument();

    const completeButton = screen.getByText("Complete");
    expect(completeButton).toBeInTheDocument();
  });

  it("edit button logic", async () => {
    isEdit = false;
    render(<CategoryPage params={{ nickname: "testuser" }} />);

    const editButton = screen.queryByText("Edit");
    userEvent.click(editButton as HTMLButtonElement);

    await waitFor(() => {
      expect(setStateMockFunction).toBeCalledTimes(1);
    });
  });

  it("complete button logic", async () => {
    isEdit = true;
    render(<CategoryPage params={{ nickname: "testuser" }} />);

    const completeButton = screen.getByText("Complete");
    userEvent.click(completeButton as HTMLButtonElement);

    await waitFor(() => {
      expect(setStateMockFunction).toBeCalledTimes(2);
    });
  });

  it("add button logic", async () => {
    isEdit = true;
    render(<CategoryPage params={{ nickname: "testuser" }} />);

    const AddButton = screen.getByText("Add");
    userEvent.click(AddButton);

    await waitFor(() => {
      expect(mutateMockFunction).toBeCalledTimes(1);
    });
  });
});
