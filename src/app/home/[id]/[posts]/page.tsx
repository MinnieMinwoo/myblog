import toc from "@jsdevtools/rehype-toc";
import ReactMarkdown from "react-markdown";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

import getPostDetail from "./getPostDetail";
import SyntaxHighlightProvider from "./SyntaxHIghlightProvider";
import LikeButton from "./LikeButton";
import ShareButton from "./ShareButton";
import getDate from "logics/getDate";
import EditSpan from "./EditSpan";
import "./page.css";

export default async function PostPage({ params }: { params: { id: string; posts: string } }) {
  const { id: userNickname, posts: postID } = params;
  const postData = await getPostDetail(postID);

  return (
    <main className="col col-10 offset-1 col-lg-8 offset-lg-2 col-xxl-6 offset-xxl-3">
      <div className="w-100 h-340px">
        <div
          className="w-100 h-100 px-4 py-0 position-relative"
          style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
            url(${postData?.thumbnailImageURL}) center/cover no-repeat`,
            color: "#eee",
          }}
        >
          <div className="pb-1 pt-140px">
            {postData.categoryMain ? (
              postData.categorySub ? (
                <span>{`${postData.categoryMain} - ${postData.categorySub}`}</span>
              ) : (
                <span>{`${postData.categoryMain}`}</span>
              )
            ) : null}
          </div>
          {postData?.title ? <h2 className="fs-1 fw-normal mb-2">{postData?.title}</h2> : null}
          <span>{`by ${userNickname}`}</span>
          <span>{` ∙  ${getDate(postData.createdAt)}`}</span>
          <EditSpan postID={postData.createdBy} />
        </div>
      </div>
      <article className="py-3" data-color-mode="light">
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlightProvider props={props} match={match}>
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlightProvider>
              ) : (
                <code {...props} className={className}>
                  {children}
                </code>
              );
            },
          }}
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
          {postData.postDetail}
        </ReactMarkdown>
      </article>
      <section>
        <div className="hstack mb-4">
          <LikeButton />
          <ShareButton />
        </div>
      </section>
    </main>
  );
}
