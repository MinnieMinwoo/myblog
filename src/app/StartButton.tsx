"use client";

import parseJwt from "logics/parseJwt";
import revalidateToken from "logics/revalidateToken";
import { useRouter } from "next/navigation";

export default function StartButton() {
  const router = useRouter();
  const onClick = async () => {
    await revalidateToken();
    const idToken = localStorage.getItem("idToken");
    if (!idToken || idToken.length < 10) {
      router.push("/auth/signin");
      return;
    }
    const tokenPayload: IdTokenPayload = await parseJwt(idToken);
    router.push(tokenPayload.email_verified ? `home/${tokenPayload.nickname}` : "/auth/signin");
  };

  return (
    <button className="btn btn-primary btn-lg fs-4 mt-3 w-200px h-60px" onClick={onClick}>
      Start
    </button>
  );
}
