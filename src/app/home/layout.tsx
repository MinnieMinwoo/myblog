import Footer from "components/Footer";
import HomeHeader from "./HomeHeader";

export default function homeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HomeHeader />
      {children}
      <Footer />
    </>
  );
}
