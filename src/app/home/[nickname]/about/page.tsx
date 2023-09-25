"use client";

import { useQuery } from "@tanstack/react-query";
import getCurrentUserData from "logics/getCurrentUserData";
import AboutReader from "./AboutReader";
import { Suspense, useState } from "react";
import CategorySideBar from "components/CategorySideBar";

export default function AboutPage({ params: { nickname } }: { params: { nickname: string } }) {
  const { data: userData, status: userStatus } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserData,
  });

  const [isEdit, setIsEdit] = useState(false);
  const onClick = () => setIsEdit((prev) => !prev);

  return (
    <main className="flex-grow-1 row">
      <div className="col col-10 offset-1 col-lg-8 offset-lg-2 col-xxl-6 offset-xxl-3">
        <div className="px-md-3 my-4 mx-md-4">
          <section className="pb-3 bb-light">
            <h2 className="d-inline-block fw-bold">{"" ? "Edit page" : "About"}</h2>
            {userStatus === "success" && userData?.nickname === nickname && (
              <button className="btn btn-primary float-end mt-1 me-3" onClick={onClick}>
                {isEdit ? "Complete" : "Edit"}
              </button>
            )}
            <hr />
            <Suspense fallback={<></>}>{isEdit ? <></> : <AboutReader nickname={nickname} />}</Suspense>
          </section>
        </div>
      </div>
      <div className="col">
        <CategorySideBar />
      </div>
    </main>
  );
}
