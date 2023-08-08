"use client";

import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    const data = {
      title: "test1",
      name: "test2",
    };

    fetch("https://b88yhx9gmh.execute-api.ap-northeast-2.amazonaws.com/dev/posts/123", {
      headers: {
        "Content-Type": "application/json",
      },
    }).then((result) => console.log(result));
  }, []);
  return;
}
