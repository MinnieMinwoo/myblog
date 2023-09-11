"use client";

import PostThumbnailBox from "components/PostThumbnailBox";
import PostPagination from "components/PostPagination";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import CategorySideBar from "components/CategorySideBar";
import getCurrentUserToken from "logics/getCurrentUserToken";

export default function HomePage({ params }: { params: { nickname: string; names: string[] } }) {
  const { nickname, names } = params;
  const [categoryMain, categorySub] = names;

  const {
    data: postData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status: postStatus,
  } = useInfiniteQuery({
    queryKey: ["postAllLists", nickname],
    queryFn: async ({ pageParam }): Promise<UserPostList> => {
      const queryString = pageParam
        ? `?${Object.entries(pageParam)
            .map(([key, value]) => value && key + "=" + value)
            .filter((v) => v)
            .join("&")}` + `&categoryMain=${categoryMain}&categorySub=${categorySub}`
        : `?categoryMain=${categoryMain}&categorySub=${categorySub}`;

      try {
        const token = await getCurrentUserToken();
        return await (
          await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/posts/${nickname}${queryString}`, {
            headers: {
              "Content-Type": "application/json",
            },
          })
        ).json();
      } catch (error) {
        throw error;
      }
    },
    getNextPageParam: (postData) => postData.LastEvaluatedKey,
  });

  const { data: categoryList } = useQuery({
    queryKey: ["CategoryLists", nickname],
    queryFn: async (): Promise<CategoryMainData[]> => {
      try {
        const data = await (
          await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/categories/${nickname}`, {
            headers: {
              "Content-Type": "application/json",
            },
          })
        ).json();
        if (!data.category) throw new Error("No category data.");
        else return data.category;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  });

  return (
    <>
      <div className="flex-grow-1 px-md-3 my-4 mx-md-4">
        <div className="row">
          <div className=" col col-10 offset-1 col-lg-8 offset-lg-2 col-xxl-6 offset-xxl-3">
            <section
              className="bg-image w-100 bg-opacity-50 px-4 mb-4 h-340px text-eee"
              style={{
                background: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
                url(${
                  categoryList?.find((e) => e.name === categoryMain)?.subCategory.find((e) => e.name === categorySub)
                    ?.thumbnailImageURL ?? "/altThumbnail.jpg"
                }) center/cover no-repeat`,
              }}
            >
              <h2 className="fs-1 fw-middle mb-3 pt-140px text-white">{`${categoryMain} - ${categorySub}`}</h2>
              {postStatus === "success" && (
                <span className="fs-5 text-white">{`${postData?.pages[0].postCount} ${
                  postData?.pages[0].postCount && postData?.pages[0].postCount !== 1 ? "posts" : "post"
                }`}</span>
              )}
            </section>
            {postStatus === "loading" ? (
              <></>
            ) : postStatus === "error" ? (
              <p>Something Wrong... Try again</p>
            ) : (
              <PostThumbnailBox postList={postData.pages.map((e) => e.postList).flat()} />
            )}
            {postStatus !== "error" && (
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
