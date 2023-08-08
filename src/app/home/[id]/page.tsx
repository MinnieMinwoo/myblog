"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const params = useParams();

  useEffect(() => {
    fetch(`https://b88yhx9gmh.execute-api.ap-northeast-2.amazonaws.com/dev/posts/${params.id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (result) => {
      console.log(result);
      const response = await result.json();
      console.log(response);
    });
  }, []);
  return;
}
