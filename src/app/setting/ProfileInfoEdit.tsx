import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getCurrentUserData from "logics/getCurrentUserData";
import updateUserInfo from "logics/updateUserInfo";

export default function ProfileInfoEdit() {
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

  const [hidden, setHidden] = useState(true);
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setNickname(userData?.nickname ?? "");
  }, [userData]);
  const onToggle = () => {
    setHidden((prev) => !prev);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;
    if (name === "nickname") setNickname(value);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    if (!userData?.id) return;
    try {
      const newUserData = structuredClone(userData);
      newUserData.nickname = nickname;
      updateProfile(newUserData);
      setHidden(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ProfileInfoEdit container px-4">
      <div className="vstack gap-2" hidden={!hidden}>
        <p className="fs-2 fw-semibold m-0 text-111">{userData?.nickname}</p>
        <button type="button" className="btn btn-outline-primary w-100px" onClick={onToggle}>
          Edit
        </button>
      </div>
      <form hidden={hidden} onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">Nickname</label>
          <input
            className="form-control"
            type="text"
            name="nickname"
            placeholder="Nicknames must be written in 4-20 digits using only English, numbers, and special characters."
            value={nickname}
            maxLength={20}
            onChange={onChange}
            required
          />
        </div>
        {isLoading ? (
          <button className="btn btn-primary w-100px" type="button" disabled>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span className="visually-hidden">Loading...</span>
          </button>
        ) : (
          <button type="submit" className="btn btn-primary w-100px">
            Save
          </button>
        )}
      </form>
    </div>
  );
}
