import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PostCategoryCard from "./CategoryCard";
import updateCategoryList from "../../../../logics/updateCategoryList";
import getCurrentUserData from "logics/getCurrentUserData";
import { useParams } from "next/navigation";

interface Props {
  isEdit: boolean;
  categoryList: CategoryMainData[];
}

export default function CategorySection({ isEdit, categoryList }: Props) {
  const params = useParams();
  const { nickname } = params;

  const { data: userData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserData,
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

  const onAdd = async (index: number) => {
    if (!userData?.id || nickname !== userData?.nickname) return; // invalid access
    const name = window.prompt("Add new sub category name");
    if (!name) return; // no name
    // duplicate name
    if (categoryList[index].subCategory.findIndex((subCategory) => subCategory.name === name) !== -1) {
      window.alert("duplicate name");
      return;
    }

    const newCategoryList = structuredClone(categoryList);
    newCategoryList[index].subCategory.push({ name: name, thumbnailImageURL: "" });
    updateCategory(newCategoryList);
  };

  const onEdit = (index: number) => {
    if (!userData?.id || nickname !== userData?.nickname) return; // invalid access
    const name = window.prompt("Insert new main category name");
    if (!name) return; // no name
    // duplicate name
    if (categoryList[index].subCategory.findIndex((subCategory) => subCategory.name === name) !== -1) {
      window.alert("duplicate name");
      return;
    }

    const newCategoryList = structuredClone(categoryList);
    newCategoryList[index].name = name;
    updateCategory(newCategoryList);
  };

  const onDelete = (index: number) => {
    if (!userData?.id || nickname !== userData?.nickname) return; // invalid access
    if (!window.confirm("If you really want delete this category?")) return; //confirm
    const newCategoryList = categoryList.filter((_, i) => i !== index);
    updateCategory(newCategoryList);
  };

  return (
    <div className="PostCategorySection col">
      {categoryList.map((categoryMainData, id) => {
        return (
          <section className="pt-3 pb-4 bt-light" key={id}>
            <div className="hstack gap-1 mb-1">
              <h3 className="fw-semibold d-inline-block text-333">{categoryMainData.name}</h3>
              <span className="text-info fs-5">({categoryMainData.subCategory.length})</span>
              {isEdit && (
                <>
                  <button className="btn btn-outline-primary w-100px ms-auto" onClick={() => onAdd(id)}>
                    Add
                  </button>
                  <button className="btn btn-outline-info w-100px " onClick={() => onEdit(id)}>
                    Edit
                  </button>
                  <button className="btn btn-danger w-100px " onClick={() => onDelete(id)}>
                    Delete
                  </button>
                </>
              )}
            </div>
            <div className="container p-0 d-flex flex-wrap w-100">
              {categoryMainData.subCategory.map((subCategory) => (
                <PostCategoryCard
                  key={`${categoryMainData.name}-${subCategory.name}`}
                  isEdit={isEdit}
                  mainCategoryName={categoryMainData.name}
                  subCategoryName={subCategory.name}
                  thumbnailImageURL={subCategory.thumbnailImageURL}
                  categoryList={categoryList}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
