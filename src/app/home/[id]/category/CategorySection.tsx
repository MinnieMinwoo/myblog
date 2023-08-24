import { useRef } from "react";
import PostCategoryCard from "./CategoryCard";

interface Props {
  isEdit: boolean;
  categoryData: CategoryMainData[];
}

export default function CategorySection({ isEdit, categoryData }: Props) {
  const categoryRef = useRef<HTMLInputElement>(null);

  return (
    <div className="PostCategorySection col">
      {categoryData.map((categoryMainData, id) => {
        return (
          <section className="pt-3 pb-4 bt-light" key={id}>
            <div className="hstack gap-1 mb-1">
              <h3 className="fw-semibold d-inline-block text-333">{categoryMainData.name}</h3>
              <span className="text-info fs-5">({categoryMainData.subCategory.length})</span>
              {isEdit ? (
                <>
                  <button className="btn btn-outline-primary w-100px ms-auto" id={`${id},1`} name="addSubCategory">
                    Add
                  </button>
                  <button className="btn btn-outline-secondary w-100px " id={`${id},2`} name="editMainCategory">
                    Edit
                  </button>
                  <button className="btn btn-danger w-100px " id={`${id},3`} name="deleteMainCategory">
                    Delete
                  </button>
                </>
              ) : null}
            </div>
            <div className="container p-0 d-flex flex-wrap w-100">
              {categoryMainData.subCategory.map((subCategory, subID) => (
                <PostCategoryCard
                  key={`${categoryMainData.name}-${subCategory.name}`}
                  isEdit={isEdit}
                  mainCategoryName={categoryMainData.name}
                  subCategoryName={subCategory.name}
                  thumbnailImageURL={subCategory.thumbnailImageURL}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
