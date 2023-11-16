/**
 * @jest-environment jest-environment-jsdom
 */

import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import CategoryDetailPage from "./page";

jest.mock("@tanstack/react-query", () => {
  return {
    useQuery: () => ({
      data: [
        { name: "testMainCategory", subCategory: [{ name: "testSubCategory", thumbnailImageURL: "testImageURL" }] },
      ],

      status: "success",
    }),
    useInfiniteQuery: ({ queryKey }: { queryKey: string[] }) => {
      const [_, nickname] = queryKey;
      return nickname === "NoPost"
        ? {
            data: {
              pages: [
                {
                  postCount: 0,
                  postList: [],
                },
              ],
            },
            hasNextPage: false,
            isFetching: false,
            isFetchingNextPage: false,
            status: "success",
          }
        : nickname === "OnePost"
        ? {
            data: {
              pages: [
                {
                  postCount: 1,
                  postList: [
                    {
                      id: "12345",
                      title: "testPost1",
                      createdBy: "11111",
                      createdNickname: "OnePost",
                      createdAt: 1700113118000,
                      thumbnailImageURL: "testThumbnailURL",
                      thumbnailData: "testThumbnailData",
                      tag: [],
                    },
                  ],
                },
              ],
            },
            hasNextPage: false,
            isFetching: false,
            isFetchingNextPage: false,
            status: "success",
          }
        : nickname === "TwoPosts"
        ? {
            data: {
              pages: [
                {
                  postCount: 2,
                  postList: [
                    {
                      id: "12345",
                      title: "testPost1",
                      createdBy: "22222",
                      createdNickname: "TwoPosts",
                      createdAt: 1700113118000,
                      thumbnailImageURL: "testThumbnailURL",
                      thumbnailData: "testThumbnailData",
                      tag: [],
                    },
                    {
                      id: "23456",
                      title: "testPost2",
                      createdBy: "22222",
                      createdNickname: "TwoPosts",
                      createdAt: 1700113118000,
                      thumbnailImageURL: "testThumbnailURL",
                      thumbnailData: "testThumbnailData",
                      tag: [],
                    },
                  ],
                },
              ],
            },
            hasNextPage: false,
            isFetching: false,
            isFetchingNextPage: false,
            status: "success",
          }
        : {};
    },
  };
});

// eslint-disable-next-line react/display-name
jest.mock("components/PostPagination", () => () => <></>);

// eslint-disable-next-line react/display-name
jest.mock("components/CategorySideBar", () => () => <></>);

jest.mock(
  "next/image",
  jest.fn().mockImplementation(() => ({
    __esModule: true,
    default: (props: any) => {
      return <img {...props} />;
    },
  }))
);

describe("/home/[nickname]/category/[...names] page test", () => {
  afterAll(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("render test when user don't have post", () => {
    render(<CategoryDetailPage params={{ nickname: "NoPost", names: ["noPostCategoryMain", "noPostCategorySub"] }} />);
    const title = screen.getByText("noPostCategoryMain - noPostCategorySub");
    expect(title).toBeInTheDocument();
    const count = screen.getByText("0 post");
    expect(count).toBeInTheDocument();
    screen.debug();
  });

  it("render test when user have one post", () => {
    render(
      <CategoryDetailPage params={{ nickname: "OnePost", names: ["OnePostCategoryMain", "OnePostCategorySub"] }} />
    );
    const title = screen.getByText("OnePostCategoryMain - OnePostCategorySub");
    expect(title).toBeInTheDocument();
    const count = screen.getByText("1 post");
    expect(count).toBeInTheDocument();
    const postTitle = screen.getByText("testPost1");
    expect(postTitle).toBeInTheDocument();
  });

  it("render test when user have two posts", () => {
    render(
      <CategoryDetailPage params={{ nickname: "TwoPosts", names: ["TwoPostsCategoryMain", "TwoPostsCategorySub"] }} />
    );
    const title = screen.getByText("TwoPostsCategoryMain - TwoPostsCategorySub");
    expect(title).toBeInTheDocument();
    const count = screen.getByText("2 posts");
    expect(count).toBeInTheDocument();
    const postTitleOne = screen.getByText("testPost1");
    expect(postTitleOne).toBeInTheDocument();
    const postTitleTwo = screen.getByText("testPost1");
    expect(postTitleTwo).toBeInTheDocument();
    screen.debug();
  });
});
