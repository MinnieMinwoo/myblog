"use client";

import dynamic from "next/dynamic";

const GoogleAccountLink = dynamic(() => import("./GoogleAccountLInk"), { ssr: false });

export default function AuthWithGoogle() {
  return (
    <>
      <GoogleAccountLink />
    </>
  );
}
