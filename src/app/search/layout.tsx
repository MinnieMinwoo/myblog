import Footer from "components/Footer";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "myBlog - search",
  description: "Search user post data",
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header>
        <nav className="navbar bg-white">
          <div className="container">
            <div className="navbar-brand">
              <Link href={`/`}>
                <Image className="me-2" src={"/logo.png"} width={40} height={40} alt="blog logo" />
              </Link>
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
