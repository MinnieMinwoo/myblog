import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { useQuery } from "@tanstack/react-query";
import getCurrentUserData from "logics/getCurrentUserData";

import "./HeaderProfile.css";

export default function HeaderProfile() {
  const [isOpen, setIsOpen] = useState(false);

  const { data: userData, status } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserData,
  });

  const router = useRouter();
  const onToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const onClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!("name" in event.target)) return;
    const { name } = event.target;
    if (name === "write") router.push("/write");
    else if (name === "setting") router.push("/setting");
    else if (name === "logout") {
      localStorage.removeItem("idToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      router.push("/");
    }
  };

  return (
    <div className="HeaderProfile d-inline-block">
      <Image
        className="img-thumbnail rounded-circle w-50px h-50px-i fs-0 bg-white"
        src={status && userData?.picture ? userData.picture : "/altThumbnail.jpg"}
        alt="Profile"
        role="button"
        width={50}
        height={50}
        onClick={onToggle}
      />
      {isOpen && (
        <div
          className="btn-group-vertical mt-2 position-absolute w-98px z-index-1 header-profile-translate"
          role="group"
        >
          <button className="btn btn-info text-white" name="write" onClick={onClick}>
            Post
          </button>
          <button className="btn btn-info text-white" name="setting" onClick={onClick}>
            Setting
          </button>
          <button className="btn btn-info text-white" name="logout" onClick={onClick}>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
