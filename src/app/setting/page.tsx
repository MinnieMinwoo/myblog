"use client";
import { useQuery } from "@tanstack/react-query";
import getCurrentUserData from "logics/getCurrentUserData";
import SettingData from "./SettingData";
import ProfileInfoEdit from "./ProfileInfoEdit";
import ProfileImageEdit from "./ProfileImageEdit";
import CategoryOrderEdit from "./CategoryOrderEdit";
import getCurrentUserToken from "logics/getCurrentUserToken";
import { useRouter } from "next/navigation";

export default function SettingPage() {
  const router = useRouter();

  const { data: userData, status } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserData,
  });

  const onEmailChange = async () => {
    const email = window.prompt("Enter new email address.");
    if (!email) return;
    const result = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/email`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getCurrentUserToken()}`,
      },
      body: JSON.stringify({
        email: email,
      }),
    });
    if (result.ok) {
      while (true) {
        const verificationCode = window.prompt("Enter verification code.");
        if (verificationCode === null) break;
        const verificationResult = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await getCurrentUserToken()}`,
          },
          body: JSON.stringify({
            code: verificationCode,
          }),
        });
        if (verificationResult.ok) {
          window.alert("Email update complete");
          window.location.reload();
          break;
        } else continue;
      }
    } else window.alert("Email update failed.");
  };

  const onPasswordChange = async () => {
    const currentPassword = window.prompt("Enter current password.");
    if (!currentPassword) return;
    const newPassword = window.prompt("Enter new password");
    if (!newPassword) return;
    if (newPassword !== window.prompt("Enter new password again")) {
      window.alert("The password you entered is not the same.");
      return;
    }
    const result = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getCurrentUserToken()}`,
      },
      body: JSON.stringify({
        beforePassword: currentPassword,
        newPassword: newPassword,
      }),
    });
    result.ok ? window.alert("Password update complete.") : window.alert("Password update failed");
  };

  const onQuit = async () => {
    if (!window.confirm("If you want quit myBlog?")) return;
    const keyword = window.prompt("Enter this text: Quit Myblog");
    if (keyword !== "Quit Myblog") return;
    try {
      const result = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/users/${userData?.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${await getCurrentUserToken()}`,
        },
      });
      if (result.ok) {
        localStorage.clear();
        window.alert("The withdrawal is complete.");
        router.push("/");
      } else throw new Error("Withdrawal failed");
    } catch (error) {
      console.log(error);
      window.alert("Something Wrong.");
    }
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
          <SettingData
            title="Password change"
            description="You can change your password."
            buttonMessage="Change"
            onClick={onPasswordChange}
          />
          <CategoryOrderEdit />
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
