import Footer from "components/Footer";
import HomeHeader from "./HomeHeader";

interface PageParms {
  id: string;
}

export default function homeLayout({ children, params }: { children: React.ReactNode; params: PageParms }) {
  return (
    <main className="d-flex flex-column min-vh-100 overflow-hidden">
      <HomeHeader userName={params.id} />
      {children}
      <Footer />
    </main>
  );
}
