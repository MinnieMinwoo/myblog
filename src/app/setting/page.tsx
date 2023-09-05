"use client";
import { useQuery } from "@tanstack/react-query";
import getCurrentUserData from "logics/getCurrentUserData";
import SettingData from "./SettingData";
import ProfileInfoEdit from "./ProfileInfoEdit";
import ProfileImageEdit from "./ProfileImageEdit";

export default function SettingPage() {
  const { data: userData, status } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserData,
  });

  const onEmailChange = async () => {
    const email = window.prompt("Enter new email address.");
    const password = window.prompt("Enter your password.");
  };

  const onQuit = async () => {
    if (!window.confirm("If you want quit myBlog?")) return;
    const password = window.prompt("Enter your password.");
  };

  return (
    <>
      {
        status === "loading" ? null : null // todo: input fallback loading
      }
      <main className="EditProfile">
        <section className="py-4 col col-lg-10 offset-lg-1 col-xxl-8 offset-xxl-2">
          <div className="hstack">
            <ProfileImageEdit />
            <div className="vr"></div>
            <ProfileInfoEdit />
          </div>
        </section>
        <hr className="col col-lg-10 offset-lg-1 col-xxl-8 offset-xxl-2" />
        <section className="col col-lg-10 offset-lg-1 col-xxl-8 offset-xxl-2">
          <SettingData
            title="Email address"
            description="Email address that receives authentication or notification."
            buttonMessage="Change"
            currentData={userData?.email}
            onClick={onEmailChange}
          />
          {
            // <SocialLoginEdit />
          }
          {
            // <CategoryOrderEdit />
          }
          <SettingData
            title="Withdrawal"
            description="All posts and comments you created upon withdrawal will be deleted and will not be
            recovered."
            buttonMessage="Quit"
            onClick={onQuit}
          />
        </section>
      </main>
    </>
  );
}
