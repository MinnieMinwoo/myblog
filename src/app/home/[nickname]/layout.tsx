import Footer from "components/Footer";
import HomeHeader from "./HomeHeader";
import CategorySideBar from "../../../components/CategorySideBar";

interface PageParms {
  id: string;
}

export default function homeLayout({
  children,
  params: { nickname },
}: {
  children: React.ReactNode;
  params: { nickname: string };
}) {
  return (
    <main className="d-flex flex-column min-vh-100 overflow-hidden">
      <HomeHeader userName={nickname} />
      {children}
      <Footer />
    </main>
  );
}
