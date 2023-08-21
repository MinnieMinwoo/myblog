"use client";

export default function LikeButton() {
  return (
    <button
      className={`btn btn${
        //postData && userData?.uid && postData.likes.includes(userData.uid) ? "" : "-outline"
        ""
      }-primary w-100px h-50px me-3`}
    >
      ♡
      {`(${
        0
        //todo: get likes length
      })`}
    </button>
  );
}
