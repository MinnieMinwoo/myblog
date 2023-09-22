import { useRef } from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getCurrentUserData from "logics/getCurrentUserData";
import imageUpload from "logics/imageUpload";
import updateUserInfo from "logics/updateUserInfo";

const ProfileImageEdit = () => {
  const { data: userData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserData,
  });

  const queryClient = useQueryClient();
  const { mutate: updateProfile } = useMutation({
    mutationFn: async (userInfo) => {
      if (!userData) throw new Error("no user data");
      else return updateUserInfo(userInfo);
    },
    onMutate: async (newUserData: UserInfo) => {
      await queryClient.cancelQueries({ queryKey: ["currentUser"] });
      const previousUserData = queryClient.getQueryData(["currentUser"]);
      queryClient.setQueryData(["currentUser"], () => newUserData);
      return { previousUserData };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["currentUser"], context?.previousUserData ?? {});
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  const inputRef = useRef<HTMLInputElement | null>(null);

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!userData) return;
    if (!event.target.files) throw window.alert("no files exist");
    const {
      target: { files },
    } = event;
    const imageURL = await imageUpload(files[0]);
    const newUserData = structuredClone(userData);
    newUserData.picture = imageURL;
    updateProfile(newUserData);
  };

  const onUpload = () => {
    inputRef.current?.click();
  };

  const onDelete = () => {
    if (!userData) return;
    if (inputRef.current?.value) inputRef.current.value = "";
    const newUserData = structuredClone(userData);
    newUserData.picture = "";
    updateProfile(newUserData);
  };

  return (
    <div className="ProfileImageEdit px-4 vstack gap-3 flex-basis-210px">
      <Image
        className="img-thumbnail rounded-circle w-128px h-128px-i"
        src={userData?.picture ? userData?.picture : "/altThumbnail.jpg"}
        alt="Profile"
        width={128}
        height={128}
      />
      <input hidden type="file" accept="image/*" ref={inputRef} src={userData?.picture} onChange={onChange} />
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
