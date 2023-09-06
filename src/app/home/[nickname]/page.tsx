"use client";

import { useParams } from "next/navigation";
import PostThumbnailBox from "components/PostThumbnailBox";
import getCurrentUserData from "logics/getCurrentUserData";
import Link from "next/link";
import PostPagination from "components/PostPagination";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import CategorySideBar from "../../../components/CategorySideBar";
import getCurrentUserToken from "logics/getCurrentUserToken";

export default function HomePage() {
  const params = useParams();
  const { nickname } = params;

  const {
    data: postData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["postAllLists", nickname],
    queryFn: async ({ pageParam }): Promise<UserPostData> => {
      const queryString = pageParam
        ? `?${Object.entries(pageParam)
            .map(([key, value]) => value && key + "=" + value)
            .filter((v) => v)
            .join("&")}`
        : "";

      try {
        await getCurrentUserToken();
        const result = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/posts/${nickname}${queryString}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!result.ok) {
          const { error } = await result.json();
          throw new Error(error);
        } else {
          const body = await result.json();
          return body;
        }
      } catch (error) {
        throw error;
      }
    },
    getNextPageParam: (postData) => postData.LastEvaluatedKey,
  });

  const { data: userData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserData,
  });

  return (
    <>
      <div className="flex-grow-1 px-md-3 my-4 mx-md-4">
        <div className="row">
          <div className=" col col-10 offset-1 col-lg-8 offset-lg-2 col-xxl-6 offset-xxl-3">
            <section className=" mb-3 hstack gap-1">
              <h2 className="fw-bold d-inline-block">Posts</h2>
              <span className="text-primary fs-5">{postData ? `(${String(postData.pages[0].postCount)})` : ""}</span>
              {userData && nickname === userData.nickname ? (
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
          <div className="col">
            <CategorySideBar />
          </div>
        </div>
      </div>
    </>
  );
}
