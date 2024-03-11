import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Setting",
  description: "myblog setting",
};

export default function SettingLayout({ children }: { children: React.ReactNode }) {
  return <main className="Home d-flex flex-column min-vh-100 overflow-hidden">{children}</main>;
}
