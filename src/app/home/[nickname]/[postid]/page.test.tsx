/**
 * @jest-environment jest-environment-jsdom
 */

import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import PostPage from "./page";

// this brings error if not mocking
jest.mock("hast-util-sanitize", () => ({
  __esModule: true,
  hastUtilSanitize: {},
  defaultSchema: { attributes: {} },
}));

jest.mock("react-markdown", () => ({
  __esModule: true,
  commands: {},
  default: ({ children }: { children: React.ReactNode }) => {
    return (
      <>
        <p>{children}</p>
      </>
    );
  },
}));

jest.mock("@jsdevtools/rehype-toc");
jest.mock("rehype-sanitize");

// eslint-disable-next-line react/display-name
jest.mock("./SyntaxHIghlightProvider", () => () => <></>);
jest.mock("./EditSpan");
jest.mock("./LikeButton");
jest.mock("./ShareButton");
jest.mock("./ParamCheck");

describe("/home/[nickname]/[posid] page test", () => {
  beforeAll(() => {
    const fetchMockFunction = jest.fn((url: string) => {
      return {
        json: () =>
          Promise.resolve({
            id: "12345",
            createdNickname: "Minnie",
            postDetail: "testText",
            createdAt: 1695601250441,
            categoryMain: "categoryMainTest",
            categorySub: "categorySubTest",
            title: "titleTest",
          }),
      };
    });
    (global as any).fetch = fetchMockFunction;
  });

  beforeEach(async () => {
    render(await PostPage({ params: { nickname: "Minnie", postid: "12345" } }));
  });

  afterEach(() => cleanup());

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("render test", () => {
    const title = screen.getByText("titleTest");
    expect(title).toBeInTheDocument();
    const nickname = screen.getByText("by Minnie");
    expect(nickname).toBeInTheDocument();
    const createdDate = screen.getByText("2023. 09. 25", { exact: false });
    expect(createdDate).toBeInTheDocument();
    const category = screen.getByText("categoryMainTest - categorySubTest");
    expect(category).toBeInTheDocument();
    const detail = screen.getByText("testText");
    expect(detail).toBeInTheDocument();
  });
});
