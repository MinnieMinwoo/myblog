import ReactMarkdown from "react-markdown";
import SyntaxHighlightProvider from "../[postid]/SyntaxHIghlightProvider";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

export default async function AboutReader({ nickname }: { nickname: string }) {
  const { about } = await (await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/users/about/${nickname}`)).json();
  return (
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
  );
}
