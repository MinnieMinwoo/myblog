"use client";

import { useQuery } from "@tanstack/react-query";
import getCurrentUserData from "logics/getCurrentUserData";
import getCurrentUserToken from "logics/getCurrentUserToken";
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

  const onEdit = () => {
    router.push(`${process.env.NEXT_PUBLIC_WEB_DOMAIN}/write?id=${postid}`);
  };

  const onDelete = async () => {
    if (!window.confirm("If you want to delete this post?")) return;
    try {
      const token = await getCurrentUserToken();
      const result = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/posts/detail/${postid}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!result.ok) {
        const { error } = await result.json();
        throw new Error(error);
      }

      router.push(`/home/${userData?.nickname}`);
    } catch (error) {
      console.log(error);
      window.alert("Post delete failed.");
    }
  };
  return (
    <>
      <span className="pe-on" hidden={hidden} onClick={onEdit}>
        ∙ Edit
      </span>
      <span className="pe-on" hidden={hidden} onClick={onDelete}>
        ∙ Delete
      </span>
    </>
  );
}
