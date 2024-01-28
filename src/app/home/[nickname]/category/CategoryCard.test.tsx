/**
 * @jest-environment jest-environment-jsdom
 */

import "@testing-library/jest-dom";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import PostCategoryCard from "./CategoryCard";
import userEvent from "@testing-library/user-event";

const mutateMockFunction = jest.fn();
jest.mock("@tanstack/react-query", () => {
  return {
    useQuery: () => ({
      data: {
        id: "12345",
        nickname: "testuser",
      },
      status: "success",
    }),
    QueryClient: {},
    useQueryClient: () => {},
    useMutation: jest.fn(() => ({
      mutate: mutateMockFunction,
    })),
  };
});

jest.mock(
  "next/image",
  jest.fn().mockImplementation(() => ({
    __esModule: true,
    default: (props: any) => {
      return <img {...props} />;
    },
  }))
);

jest.mock("logics/imageUpload");

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

describe("/home/[nickname]/category/ CategoryCard test", () => {
  // set edit category status on test
  let isEdit = false;

  beforeAll(() => {
    Object.defineProperty(window, "prompt", {
      value: () => "test",
    });

    Object.defineProperty(window, "confirm", {
      value: () => true,
    });

    // copy value does not use after modification
    Object.defineProperty(global, "structuredClone", {
      value: (object: any) => object,
    });
  });

  beforeEach(() => {
    render(
      <PostCategoryCard
        isEdit={isEdit}
        mainCategoryName="testMainCategory"
        subCategoryName="testSubCategory"
        thumbnailImageURL="testImageURL"
        categoryList={[
          { name: "testMainCategory", subCategory: [{ name: "testSubCategory", thumbnailImageURL: "testImageURL" }] },
        ]}
      />
    );
  });

  // set edit status except first test
  afterEach(() => {
    isEdit = true;
  });

  afterAll(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("render test when does not edit", () => {
    const title = screen.getByText("testSubCategory");
    expect(title).toBeInTheDocument();
    const thumbnailImage = screen.getByAltText("Thumbnail");
    expect(thumbnailImage).toBeInTheDocument();

    const editButton = screen.queryByText("✎");
    expect(editButton).not.toBeInTheDocument();
    const thumbnailButton = screen.queryByText("🖼️");
    expect(thumbnailButton).not.toBeInTheDocument();
    const deleteButton = screen.queryByText("🗑️");
    expect(deleteButton).not.toBeInTheDocument();
  });

  it("render test when edit", () => {
    const title = screen.getByText("testSubCategory");
    expect(title).toBeInTheDocument();
    const thumbnailImage = screen.getByAltText("Thumbnail");
    expect(thumbnailImage).toBeInTheDocument();

    const editButton = screen.getByText("✎");
    expect(editButton).toBeInTheDocument();
    const thumbnailButton = screen.getByText("🖼️");
    expect(thumbnailButton).toBeInTheDocument();
    const deleteButton = screen.getByText("🗑️");
    expect(deleteButton).toBeInTheDocument();
  });

  it("edit button logic", async () => {
    const editButton = screen.getByText("✎");
    userEvent.click(editButton);
    await waitFor(() => {
      expect(mutateMockFunction).toBeCalledTimes(1);
    });
  });

  it("thumbnail button logic", async () => {
    const thumbnailButton = screen.getByText("🖼️");
    const thumbnailFileInput = thumbnailButton.firstChild;

    act(() => {
      userEvent.upload(thumbnailFileInput as HTMLInputElement, new File([], "test.png", { type: "image/png" }));
    });

    await waitFor(() => {
      expect(mutateMockFunction).toBeCalledTimes(2);
    });
  });

  it("delete button logic", async () => {
    const deleteButton = screen.getByText("🗑️");
    userEvent.click(deleteButton);
    await waitFor(() => {
      expect(mutateMockFunction).toBeCalledTimes(3);
    });
  });
});
