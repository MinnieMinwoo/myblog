"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import getPostThumbnailData from "./getPostThumbnailData";
import PostThumbnailBox from "components/PostThumbnailBox";
import getCurrentUsetData from "logics/getCurrentUserData";
import Link from "next/link";
import PostPagination from "components/PostPagination";

export default function HomePage() {
  const params = useParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [postNum, setPostNum] = useState<number>(0);
  const [postData, setPostData] = useState<PostThumbnail[]>([]);
  const [lastPostIndex, setLastPostIndex] = useState<LastPost | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const { id } = params;
    getPostThumbnailData(id)
      .then(({ postCount, postList, LastEvaluatedKey }) => {
        console.log(postCount);
        console.log(postList);
        console.log(LastEvaluatedKey);
        setPostNum(postCount);
        setPostData(postList);
        setLastPostIndex(LastEvaluatedKey);
      })
      .catch((error) => {
        console.log(error);
        router.push("/");
      })
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isSameUser, setIsSameUser] = useState(false);
  useEffect(
    () => {
      getCurrentUsetData().then((userData) => {
        if (userData !== null) setIsSameUser(params.id === userData.nickname);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onPagination = async () => {
    if (!lastPostIndex) return;
    const { id } = params;
    const { postCount, postList, LastEvaluatedKey } = await getPostThumbnailData(id, lastPostIndex);
    setPostNum(postCount);
    setPostData((before) => [...before, ...postList]);
    setLastPostIndex(LastEvaluatedKey);
  };

  return (
    <>
      <div className="flex-grow-1 px-md-3 my-4 mx-md-4">
        <div className=" col col-10 offset-1 col-lg-8 offset-lg-2 col-xxl-6 offset-xxl-3">
          <section className=" mb-3 hstack gap-1">
            <h2 className="fw-bold d-inline-block">Posts</h2>
            <span className="text-primary fs-5">{`(${String(postNum)})`}</span>
            {isSameUser ? (
              <Link href="/write" role="button" className="btn btn-outline-primary ms-auto">
                Write
              </Link>
            ) : null}
          </section>
          <PostThumbnailBox postList={postData} />
          <PostPagination isLoading={isLoading} isLastPost={!lastPostIndex?.id} callBack={onPagination} />
        </div>
      </div>
    </>
  );
}
