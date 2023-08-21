"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

import OnWrite from "./OnWrite";
import Preview from "./OnPreview";
import getCurrentUserData from "logics/getCurrentUserData";
import Image from "next/image";
import uploadPost from "./uploadPost";
import { useQuery } from "@tanstack/react-query";

export default function WritePage() {
  const [isPreview, setIsPreview] = useState(false);
  const router = useRouter();
  const params = useParams();

  const { data: userData, status } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserData,
  });

  const [postContent, setPostContent] = useState<PostEditData>({
    id: "",
    createdBy: "",
    createdAt: 0,
    createdNickname: "",
    title: "",
    categoryMain: "",
    categorySub: "",
    postDetail: "",
    thumbnailImageURL: "",
    thumbnailData: "",
    tag: [],
    likes: [],
  });

  useEffect(() => {
    if (status === "loading") return;
    else if (status === "error") {
      router.push("/");
      return;
    } else if (!userData?.id || !userData?.nickname) {
      router.push("/");
      return;
    }
    setPostContent((prev) => ({
      ...prev,
      createdBy: userData?.id,
      createdNickname: userData?.nickname,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const [isSubmit, setIsSubmit] = useState(false);
  const onSubmit = async () => {
    if (!userData) return;
    setIsSubmit(true);
    try {
      if (params["*"]) {
        // todo: update post
        const postID = params["*"];
        router.push(`/home/${postContent.createdNickname}/${postID}`);
      } else {
        const postID = await uploadPost(postContent);
        router.push(`/home/${postContent.createdNickname}/${postID}`);
      }
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
        thumbnailData: postContent.postDetail.replace(reg, "").substring(0, 150),
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
