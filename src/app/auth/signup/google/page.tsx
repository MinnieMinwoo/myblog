"use client";

import dynamic from "next/dynamic";

const GetToken = dynamic(() => import("./GetToken"), { ssr: false });

export default function AuthWithGoogle() {
  return (
    <>
      <GetToken />
    </>
  );
}
