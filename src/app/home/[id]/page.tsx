"use client";

import { useParams } from "next/navigation";
import getPostThumbnailData from "./getPostThumbnailData";
import PostThumbnailBox from "components/PostThumbnailBox";
import getCurrentUserData from "logics/getCurrentUserData";
import Link from "next/link";
import PostPagination from "components/PostPagination";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export default function HomePage() {
  const params = useParams();
  const { id } = params;

  const {
    data: postData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["postAllLists"],
    queryFn: async ({ pageParam }) => getPostThumbnailData(id, pageParam),
    getNextPageParam: (postData) => postData.LastEvaluatedKey,
  });

  const { data: userData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserData,
  });

  return (
    <>
      <div className="flex-grow-1 px-md-3 my-4 mx-md-4">
        <div className=" col col-10 offset-1 col-lg-8 offset-lg-2 col-xxl-6 offset-xxl-3">
          <section className=" mb-3 hstack gap-1">
            <h2 className="fw-bold d-inline-block">Posts</h2>
            <span className="text-primary fs-5">{postData ? `(${String(postData.pages[0].postCount)})` : ""}</span>
            {userData && id === userData.nickname ? (
              <Link href="/write" role="button" className="btn btn-outline-primary ms-auto">
                Write
              </Link>
            ) : null}
          </section>
          {status === "loading" ? (
            <></>
          ) : status === "error" ? (
            <p>Something Wrong... Try again</p>
          ) : (
            <PostThumbnailBox postList={postData.pages.map((e) => e.postList).flat()} />
          )}
          {status !== "error" && (
            <PostPagination
              isFetching={isFetching}
              isFetchingNextPage={isFetchingNextPage}
              isLastPost={!hasNextPage}
              callBack={fetchNextPage}
            />
          )}
        </div>
      </div>
    </>
  );
}
