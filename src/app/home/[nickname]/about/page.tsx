import ReactMarkdown from "react-markdown";
import SyntaxHighlightProvider from "../[postid]/SyntaxHIghlightProvider";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import CategorySideBar from "components/CategorySideBar";

export default async function AboutPage({ params: { nickname } }: { params: { nickname: string } }) {
  const { about } = await (await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/users/about/${nickname}`)).json();
  return (
    <main className="flex-grow-1 row">
      <div className="col col-10 offset-1 col-lg-8 offset-lg-2 col-xxl-6 offset-xxl-3">
        <div className="px-md-3 my-4 mx-md-4">
          <section className="pb-3 bb-light">
            <h2 className="d-inline-block fw-bold">{"" ? "Edit page" : "About"}</h2>
            {null}
          </section>
          <article className="mt-3" data-color-mode="light">
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
              ]}
            >
              {about}
            </ReactMarkdown>
          </article>
        </div>
      </div>
      <div className="col">
        <CategorySideBar />
      </div>
    </main>
  );
}
