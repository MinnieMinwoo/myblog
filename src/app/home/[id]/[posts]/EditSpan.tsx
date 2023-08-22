"use client";

import { useQuery } from "@tanstack/react-query";
import getCurrentUserData from "logics/getCurrentUserData";

export default function EditSpan({ postID }: { postID: string }) {
  const { data: userData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserData,
  });

  const hidden = !(userData && postID === userData.id);

  return (
    <>
      <span className="pe-on" hidden={hidden}>
        ∙ Edit
      </span>
      <span className="pe-on" hidden={hidden}>
        ∙ Delete
      </span>
    </>
  );
}
