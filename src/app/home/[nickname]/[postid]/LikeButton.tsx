"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getCurrentUserData from "logics/getCurrentUserData";
import getCurrentUserToken from "logics/getCurrentUserToken";
import { useParams } from "next/navigation";

export default function LikeButton() {
  const params = useParams();
  const { postid } = params;

  const { data: userData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserData,
  });

  const { data: likes, status } = useQuery({
    queryKey: ["likes", postid],
    queryFn: async () => {
      try {
        const { likes: likesList } = await (
          await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/posts/detail/${postid}/likes`)
        ).json();
        console.log(likesList);
        return likesList;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
  });

  const queryClient = useQueryClient();

  const { mutate: updateLikes } = useMutation({
    mutationFn: () => {
      if (!userData) throw new Error("no user data");

      const getLikeFunction = async () => {
        const token = await getCurrentUserToken();
        const likesList: string[] = await (
          await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/posts/detail/${postid}/likes`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            method: "POST",
          })
        ).json();
        return likesList;
      };
      return getLikeFunction();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["likes", postid] });
      const previousLikes = queryClient.getQueryData(["likes", postid]);
      queryClient.setQueryData(["likes", postid], () =>
        likes.includes(userData?.id) ? likes.filter((id: string) => id !== userData?.id) : [...likes, userData?.id]
      );
      return { previousLikes };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["likes", postid], context?.previousLikes ?? {});
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", postid] });
    },
  });

  return (
    <button
      className={`btn btn${
        status === "success" && userData?.id && likes.includes(userData.id) ? "" : "-outline"
      }-primary w-100px h-50px me-3`}
      onClick={() => updateLikes()}
    >
      ♡{`(${status === "success" ? likes.length : 0})`}
    </button>
  );
}
