"use client";
import { useQuery } from "@tanstack/react-query";
import getCurrentUserData from "logics/getCurrentUserData";
import { useParams } from "next/navigation";

export default function CategoryPage() {
  const params = useParams();
  const { id } = params;

  const { status, data, error } = useQuery({
    queryKey: ["CategoryLists", id],
    queryFn: () => {},
  });

  const { data: userData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserData,
  });

  return (
    <>
      <div className="flex-grow-1 px-md-3 my-4 mx-md-4">
        <div className=" col col-10 offset-1 col-lg-8 offset-lg-2 col-xxl-6 offset-xxl-3">
          <section className=" mb-3 hstack gap-1"></section>
          Hello
        </div>
      </div>
    </>
  );
}
