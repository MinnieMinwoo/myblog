"use client";

import { useQuery } from "@tanstack/react-query";
import getCurrentUserData from "logics/getCurrentUserData";
import { useParams, useRouter } from "next/navigation";

export default function EditSpan({ createdBy }: { createdBy: string }) {
  const router = useRouter();
  const params = useParams();
  const { postid } = params;

  const { data: userData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserData,
  });

  const hidden = !(userData && createdBy === userData.id);

  const onDelete = async () => {
    if (!window.confirm("If you want to delete this post?")) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/posts/detail/${postid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userData?.id,
          nickname: userData?.nickname,
        }),
      });
      router.push(`/home/${userData?.nickname}`);
    } catch (error) {
      console.log(error);
      window.alert("Post delete failed.");
    }
  };
  return (
    <>
      <span className="pe-on" hidden={hidden} onClick={() => {}}>
        ∙ Edit
      </span>
      <span className="pe-on" hidden={hidden} onClick={onDelete}>
        ∙ Delete
      </span>
    </>
  );
}
