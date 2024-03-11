"use client";

import Image from "next/image";
import HeaderSearch from "components/HeaderSearch";
import useColorScheme from "logics/useColorScheme";

export default function MainHeader() {
  const { colorScheme } = useColorScheme();

  return (
    <header>
      <nav className={`navbar ${colorScheme === "dark" ? "bg-dark" : "bg-light"}`}>
        <div className="container">
          <div className="navbar-brand">
            <Image className="me-2" src={"/logo.png"} width={40} height={40} alt="blog logo" />
          </div>
          <HeaderSearch />
        </div>
      </nav>
    </header>
  );
}
