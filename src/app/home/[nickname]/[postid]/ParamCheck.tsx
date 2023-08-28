"use client";

import { useParams, useRouter } from "next/navigation";

export default function ParamCheck({ userName, postID }: { userName: string; postID: string }) {
  const params = useParams();
  const router = useRouter();
  const { nickname, postid: _postid } = params;
  if (postID !== _postid || userName !== nickname) {
    router.push("/error");
  }
  return <></>;
}
