import Footer from "components/Footer";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "myBlog - search",
  description: "Search user post data",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header>
        <nav className="navbar bg-white">
          <div className="container">
            <div className="navbar-brand">
              <Image className="me-2" src={"/logo.png"} width={40} height={40} alt="blog logo" />
              <span>Search</span>
            </div>
          </div>
        </nav>
      </header>
      {children}
      <Footer />
    </>
  );
}
