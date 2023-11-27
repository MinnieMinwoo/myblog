/**
 * @jest-environment jest-environment-jsdom
 */

import "@testing-library/jest-dom";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import CategorySection from "./CategorySection";
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

jest.mock("./CategoryCard");

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

describe("/home/[nickname]/category/ CategorySection test", () => {
  // set edit category status on test
  let isEdit = false;
  let categoryData = [
    {
      name: "testMainCategoryOne",
      subCategory: [{ name: "testSubCategoryOne", thumbnailImageURL: "testImageURL" }],
    },
    {
      name: "testMainCategoryTwo",
      subCategory: [
        { name: "testSubCategoryTwo", thumbnailImageURL: "testImageURL" },
        { name: "testSubCategoryThree", thumbnailImageURL: "testImageURL" },
      ],
    },
  ];

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
  beforeEach(() => render(<CategorySection isEdit={isEdit} categoryList={categoryData} />));

  /*
  Set edit status except first test.
  And set test category data for test convenience
    */
  afterEach(() => {
    isEdit = true;
    categoryData = categoryData = [
      {
        name: "testMainCategoryOne",
        subCategory: [{ name: "testSubCategoryOne", thumbnailImageURL: "testImageURL" }],
      },
    ];
  });

  afterAll(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("render test when does not edit state", () => {
    const sectionOne = screen.getByText("testMainCategoryOne");
    const numberOne = screen.getByText("(1)");
    expect(sectionOne.parentNode).toEqual(numberOne.parentNode);

    const sectionTwo = screen.getByText("testMainCategoryTwo");
    const numberTwo = screen.getByText("(2)");
    expect(sectionTwo.parentNode).toEqual(numberTwo.parentNode);

    const addButton = screen.queryByText("Add");
    expect(addButton).not.toBeInTheDocument();

    const editButton = screen.queryByText("Edit");
    expect(editButton).not.toBeInTheDocument();

    const deleteButton = screen.queryByText("Delete");
    expect(deleteButton).not.toBeInTheDocument();
  });

  it("render test when edit state", () => {
    screen.debug();
    const sectionOne = screen.getByText("testMainCategoryOne");
    const numberOne = screen.getByText("(1)");
    expect(sectionOne.parentNode).toEqual(numberOne.parentNode);

    const addButton = screen.getByText("Add");
    expect(addButton).toBeInTheDocument();

    const editButton = screen.getByText("Edit");
    expect(editButton).toBeInTheDocument();

    const deleteButton = screen.getByText("Delete");
    expect(deleteButton).toBeInTheDocument();
  });

  it("add button logic", async () => {
    const AddButton = screen.getByText("Add");
    userEvent.click(AddButton);

    await waitFor(() => {
      expect(mutateMockFunction).toBeCalledTimes(1);
    });
  });

  it("edit button logic", async () => {
    const editButton = screen.getByText("Edit");
    userEvent.click(editButton);
    await waitFor(() => {
      expect(mutateMockFunction).toBeCalledTimes(2);
    });
  });

  it("delete button logic", async () => {
    const deleteButton = screen.getByText("Delete");
    userEvent.click(deleteButton);
    await waitFor(() => {
      expect(mutateMockFunction).toBeCalledTimes(3);
    });
  });
});
