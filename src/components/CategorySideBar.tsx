"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import getCategoryList from "../app/home/[id]/category/getCategoryList";
import CategorySideContent from "./CategorySideContent";

export default function CategorySideBar() {
  const params = useParams();
  const { id } = params;
  const { status, data: categoryList } = useQuery({
    queryKey: ["CategoryLists", id],
    queryFn: () => getCategoryList(id),
  });

  return (
    <aside className="CategorySideBar d-none d-lg-block ps-4 my-5 bs-light">
      <nav className="category_navigation">
        <p className="fs-6 fw-bold text-decoration-none mb-3 text-dark">Categories</p>
        {status === "success" &&
          categoryList.map((element, index) => <CategorySideContent key={index} mainCategory={element} />)}
      </nav>
    </aside>
  );
}
