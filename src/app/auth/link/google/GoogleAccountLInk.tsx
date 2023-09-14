"use client";

import getCurrentUserToken from "logics/getCurrentUserToken";
import parseJwt from "logics/parseJwt";
import { useEffect } from "react";

export default function GoogleAccountLink(this: any) {
  const parsedHash = new URLSearchParams(window.location.hash.substring(1));
  parsedHash.forEach((value, key) => console.log(value, key));
  const idToken = parsedHash.get("id_token");
  const tokenType = parsedHash.get("token_type");

  useEffect(() => {
    const nonce = window.localStorage.getItem("nonce");
    if (!nonce) {
      console.log("no nonce value");
      return;
    }
    linkAccountToGoogle(nonce);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const linkAccountToGoogle = async (nonce: string) => {
    try {
      const currentUserToken = await getCurrentUserToken();
      const result = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/link/google`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${currentUserToken}`,
        },
        body: JSON.stringify({
          idToken: `${tokenType} ${idToken}`,
          nonce: nonce,
        }),
      });
      const tokenData = await parseJwt(idToken!);
      console.log(tokenData);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return <></>;
}
