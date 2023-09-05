"use client";

import Link from "next/link";
import Image from "next/image";
import HeaderProfile from "./HeaderProfile";

interface Props {
  userName?: string;
  isWarningAlert?: boolean;
}

export default function HomeHeader({ userName }: Props) {
  return (
    <header className="Header">
      <nav className="navbar bg-white">
        <div className="container">
          <div className="navbar-brand">
            <Link href="/">
              <Image className="me-2 pe-auto pe-on" src={"/logo.png"} width={40} height={40} alt="blog logo" />
            </Link>
            {userName ? `${userName}'s blog` : ""}
          </div>
          <HeaderProfile />
        </div>
      </nav>
      {userName && (
        <nav className="navbar bg-primary py-1">
          <div className="container">
            {userName && (
              <ul className="navbar-nav hstack gap-3 ms-1 fs-5">
                <li className="nav-item">
                  <Link className="nav-link text-white" href={`${userName ? `/home/${userName}` : "/"}`}>
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" href={`${userName ? `/home/${userName}/category` : "/"}`}>
                    Category
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" href={`${userName ? `/home/${userName}/about` : "/"}`}>
                    About
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
