"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

import OnWrite from "./OnWrite";
import Preview from "./OnPreview";
import getCurrentUsetData from "logics/getCurrentUserData";
import Image from "next/image";
import uploadPost from "./uploadPost";

export default function WritePage() {
  const [userData, setUserData] = useState<UserInfo>();
  const [postContent, setPostContent] = useState<PostEditData>({
    title: "",
    category: [],
    postData: "",
    thumbnailImgLink: "",
    thumbnailData: "",
    tag: [],
  });

  const [isPreview, setIsPreview] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    getCurrentUsetData().then((userData) => {
      if (userData === null) router.push("/");
      else setUserData(userData);
    });
    /*
    if (params["*"]) {
      getPostData(params["*"] as string)
        .then((post) => {
          const auth = getAuth();
          if (post.createdBy !== auth.currentUser?.uid) {
            const userError = {
              name: "Permission Denied",
              code: "No_Permission",
            };
            throw userError;
          }
          setPostContent((prev) => ({
            ...prev,
            title: post.title,
            category: post.category ?? [],
            postData: post.detail,
            thumbnailImgLink: post.thumbnailImageURL,
            thumbnailData: post.thumbnailData,
            imageList: post.imageList,
            tag: post.tag,
          }));
        })
        .catch((error) => {
          console.log(error);
          const errorTitle = "Post Loading failed";
          let errorText;
          switch (error?.code) {
            case "No_PostData":
              errorText = "You entered wrong url link";
              break;
            case "No_Permission":
              errorText = "You don't have permission on this post.";
              break;
            default:
              errorText = "Something wrong, try again later.";
              break;
          }
          openModal(errorTitle, errorText, () => {
            router("/");
          });
        })
        .finally(() => setLoading(false));
    }
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isSubmit, setIsSubmit] = useState(false);
  const onSubmit = async () => {
    setIsSubmit(true);
    try {
      let postID: string;
      if (params["*"]) {
        // todo: update post
        postID = params["*"];
      } else {
        if (userData) await uploadPost(userData.id, userData.nickname, postContent);
        //postID = params["*"]; // todo: set post
      }
      //router.push(`/home/${userData?.nickname}/${postID}`);
    } catch (error) {
      console.log(error);
      window.alert("Post Submit failed. Try again later.");
    } finally {
      setIsSubmit(false);
    }
  };

  const onPreview = () => {
    const reg = /[`\n|\r|~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gim;
    !postContent.thumbnailData &&
      setPostContent((prev) => ({
        ...prev,
        thumbnailData: postContent.postData.replace(reg, "").substring(0, 150),
      }));
    setIsPreview((prev) => !prev);
  };

  return (
    <>
      <header>
        <nav className="navbar bg-white">
          <div className="container">
            <div className="navbar-brand">
              <a href="/">
                <Image className="me-2 pe-auto pe-on" src={"/logo.png"} width={40} height={40} alt="blog logo" />
              </a>
            </div>
          </div>
        </nav>
      </header>
      <Preview
        isEdit={Boolean(params["*"])}
        isPreview={isPreview}
        postContent={postContent}
        setPostContent={setPostContent}
        onPreview={onPreview}
        isSubmit={isSubmit}
        onSubmit={onSubmit}
      />
      <OnWrite
        isEdit={Boolean(params["*"])}
        postContent={postContent}
        setPostContent={setPostContent}
        onPreview={onPreview}
      />
    </>
  );
}
