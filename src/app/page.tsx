import Image from "next/image";
import Footer from "components/Footer";
import "./main.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className="Home d-flex flex-column min-vh-100 overflow-hidden">
      <header>
        <nav className="navbar bg-white">
          <div className="container">
            <div className="navbar-brand">
              <a href="/">
                <Image className="me-2 pe-auto pe-on" src={"/logo.png"} width={40} height={40} alt="blog logo" />
              </a>
            </div>
          </div>
        </nav>
      </header>
      <section className="MainSection d-flex flex-column flex-grow-1 align-items-center justify-content-center main-gradation">
        <h1 className="fw-bold mb-2 text-center text-333 fs-45px">Publish your stroy, your way</h1>
        <p className="fs-3 fw-normal mb-2 text-333">Create a unique and beautiful blog.</p>
        <Link href="/auth/signin" role="button" className="btn btn-primary btn-lg fs-4 mt-3 w-200px h-60px">
          Start
        </Link>
      </section>
      <Footer />
    </main>
  );
}
