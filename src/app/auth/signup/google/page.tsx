"use client";

import dynamic from "next/dynamic";

const GetToken = dynamic(() => import("./SocialSignupForm"), { ssr: false });

export default function AuthWithGoogle() {
  return (
    <>
      <GetToken />
    </>
  );
}
