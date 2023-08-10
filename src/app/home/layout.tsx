import Footer from "components/Footer";
import HomeHeader from "./HomeHeader";

export default function homeLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="d-flex flex-column min-vh-100 overflow-hidden">
      <HomeHeader />
      {children}
      <Footer />
    </main>
  );
}
