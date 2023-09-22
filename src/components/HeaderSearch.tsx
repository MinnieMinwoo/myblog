"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

const HeaderSearch = () => {
  const router = useRouter();
  const params = useParams();
  const [query, setQuery] = useState("");
  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const { nickname } = params;
    router.push(`/search?query=${query}${nickname ? `&user=${nickname}` : ""}`);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setQuery(value);
  };

  return (
    <div className="SearchBox d-inline-block align-middle me-2 me-md-4" onSubmit={onSubmit}>
      <form className="d-flex" role="search">
        <input
          className="form-control me-2 d-none d-md-inline-block"
          type="search"
          placeholder="Search posts"
          aria-label="Search"
          value={query}
          onChange={onChange}
        />
        <button className="btn btn-outline-success d-inline-block" type="submit">
          Search
        </button>
      </form>
    </div>
  );
};

export default HeaderSearch;
