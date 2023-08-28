import type { Metadata } from "next";
import { Inter } from "next/font/google";
const Providers = dynamic(() => import("./Providers"));

import "./globals.scss";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "myBlog",
  description: "Make your own blog",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
