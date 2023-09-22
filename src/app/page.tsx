import Image from "next/image";
import Footer from "components/Footer";
import "./main.css";
import StartButton from "./StartButton";
import HeaderSearch from "components/HeaderSearch";

export default function Home() {
  return (
    <main className="Home d-flex flex-column min-vh-100 overflow-hidden">
      <header>
        <nav className="navbar bg-white">
          <div className="container">
            <div className="navbar-brand">
              <Image className="me-2" src={"/logo.png"} width={40} height={40} alt="blog logo" />
            </div>
            <HeaderSearch />
          </div>
        </nav>
      </header>
      <section className="MainSection d-flex flex-column flex-grow-1 align-items-center justify-content-center main-gradation">
        <h1 className="fw-bold mb-2 text-center text-333 fs-45px">Publish your stroy, your way</h1>
        <p className="fs-3 fw-normal mb-2 text-333">Create a unique and beautiful blog.</p>
        <StartButton />
      </section>
      <Footer />
    </main>
  );
}
