"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const Search = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

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
    getResults(query, user);
  };

  const getResults = async (query: string, user = "") => {
    setIsLoading(true);
  };

  useEffect(() => {
    const query = searchParams.get("query");
    setQuery(query ?? "");
    const user = searchParams.get("user") ?? "";
    if (query) getResults(query, user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPagination = async () => {};

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
              {isLoading ? (
                <button className="btn btn-outline-success w-80px h-40px" type="submit" disabled>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                </button>
              ) : (
                <button type="submit" className="btn btn-outline-success w-80px h-40px">
                  Search
                </button>
              )}
            </form>
            {/*
                        {query && !postList.length && <h5>No posts.</h5>}
            <PostThumbnailBox postList={postList} />
            <Pagination isLastPost={isLastPost} postIndex={postIndex} callBack={onPagination} />

            */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Search;
