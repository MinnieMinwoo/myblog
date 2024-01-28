"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import PostPagination from "components/PostPagination";
import PostThumbnailBox from "components/PostThumbnailBox";
import getCurrentUserToken from "logics/getCurrentUserToken";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

const Search = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") ?? "");
  const user = searchParams.get("user");

  const {
    data: postData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["postAllLists", query],
    queryFn: async ({ pageParam }): Promise<PostList> => {
      const queryString = pageParam
        ? `&${Object.entries(pageParam)
            .map(([key, value]) => value && key + "=" + value)
            .filter((v) => v)
            .join("&")}`
        : "";
      if (!query)
        return {
          postList: [],
        };
      try {
        await getCurrentUserToken();
        const result = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/search/?query=${query}${user ? `&user=${user}` : ""}${queryString}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
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

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setQuery(value);

    const params = new URLSearchParams(searchParams);
    params.set("query", query);
    router.push(pathname + "?" + params.toString());
  };

  return (
    <div className="d-flex flex-column min-vh-100 overflow-hidden">
      <section className="flex-grow-1">
        <div className="row">
          <div className="col col-10 offset-1 col-lg-8 offset-lg-2 col-xxl-6 offset-xxl-3">
            <section className="d-flex align-items-end mb-4">
              <div className="flex-grow-1 me-3">
                <label className="form-label" htmlFor="query">
                  {searchParams.get("user") ? `Search ${searchParams.get("user")}'s posts` : "Search all posts"}
                </label>
                <input id="query" type="text" className="form-control" value={query} onChange={onChange} required />
              </div>
            </section>
            {status === "loading" ? (
              <div className="Pagination page-spinner-center mb-4">
                <div className="spinner-border text-secondary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : status === "error" ? (
              <h5>Something wrong. Please try again.</h5>
            ) : (
              <>
                {!postData.pages.length ? (
                  <h5>No posts.</h5>
                ) : (
                  <>
                    <PostThumbnailBox postList={postData.pages.map((e) => e.postList).flat()} />
                    <PostPagination
                      isFetching={isFetching}
                      isFetchingNextPage={isFetchingNextPage}
                      isLastPost={!hasNextPage}
                      callBack={fetchNextPage}
                    />
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Search;
