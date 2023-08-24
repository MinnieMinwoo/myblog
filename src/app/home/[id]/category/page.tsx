"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import getCurrentUserData from "logics/getCurrentUserData";
import getCategoryList from "./getCategoryList";
import CategorySection from "./CategorySection";

export default function CategoryPage() {
  const params = useParams();
  const { id } = params;

  const [isEdit, setIsEdit] = useState(false);

  const { status, data: categoryList } = useQuery({
    queryKey: ["CategoryLists", id],
    queryFn: () => getCategoryList(id),
  });

  const { data: userData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserData,
  });

  const onEdit = () => {
    setIsEdit((prev) => !prev);
  };

  return (
    <>
      <div className="flex-grow-1 px-md-3 my-4 mx-md-4">
        <div className=" col col-10 offset-1 col-lg-8 offset-lg-2 col-xxl-6 offset-xxl-3">
          {status === "loading" ? (
            <></>
          ) : status === "error" || !categoryList ? (
            <p>Something Wrong... Try again</p>
          ) : (
            <>
              <section className=" mb-3 hstack gap-1">
                <h2 className="fw-bold d-inline-block">{"Categories"}</h2>
                <span className="text-primary fs-5">{`(${categoryList.length})`}</span>
                {isEdit && (
                  <button className="btn btn-outline-primary ms-auto w-100px" name="addMainCategory" onClick={() => {}}>
                    Add
                  </button>
                )}
                {id === userData?.nickname && (
                  <button className={`btn btn-primary ${isEdit ? null : "ms-auto"}`} onClick={onEdit}>
                    {isEdit ? "Complete" : "Edit"}
                  </button>
                )}
              </section>
              <CategorySection isEdit={isEdit} categoryList={categoryList} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
