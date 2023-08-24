import PostCategoryCard from "./CategoryCard";

interface Props {
  isEdit: boolean;
  categoryList: CategoryMainData[];
}

export default function CategorySection({ isEdit, categoryList }: Props) {
  const onAdd = (index: number) => {
    const name = window.prompt("Add new sub category name");
    if (!name) return; // no name
    // duplicate name
    if (categoryList[index].subCategory.findIndex((subCategory) => subCategory.name === name)) {
      window.alert("duplicate name");
      return;
    }

    const newCategoryList = structuredClone(categoryList);
    newCategoryList[index].subCategory.push({ name: name, thumbnailImageURL: "" });
  };

  const onEdit = (index: number) => {
    const name = window.prompt("Insert new main category name");
    if (!name) return; // no name
    // duplicate name
    if (categoryList[index].subCategory.findIndex((subCategory) => subCategory.name === name)) {
      window.alert("duplicate name");
      return;
    }

    const newCategoryList = structuredClone(categoryList);
    newCategoryList[index].name = name;
  };

  const onDelete = (index: number) => {
    if (!window.confirm("If you really want delete this category?")) return; //confirm
    const newCategoryList = categoryList.filter((_, i) => i !== index);
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
