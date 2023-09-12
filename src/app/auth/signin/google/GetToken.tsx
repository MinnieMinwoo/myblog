"use client";

export default function GetToken(this: any) {
  const parsedHash = new URLSearchParams(window.location.hash.substring(1));
  console.log(parsedHash);
  const accessToken = parsedHash.get("access_token");
  const tokenType = parsedHash.get("token_type");

  fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/signup/google`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${tokenType} ${accessToken}`,
    },
    method: "POST",
  });

  return <></>;
}
