"use client";

import { Auth } from "aws-amplify";
import { useRouter } from "next/navigation";

export default function StartButton() {
  const router = useRouter();
  const onClick = async () => {
    const data = await Auth.currentUserInfo();
    router.push(data === null ? "/auth/signin" : `home/${data.attributes.nickname}`);
  };

  return (
    <button className="btn btn-primary btn-lg fs-4 mt-3 w-200px h-60px" onClick={onClick}>
      Start
    </button>
  );
}
