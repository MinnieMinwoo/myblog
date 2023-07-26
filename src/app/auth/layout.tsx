import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "myBlog login",
  description: "login to myBlog",
};

export default function AuthPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="vstack gap-3 position-absolute top-50 start-50 translate-middle col-10 col-md-6 col-lg-4">
      <h1>MyBlog</h1>
      {children}
    </div>
  );
}
