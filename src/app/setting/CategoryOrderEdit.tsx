import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import getCurrentUserData from "logics/getCurrentUserData";
import getUserCategoryData from "logics/getUserCategoryData";
import updateCategoryList from "logics/updateCategoryList";
import useColorScheme from "logics/useColorScheme";
import React, { useRef, useState } from "react";

const CategoryOrderEdit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isSubCategory, setIsSubCategory] = useState(0);
  const [mainIndex, setMainIndex] = useState(0);
  const [categoryData, setCategoryData] = useState<CategoryMainData[]>([]);
  const { colorScheme } = useColorScheme();
  const queryClient = new QueryClient();

  const { data: userData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserData,
  });

  const { data: categoryList } = useQuery({
    queryKey: ["CategoryLists", userData?.nickname],
    queryFn: () =>
      getUserCategoryData(userData?.nickname ?? "").then((result) => {
        setCategoryData([...result]);
        return result;
      }),
    enabled: !!userData?.nickname,
  });

  const { mutate: updateCategory } = useMutation({
    mutationFn: (categoryData) => {
      if (!userData) throw new Error("no user data");
      else return updateCategoryList(userData.id, userData.nickname, categoryData);
    },
    onMutate: async (newCategoryData: CategoryMainData[]) => {
      await queryClient.cancelQueries({ queryKey: ["CategoryLists", userData?.nickname] });
      const previousCategoryData = queryClient.getQueryData(["CategoryLists", userData?.nickname]);
      queryClient.setQueryData(["CategoryLists", userData?.nickname], () => newCategoryData);
      return { previousCategoryData };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["CategoryLists", userData?.nickname], context?.previousCategoryData ?? {});
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["CategoryLists", userData?.nickname] });
    },
  });

  const onClickMain = async () => {
    if (isEdit && userData) {
      setIsLoading(true);
      try {
        // todo
      } catch (error) {
        console.log(error);
        window.alert("Category update failed");
      } finally {
        setIsLoading(false);
      }
    }
    setIsEdit((prev) => !prev);
  };

  const onMainCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const {
      target: { value },
    } = event;
    setIsSubCategory(Number(value));
  };
  const onSubCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const {
      target: { value },
    } = event;
    setMainIndex(Number(value));
  };

  // drag logic
  const draggingItemIndex = useRef<number | null>(null);
  const draggingOverItemIndex = useRef<number | null>(null);

  const onDragStart = (event: React.DragEvent, index: number) => {
    draggingItemIndex.current = index;
    if (event.target instanceof HTMLLIElement) event.target.classList.add("grab");
  };
  const onDragEnter = (event: React.DragEvent, index: number) => {
    if (!categoryList || !(event.target instanceof HTMLLIElement)) return;
    draggingOverItemIndex.current = index;
    const copyCategoryList = structuredClone(categoryList);
    if (draggingItemIndex.current === null || draggingOverItemIndex.current === null) return;
    if (isSubCategory) {
      const subCategoryTemp = structuredClone(copyCategoryList[mainIndex].subCategory[draggingItemIndex.current]);
      copyCategoryList[mainIndex].subCategory[draggingItemIndex.current] =
        copyCategoryList[mainIndex].subCategory[draggingOverItemIndex.current];
      copyCategoryList[mainIndex].subCategory[draggingOverItemIndex.current] = subCategoryTemp;
    } else {
      const mainCategoryTemp = structuredClone(copyCategoryList[draggingItemIndex.current]);
      copyCategoryList[draggingItemIndex.current] = copyCategoryList[draggingOverItemIndex.current];
      copyCategoryList[draggingOverItemIndex.current] = mainCategoryTemp;
    }
    queryClient.setQueryData(["CategoryLists", userData?.nickname], copyCategoryList);
    setCategoryData([...copyCategoryList]);
  };
  const onDragEnd = () => {
    updateCategory(categoryData);
    draggingItemIndex.current = null;
    draggingOverItemIndex.current === null;
  };

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  /* todo: refactor code to use settingData component */
  return (
    <>
      <div className={`SettingData px-3 ${isEdit ? "pt-4 py-2" : "bb-light py-4"}`}>
        <h3 className={`d-inline-block fs-5 w-170px ${colorScheme === "dark" ? "text-eee" : "text-111"}`}>
          Category order
        </h3>
        <span className="d-inline-block float-end">
          <div className="hstack">
            <button className="btn btn-primary w-98px" onClick={onClickMain} disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span className="visually-hidden">Loading...</span>
                </>
              ) : isEdit ? (
                "Save"
              ) : (
                "Edit"
              )}
            </button>
          </div>
        </span>
        <p className={`mt-2 mb-0 fs-14px ${colorScheme === "dark" ? "text-999" : "text-777"}`}>
          Adjust the order of categories shown.
        </p>
      </div>
      {isEdit && (
        <div className="SettingData px-3 py-4 bb-light">
          <select className="form-select form-select-md mb-2" value={isSubCategory} onChange={onMainCategoryChange}>
            <option value={0}>Main Category</option>
            <option value={1}>Sub Category</option>
          </select>
          <select
            className="form-select form-select-sm mb-3"
            hidden={!isSubCategory}
            value={mainIndex}
            onChange={onSubCategoryChange}
          >
            {categoryList?.map((category, index) => (
              <option key={category.name} value={index}>
                {category.name}
              </option>
            ))}
          </select>
          {categoryData.length && (
            <ul className="list-group">
              {isSubCategory
                ? categoryData[mainIndex].subCategory.map((subCategory, index) => (
                    <li
                      key={subCategory.name}
                      className="list-group-item list-group-item-action"
                      onDragStart={(event) => onDragStart(event, index)}
                      onDragEnter={(event) => onDragEnter(event, index)}
                      onDragEnd={onDragEnd}
                      onDragOver={(event) => onDragOver(event)}
                      draggable={true}
                    >
                      {subCategory.name}
                    </li>
                  ))
                : categoryData.map((category, index) => (
                    <li
                      key={category.name}
                      className="list-group-item list-group-item-action"
                      onDragStart={(event) => onDragStart(event, index)}
                      onDragEnter={(event) => onDragEnter(event, index)}
                      onDragEnd={onDragEnd}
                      onDragOver={(event) => onDragOver(event)}
                      draggable={true}
                    >
                      {category.name}
                    </li>
                  ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
};

export default CategoryOrderEdit;
