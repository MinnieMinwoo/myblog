import { useRef, useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import getCurrentUserData from "logics/getCurrentUserData";

const ProfileImageEdit = () => {
  const { data: userData, status } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserData,
  });
  const [imageLink, setImageLink] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!userData?.id) throw window.alert("no user uid data");
    if (!event.target.files) throw window.alert("no files exist");
    //todo: update image
  };

  const onUpload = () => {
    inputRef.current?.click();
  };

  const onDelete = () => {
    if (inputRef.current?.value) inputRef.current.value = "";
  };

  return (
    <div className="ProfileImageEdit px-4 vstack gap-3 flex-basis-210px">
      <Image
        className="img-thumbnail rounded-circle w-128px h-128px-i"
        src={imageLink ? imageLink : "/altThumbnail.jpg"}
        alt="Profile"
        width={128}
        height={128}
      />
      <input hidden type="file" accept="image/*" ref={inputRef} src={imageLink} onChange={onChange} />
      <button type="button" className="btn btn-primary w-128px" onClick={onUpload}>
        Upload Image
      </button>
      <button type="button" className="btn btn-outline-primary w-128px" onClick={onDelete}>
        Delete Image
      </button>
    </div>
  );
};

export default ProfileImageEdit;
