"use client";

import { ReactNode } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function SyntaxHighlightProvider({
  children,
  match,
  props,
}: {
  children: ReactNode;
  match: RegExpExecArray;
  props: any;
}) {
  return (
    <SyntaxHighlighter {...props} style={materialLight} language={match[1]} PreTag="div">
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  );
}
