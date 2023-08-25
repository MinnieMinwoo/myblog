import { useParams } from "next/navigation";

interface Props {
  mainCategory: CategoryMainData;
}

const CategorySideContent = ({ mainCategory }: Props) => {
  const params = useParams();
  const { id: nickname } = params;

  return (
    <div className="CategorySideContent">
      <p className="my-1 mx-0 text-primary">{mainCategory.name}</p>
      <ul className="m-0 list-unstyled ps-5px pe-3px py-1">
        {mainCategory.subCategory.map(({ name: subCategoryName }, id) => (
          <li key={id} className="ps-2 bs-light-lg">
            <a
              className="fs-6 text-decoration-none text-777"
              href={`/home/${nickname}/category/${mainCategory.name}/${subCategoryName}`}
            >
              {subCategoryName}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySideContent;
