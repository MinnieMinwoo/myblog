import Footer from "components/Footer";
import HomeHeader from "./HomeHeader";

export default function HomeLayout({
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
