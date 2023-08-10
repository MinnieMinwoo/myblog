import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "myBlog - write",
  description: "Write your post",
};

export default function WriteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
