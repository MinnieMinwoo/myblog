"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import getCurrentUserData from "logics/getCurrentUserData";
import getCategoryList from "./getCategoryList";
import CategorySection from "./CategorySection";
import updateCategoryList from "logics/updateCategoryList";
import CategorySideBar from "../../../../components/CategorySideBar";

export default function CategoryPage() {
  const params = useParams();
  const { id } = params;

  const { data: userData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserData,
  });

  const { status, data: categoryList } = useQuery({
    queryKey: ["CategoryLists", id],
    queryFn: () => getCategoryList(id),
  });

  const queryClient = useQueryClient();
  const { mutate: updateCategory } = useMutation({
    mutationFn: (categoryData) => {
      if (!userData) throw new Error("no user data");
      else return updateCategoryList(userData.id, userData.nickname, categoryData);
    },
    onMutate: async (newCategoryData: CategoryMainData[]) => {
      await queryClient.cancelQueries({ queryKey: ["CategoryLists", params.id] });
      const previousCategoryData = queryClient.getQueryData(["CategoryLists", params.id]);
      queryClient.setQueryData(["CategoryLists", params.id], () => newCategoryData);
      return { previousCategoryData };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["CategoryLists", params.id], context?.previousCategoryData ?? {});
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["CategoryLists", params.id] });
    },
  });

  const onAdd = () => {
    if (!categoryList || !userData?.id || params.id !== userData?.nickname) return; // invalid access
    const name = window.prompt("Add new main category name");
    if (!name) return; // no name
    // duplicate name
    if (categoryList.findIndex((mainCategory) => mainCategory.name === name) !== -1) {
      window.alert("duplicate name");
      return;
    }

    const newCategoryList = structuredClone(categoryList);
    newCategoryList.push({ name: name, subCategory: [] });
    updateCategory(newCategoryList);
  };

  const [isEdit, setIsEdit] = useState(false);
  const onEdit = () => {
    setIsEdit((prev) => !prev);
  };

  return (
    <>
      <div className="flex-grow-1 px-md-3 my-4 mx-md-4">
        <div className="row">
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
                    <button className="btn btn-outline-primary ms-auto w-100px" name="addMainCategory" onClick={onAdd}>
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
          <div className="col">
            <CategorySideBar />
          </div>
        </div>
      </div>
    </>
  );
}
