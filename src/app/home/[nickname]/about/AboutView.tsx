"use client";

import { useQuery } from "@tanstack/react-query";
import getCurrentUserData from "logics/getCurrentUserData";
import AboutReader from "./AboutReader";
import { Suspense, useState } from "react";
import CategorySideBar from "components/CategorySideBar";
import dynamic from "next/dynamic";
import getCurrentUserToken from "logics/getCurrentUserToken";
const AboutEdit = dynamic(() => import("./AboutEdit"), { ssr: false });

export default function AboutView({ about, nickname }: { about: string; nickname: string }) {
  const { data: userData, status: userStatus } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserData,
  });

  const [isEdit, setIsEdit] = useState(false);
  const [aboutData, setAboutData] = useState(about);
  const onClick = async () => {
    if (isEdit === false) setIsEdit(true);
    else {
      const result = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/users/about/${nickname}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getCurrentUserToken()}`,
        },
        body: JSON.stringify({
          about: aboutData,
        }),
      });
      if (result.ok) {
        window.alert("About update complete");
        window.location.reload();
      } else {
        window.alert("About update failed");
        setIsEdit(false);
        setAboutData(aboutData);
      }
    }
  };

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
            {isEdit ? (
              <Suspense
                fallback={
                  <div className="d-flex justify-content-center">
                    <div className="spinner-border spinner-border-lg start-50" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                }
              >
                <AboutEdit aboutData={aboutData} setAboutData={setAboutData} />
              </Suspense>
            ) : (
              <AboutReader about={about} />
            )}
          </section>
        </div>
      </div>
      <div className="col">
        <CategorySideBar />
      </div>
    </main>
  );
}
