"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import getCurrentUserData from "logics/getCurrentUserData";
import CategorySection from "./CategorySection";
import updateCategoryList from "logics/updateCategoryList";
import CategorySideBar from "../../../../components/CategorySideBar";

export default function CategoryPage({ params: { nickname } }: { params: { nickname: string } }) {
  const { data: userData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserData,
  });

  const { status, data: categoryList } = useQuery({
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

  const queryClient = useQueryClient();
  const { mutate: updateCategory } = useMutation({
    mutationFn: (categoryData) => {
      if (!userData) throw new Error("no user data");
      else return updateCategoryList(userData.id, userData.nickname, categoryData);
    },
    onMutate: async (newCategoryData: CategoryMainData[]) => {
      await queryClient.cancelQueries({ queryKey: ["CategoryLists", nickname] });
      const previousCategoryData = queryClient.getQueryData(["CategoryLists", nickname]);
      queryClient.setQueryData(["CategoryLists", nickname], () => newCategoryData);
      return { previousCategoryData };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["CategoryLists", nickname], context?.previousCategoryData ?? {});
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["CategoryLists", nickname] });
    },
  });

  const onAdd = () => {
    if (!categoryList || !userData?.id || nickname !== userData?.nickname) return; // invalid access
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
                  {nickname === userData?.nickname && (
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
