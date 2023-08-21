import toc from "@jsdevtools/rehype-toc";
import ReactMarkdown from "react-markdown";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import "./page.css";

export default function PostPage() {
  const source = `
## MarkdownPreview
> todo: React component preview markdown text.
`;

  const postData = {
    thumbnailImageURL: "",
    category: [],
    title: "test",
    nickname: "Minnie",
    createdAt: 12345678,
    detail: source,
    likes: [],
  };

  let hidden = false;

  return (
    <>
      <main>
        <div className="w-100 h-340px">
          <div
            className="w-100 h-100 px-4 py-0 position-relative"
            style={{
              background: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
            url(${!!postData?.thumbnailImageURL ? postData.thumbnailImageURL : "altImage"}) center/cover no-repeat`,
              color: "#eee",
            }}
          >
            <div className="pb-1 pt-140px">
              {postData?.category?.length ? <span>{`${postData.category[0]} - ${postData.category[1]}`}</span> : null}
            </div>
            {postData?.title ? <h2 className="fs-1 fw-normal mb-2">{postData?.title}</h2> : null}
            {postData?.nickname ? <span>{`by ${postData.nickname}`}</span> : null}
            {postData?.createdAt ? (
              <span>{` ∙  ${
                "12345" //todo: use getDate
              }`}</span>
            ) : null}
            <span className="pe-on" hidden={hidden}>
              ∙ Edit
            </span>
            <span className="pe-on" hidden={hidden}>
              ∙ Delete
            </span>
          </div>
        </div>
        <article className="py-3" data-color-mode="light">
          <ReactMarkdown
            rehypePlugins={[
              [
                rehypeSanitize,
                {
                  ...defaultSchema,
                  attributes: {
                    ...defaultSchema.attributes,
                    span: [
                      // @ts-ignore
                      ...(defaultSchema.attributes.span || []),
                      // List of all allowed tokens:
                      ["className"],
                    ],
                    code: [["className"]],
                  },
                },
              ],
              [
                toc,
                {
                  headings: ["h1", "h2", "h3"],
                  cssClasses: {
                    toc: "page-outline",
                    list: "page-list",
                    listItem: "page-listItem",
                    link: "page-link",
                  },
                },
              ],
            ]}
          >
            {postData?.detail}
          </ReactMarkdown>
        </article>
        <section>
          <div className="hstack mb-4">
            <button
              className={`btn btn${
                //postData && userData?.uid && postData.likes.includes(userData.uid) ? "" : "-outline"
                ""
              }-primary w-100px h-50px me-3`}
            >
              ♡{`(${postData?.likes.length ?? 0})`}
            </button>
            <div className="dropdown-center">
              <button
                className="btn btn-outline-info dropdown-toggle w-100px h-50px"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Share
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href={"faceBookLink"} role="button">
                    Facebook
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href={"twitterLink"} role="button">
                    Twitter
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href={""} role="button">
                    Copy link
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
