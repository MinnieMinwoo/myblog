import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Setting",
  description: "myblog setting",
};

export default function SettingLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="Home d-flex flex-column min-vh-100 overflow-hidden">
      <header>
        <nav className="navbar bg-white">
          <div className="container">
            <div className="navbar-brand">
              <Image className="me-2" src={"/logo.png"} width={40} height={40} alt="blog logo" />
            </div>
          </div>
        </nav>
      </header>
      {children}
    </main>
  );
}
