import Footer from "components/Footer";
import HomeHeader from "./HomeHeader";
import NicknameParamCheck from "app/home/[nickname]/[postid]/ParamCheck";

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
