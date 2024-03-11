import Footer from "components/Footer";
import "./main.css";
import StartButton from "./StartButton";
import MainHeader from "./MainHeader";

export default function Home() {
  return (
    <main className="Home d-flex flex-column min-vh-100 overflow-hidden">
      <MainHeader />
      <section className="MainSection d-flex flex-column flex-grow-1 align-items-center justify-content-center main-gradation">
        <h1 className="fw-bold mb-2 text-center text-333 fs-45px">Publish your stroy, your way</h1>
        <p className="fs-3 fw-normal mb-2 text-333">Create a unique and beautiful blog.</p>
        <StartButton />
      </section>
      <Footer />
    </main>
  );
}
