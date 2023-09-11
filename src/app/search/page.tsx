"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import PostPagination from "components/PostPagination";
import PostThumbnailBox from "components/PostThumbnailBox";
import getCurrentUserToken from "logics/getCurrentUserToken";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Search = () => {
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();

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
        ? `?${Object.entries(pageParam)
            .map(([key, value]) => value && key + "=" + value)
            .filter((v) => v)
            .join("&")}`
        : "";
      const query = searchParams.get("query");
      const user = searchParams.get("user");
      if (!query)
        return {
          postList: [],
        };
      try {
        await getCurrentUserToken();
        const result = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/search/?query=${query}${user ? `&user=${user}` : ""}`,
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
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!query) return;
    const user = searchParams.get("user") ?? "";
    const params = new URLSearchParams(searchParams.toString());
    params.set("query", query);
    if (user) params.set("user", user);
  };

  useEffect(() => {
    const query = searchParams.get("query");
    setQuery(query ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100 overflow-hidden">
      <section className="flex-grow-1">
        <div className="row">
          <div className="col col-10 offset-1 col-lg-8 offset-lg-2 col-xxl-6 offset-xxl-3">
            <form className="d-flex align-items-end mb-4" onSubmit={onSubmit}>
              <div className="flex-grow-1 me-3">
                <label className="form-label">
                  {searchParams.get("user") ? `Search ${searchParams.get("user")}'s posts` : "Search all posts"}
                </label>
                <input type="text" className="form-control" value={query} onChange={onChange} required />
              </div>
              {status === "loading" ? (
                <button className="btn btn-outline-success w-80px h-40px" type="submit" disabled>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                </button>
              ) : (
                <button type="submit" className="btn btn-outline-success w-80px h-40px">
                  Search
                </button>
              )}
            </form>
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
