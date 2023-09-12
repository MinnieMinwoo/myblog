"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect } from "react";
const GetToken = dynamic(() => import("./GetToken"), { ssr: false });

export default function AuthWithGoogle(this: any) {
  const params = useParams();

  return (
    <>
      <GetToken />
    </>
  );
}
